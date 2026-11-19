/* Pure parsing helpers for YouTube pages and responses. No network here, so
   these can be tested with saved samples. Loaded by background.js. */
(function (root) {
  'use strict';

  // Extract the JSON object that follows a marker like "ytInitialPlayerResponse = ".
  function extractJson(html, marker) {
    var i = html.indexOf(marker);
    while (i !== -1) {
      var start = html.indexOf('{', i + marker.length);
      if (start === -1) return null;
      // Only accept if nothing but whitespace sits between the marker and "{".
      if (/^\s*$/.test(html.slice(i + marker.length, start))) {
        var depth = 0, inStr = false, esc = false;
        for (var j = start; j < html.length; j++) {
          var c = html[j];
          if (inStr) {
            if (esc) esc = false;
            else if (c === '\\') esc = true;
            else if (c === '"') inStr = false;
          } else if (c === '"') inStr = true;
          else if (c === '{') depth++;
          else if (c === '}') {
            depth--;
            if (depth === 0) {
              try { return JSON.parse(html.slice(start, j + 1)); } catch (e) { return null; }
            }
          }
        }
        return null;
      }
      i = html.indexOf(marker, i + marker.length);
    }
    return null;
  }

  function cfgValue(html, key) {
    var m = html.match(new RegExp('"' + key + '"\\s*:\\s*"([^"]+)"'));
    return m ? m[1] : '';
  }

  function text(node) {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (node.simpleText) return node.simpleText;
    if (node.runs) return node.runs.map(function (r) { return r.text || ''; }).join('');
    if (node.content) return node.content;
    return '';
  }

  // Collect every value stored under `key` anywhere in a nested object.
  function findAll(obj, key, out) {
    out = out || [];
    if (!obj || typeof obj !== 'object') return out;
    if (Array.isArray(obj)) { for (var i = 0; i < obj.length; i++) findAll(obj[i], key, out); return out; }
    for (var k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      if (k === key) out.push(obj[k]);
      findAll(obj[k], key, out);
    }
    return out;
  }

  function parseWatchPage(html) {
    var player = extractJson(html, 'ytInitialPlayerResponse = ') || extractJson(html, 'ytInitialPlayerResponse=');
    if (!player) return { error: 'YouTube did not return the video page. Open youtube.com in this browser once, then try again.' };
    var status = (player.playabilityStatus || {}).status || 'OK';
    var reason = text((player.playabilityStatus || {}).reason) || (player.playabilityStatus || {}).reason || '';
    var vd = player.videoDetails || {};
    var mf = ((player.microformat || {}).playerMicroformatRenderer) || {};
    var list = ((player.captions || {}).playerCaptionsTracklistRenderer) || {};
    var tracks = (list.captionTracks || []).map(function (t) {
      return {
        lang: t.languageCode || '',
        name: text(t.name) || t.languageCode || '',
        kind: t.kind === 'asr' ? 'auto' : 'uploaded',
        translatable: !!t.isTranslatable,
        baseUrl: t.baseUrl || ''
      };
    });
    var translations = (list.translationLanguages || []).map(function (t) {
      return { lang: t.languageCode || '', name: text(t.languageName) || t.languageCode || '' };
    });
    var tp = html.match(/"getTranscriptEndpoint"\s*:\s*\{\s*"params"\s*:\s*"([^"]+)"/);
    return {
      status: status,
      reason: typeof reason === 'string' ? reason : '',
      id: vd.videoId || '',
      title: vd.title || text(mf.title) || '',
      channel: vd.author || text(mf.ownerChannelName) || mf.ownerChannelName || '',
      lengthSeconds: +(vd.lengthSeconds || 0),
      publishDate: mf.publishDate || mf.uploadDate || '',
      tracks: tracks,
      translations: translations,
      transcriptParams: tp ? tp[1] : '',
      clientVersion: cfgValue(html, 'INNERTUBE_CLIENT_VERSION'),
      apiKey: cfgValue(html, 'INNERTUBE_API_KEY'),
      visitorData: cfgValue(html, 'VISITOR_DATA')
    };
  }

  function decodeEntities(s) {
    return s.replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(+n); })
      .replace(/&#x([0-9a-f]+);/gi, function (_, n) { return String.fromCharCode(parseInt(n, 16)); })
      .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  }

  // Caption body: json3 (preferred), srv3/XML, or plain timedtext XML. Returns lines of text.
  function parseCaptions(body) {
    if (!body || !body.trim()) return [];
    var t = body.trim();
    if (t[0] === '{') {
      try {
        var j = JSON.parse(t);
        return (j.events || []).map(function (ev) {
          return (ev.segs || []).map(function (s) { return s.utf8 || ''; }).join('');
        }).map(function (s) { return s.replace(/\s+/g, ' ').trim(); }).filter(Boolean);
      } catch (e) { return []; }
    }
    var out = [];
    var re = /<(text|p)\b[^>]*>([\s\S]*?)<\/\1>/g, m;
    while ((m = re.exec(t))) {
      var s = decodeEntities(m[2].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
      if (s) out.push(s);
    }
    return out;
  }

  // Response of youtubei/v1/get_transcript: segment lines plus the language menu.
  function parseTranscript(json) {
    var segs = findAll(json, 'transcriptSegmentRenderer').map(function (s) {
      return text(s.snippet).replace(/\s+/g, ' ').trim();
    }).filter(Boolean);
    var menus = findAll(json, 'subMenuItems')[0] || [];
    var languages = menus.map(function (it) {
      var cont = findAll(it, 'continuation').filter(function (c) { return typeof c === 'string'; })[0] || '';
      return { title: it.title || '', selected: !!it.selected, params: cont };
    });
    return { lines: segs, languages: languages };
  }

  function parsePlaylistPage(html) {
    var data = extractJson(html, 'ytInitialData = ') || extractJson(html, 'ytInitialData=');
    if (!data) return { error: 'YouTube did not return the playlist page.' };
    var meta = findAll(data, 'playlistMetadataRenderer')[0] || {};
    var res = collectPlaylist(data);
    return {
      title: meta.title || text(findAll(data, 'pageHeaderRenderer')[0] && findAll(data, 'pageHeaderRenderer')[0].pageTitle) || '',
      videos: res.videos,
      continuation: res.continuation,
      clientVersion: cfgValue(html, 'INNERTUBE_CLIENT_VERSION'),
      apiKey: cfgValue(html, 'INNERTUBE_API_KEY'),
      visitorData: cfgValue(html, 'VISITOR_DATA')
    };
  }

  // Works for the first playlist page and for browse continuations.
  function collectPlaylist(json) {
    var seen = {}, videos = [];
    findAll(json, 'playlistVideoRenderer').forEach(function (r) {
      if (r && r.videoId && !seen[r.videoId]) {
        seen[r.videoId] = 1;
        videos.push({ id: r.videoId, title: text(r.title) });
      }
    });
    // Newer layouts use lockupViewModel cards.
    findAll(json, 'lockupViewModel').forEach(function (l) {
      if (l && l.contentType === 'LOCKUP_CONTENT_TYPE_VIDEO' && l.contentId && !seen[l.contentId]) {
        seen[l.contentId] = 1;
        var t = findAll(l, 'title').map(text).filter(Boolean)[0] || '';
        videos.push({ id: l.contentId, title: t });
      }
    });
    var tokens = findAll(json, 'continuationCommand').map(function (c) { return c && c.token; }).filter(Boolean);
    return { videos: videos, continuation: tokens[tokens.length - 1] || '' };
  }

  var api = {
    extractJson: extractJson, parseWatchPage: parseWatchPage, parseCaptions: parseCaptions,
    parseTranscript: parseTranscript, parsePlaylistPage: parsePlaylistPage, collectPlaylist: collectPlaylist,
    findAll: findAll, text: text
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.YTParse = api;
})(typeof self !== 'undefined' ? self : this);
