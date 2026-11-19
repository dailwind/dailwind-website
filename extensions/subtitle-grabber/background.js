/* Dailwind Subtitle Grabber: background service worker.
   Talks only to www.youtube.com, from the user's own browser, and only when the
   Subtitle Corpus Builder page asks. Nothing is sent to Dailwind. */
importScripts('yt-parse.js');

var YT = 'https://www.youtube.com';
var cache = new Map(); // video id -> parsed watch page (lost when the worker sleeps; refetched as needed)

var ID_RE = /^[A-Za-z0-9_-]{11}$/;
var LIST_RE = /^[A-Za-z0-9_-]{10,80}$/;
var LANG_RE = /^[A-Za-z]{2,3}(?:[-_][A-Za-z0-9]{2,8})*$/;

async function getText(url, init) {
  var res = await fetch(url, Object.assign({ credentials: 'include', cache: 'no-store' }, init || {}));
  if (res.status === 429) throw new Error('YouTube is limiting requests right now. Wait a few minutes, then continue.');
  if (!res.ok) throw new Error('YouTube answered with error ' + res.status + '.');
  return res.text();
}

async function videoInfo(id, fresh) {
  if (!fresh && cache.has(id)) return cache.get(id);
  var html = await getText(YT + '/watch?v=' + id + '&hl=en&bpctr=9999999999&has_verified=1');
  var info = YTParse.parseWatchPage(html);
  if (info.error) throw new Error(info.error);
  if (info.status !== 'OK') {
    var why = info.reason || info.status;
    if (/bot/i.test(why)) why += ' Open youtube.com in this browser, play any video for a moment, then try again.';
    throw new Error(why);
  }
  info.id = info.id || id;
  cache.set(id, info);
  return info;
}

function publicInfo(info) {
  return {
    id: info.id, title: info.title, channel: info.channel, lengthSeconds: info.lengthSeconds,
    publishDate: info.publishDate,
    tracks: info.tracks.map(function (t) { return { lang: t.lang, name: t.name, kind: t.kind, translatable: t.translatable }; }),
    translations: info.translations,
    hasTranscriptPanel: !!info.transcriptParams
  };
}

function innertubeHeaders(info) {
  var h = { 'Content-Type': 'application/json', 'X-YouTube-Client-Name': '1' };
  if (info.clientVersion) h['X-YouTube-Client-Version'] = info.clientVersion;
  if (info.visitorData) h['X-Goog-Visitor-Id'] = info.visitorData;
  return h;
}

function context(info) {
  return { client: { clientName: 'WEB', clientVersion: info.clientVersion || '2.20260101.00.00', hl: 'en', gl: 'US', visitorData: info.visitorData || undefined } };
}

async function transcriptCall(info, params) {
  var url = YT + '/youtubei/v1/get_transcript?prettyPrint=false' + (info.apiKey ? '&key=' + encodeURIComponent(info.apiKey) : '');
  var body = await getText(url, { method: 'POST', headers: innertubeHeaders(info), body: JSON.stringify({ context: context(info), params: params }) });
  return YTParse.parseTranscript(JSON.parse(body));
}

function matchesTrack(title, track) {
  var t = (title || '').toLowerCase();
  var n = (track.name || '').toLowerCase();
  if (n && t === n) return true;
  var auto = /auto-generated|automatic/.test(t);
  return n && t.indexOf(n.replace(/\s*\(auto-generated\)\s*$/, '')) === 0 && auto === (track.kind === 'auto');
}

async function captions(id, lang, kind, tlang) {
  var info = await videoInfo(id);
  var track = info.tracks.filter(function (t) { return t.lang === lang && t.kind === kind; })[0];
  if (!track) throw new Error('That subtitle track is no longer listed for this video.');

  // 1. The caption file itself (supports YouTube machine translation with tlang).
  if (track.baseUrl) {
    try {
      var url = track.baseUrl + '&fmt=json3' + (tlang ? '&tlang=' + encodeURIComponent(tlang) : '');
      var lines = YTParse.parseCaptions(await getText(url));
      if (lines.length) return { lines: lines, method: tlang ? 'translated' : 'caption-file' };
    } catch (e) { /* fall through */ }
  }
  if (tlang) throw new Error('YouTube did not provide a machine translation for this video. Choose its original subtitles instead.');

  // 2. The "Show transcript" panel, which YouTube serves to normal viewers.
  if (!info.transcriptParams) throw new Error('YouTube did not provide these subtitles. Try again later, or use the paid service for this video.');
  var tr = await transcriptCall(info, info.transcriptParams);
  var sel = tr.languages.filter(function (l) { return l.selected; })[0];
  if (tr.languages.length && !(sel && matchesTrack(sel.title, track))) {
    var want = tr.languages.filter(function (l) { return matchesTrack(l.title, track) && l.params; })[0];
    if (!want) throw new Error('The transcript panel does not offer "' + track.name + '" for this video.');
    tr = await transcriptCall(info, want.params);
  }
  if (!tr.lines.length) throw new Error('YouTube returned an empty transcript for this video.');
  return { lines: tr.lines, method: 'transcript-panel' };
}

async function playlist(list) {
  var html = await getText(YT + '/playlist?list=' + list + '&hl=en');
  var page = YTParse.parsePlaylistPage(html);
  if (page.error) throw new Error(page.error);
  var videos = page.videos.slice();
  var seen = {};
  videos.forEach(function (v) { seen[v.id] = 1; });
  var token = page.continuation, guard = 0;
  while (token && videos.length < 2000 && guard++ < 40) {
    var url = YT + '/youtubei/v1/browse?prettyPrint=false' + (page.apiKey ? '&key=' + encodeURIComponent(page.apiKey) : '');
    var body = await getText(url, { method: 'POST', headers: innertubeHeaders(page), body: JSON.stringify({ context: context(page), continuation: token }) });
    var more = YTParse.collectPlaylist(JSON.parse(body));
    var added = 0;
    more.videos.forEach(function (v) { if (!seen[v.id]) { seen[v.id] = 1; videos.push(v); added++; } });
    if (!added || more.continuation === token) break;
    token = more.continuation;
  }
  if (!videos.length) throw new Error('No videos found. The playlist may be private, empty or a "Mix".');
  return { title: page.title, videos: videos };
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // Only our own bridge on the Corpus Builder page may ask.
  if (sender.id !== chrome.runtime.id || !msg || typeof msg.type !== 'string') return false;
  var job;
  if (msg.type === 'videoInfo' && ID_RE.test(msg.id)) job = videoInfo(msg.id, !!msg.fresh).then(publicInfo);
  else if (msg.type === 'captions' && ID_RE.test(msg.id) && LANG_RE.test(msg.lang || '') && (msg.kind === 'auto' || msg.kind === 'uploaded') && (!msg.tlang || LANG_RE.test(msg.tlang)))
    job = captions(msg.id, msg.lang, msg.kind, msg.tlang || '');
  else if (msg.type === 'playlist' && LIST_RE.test(msg.list)) job = playlist(msg.list);
  else { sendResponse({ error: 'Unsupported request.' }); return false; }
  job.then(function (result) { sendResponse({ result: result }); },
           function (err) { sendResponse({ error: (err && err.message) || String(err) }); });
  return true; // answer asynchronously
});
