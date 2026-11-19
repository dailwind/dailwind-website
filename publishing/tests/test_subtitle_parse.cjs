// Tests the Subtitle Grabber's YouTube parsers with small samples shaped like real responses.
const assert = require('assert');
const P = require('../../extensions/subtitle-grabber/yt-parse.js');

const player = {
  playabilityStatus: { status: 'OK' },
  videoDetails: { videoId: 'abcDEF12345', title: 'Episode 1 "Pilot" {test}', author: 'Har Pal Geo', lengthSeconds: '2531' },
  microformat: { playerMicroformatRenderer: { publishDate: '2024-03-01' } },
  captions: { playerCaptionsTracklistRenderer: {
    captionTracks: [
      { baseUrl: 'https://www.youtube.com/api/timedtext?v=abcDEF12345&lang=ur', name: { simpleText: 'Urdu' }, languageCode: 'ur', isTranslatable: true },
      { baseUrl: 'https://www.youtube.com/api/timedtext?v=abcDEF12345&lang=en&kind=asr', name: { runs: [{ text: 'English (auto-generated)' }] }, languageCode: 'en', kind: 'asr', isTranslatable: true }
    ],
    translationLanguages: [{ languageCode: 'en', languageName: { simpleText: 'English' } }, { languageCode: 'zh-Hans', languageName: { simpleText: 'Chinese (Simplified)' } }]
  } }
};
const html = '<html><script>var ytcfg={};ytcfg.set({"INNERTUBE_API_KEY":"KEY123","INNERTUBE_CLIENT_VERSION":"2.20261101.01.00","VISITOR_DATA":"VIS"});</script>' +
  '<script>var ytInitialPlayerResponse = ' + JSON.stringify(player) + ';var meta = {};</script>' +
  '<script>var ytInitialData = {"engagementPanels":[{"x":{"getTranscriptEndpoint":{"params":"PARAMS=="}}}]};</script></html>';

const w = P.parseWatchPage(html);
assert.equal(w.status, 'OK');
assert.equal(w.id, 'abcDEF12345');
assert.equal(w.title, 'Episode 1 "Pilot" {test}');
assert.equal(w.channel, 'Har Pal Geo');
assert.equal(w.lengthSeconds, 2531);
assert.equal(w.publishDate, '2024-03-01');
assert.equal(w.tracks.length, 2);
assert.deepEqual(w.tracks.map(t => [t.lang, t.kind, t.name]), [['ur', 'uploaded', 'Urdu'], ['en', 'auto', 'English (auto-generated)']]);
assert.equal(w.translations[1].lang, 'zh-Hans');
assert.equal(w.transcriptParams, 'PARAMS==');
assert.equal(w.clientVersion, '2.20261101.01.00');
assert.equal(w.apiKey, 'KEY123');

// Blocked / login-required page
const blocked = P.parseWatchPage('<script>var ytInitialPlayerResponse = {"playabilityStatus":{"status":"LOGIN_REQUIRED","reason":"Sign in to confirm you’re not a bot"}};</script>');
assert.equal(blocked.status, 'LOGIN_REQUIRED');
assert.ok(/bot/.test(blocked.reason));
assert.ok(P.parseWatchPage('<html>nothing</html>').error);

// json3 captions
const json3 = JSON.stringify({ events: [{ tStartMs: 0, segs: [{ utf8: 'Hello ' }, { utf8: 'there.' }] }, { segs: [{ utf8: '\n' }] }, { segs: [{ utf8: '[Music]' }] }, {}] });
assert.deepEqual(P.parseCaptions(json3), ['Hello there.', '[Music]']);
// XML timedtext
assert.deepEqual(P.parseCaptions('<transcript><text start="0" dur="1">It&#39;s &amp; ok</text><text start="1">Line\ntwo</text></transcript>'), ["It's & ok", 'Line two']);
assert.deepEqual(P.parseCaptions(''), []);

// get_transcript response
const tr = { actions: [{ updateEngagementPanelAction: { content: { transcriptRenderer: {
  content: { transcriptSearchPanelRenderer: { body: { transcriptSegmentListRenderer: { initialSegments: [
    { transcriptSegmentRenderer: { snippet: { runs: [{ text: 'First line' }] } } },
    { transcriptSegmentRenderer: { snippet: { runs: [{ text: 'Second ' }, { text: 'line' }] } } }
  ] } }, footer: { transcriptFooterRenderer: { languageMenu: { sortFilterSubMenuRenderer: { subMenuItems: [
    { title: 'Urdu', selected: true, continuation: { reloadContinuationData: { continuation: 'C-UR' } } },
    { title: 'English (auto-generated)', selected: false, continuation: { reloadContinuationData: { continuation: 'C-EN' } } }
  ] } } } } } } } } } }] };
const t = P.parseTranscript(tr);
assert.deepEqual(t.lines, ['First line', 'Second line']);
assert.deepEqual(t.languages.map(l => [l.title, l.selected, l.params]), [['Urdu', true, 'C-UR'], ['English (auto-generated)', false, 'C-EN']]);

// playlist page + continuation
const pdata = { metadata: { playlistMetadataRenderer: { title: 'Drama Serial' } }, contents: { x: [
  { playlistVideoRenderer: { videoId: 'aaaaaaaaaaa', title: { runs: [{ text: 'Ep 1' }] } } },
  { playlistVideoRenderer: { videoId: 'bbbbbbbbbbb', title: { simpleText: 'Ep 2' } } },
  { continuationItemRenderer: { continuationEndpoint: { continuationCommand: { token: 'TOK1' } } } } ] } };
const pl = P.parsePlaylistPage('<script>var ytInitialData = ' + JSON.stringify(pdata) + ';</script>"INNERTUBE_CLIENT_VERSION":"2.1"');
assert.equal(pl.title, 'Drama Serial');
assert.deepEqual(pl.videos.map(v => v.id), ['aaaaaaaaaaa', 'bbbbbbbbbbb']);
assert.equal(pl.continuation, 'TOK1');
const more = P.collectPlaylist({ onResponseReceivedActions: [{ appendContinuationItemsAction: { continuationItems: [
  { lockupViewModel: { contentId: 'ccccccccccc', contentType: 'LOCKUP_CONTENT_TYPE_VIDEO', metadata: { title: { content: 'Ep 3' } } } } ] } }] });
assert.deepEqual(more.videos, [{ id: 'ccccccccccc', title: 'Ep 3' }]);
assert.equal(more.continuation, '');

console.log('subtitle grabber parser tests passed');
