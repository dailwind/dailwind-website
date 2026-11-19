// Tests the Subtitle Corpus Builder engine.
const assert = require('assert');
const E = require('../../assets/subtitle-engine.js');

const links = E.parseLinks(`https://www.youtube.com/watch?v=dQw4w9WgXcQ
youtu.be/abcDEF12345?t=10, https://m.youtube.com/shorts/ABCdef_-123
https://www.youtube.com/playlist?list=PLabcdefghij123
https://www.youtube.com/watch?v=xyzXYZ12345&list=PLsecondlist999
https://www.youtube.com/watch?v=mixMIX12345&list=RDmixMIX12345
dQw4w9WgXcQ  https://example.com/nope  hello`, { wholePlaylist: true });
assert.deepEqual(links.videos, ['dQw4w9WgXcQ', 'abcDEF12345', 'ABCdef_-123', 'xyzXYZ12345', 'mixMIX12345']);
assert.deepEqual(links.playlists, ['PLabcdefghij123', 'PLsecondlist999']);
assert.deepEqual(links.bad, ['https://example.com/nope', 'hello']);
assert.deepEqual(E.parseLinks('https://www.youtube.com/watch?v=xyzXYZ12345&list=PLsecondlist999').playlists, []);

const srt = '﻿1\r\n00:00:01,000 --> 00:00:02,500\r\n<i>Hello</i> there.\r\n\r\n2\r\n00:00:03,000 --> 00:00:04,000\r\n[Music]\r\n\r\n3\r\n00:00:05,000 --> 00:00:06,000\r\n>> How are you?\r\n';
assert.deepEqual(E.parseSubtitleFile('a.srt', srt), ['Hello there.', '[Music]', '>> How are you?']);
const vtt = 'WEBVTT\nKind: captions\nLanguage: en\n\nNOTE this is a note\nstill note\n\n00:00:00.000 --> 00:00:02.000 align:start position:0%\nso<00:00:00.500><c> today</c>\n\n00:00:02.000 --> 00:00:04.000\nso today\nwe talk\n';
assert.deepEqual(E.parseSubtitleFile('a.vtt', vtt), ['Kind: captions', 'Language: en', 'so today', 'we talk']);
assert.deepEqual(E.parseSubtitleFile('a.sbv', '0:00:01.000,0:00:02.000\nOne line\n\n0:00:03.000,0:00:04.000\nTwo\n'), ['One line', 'Two']);
assert.deepEqual(E.parseSubtitleFile('notes.txt', 'Plain line\n\nSecond'), ['Plain line', 'Second']);

const lines = ['Hello there.', '[Music]', '>> How are you?', 'How are you?', '♪ la la ♪', 'Fine (laughs) thanks.'];
assert.equal(E.cleanLines(lines, { layout: 'lines' }), 'Hello there.\nHow are you?\nla la\nFine thanks.');
assert.equal(E.cleanLines(lines, { layout: 'lines', removeSound: false, removeSpeakers: false }), 'Hello there.\n[Music]\n>> How are you?\nHow are you?\n♪ la la ♪\nFine (laughs) thanks.');
const running = E.cleanLines(['One.', 'Two.', 'Three.', 'Four.', 'Five.', 'Six.', 'Seven ,', 'eight'], {});
assert.equal(running, 'One. Two. Three. Four. Five. Six.\n\nSeven, eight');
assert.equal(E.countWords("It's a well-known test, 2026!"), 5);
assert.equal(E.countWords('یہ ایک ٹیسٹ ہے'), 4);

assert.equal(E.fileName(0, { title: 'Ishq Murshid — Episode 1!', id: 'abcDEF12345' }), '001_ishq-murshid-episode-1_abcDEF12345.txt');
assert.equal(E.slug('بہت اچھا'), 'بہت-اچھا');
const item = { id: 'abcDEF12345', title: 'A "B" <C>', channel: 'Ch', languageLabel: 'English (uploaded)', url: 'https://youtu.be/abcDEF12345', text: 'Body.' };
assert.equal(E.combined([item], 'tags'), '<text id="abcDEF12345" title="A &quot;B&quot; &lt;C>" channel="Ch" language="English (uploaded)" source="https://youtu.be/abcDEF12345">\nBody.\n</text>');
assert.ok(E.combined([item], 'title').startsWith('=== A "B" <C> ===\nCh | English (uploaded) | https://youtu.be/abcDEF12345\n\nBody.'));
assert.equal(E.combined([item, item], 'none'), 'Body.\n\nBody.');
assert.equal(E.csv([['a', 'b,c'], ['=1+1', 'q"t']]), 'a,"b,c"\r\n\'=1+1,"q""t"');

// ZIP: verify with Python's zipfile
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const z = E.zip([{ name: 'corpus/001_ü.txt', data: 'Hällo\n' }, { name: 'metadata.csv', data: 'a,b\r\n1,2' }]);
const f = path.join(os.tmpdir(), 'sub-test.zip'); fs.writeFileSync(f, z);
const out = execFileSync('python3', ['-c', 'import zipfile,sys;z=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None;print(z.namelist(), z.read("corpus/001_ü.txt").decode())', f]).toString();
assert.ok(out.includes("['corpus/001_ü.txt', 'metadata.csv'] Hällo"), out);
assert.equal(E.crc32(new TextEncoder().encode('123456789')).toString(16), 'cbf43926');
console.log('subtitle engine tests passed');
