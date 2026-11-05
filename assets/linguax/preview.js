
"use strict";
/* ================= LinguaX Arc — core ================= */
const I = {
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  plot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5v14M8.5 5v14M12 5v14M17 5v14M20.5 5v14"/></svg>',
  file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>',
  cluster:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="7" width="8" height="8" rx="2"/><rect x="7" y="14" width="8" height="8" rx="2"/></svg>',
  ngram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="5" height="5" rx="1.5"/><rect x="10" y="4" width="5" height="5" rx="1.5"/><rect x="17" y="4" width="4" height="5" rx="1.5"/><rect x="3" y="15" width="8" height="5" rx="1.5"/><rect x="13" y="15" width="8" height="5" rx="1.5"/></svg>',
  link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7L12.5 18.5"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  key:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="15" r="4.5"/><path d="m11.5 11.5 8-8M17 6l2.5 2.5M14 9l2 2"/></svg>',
  cloud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 18.5H7a4.5 4.5 0 1 1 .8-8.9A6 6 0 0 1 19.5 11a3.8 3.8 0 0 1-2 7.5z"/></svg>',
  pie:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',
  dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16"/></svg>',
  chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h6M9 11h2"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .35 1.9l.05.05a2.1 2.1 0 1 1-2.95 2.95l-.05-.05a1.7 1.7 0 0 0-1.9-.35 1.7 1.7 0 0 0-1 1.55V19.6a2.1 2.1 0 1 1-4.2 0v-.08a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.9.35l-.05.05a2.1 2.1 0 1 1-2.95-2.95l.05-.05a1.7 1.7 0 0 0 .35-1.9 1.7 1.7 0 0 0-1.55-1H4.4a2.1 2.1 0 1 1 0-4.2h.08a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.35-1.9l-.05-.05a2.1 2.1 0 1 1 2.95-2.95l.05.05a1.7 1.7 0 0 0 1.9.35H10.6a1.7 1.7 0 0 0 1-1.55V4.4a2.1 2.1 0 1 1 4.2 0v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.9-.35l.05-.05a2.1 2.1 0 1 1 2.95 2.95l-.05.05a1.7 1.7 0 0 0-.35 1.9V10.6a1.7 1.7 0 0 0 1.55 1h.08a2.1 2.1 0 1 1 0 4.2h-.08a1.7 1.7 0 0 0-1.55 1z"/></svg>',
  zoom:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-3.5-3.5"/></svg>',
  reset:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
  help:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  smile:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  volume:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
  vibrate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M22 7l-2 2 2 2m-20-4l2 2-2 2m20 4l-2 2 2 2m-20-8l2 2-2 2"/></svg>',
  broom:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 4-12 12a3 3 0 0 0 4 4l12-12m-4-4 4 4m-8 4 1-1m-5 5 1-1"/><path d="M19 3h.01M17 7h.01M21 8h.01M13 13h.01"/></svg>',
  toolkit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  repeat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1v4h-4M7 23v-4h4"/><path d="M3 12a9 9 0 0 1 15-6.7L18 5M21 12a9 9 0 0 1-15 6.7L6 19"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>',
  history:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  dashboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  donut:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  sparkle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>',
  bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
};

const APP_VERSION = 'v6.0';
const TOOLS = [
  ['corpus','Corpus',I.folder],['kwic','KWIC',I.search],['plot','Plot',I.plot],
  ['fileview','File View',I.file],['cluster','Clusters',I.cluster],['ngram','N-Grams',I.ngram],
  ['collocate','Collocates',I.link],['wordlist','Word List',I.list],['keyword','Keyness',I.key],
  ['cloud','Word Cloud',I.cloud],
  ['summary','Summarizer',I.doc],['sentiment','Sentiment',I.smile],
  ['history','History',I.history],['settings','Settings',I.gear]
];

const STOP = new Set("a an and are as at be by for from has have he her his i in is it its of on or she that the this to was were will with you your we they them their our us not but if so no do does did".split(" "));

const TRANSLATIONS = {
  en: {
    appTitle: '<span class="brand-fixed">LinguaX</span> <span class="arc-animated">Arc</span>',
    logoSub: "Corpus Toolkit",
    corpus: "Corpus",
    history: "History",
    dashboard: "History",
    stats: "History",
    workspace: "History",
    kwic: "KWIC",
    plot: "Plot",
    fileview: "File View",
    cluster: "Clusters",
    ngram: "N-Grams",
    collocate: "Collocates",
    wordlist: "Word List",
    keyword: "Keywords",
    cloud: "Word Cloud",
    summary: "Summarizer",
    sentiment: "Sentiment",
    toolkit: "Toolkit",
    settings: "Settings",
    
    welcomeGuide: "Welcome & Multilingual Audio Guide",
    corpusCleaner: "Advanced Corpus Cleaner & Normalizer",
    fileMerger: "High-Capacity File Merger & Combiner",
    fileConverter: "Bulk File Format Converter",
    
    cleanerIntro: "Clean, lowercase, strip punctuation, remove stop words, or normalize whitespaces across your corpus or raw text.",
    mergerIntro: "Merge multiple .txt, .docx, or .pdf files into a single consolidated text or Word document offline.",
    converterIntro: "Batch convert .docx and .pdf files to clean .txt format, or .txt to .doc (Word) completely offline.",
    
    playAudio: "Play MP3 Guide",
    playAiVoice: "Play Built-In AI Voice",
    showTranscript: "Show Text Transcript",
    hideTranscript: "Hide Text Transcript",
    cleanNow: "Clean Text Now",
    cleanCorpus: "Clean Main Corpus In-Place",
    mergeNow: "Merge Selected Files",
    convertNow: "Convert Files",
    downloadClean: "Download Cleaned Text",
    copyText: "Copy to Clipboard",
    
    optLowercase: "Convert to Lowercase",
    optRemovePunct: "Remove Punctuation",
    optRemoveDigits: "Remove Numbers & Digits",
    optRemoveUrls: "Remove Web Links (URLs)",
    optRemoveEmojis: "Remove Emojis & Symbols",
    optRemoveStops: "Remove Stop Words",
    optNormalize: "Normalize Whitespace",
    optOnlyAlpha: "Retain Only Alphabetic Words",
    customStopsLabel: "Custom Stop Words (space-separated):",
    pasteTextPlaceholder: "Paste your raw text here to clean...",
    
    optInsertHeader: "Insert file name separators between files",
    optExtraLines: "Add double blank lines between files",
    mergeTargetLabel: "Output Merge Format:",
    selectMergeFiles: "Select Local Files to Merge:",
    orMergeCorpus: "Or merge currently loaded Corpus files:",
    mergeCorpusBtn: "Merge All Corpus Files",
    
    convTargetLabel: "Target Conversion Format:",
    selectConvFiles: "Select Local Files to Convert:",
    converting: "Converting...",
    convertedSuccess: "Converted successfully!",
    downloadConverted: "Download Converted File",
  }
};
/*
  ur: {
    appTitle: "لنگوا ایکس آرک",
    logoSub: "کارپس ٹول کٹ · بذریعہ ارسلان طاہر",
    corpus: "کارپس فائلیں",
    kwic: "موافقت لفظ",
    plot: "پلاٹ",
    fileview: "فائل کا جائزہ",
    cluster: "کلسٹرز",
    ngram: "این-گرامز",
    collocate: "ہمراہ الفاظ",
    wordlist: "الفاظ کی فہرست",
    keyword: "کلیدی الفاظ",
    cloud: "الفاظ کا بادل",
    summary: "خلاصہ کار",
    sentiment: "جذبات",
    toolkit: "ٹول کٹ",
    settings: "ترتیبات",
    
    welcomeGuide: "خوش آمدید اور کثیر لسانی آڈیو گائیڈ",
    corpusCleaner: "جدید کارپس صفائی اور نارملائزیشن",
    fileMerger: "اعلیٰ صلاحیت فائل انضمام و ملاپ",
    fileConverter: "فائل فارمیٹ کنورٹر (بلک)",
    
    cleanerIntro: "اپنے کارپس یا خام متن سے چھوٹے حروف میں تبدیل کریں، اوقاف، نمبرز اور فالتو الفاظ کو ختم کریں۔",
    mergerIntro: "کئی .txt، .docx، یا .pdf فائلوں کو ایک ہی فائل میں آف لائن یکجا کریں۔",
    converterIntro: "اپنے فون پر محفوظ .docx اور .pdf فائلوں کو .txt میں یا .txt کو .doc (Word) میں تبدیل کریں۔",
    
    playAudio: "آڈیو گائیڈ چلائیں (MP3)",
    playAiVoice: "مصنوعی آواز سنیں (AI)",
    showTranscript: "تحریر دیکھیں (ٹرانسکرپٹ)",
    hideTranscript: "تحریر چھپائیں",
    cleanNow: "متن صاف کریں",
    cleanCorpus: "کارپس کو صاف کریں",
    mergeNow: "فائلیں یکجا کریں",
    convertNow: "تبدیل کریں (کنورٹ)",
    downloadClean: "صاف شدہ متن ڈاؤن لوڈ کریں",
    copyText: "کاپی کریں",
    
    optLowercase: "چھوٹے حروف میں تبدیل کریں (Lowercase)",
    optRemovePunct: "رموز و اوقاف ختم کریں (Punctuation)",
    optRemoveDigits: "ہندسے اور نمبر ختم کریں",
    optRemoveUrls: "ویب لنکس (URLs) ختم کریں",
    optRemoveEmojis: "ایموجیز اور نشانات ختم کریں",
    optRemoveStops: "عام فالتو الفاظ (Stop Words) ختم کریں",
    optNormalize: "اضافی خالی جگہیں ختم کریں",
    optOnlyAlpha: "صرح حروف تہجی والے الفاظ رکھیں",
    customStopsLabel: "اپنے فالتو الفاظ یہاں لکھیں (خالی جگہ کے ساتھ):",
    pasteTextPlaceholder: "صاف کرنے کے لیے اپنا متن یہاں لکھیں یا پیسٹ کریں...",
    
    optInsertHeader: "فائلوں کے درمیان فائل کا نام شامل کریں",
    optExtraLines: "فائلوں کے درمیان اضافی خالی لائنیں شامل کریں",
    mergeTargetLabel: "اؤٹ پٹ فارمیٹ منتخب کریں:",
    selectMergeFiles: "یکجا کرنے کے لیے فائلیں منتخب کریں:",
    orMergeCorpus: "یا کارپس کی تمام فائلوں کو یکجا کریں:",
    mergeCorpusBtn: "کارپس کی تمام فائلیں یکجا کریں",
    
    convTargetLabel: "کس فارمیٹ میں تبدیل کرنا ہے:",
    selectConvFiles: "تبدیل کرنے کے لیے فائلیں منتخب کریں:",
    converting: "تبدیلی جاری ہے...",
    convertedSuccess: "کامیابی سے تبدیل ہو گیا!",
    downloadConverted: "تبدیل شدہ فائل ڈاؤن لوڈ کریں",
  },
  hi: {
    appTitle: "लिंगुआएक्स आर्क",
    logoSub: "कॉर्पस टूलकिट · अर्स्लान ताहिर द्वारा",
    corpus: "कॉर्पस",
    kwic: "KWIC",
    plot: "प्लॉट",
    fileview: "फ़ाइल दृश्य",
    cluster: "क्लस्टर",
    ngram: "एन-ग्राम",
    collocate: "सह-शब्द",
    wordlist: "शब्द सूची",
    keyword: "कीवर्ड",
    cloud: "शब्द क्लाउड",
    summary: "सारांशकर्ता",
    sentiment: "भावना",
    toolkit: "टूलकिट",
    settings: "सेटिंग्स",
    
    welcomeGuide: "स्वागत और बहुभाषी ऑडियो गाइड",
    corpusCleaner: "उन्नत कॉर्पस क्लीनर और सामान्यीकरण",
    fileMerger: "फ़ाइल विलय और योजक",
    fileConverter: "बल्क फ़ाइल कनवर्टर",
    
    cleanerIntro: "अपने कॉर्पस या कच्चे टेक्स्ट को लोअरकेस करें, विराम चिह्न हटाएं, स्टॉप वर्ड्स हटाएं और स्पेस ठीक करें।",
    mergerIntro: "कई .txt, .docx, या .pdf फाइलों को ऑफलाइन एक सिंगल फाइल में जोड़ें।",
    converterIntro: "ऑफ़लाइन .docx और .pdf फ़ाइलों को .txt में या .txt को .doc (Word) में बदलें।",
    
    playAudio: "ऑडियो चलाएं (MP3)",
    playAiVoice: "एआई आवाज सुनें",
    showTranscript: "ट्रांसक्रिप्ट देखें",
    hideTranscript: "ट्रांसक्रिप्ट छुपाएं",
    cleanNow: "टेक्स्ट साफ करें",
    cleanCorpus: "कॉर्पस को साफ करें",
    mergeNow: "फ़ाइलें जोड़ें",
    convertNow: "बदलें (Convert)",
    downloadClean: "साफ टेक्स्ट डाउनलोड करें",
    copyText: "कॉपी करें",
    
    optLowercase: "लोअरकेस में बदलें",
    optRemovePunct: "विराम चिह्न हटाएं",
    optRemoveDigits: "अंक और नंबर हटाएं",
    optRemoveUrls: "वेब लिंक (URLs) हटाएं",
    optRemoveEmojis: "इमोजी और प्रतीक हटाएं",
    optRemoveStops: "स्टॉप शब्द हटाएं",
    optNormalize: "अतिरिक्त स्थान हटाएं",
    optOnlyAlpha: "केवल वर्णमाला वाले शब्द रखें",
    customStopsLabel: "कस्टम स्टॉप शब्द (स्पेस के साथ):",
    pasteTextPlaceholder: "साफ करने के लिए टेक्स्ट यहाँ पेस्ट करें...",
    
    optInsertHeader: "फाइलों के बीच फाइल का नाम डालें",
    optExtraLines: "फाइलों के बीच अतिरिक्त खाली लाइनें छोड़ें",
    mergeTargetLabel: "आउटपुट प्रारूप चुनें:",
    selectMergeFiles: "जोड़ने के लिए फ़ाइलें चुनें:",
    orMergeCorpus: "या वर्तमान लोड किए गए कॉर्पस को जोड़ें:",
    mergeCorpusBtn: "पूरे कॉर्पस को एक करें",
    
    convTargetLabel: "किस प्रारूप में बदलना है:",
    selectConvFiles: "बदलने के लिए फ़ाइलें चुनें:",
    converting: "बदला जा रहा है...",
    convertedSuccess: "सफलतापूर्वक बदला गया!",
    downloadConverted: "बदली हुई फ़ाइल डाउनलोड करें",
  },
  zh: {
    appTitle: "LinguaX Arc 语料库",
    logoSub: "语料库工具箱 · 由 Arslan Tahir 开发",
    corpus: "语料库",
    kwic: "语境共现",
    plot: "分布图",
    fileview: "文件查看",
    cluster: "词群",
    ngram: "N元语法",
    collocate: "搭配词",
    wordlist: "词频表",
    keyword: "主题词",
    cloud: "词云图",
    summary: "学术摘要",
    sentiment: "情感分析",
    toolkit: "工具箱",
    settings: "系统设置",
    
    welcomeGuide: "欢迎使用与多语言语音指南",
    corpusCleaner: "语料库高级清洗与标准化",
    fileMerger: "高性能多文件合并工具",
    fileConverter: "批量文件格式转换器",
    
    cleanerIntro: "转换大小写、过滤标点符号、去除停用词、清理数字/网址等，支持直接清洗语料库或粘贴文本。",
    mergerIntro: "完全离线合并多个 .txt、.docx 或 .pdf 文件为单个文件或Word文档。",
    converterIntro: "无需联网，批量将 .docx 和 .pdf 转换为干净的文本文件，或将文本转换为 .doc (Word) 文档。",
    
    playAudio: "播放音频指南 (MP3)",
    playAiVoice: "播放内置 AI 语音",
    showTranscript: "显示文本内容 (转录)",
    hideTranscript: "隐藏转录文本",
    cleanNow: "立即清洗文本",
    cleanCorpus: "直接清洗当前语料库",
    mergeNow: "立即合并选定文件",
    convertNow: "开始格式转换",
    downloadClean: "下载清洗后的文本",
    copyText: "复制文本",
    
    optLowercase: "全部转换为小写",
    optRemovePunct: "过滤所有标点符号",
    optRemoveDigits: "过滤数字字符",
    optRemoveUrls: "过滤网址链接 (URLs)",
    optRemoveEmojis: "过滤 Emoji 表情与符号",
    optRemoveStops: "去除停用词 (Stop Words)",
    optNormalize: "规范化空格与换行",
    optOnlyAlpha: "仅保留纯英文字母单词",
    customStopsLabel: "自定义停用词列表 (空格分隔):",
    pasteTextPlaceholder: "请在此处粘贴要清洗的文本...",
    
    optInsertHeader: "在文件之间插入文件名分隔符",
    optExtraLines: "在合并的文件之间插入空行",
    mergeTargetLabel: "合并输出格式:",
    selectMergeFiles: "选择本地待合并文件:",
    orMergeCorpus: "或直接合并当前已载入的语料库文件:",
    mergeCorpusBtn: "一键合并语料库文件",
    
    convTargetLabel: "目标转换格式:",
    selectConvFiles: "选择本地待转换文件:",
    converting: "正在转换格式...",
    convertedSuccess: "格式转换成功！",
    downloadConverted: "下载已转换的文件",
  }
*/

function _t(key, defaultVal) {
  if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
    return TRANSLATIONS.en[key];
  }
  return defaultVal;
}

const S = {
  theme:'light', tool:'corpus', files:[], ref:[],
  posChartMode:'donut', punctChartMode:'donut', posFilter:'all',
  dashboardTab:'history',
  q:{term:'', cs:false, rx:false, ctx:8, sort:'none', sort1:'1R', sort2:'2R', sort3:'3R', sortMode:'freq', foldGroups:false, groupSingletons:false, page:1, pageSize:100},
  cluster:{term:'', size:2, side:'right', min:1},
  ngram:{size:2, min:2, sortBy:'freq'},
  coll:{term:'', L:5, R:5, min:2, stat:'MI'},
  wl:{sortBy:'freq', stop:false},
  kw:{show:'pos', metric:'LL', minFreq:2, sigFilter:'all', removeStop:false},
  stats:{minFreq:1, sampleSize:100, selectedFile:'all'},
  workspace:{filter:'all', searchQuery:'', activeItem:null},
  workspaceHistory:[],
  fv:{file:0, term:''},
  settings:{lang:'en', reduceMotion:false, disableBlur:true, showBg:true, palette:'nature', appTheme:'amber', exportFormat:'pdf', outputFolder:'Documents/LinguaX', vibrationEnabled:true, recordHistory:true},
  lastHits:[], lastRows:null,
  summary:{text:'', length:'5', format:'bullets', query:'', outHtml:'', fileIdx:''},
  sentiment:{text:'', fileIdx:'', data:null, filter:'all'},
  cachedOut:{},
  toolkit:{
    activeSection: 'cleaner',
    cleanPaste: '',
    cleanOpts: {
      lowercase: true,
      removePunct: true,
      removeDigits: false,
      removeUrls: true,
      removeEmojis: true,
      removeStopwords: false,
      normalizeSpaces: true,
      onlyAlpha: false,
      customStopwords: "the and of in a to that is for on was with"
    },
    mergeOpts: {
      insertHeader: true,
      extraLines: true,
      target: 'txt'
    },
    convOpts: {
      target: 'txt'
    }
  }
};

let currentUtterance = null;
let isSpeaking = false;

function clearTabCache(){
  S.cachedOut = {};
  S.corpusWordFreqs = null;
  S._cachedCorpusTotalsFiles = null;
  S._cachedCorpusTotalsRef = null;
  S._cachedTextStats = null;
  S._cachedPOSAnalysis = null;
  S._cachedPunctAnalysis = null;
  (S.files || []).forEach(f => {
    delete f._sCnt;
    delete f._pCnt;
    delete f._pBreakdown;
    delete f._charsNoSpaces;
    delete f._paragraphs;
  });
  (S.ref || []).forEach(f => {
    delete f._sCnt;
    delete f._pCnt;
    delete f._pBreakdown;
    delete f._charsNoSpaces;
    delete f._paragraphs;
  });
}

/* ---------- settings persistence ---------- */
function loadSettings(){
  try{
    const raw = localStorage.getItem('linguax_settings');
    if(raw){
      const saved = JSON.parse(raw);
      Object.assign(S.settings, saved.settings||{});
      if(saved.theme) S.theme = saved.theme;
    }
  }catch(e){}
  if(S.settings.lang === undefined) S.settings.lang = 'en';
  if(S.settings.showBg === undefined) S.settings.showBg = true;
  S.settings.disableBlur = true; // Permanently enabled (60FPS Mode)
  if(S.settings.reduceMotion === undefined) S.settings.reduceMotion = false;
  if(S.settings.palette === undefined) S.settings.palette = 'nature';
  if(S.settings.appTheme === undefined || S.settings.appTheme === 'emerald' || S.settings.appTheme === 'indigo') S.settings.appTheme = 'amber';
  if(S.settings.exportFormat === undefined || S.settings.exportFormat === 'excel') S.settings.exportFormat = 'pdf';
  if(S.settings.outputFolder === undefined) S.settings.outputFolder = 'Documents/LinguaX';
  if(S.settings.vibrationEnabled === undefined) S.settings.vibrationEnabled = true;
  if(S.settings.recordHistory === undefined) S.settings.recordHistory = true;
  
  applyDisableBlur();
  applyAppTheme();
}
function saveSettings(){
  try{ localStorage.setItem('linguax_settings', JSON.stringify({theme:S.theme, settings:S.settings})); }catch(e){}
}
function applyReduceMotion(){
  document.documentElement.classList.toggle('force-reduce-motion', S.settings.reduceMotion);
}
function toggleReduceMotion(){ S.settings.reduceMotion = !S.settings.reduceMotion; applyReduceMotion(); saveSettings(); render(); }
function applyDisableBlur(){
  document.documentElement.classList.toggle('disable-blur', !!S.settings.disableBlur);
}
function toggleDisableBlur(){ S.settings.disableBlur = !S.settings.disableBlur; applyDisableBlur(); saveSettings(); render(); }
function applyBgVisibility(){
  document.body.classList.toggle('hide-gradient-bg', !S.settings.showBg);
}
function toggleBgVisibilitySetting(){
  S.settings.showBg = !S.settings.showBg;
  applyBgVisibility();
  saveSettings();
  render();
}

const THEMES = [
  { id: 'monochrome', name: 'Charcoal Silver', gradient: 'linear-gradient(135deg, #2b2b30, #a3a3a3)' },
  { id: 'purple', name: 'Royal Purple', gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
  { id: 'indigo', name: 'Electric Blue', gradient: 'linear-gradient(135deg, #2563eb, #60a5fa)' },
  { id: 'emerald', name: 'Emerald Teal', gradient: 'linear-gradient(135deg, #059669, #34d399)' },
  { id: 'crimson', name: 'Crimson Rose', gradient: 'linear-gradient(135deg, #e11d48, #fb7185)' },
  { id: 'amber', name: 'Warm Amber Brown', gradient: 'linear-gradient(135deg, #b45309, #f59e0b)' },
  { id: 'cyberpink', name: 'Cyber Pink', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' }
];

function getThemeName(id) {
  const t = THEMES.find(item => item.id === id);
  return t ? t.name : 'Warm Amber Brown';
}

function renderThemeCircles() {
  const current = S.settings.appTheme || 'amber';
  return THEMES.map(t => {
    const active = current === t.id;
    return `
      <button class="theme-circle-btn ${active ? 'active' : ''}" 
              onclick="changeAppTheme('${t.id}')" 
              type="button" 
              style="background: ${t.gradient};" 
              aria-label="Theme Color">
        ${active ? `
          <svg class="theme-circle-check" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        ` : ''}
      </button>
    `;
  }).join('');
}

function applyAppTheme(){
  const t = S.settings.appTheme || 'amber';
  const themes = ['monochrome', 'purple', 'indigo', 'emerald', 'crimson', 'amber', 'cyberpink'];
  themes.forEach(name => document.documentElement.classList.remove('apptheme-' + name));
  document.documentElement.classList.add('apptheme-' + t);
}
function changeAppTheme(t){
  S.settings.appTheme = t;
  applyAppTheme();
  saveSettings();
  render();
  triggerVibration('click');
}
function updateOutputFolder(val){
  S.settings.outputFolder = val;
  saveSettings();
}
function changeExportFormat(fmt){
  S.settings.exportFormat = fmt;
  saveSettings();
  render();
}
function triggerVibration(type) {
  if (!S.settings.vibrationEnabled) return;
  // 1. Prefer native AndroidBridge vibration to avoid Chromium user-gesture blocking
  if (typeof AndroidBridge !== 'undefined' && typeof AndroidBridge.vibrate === 'function') {
    try {
      if (type === 'click') {
        AndroidBridge.vibrate(12);
      } else if (type === 'success') {
        if (typeof AndroidBridge.vibratePattern === 'function') {
          AndroidBridge.vibratePattern('20,40,25');
        } else {
          AndroidBridge.vibrate(35);
        }
      } else if (type === 'error') {
        if (typeof AndroidBridge.vibratePattern === 'function') {
          AndroidBridge.vibratePattern('60,50,60');
        } else {
          AndroidBridge.vibrate(80);
        }
      } else if (type === 'toggle') {
        AndroidBridge.vibrate(15);
      } else if (type === 'trash') {
        AndroidBridge.vibrate(120);
      }
      return;
    } catch(e) {}
  }

  // 2. Fallback to web navigator.vibrate only if user has interacted with the document
  const isActivated = (typeof navigator !== 'undefined' && navigator.userActivation) ? navigator.userActivation.hasBeenActive : true;
  if (isActivated && typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      if (type === 'click') {
        navigator.vibrate(12);
      } else if (type === 'success') {
        navigator.vibrate([20, 40, 25]);
      } else if (type === 'error') {
        navigator.vibrate([60, 50, 60]);
      } else if (type === 'toggle') {
        navigator.vibrate(15);
      } else if (type === 'trash') {
        navigator.vibrate(120);
      }
    } catch(e) {}
  }
}
function playFeedback(type) {
  triggerVibration(type);
}
function toggleVibrationEnabled() {
  S.settings.vibrationEnabled = !S.settings.vibrationEnabled;
  if (S.settings.vibrationEnabled) {
    if (typeof AndroidBridge !== 'undefined' && typeof AndroidBridge.vibrate === 'function') {
      try { AndroidBridge.vibrate(30); } catch(e) {}
    } else if (typeof navigator !== 'undefined' && navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) {
      try { navigator.vibrate(30); } catch(e) {}
    }
  }
  playFeedback('toggle');
  saveSettings();
  render();
}
let onConfirmActionCallback = null;

function showActionConfirmDialog({ title, message, confirmText, iconHtml, onConfirm }) {
  const modal = document.getElementById('confirmActionModal');
  if (!modal) {
    if (typeof onConfirm === 'function') onConfirm();
    return;
  }
  const titleEl = document.getElementById('confirmActionTitle');
  const msgEl = document.getElementById('confirmActionMessage');
  const btn = document.getElementById('confirmActionBtn');
  const iconWrap = document.getElementById('confirmActionIcon');
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;
  if (btn) btn.textContent = confirmText || 'Clear';
  if (iconHtml && iconWrap) iconWrap.innerHTML = iconHtml;
  onConfirmActionCallback = onConfirm;
  btn.onclick = () => {
    const cb = onConfirmActionCallback;
    onConfirmActionCallback = null;
    closeConfirmActionModal();
    if (typeof cb === 'function') {
      try {
        cb();
      } catch (err) {
        console.error('Error executing confirm action callback:', err);
      }
    }
  };
  modal.classList.add('open');
}

function closeConfirmActionModal() {
  const modal = document.getElementById('confirmActionModal');
  if (modal) modal.classList.remove('open');
  onConfirmActionCallback = null;
}

function promptClearCorpusFiles() {
  if (!S.files.length) return;
  showActionConfirmDialog({
    title: 'Clear Corpus Files?',
    message: `Are you sure you want to remove all ${S.files.length} loaded corpus files (${corpusTotals(S.files).tok.toLocaleString()} tokens)? This action will reset target corpus analysis and cannot be undone.`,
    confirmText: 'Clear Corpus Files',
    onConfirm: () => {
      playFeedback('trash');
      clearFiles('main');
      toast('Corpus files cleared');
    }
  });
}

function promptClearRefFiles() {
  if (!S.ref.length) return;
  showActionConfirmDialog({
    title: 'Clear Reference Corpus?',
    message: `Are you sure you want to remove all ${S.ref.length} reference files (${corpusTotals(S.ref).tok.toLocaleString()} tokens)?`,
    confirmText: 'Clear Reference',
    onConfirm: () => {
      playFeedback('trash');
      clearFiles('ref');
      toast('Reference corpus files cleared');
    }
  });
}

function promptClearAllData() {
  showActionConfirmDialog({
    title: 'Clear My Data?',
    message: 'Are you sure you want to clear your stored data? All uploaded files saved inside the app and cached analyses will be permanently removed from this device.',
    confirmText: 'Clear My Data',
    onConfirm: () => {
      clearAllData();
    }
  });
}

function promptClearWorkspaceHistory() {
  const count = S.workspaceHistory ? S.workspaceHistory.length : 0;
  if (!count) return toast('Workspace history is already empty', false);
  showActionConfirmDialog({
    title: 'Clear Analysis History?',
    message: `Are you sure you want to delete all ${count} recorded task sessions and export logs from your device? This cannot be undone.`,
    confirmText: 'Clear All History',
    onConfirm: () => {
      playFeedback('trash');
      S.workspaceHistory = [];
      saveWorkspaceHistory();
      render();
      toast('Workspace analysis history cleared');
    }
  });
}

function promptDelSingleFile(i, which) {
  const arr = which === 'ref' ? S.ref : S.files;
  const item = arr[i];
  if (!item) return;
  showActionConfirmDialog({
    title: 'Remove File?',
    message: `Are you sure you want to remove "${item.name}" (${item.toks.length.toLocaleString()} words) from your ${which === 'ref' ? 'reference' : 'target'} corpus?`,
    confirmText: 'Remove File',
    onConfirm: () => {
      playFeedback('trash');
      delFile(i, which);
      toast(`Removed "${item.name}"`);
    }
  });
}

async function clearAllData(){
  playFeedback('trash');
  S.files=[]; S.ref=[]; S.lastHits=[]; S.lastRows=null;
  await clearStorageFiles('all');
  clearTabCache();
  go('corpus');
  toast('All saved files and data cleared');
}

function toggleRecordHistory(){
  S.settings.recordHistory = !S.settings.recordHistory;
  if (!S.settings.recordHistory) {
    S.history = [];
    try { localStorage.removeItem('linguax_history'); } catch(e){}
  }
  playFeedback('toggle');
  saveSettings();
  render();
}

/* ---------- Workspace Persistence & Rating Dialog Helpers ---------- */
function loadWorkspaceHistory() {
  try {
    const raw = localStorage.getItem('linguax_workspace_history');
    if (raw) S.workspaceHistory = JSON.parse(raw) || [];
  } catch(e) { S.workspaceHistory = []; }
  
  try {
    const tc = localStorage.getItem('linguax_task_count');
    if (tc) S.taskCount = parseInt(tc, 10) || 0;
    else S.taskCount = 0;
    
    const hr = localStorage.getItem('linguax_has_rated');
    if (hr === 'true') S.hasRated = true;
    else S.hasRated = false;
  } catch(e) {}
}

function saveWorkspaceHistory() {
  try {
    localStorage.setItem('linguax_workspace_history', JSON.stringify((S.workspaceHistory || []).slice(0, 500)));
  } catch(e) {}
}

function incrementTaskCount() {
  S.taskCount = (S.taskCount || 0) + 1;
  try {
    localStorage.setItem('linguax_task_count', String(S.taskCount));
  } catch(e) {}
  
  // Rate dialog trigger on 5th task
  if (S.taskCount === 5 && !S.hasRated) {
    setTimeout(() => {
      triggerRateAppDialog();
    }, 800);
  }
}

function triggerRateAppDialog() {
  const modal = document.getElementById('rateAppModal');
  if (modal) {
    const countEl = document.getElementById('rateTaskCountText');
    if (countEl) countEl.textContent = `${S.taskCount} analyses`;
    modal.classList.add('open');
  }
}

function dismissRateAppDialog() {
  const modal = document.getElementById('rateAppModal');
  if (modal) modal.classList.remove('open');
  S.hasRated = true;
  try { localStorage.setItem('linguax_has_rated', 'true'); } catch(e){}
}

function handleRateAppClick() {
  dismissRateAppDialog();
  if (window.AndroidBridge && typeof window.AndroidBridge.rateApp === 'function') {
    window.AndroidBridge.rateApp();
  } else {
    window.open('https://play.google.com/store/apps/details?id=com.linguax.arc', '_blank');
  }
}

function logWorkspaceTask(taskData) {
  if (!taskData) return;
  const id = 'ws_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  const resolvedFileName = taskData.fileName || taskData.file || (
    S.files.length === 1
      ? S.files[0].name
      : (S.files.length > 1 ? S.files.map(f => f.name).join(', ') : 'Direct Text Input')
  );

  const record = {
    id,
    timestamp: now.getTime(),
    dateStr,
    timeStr,
    type: taskData.type || 'generic',
    typeName: taskData.typeName || taskData.type,
    title: taskData.title || 'Corpus Task',
    fileName: resolvedFileName,
    corpusSummary: resolvedFileName,
    summarySnippet: taskData.summarySnippet || '',
    metrics: taskData.metrics || {},
    params: taskData.params || {},
    exportableRows: taskData.exportableRows || null,
    exportFilename: taskData.exportFilename || 'analysis_export.csv'
  };

  if (!S.workspaceHistory) S.workspaceHistory = [];
  S.workspaceHistory.unshift(record);
  if (S.workspaceHistory.length > 80) S.workspaceHistory.pop();
  saveWorkspaceHistory();
  incrementTaskCount();
}

function getTabCategoryMeta(type) {
  switch (type) {
    case 'kwic':
      return { label: 'Concordance (KWIC)', icon: I.search, color: '#38bdf8' };
    case 'stats':
      return { label: 'Corpus Statistics', icon: I.chart, color: '#a78bfa' };
    case 'plot':
      return { label: 'Concordance Plot', icon: I.plot, color: '#22d3ee' };
    case 'keyword':
      return { label: 'Keyword / Keyness', icon: I.key, color: '#fbbf24' };
    case 'cloud':
      return { label: 'Word Cloud', icon: I.cloud, color: '#34d399' };
    case 'summary':
      return { label: 'Text Summarizer', icon: I.doc, color: '#818cf8' };
    case 'sentiment':
      return { label: 'Sentiment & Tone', icon: I.smile, color: '#f43f5e' };
    case 'collocate':
      return { label: 'Collocates & Metrics', icon: I.link, color: '#2dd4bf' };
    case 'ngram':
      return { label: 'N-Grams Sequences', icon: I.ngram, color: '#facc15' };
    case 'wordlist':
      return { label: 'Word List & Vocab', icon: I.list, color: '#c084fc' };
    case 'cluster':
      return { label: 'Collocational Clusters', icon: I.cluster, color: '#fb923c' };
    default:
      return { label: 'Linguistic Analysis', icon: I.doc, color: 'var(--a1)' };
  }
}

function renderWorkspaceCardHtml(item, { showDelete = false } = {}) {
  let icon = I.doc;
  let typeColor = 'var(--a1)';
  let typeBg = 'rgba(16, 185, 129, 0.12)';
  let typeLabel = esc(item.typeName || (item.type ? item.type.toUpperCase() : 'ANALYSIS'));

  if (item.type === 'sentiment') {
    const textCorpus = ((item.title || '') + ' ' + (item.summarySnippet || '')).toLowerCase();
    const isThreat = textCorpus.includes('threat') || textCorpus.includes('hostile');
    const isNegative = isThreat || textCorpus.includes('negative');
    const isPositive = !isNegative && textCorpus.includes('positive');

    if (isThreat) {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      typeColor = '#f87171';
      typeBg = 'rgba(248, 113, 113, 0.14)';
      typeLabel = 'Hostile / Threat Flagged';
    } else if (isNegative) {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;
      typeColor = '#fb923c';
      typeBg = 'rgba(251, 146, 60, 0.14)';
      typeLabel = 'Sentiment (Negative)';
    } else if (isPositive) {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;
      typeColor = '#34d399';
      typeBg = 'rgba(52, 211, 153, 0.14)';
      typeLabel = 'Sentiment (Positive)';
    } else {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;
      typeColor = '#38bdf8';
      typeBg = 'rgba(56, 189, 248, 0.14)';
      typeLabel = 'Sentiment (Objective)';
    }
  } else if (item.type === 'kwic') { icon = I.search; typeColor = '#38bdf8'; typeBg = 'rgba(56, 189, 248, 0.14)'; }
  else if (item.type === 'stats') { icon = I.chart; typeColor = '#a78bfa'; typeBg = 'rgba(167, 139, 250, 0.14)'; }
  else if (item.type === 'plot') { icon = I.plot; typeColor = '#22d3ee'; typeBg = 'rgba(34, 211, 238, 0.14)'; }
  else if (item.type === 'keyword') { icon = I.key; typeColor = '#fbbf24'; typeBg = 'rgba(251, 191, 36, 0.14)'; }
  else if (item.type === 'cloud') { icon = I.cloud; typeColor = '#34d399'; typeBg = 'rgba(52, 211, 153, 0.14)'; }
  else if (item.type === 'summary') { icon = I.doc; typeColor = '#818cf8'; typeBg = 'rgba(129, 140, 248, 0.14)'; }
  else if (item.type === 'collocate') { icon = I.link; typeColor = '#2dd4bf'; typeBg = 'rgba(45, 212, 191, 0.14)'; }
  else if (item.type === 'ngram') { icon = I.ngram; typeColor = '#facc15'; typeBg = 'rgba(250, 204, 21, 0.14)'; }
  else if (item.type === 'wordlist') { icon = I.list; typeColor = '#c084fc'; typeBg = 'rgba(192, 132, 252, 0.14)'; }
  else if (item.type === 'cluster') { icon = I.cluster; typeColor = '#fb923c'; typeBg = 'rgba(251, 146, 60, 0.14)'; }

  return `
    <div class="workspace-card ws-card" id="ws-card-${item.id}">
      <div class="ws-card-header">
        <div class="ws-type-badge" style="background:${typeBg}; color:${typeColor}; border:1px solid ${typeColor}40;">
          <span class="ws-icon" style="color:${typeColor};">${icon}</span>
          <span>${typeLabel}</span>
        </div>
        <div class="ws-timestamp">${esc(item.dateStr)} · ${esc(item.timeStr)}</div>
      </div>
      
      <div class="ws-card-title">${esc(item.title)}</div>
      
      ${item.corpusSummary ? `
        <div class="ws-corpus-meta">
          <span class="ws-meta-icon">${I.folder}</span>
          <span>${esc(item.corpusSummary)}</span>
        </div>
      ` : ''}
      
      ${item.summarySnippet ? `
        <div class="ws-snippet">
          ${esc(item.summarySnippet)}
        </div>
      ` : ''}
      
      <div class="ws-card-actions">
        <button class="btn run small" onclick="revisitWorkspaceItem('${item.id}')" style="display:inline-flex; align-items:center; gap:6px;">
          ${I.search} Revisit
        </button>
        <button class="btn ghost small" onclick="openWorkspaceDetailModal('${item.id}')" style="display:inline-flex; align-items:center; gap:6px;">
          ${I.info} Details
        </button>
        ${item.exportableRows ? `
          <button class="btn ghost small" onclick="exportWorkspaceItem('${item.id}')" style="display:inline-flex; align-items:center; gap:6px;">
            ${I.dl} Export
          </button>
        ` : ''}
        ${showDelete ? `
          <button class="iconbtn" onclick="deleteWorkspaceItem('${item.id}')" style="width:34px; height:34px; border-radius:10px; color:var(--danger); margin-left:auto;" title="Delete log">
            ${I.trash}
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

/* ---------- utils ---------- */
const $ = s => document.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const CHART_BAR_COLORS = [
  '#4ea8de', // Vibrant Blue
  '#ff70a6', // Vibrant Pink
  '#ffb703', // Vibrant Gold
  '#34d399', // Vibrant Mint
  '#b5179e', // Vibrant Violet
  '#f4a261', // Vibrant Orange
  '#06b6d4', // Vibrant Cyan
  '#f43f5e', // Vibrant Rose
  '#a855f7', // Vibrant Purple
  '#10b981'  // Vibrant Teal
];

function drawBarChart(title, data, labelKey, valueKey, actionType) {
  if (!data || data.length === 0) return '';
  const top10 = data.slice(0, 10);
  const maxVal = Math.max(...top10.map(d => Number(d[valueKey]) || 0)) || 1;
  
  const barHeight = 22;
  const barGap = 10;
  const paddingLeft = 120;
  const paddingRight = 60;
  const paddingTop = 15;
  const paddingBottom = 15;
  const width = 540;
  const height = top10.length * (barHeight + barGap) - barGap + paddingTop + paddingBottom;
  const chartWidth = width - paddingLeft - paddingRight;
  
  let barsSvg = '';
  top10.forEach((item, index) => {
    if (!item) return;
    const rawLabel = item[labelKey];
    const label = rawLabel !== undefined && rawLabel !== null ? String(rawLabel) : '';
    const rawVal = item[valueKey];
    const val = rawVal !== undefined && rawVal !== null ? Number(rawVal) : 0;
    const percentage = isNaN(val) || isNaN(maxVal) || maxVal === 0 ? 0 : val / maxVal;
    const barWidth = Math.max(8, isNaN(percentage) ? 8 : percentage * chartWidth);
    const y = paddingTop + index * (barHeight + barGap);
    
    const escapedWord = label.replace(/'/g, "\\'");
    let clickAttr = '';
    let cursorStyle = '';
    
    if (actionType) {
      clickAttr = `onclick="S.q.term='${esc(escapedWord)}'; go('kwic'); runKwic()"`;
      cursorStyle = 'cursor: pointer;';
    }
    
    const barColor = CHART_BAR_COLORS[index % CHART_BAR_COLORS.length];
    
    const valText = Number.isInteger(val) ? val.toLocaleString() : val.toFixed(val < 0.1 ? 4 : 2);
    
    barsSvg += `
      <g ${clickAttr} style="${cursorStyle} outline: none;" class="chart-bar-group">
        <text x="${paddingLeft - 10}" y="${y + barHeight/2 + 4}" text-anchor="end" fill="var(--ink)" font-family="Sora, sans-serif" font-size="11.5px" font-weight="600" style="pointer-events: none;">
          ${esc(label.length > 15 ? label.substring(0, 13) + '..' : label)}
        </text>
        <rect x="${paddingLeft}" y="${y}" width="${chartWidth}" height="${barHeight}" rx="4" fill="var(--stroke-2)" opacity="0.3" style="pointer-events: none;" />
        <rect x="${paddingLeft}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="${barColor}" class="chart-bar-rect">
          <title>${esc(label)}: ${valText}</title>
        </rect>
        <text x="${paddingLeft + barWidth + 8}" y="${y + barHeight/2 + 4}" text-anchor="start" fill="var(--ink-soft)" font-family="JetBrains Mono, sans-serif" font-size="11px" font-weight="600" style="pointer-events: none;">
          ${valText}
        </text>
      </g>
    `;
  });
  
  return `
    <div class="card glass chart-card" style="margin-bottom: 16px; padding: 18px 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <h3 style="font-family: 'Sora'; margin: 0; font-size: 14px; display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--ink);">
          <span class="inline-svg-icon" style="color:var(--a1); width:18px; height:18px; display:inline-flex; align-items:center;">${I.chart}</span> ${title}
        </h3>
        <div style="display: flex; gap: 6px; align-items: center;">
          ${actionType ? `
          <span style="font-size: 11px; color: var(--ink-soft); font-weight: 600; background: var(--stroke-2); padding: 4px 8px; border-radius: 8px; display: inline-flex; align-items: center; gap: 4px; height: 28px; box-sizing: border-box;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--ok);"></span>
            Queryable
          </span>` : ''}
          <button class="btn ghost small" onclick="exportChartAsPDF(this.closest('.chart-card').querySelector('.main-chart-svg'), '${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_chart.pdf')" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; font-size: 11.5px; height: 28px; border-radius: 8px; border: 1px solid var(--stroke-2); background: var(--row-btn, rgba(255,255,255,0.03)); cursor: pointer;">
            PDF
          </button>
          <button class="btn ghost small" onclick="exportChartAsPNG(this.closest('.chart-card').querySelector('.main-chart-svg'), '${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_chart.png')" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; font-size: 11.5px; height: 28px; border-radius: 8px; border: 1px solid var(--stroke-2); background: var(--row-btn, rgba(255,255,255,0.03)); cursor: pointer;">
            Save Image
          </button>
        </div>
      </div>
      <div style="width: 100%; display: block; overflow: visible;">
        <svg class="main-chart-svg" width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: ${width}px; height: auto; display: block; overflow: visible;">
          ${barsSvg}
          <text x="${width - 12}" y="${height - 4}" text-anchor="end" fill="var(--a1)" font-family="Sora, sans-serif" font-size="9.5px" font-weight="700" opacity="0.65" style="pointer-events: none;">LinguaX Arc</text>
        </svg>
      </div>
    </div>
  `;
}
function toast(msg, ok=true){
  const t = $('#toast'); t.textContent = msg;
  t.style.color = ok ? 'var(--ok)' : 'var(--danger)';
  t.classList.add('show'); clearTimeout(t._h);
  t._h = setTimeout(()=>t.classList.remove('show'), 2400);
  playFeedback(ok ? 'success' : 'error');
}
/* ================= Offline Persistent Corpus Storage (IndexedDB) ================= */
const DB_NAME = 'LinguaXCorpusStorage';
const DB_VERSION = 1;
const STORE_NAME = 'stored_files';

function openCorpusDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

async function persistFileToStorage(target, name, text) {
  try {
    const db = await openCorpusDB();
    const id = (target || 'main') + '::' + name;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, target: target || 'main', name, text, timestamp: Date.now() });
  } catch (err) {
    console.warn('Could not persist file to storage:', err);
  }
}

async function removeFileFromStorage(target, name) {
  try {
    const db = await openCorpusDB();
    const id = (target || 'main') + '::' + name;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
  } catch (err) {
    console.warn('Could not remove file from storage:', err);
  }
}

async function clearStorageFiles(target) {
  try {
    const db = await openCorpusDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    if (!target || target === 'all') {
      store.clear();
    } else {
      const req = store.openCursor();
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          if (cursor.value.target === target) {
            cursor.delete();
          }
          cursor.continue();
        }
      };
    }
  } catch (err) {
    console.warn('Could not clear storage files:', err);
  }
}

async function loadPersistedFiles() {
  try {
    const db = await openCorpusDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    return new Promise((resolve) => {
      req.onsuccess = () => {
        const allFiles = req.result || [];
        let added = 0;
        if (allFiles.length > 0) {
          allFiles.forEach(item => {
            if (!item || !item.name) return;
            const isRef = item.target === 'ref';
            const arr = isRef ? S.ref : S.files;
            if (!arr.some(f => f.name === item.name)) {
              const text = item.text || '';
              const toks = tokenize(text);
              arr.push({
                name: item.name,
                text: text,
                toks,
                types: new Set(toks.map(t => t.l)).size
              });
              added++;
            }
          });
          if (added > 0) {
            clearTabCache();
            render();
          }
        }
        resolve(allFiles);
      };
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('Could not load files from storage:', err);
    return [];
  }
}

const WORD_RE = /[A-Za-z\u00C0-\u024F\u0600-\u06FF']+(?:-[A-Za-z\u00C0-\u024F]+)*/g;
function tokenize(text){
  const toks = []; let m; WORD_RE.lastIndex = 0;
  while((m = WORD_RE.exec(text))) toks.push({w:m[0], l:m[0].toLowerCase(), s:m.index});
  return toks;
}
function addTexts(items, target){
  const arr = target==='ref' ? S.ref : S.files;
  for(const {name, text} of items){
    const toks = tokenize(text);
    arr.push({name, text, toks, types:new Set(toks.map(t=>t.l)).size});
    persistFileToStorage(target, name, text);
  }
  clearTabCache();
  render();
  toast(`${items.length} file${items.length>1?'s':''} saved inside app`);
}
let PDF_READY = false;
function ensurePdfWorker(){
  if(PDF_READY || !window.pdfjsLib) return;
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
  PDF_READY = true;
}
async function extractPDF(file){
  ensurePdfWorker();
  const buf = await file.arrayBuffer();
  const withTimeout = (p, ms, msg) => Promise.race([p, new Promise((_,rej)=>setTimeout(()=>rej(new Error(msg)), ms))]);
  const doc = await withTimeout(pdfjsLib.getDocument({data: new Uint8Array(buf)}).promise, 25000, 'PDF took too long to open');
  let text = '';
  for(let i=1; i<=doc.numPages; i++){
    const page = await withTimeout(doc.getPage(i), 15000, 'PDF page took too long to read');
    const content = await withTimeout(page.getTextContent(), 15000, 'PDF page took too long to read');
    text += content.items.map(it=>it.str).join(' ') + '\n';
  }
  return text;
}
async function extractDOCX(file){
  const buf = await file.arrayBuffer();
  const result = await mammoth.extractRawText({arrayBuffer: buf});
  return result.value;
}
async function readOneFile(f){
  const ext = (f.name.split('.').pop()||'').toLowerCase();
  if(ext==='pdf') return await extractPDF(f);
  if(ext==='docx') return await extractDOCX(f);
  return await f.text();
}
async function readPicked(fileList, target){
  const files = [...fileList];
  if(!files.length) return;
  toast(`Reading ${files.length} file${files.length>1?'s':''}...`);
  const items = [];
  for(const f of files){
    try{
      const text = await readOneFile(f);
      items.push({name:f.name, text});
    }catch(e){
      toast(`Could not read ${f.name}${/docx/i.test(f.name)?' (.doc is not supported, only .docx)':''}`, false);
    }
  }
  if(items.length) addTexts(items, target);
}

/* ---------- Shared files handler (from WhatsApp, File Managers, External Shares) ---------- */
window.handleSharedFiles = async function(sharedList) {
  if (!sharedList) return;
  const list = Array.isArray(sharedList) ? sharedList : [sharedList];
  if (!list.length) return;

  // Immediately dismiss splash screen if still showing
  const sp = document.getElementById('splashScreen');
  if (sp) {
    sp.classList.add('hide');
    setTimeout(() => { try { sp.remove(); } catch(e){} }, 300);
  }

  toast(`Processing ${list.length} shared file${list.length > 1 ? 's' : ''}...`);
  const items = [];

  for (const item of list) {
    if (!item) continue;
    try {
      const fileName = item.name || 'shared_document.txt';
      let text = '';

      if (typeof item.text === 'string' && item.text.trim()) {
        text = item.text;
      } else if (item.base64) {
        const binaryStr = atob(item.base64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const mime = item.mimeType || 'application/octet-stream';
        const blob = new Blob([bytes], { type: mime });
        blob.name = fileName;
        text = await readOneFile(blob);
      }

      if (text && text.trim()) {
        items.push({ name: fileName, text });
      }
    } catch (err) {
      console.error('Error importing shared file:', item.name, err);
      toast(`Could not import ${item.name || 'shared file'}`, false);
    }
  }

  if (items.length > 0) {
    addTexts(items, 'corpus');
    if (typeof go === 'function') {
      go('corpus');
    }
    toast(`Successfully imported ${items.length} shared file${items.length > 1 ? 's' : ''}!`);
  }
};

function checkPendingSharedFiles() {
  try {
    if (window._pendingSharedFiles) {
      const p = window._pendingSharedFiles;
      window._pendingSharedFiles = null;
      window.handleSharedFiles(p);
      return;
    }
    if (typeof AndroidBridge !== 'undefined' && typeof AndroidBridge.getPendingSharedFiles === 'function') {
      const raw = AndroidBridge.getPendingSharedFiles();
      if (raw && raw !== '[]' && raw !== 'null' && raw.trim() !== '') {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          window.handleSharedFiles(parsed);
        }
      }
    }
  } catch (e) {
    console.error('Error checking pending shared files:', e);
  }
}

// Stage listeners and timeouts to ensure early and late delivery are both captured
checkPendingSharedFiles();
setTimeout(checkPendingSharedFiles, 300);
setTimeout(checkPendingSharedFiles, 1000);
setTimeout(checkPendingSharedFiles, 2500);
window.addEventListener('DOMContentLoaded', checkPendingSharedFiles);
window.addEventListener('load', checkPendingSharedFiles);

function estimateSyllables(w) {
  const word = (w || '').toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 1;
  if (word.length <= 3) return 1;
  const clean = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  const matches = clean.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

function calculateReadability(tokens, sentences, syllables) {
  if (!tokens || !sentences) {
    return {
      fleschEase: 0,
      fleschGrade: 0,
      rating: 'Standard / Plain English',
      ratingColor: 'var(--a1)'
    };
  }
  const wordsPerSentence = tokens / Math.max(1, sentences);
  const syllablesPerWord = syllables / Math.max(1, tokens);

  let flesch = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
  flesch = Math.max(0, Math.min(100, Math.round(flesch * 10) / 10));

  let grade = (0.39 * wordsPerSentence) + (11.8 * syllablesPerWord) - 15.59;
  grade = Math.max(1, Math.round(grade * 10) / 10);

  let rating = 'Standard (8th-9th Grade)';
  let ratingColor = 'var(--a1)';
  if (flesch >= 90) {
    rating = 'Very Easy (5th Grade)';
    ratingColor = 'var(--ok, #10b981)';
  } else if (flesch >= 70) {
    rating = 'Easy / Conversational (7th Grade)';
    ratingColor = 'var(--ok, #10b981)';
  } else if (flesch >= 60) {
    rating = 'Standard / Plain English';
    ratingColor = 'var(--a1)';
  } else if (flesch >= 50) {
    rating = 'Fairly Difficult (High School)';
    ratingColor = 'var(--warn, #f59e0b)';
  } else if (flesch >= 30) {
    rating = 'Difficult (College Level)';
    ratingColor = 'var(--warn, #f59e0b)';
  } else {
    rating = 'Academic / Specialized';
    ratingColor = 'var(--danger, #ef4444)';
  }

  return { fleschEase: flesch, fleschGrade: grade, rating, ratingColor };
}

function corpusTotals(arr){
  if (!arr || !arr.length) {
    return {
      tok: 0, types: 0, ttr: 0, rootTTR: 0, hapaxLegomena: 0, disLegomena: 0,
      hapaxPct: 0, totalCharsNoSpaces: 0, totalCharsWithSpaces: 0, totalSyllables: 0, paragraphs: 0
    };
  }
  const isFiles = (arr === S.files);
  const isRef = (arr === S.ref);
  if (isFiles && S._cachedCorpusTotalsFiles) return S._cachedCorpusTotalsFiles;
  if (isRef && S._cachedCorpusTotalsRef) return S._cachedCorpusTotalsRef;

  let tok=0;
  const typeFreq = new Map();
  let totalCharsNoSpaces = 0;
  let totalCharsWithSpaces = 0;
  let totalSyllables = 0;
  let paragraphs = 0;

  arr.forEach(f => {
    const raw = f.text || '';
    totalCharsWithSpaces += raw.length;
    if (f._charsNoSpaces === undefined) {
      f._charsNoSpaces = raw.replace(/\s+/g, '').length;
    }
    totalCharsNoSpaces += f._charsNoSpaces;

    if (f._paragraphs === undefined) {
      const paras = raw.split(/\n\s*\n/).filter(p => p.trim().length > 0);
      f._paragraphs = Math.max(1, paras.length);
    }
    paragraphs += f._paragraphs;

    (f.toks || []).forEach(t => {
      tok++;
      const lemma = t.l || t.w.toLowerCase();
      typeFreq.set(lemma, (typeFreq.get(lemma) || 0) + 1);
      totalSyllables += estimateSyllables(t.w);
    });
  });

  const typesCount = typeFreq.size;
  let hapaxLegomena = 0;
  let disLegomena = 0;

  typeFreq.forEach(cnt => {
    if (cnt === 1) hapaxLegomena++;
    else if (cnt === 2) disLegomena++;
  });

  const ttr = tok ? (typesCount / tok * 100) : 0;
  const rootTTR = tok ? (typesCount / Math.sqrt(tok)) : 0;
  const hapaxPct = typesCount ? (hapaxLegomena / typesCount * 100) : 0;

  const res = {
    tok,
    types: typesCount,
    ttr,
    rootTTR,
    hapaxLegomena,
    disLegomena,
    hapaxPct,
    totalCharsNoSpaces,
    totalCharsWithSpaces,
    totalSyllables,
    paragraphs: Math.max(arr.length, paragraphs)
  };

  if (isFiles) S._cachedCorpusTotalsFiles = res;
  if (isRef) S._cachedCorpusTotalsRef = res;
  return res;
}
/* ---------- sentence & punctuation counting ---------- */
function countSentences(text){
  const boundaries = text.match(/[.!?]+/g);
  return boundaries ? boundaries.length : (text.trim() ? 1 : 0);
}
const PUNCT_TYPES = [
  ['Period','.', /\./g], ['Comma',',', /,/g], ['Question mark','?', /\?/g], ['Exclamation','!', /!/g],
  ['Semicolon',';', /;/g], ['Colon',':', /:/g], ['Quote','\u2019\u2018\u201c\u201d\'"', /['"\u2018\u2019\u201c\u201d]/g],
  ['Parenthesis','()', /[()]/g], ['Dash','-\u2014\u2013', /[-\u2014\u2013]/g]
];
function punctBreakdown(text){
  const out=[]; let total=0;
  PUNCT_TYPES.forEach(([label,sym,re])=>{ const m=text.match(re); const n=m?m.length:0; if(n){ out.push([label,n]); total+=n; } });
  return {out, total};
}
function corpusTextStats(files){
  if (!files || !files.length) return { sentences: 0, punctTotal: 0, punctByType: new Map() };
  if (S._cachedTextStats) return S._cachedTextStats;

  let sentences=0, punctTotal=0; const punctByType=new Map();
  files.forEach(f=>{
    if (f._sCnt === undefined) f._sCnt = countSentences(f.text || '');
    if (f._pCnt === undefined || !f._pBreakdown) {
      const { out, total } = punctBreakdown(f.text || '');
      f._pCnt = total;
      f._pBreakdown = out;
    }
    sentences += f._sCnt;
    punctTotal += f._pCnt;
    f._pBreakdown.forEach(([label,n])=>punctByType.set(label,(punctByType.get(label)||0)+n));
  });
  const res = {sentences, punctTotal, punctByType};
  S._cachedTextStats = res;
  return res;
}
/* ---------- comprehensive rule-based part-of-speech tagger & pie chart ---------- */
const POS_PRONOUNS = new Set([
  'i','you','he','she','it','we','they','me','him','her','us','them','my','your','his','its','our','their',
  'mine','yours','hers','ours','theirs','myself','yourself','himself','herself','itself','ourselves','yourselves',
  'themselves','who','whom','whose','which','what','whatever','whoever','whomever','this','that','these','those',
  'someone','somebody','something','anyone','anybody','anything','everyone','everybody','everything','no one','nobody','nothing',
  'each','either','neither','one','oneself'
]);
const POS_PREPOSITIONS = new Set([
  'in','on','at','of','to','for','with','by','from','up','about','into','over','after','through','between','under',
  'against','during','without','before','upon','toward','towards','within','along','across','behind','beyond','around',
  'among','except','off','above','near','throughout','despite','via','per','beneath','onto','past','inside','outside',
  'besides','underneath','concerning','regarding','amid','amidst'
]);
const POS_DETERMINERS = new Set([
  'the','a','an','all','both','half','each','every','either','neither','some','any','no','such','another','other'
]);
const POS_CONJUNCTIONS = new Set([
  'and','but','or','nor','yet','so','because','although','though','while','whereas','if','unless','since','whether',
  'as','once','whenever','wherever','provided'
]);
const POS_MODALS_AUX = new Set([
  'can','could','will','would','shall','should','may','might','must','ought',
  'is','am','are','was','were','be','been','being','have','has','had','having','do','does','did','doing'
]);
const POS_COMMON_ADVERBS = new Set([
  'very','too','so','not',"n't",'also','now','then','always','never','often','sometimes','usually','seldom','rarely',
  'hardly','scarcely','barely','already','still','even','back','there','here','away','well','just','more','most',
  'rather','quite','almost','enough','indeed','perhaps','maybe','together','instead','further','soon','late','early',
  'today','yesterday','tomorrow','again','ever','nevertheless','however','furthermore','moreover','therefore','thus'
]);
const POS_COMMON_ADJECTIVES = new Set([
  'good','better','best','bad','worse','worst','new','old','great','high','small','large','big','little','young',
  'early','major','minor','political','social','public','private','economic','national','general','central','special',
  'local','physical','human','real','true','whole','free','open','full','sure','strong','hard','easy','clear',
  'recent','important','different','possible','likely','simple','common','certain','particular','able','main','past',
  'current','next','final','short','long','late','ready','dark','red','blue','green','white','black','foreign',
  'rich','poor','deep','heavy','hot','cold','warm','dry','wide','happy','sad'
]);
const POS_COMMON_VERBS = new Set([
  'say','says','said','go','goes','went','gone','make','makes','made','take','takes','took','taken',
  'see','sees','saw','seen','come','comes','came','know','knows','knew','known','get','gets','got','gotten',
  'give','gives','gave','given','find','finds','found','think','thinks','thought','tell','tells','told',
  'become','becomes','became','show','shows','showed','shown','leave','leaves','left','feel','feels','felt',
  'put','puts','bring','brings','brought','begin','begins','began','begun','keep','keeps','kept','hold','holds','held',
  'write','writes','wrote','written','stand','stands','stood','hear','hears','heard','let','lets','mean','means','meant',
  'set','sets','meet','meets','met','run','runs','ran','pay','pays','paid','sit','sits','sat','speak','speaks','spoke','spoken',
  'lie','lies','lay','lain','lead','leads','led','read','reads','grow','grows','grew','grown','lose','loses','lost',
  'fall','falls','fell','fallen','send','sends','sent','build','builds','built','understand','understands','understood',
  'draw','draws','drew','drawn','break','breaks','broke','broken','spend','spends','spent','cut','cuts','rise','rises','rose','risen',
  'drive','drives','drove','driven','buy','buys','bought','wear','wears','wore','worn','choose','chooses','chose','chosen',
  'seek','seeks','sought','throw','throws','threw','thrown','catch','catches','caught','deal','deals','dealt','win','wins','won',
  'fight','fights','fought','forget','forgets','forgot','forgotten','eat','eats','ate','eaten','teach','teaches','taught',
  'expect','expects','expected','consider','considers','considered','suggest','suggests','suggested',
  'require','requires','required','report','reports','reported','continue','continues','continued',
  'include','includes','included','provide','provides','provided','believe','believes','believed',
  'happen','happens','happened','allow','allows','allowed','create','creates','created','appear','appears','appeared',
  'wait','waits','waited','serve','serves','served','die','dies','died','stay','stays','stayed',
  'reach','reaches','reached','kill','kills','killed','remain','remains','remained','raise','raises','raised',
  'pass','passes','passed','sell','sells','sold','return','returns','returned','explain','explains','explained',
  'hope','hopes','hoped','develop','develops','developed','carry','carries','carried','claim','claims','claimed',
  'join','joins','joined','produce','produces','produced'
]);

function classifyWordPOS(w) {
  const l = w.toLowerCase();
  if (/^\d+(?:[.,]\d+)*$/.test(l)) {
    return { cat: 'Numbers', color: '#2dd4bf' };
  }
  if (POS_DETERMINERS.has(l)) {
    return { cat: 'Determiners', color: '#c084fc' };
  }
  if (POS_PRONOUNS.has(l)) {
    return { cat: 'Pronouns', color: '#38bdf8' };
  }
  if (POS_PREPOSITIONS.has(l)) {
    return { cat: 'Prepositions', color: '#10e78c' };
  }
  if (POS_CONJUNCTIONS.has(l)) {
    return { cat: 'Conjunctions', color: '#fb923c' };
  }
  if (POS_MODALS_AUX.has(l) || POS_COMMON_VERBS.has(l) || (l.endsWith('ing') && l.length > 4) || (l.endsWith('ed') && l.length > 3) || /(?:ize|ise|ify|ate)$/.test(l)) {
    return { cat: 'Verbs', color: '#8b5cf6' };
  }
  if (POS_COMMON_ADVERBS.has(l) || (l.endsWith('ly') && l.length > 3 && !['friendly','lovely','lonely','likely','deadly','daily','weekly','monthly','yearly'].includes(l))) {
    return { cat: 'Adverbs', color: '#ffb703' };
  }
  if (POS_COMMON_ADJECTIVES.has(l) || /(?:able|ible|ful|less|ous|ious|ic|ical|ive|ish|esque|al)$/.test(l)) {
    return { cat: 'Adjectives', color: '#ff3366' };
  }
  return { cat: 'Nouns', color: '#00d2ff' };
}

function lightenHex(hex, percent) {
  try {
    const num = parseInt(hex.replace('#',''), 16);
    const r = Math.min(255, (num >> 16) + Math.round(255 * (percent / 100)));
    const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * (percent / 100)));
    const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * (percent / 100)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch(e) {
    return hex;
  }
}

let _currentPOSAnalysis = null;
let _currentPunctAnalysis = null;

function setPOSChartMode(mode) {
  S.posChartMode = mode;
  const container = document.getElementById('posChartContainer');
  if (container && _currentPOSAnalysis) {
    container.innerHTML = renderPOSChartContent(_currentPOSAnalysis);
  }
  const card = container ? container.closest('.pos-chart-card') : null;
  if (card) {
    card.querySelectorAll('.pos-segmented-btn').forEach(btn => {
      const isTarget = (mode === 'donut' && btn.textContent.includes('Donut')) || (mode === 'bar' && btn.textContent.includes('Bar'));
      btn.classList.toggle('active', isTarget);
    });
  }
}
window.setPOSChartMode = setPOSChartMode;

function setPunctChartMode(mode) {
  S.punctChartMode = mode;
  const container = document.getElementById('punctChartContainer');
  if (container && _currentPunctAnalysis) {
    container.innerHTML = renderPunctChartContent(_currentPunctAnalysis);
  }
  const card = container ? container.closest('.punct-chart-card') : null;
  if (card) {
    card.querySelectorAll('.pos-segmented-btn').forEach(btn => {
      const isTarget = (mode === 'donut' && btn.textContent.includes('Donut')) || (mode === 'bar' && btn.textContent.includes('Bar'));
      btn.classList.toggle('active', isTarget);
    });
  }
}
window.setPunctChartMode = setPunctChartMode;

function analyzeCorpusPOS(files) {
  if (!files || !files.length) return null;
  if (S._cachedPOSAnalysis) {
    _currentPOSAnalysis = S._cachedPOSAnalysis;
    return S._cachedPOSAnalysis;
  }

  const catMap = new Map();
  let totalWords = 0;

  files.forEach(f => {
    (f.toks || []).forEach(t => {
      totalWords++;
      const pos = classifyWordPOS(t.w);

      if (!catMap.has(pos.cat)) {
        catMap.set(pos.cat, {
          cat: pos.cat,
          color: pos.color,
          count: 0
        });
      }
      catMap.get(pos.cat).count++;
    });
  });

  const categories = [...catMap.values()]
    .map(entry => ({
      cat: entry.cat,
      color: entry.color,
      count: entry.count,
      pct: totalWords ? ((entry.count / totalWords) * 100) : 0
    }))
    .sort((a,b) => b.count - a.count);

  const analysis = {
    categories,
    totalWords
  };
  _currentPOSAnalysis = analysis;
  S._cachedPOSAnalysis = analysis;
  return analysis;
}

function analyzeCorpusPunctuation(files) {
  if (!files || !files.length) return null;
  if (S._cachedPunctAnalysis) {
    _currentPunctAnalysis = S._cachedPunctAnalysis;
    return S._cachedPunctAnalysis;
  }

  const punctMap = new Map();
  let totalPunct = 0;

  const PUNCT_DEFS = [
    { key: 'Period', label: 'Periods (.)', sym: '.', color: '#10b981' },
    { key: 'Comma', label: 'Commas (,)', sym: ',', color: '#06b6d4' },
    { key: 'Question mark', label: 'Question Marks (?)', sym: '?', color: '#f59e0b' },
    { key: 'Exclamation', label: 'Exclamations (!)', sym: '!', color: '#ef4444' },
    { key: 'Quote', label: 'Quotes (\' ")', sym: '"', color: '#3b82f6' },
    { key: 'Dash', label: 'Dashes (- —)', sym: '—', color: '#f97316' },
    { key: 'Colon', label: 'Colons (:)', sym: ':', color: '#8b5cf6' },
    { key: 'Semicolon', label: 'Semicolons (;)', sym: ';', color: '#ec4899' },
    { key: 'Parenthesis', label: 'Brackets ( )', sym: '()', color: '#14b8a6' }
  ];

  files.forEach(f => {
    if (f._pBreakdown === undefined) {
      const { out, total } = punctBreakdown(f.text || '');
      f._pCnt = total;
      f._pBreakdown = out;
    }
    totalPunct += (f._pCnt || 0);
    (f._pBreakdown || []).forEach(([label, n]) => {
      punctMap.set(label, (punctMap.get(label) || 0) + n);
    });
  });

  const categories = PUNCT_DEFS.map(def => {
    const count = punctMap.get(def.key) || 0;
    return {
      cat: def.label,
      sym: def.sym,
      color: def.color,
      count: count,
      pct: totalPunct ? ((count / totalPunct) * 100) : 0
    };
  }).filter(c => c.count > 0).sort((a,b) => b.count - a.count);

  const analysis = {
    categories,
    totalPunct
  };
  _currentPunctAnalysis = analysis;
  S._cachedPunctAnalysis = analysis;
  return analysis;
}

async function savePOSHistogramToGallery() {
  if (!_currentPOSAnalysis || !_currentPOSAnalysis.categories || !_currentPOSAnalysis.categories.length) {
    toast('No POS data available to save', false);
    return;
  }
  playFeedback('click');
  const cats = _currentPOSAnalysis.categories;
  const totalWords = _currentPOSAnalysis.totalWords || 1;

  const canvas = document.createElement('canvas');
  const W = 1200, H = 680;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background - Crisp Luxury White Academic Card
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#ffffff');
  bgGrad.addColorStop(0.5, '#f8fafc');
  bgGrad.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle Outer Border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(10, 10, W - 20, H - 20);

  // Header Title
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 28px "Sora", sans-serif';
  ctx.fillText('LinguaX Arc — Parts of Speech (POS) Histogram', 50, 60);

  // Subtitle
  ctx.fillStyle = '#475569';
  ctx.font = '600 15px "Sora", sans-serif';
  ctx.fillText(`Corpus Volume: ${totalWords.toLocaleString()} running words  •  Grammatical Distribution`, 50, 92);

  // Top Right Brand Tag
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('● LINGUA-X CORPUS ENGINE', W - 50, 60);
  ctx.fillStyle = '#64748b';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillText('ACCREDITED NLP ANALYTICS', W - 50, 82);
  ctx.textAlign = 'left';

  // Divider Line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(50, 115);
  ctx.lineTo(W - 50, 115);
  ctx.stroke();

  // Subtle Center Watermark Stamp
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-15 * Math.PI / 180);
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.038)';
  ctx.font = '900 68px "Sora", sans-serif';
  ctx.fillText('LINGUA-X CORPUS ENGINE', 0, -10);
  ctx.font = '700 22px "JetBrains Mono", monospace';
  ctx.fillText('ACCREDITED NLP HISTOGRAM ANALYTICS', 0, 36);
  ctx.restore();

  // Plot Area Dimensions
  const plotX = 85;
  const plotY = 150;
  const plotW = W - 170;
  const plotH = 390;
  const maxPct = Math.max(...cats.map(c => c.pct), 5);
  const maxAxis = Math.ceil(maxPct / 5) * 5;

  // Grid Lines & Y-axis labels
  const gridTicks = 5;
  ctx.textAlign = 'right';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  for (let i = 0; i <= gridTicks; i++) {
    const val = (maxAxis / gridTicks) * i;
    const yPos = plotY + plotH - (plotH / gridTicks) * i;

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(plotX, yPos);
    ctx.lineTo(plotX + plotW, yPos);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#64748b';
    ctx.fillText(`${val.toFixed(0)}%`, plotX - 12, yPos + 4);
  }

  // Draw X-axis Base Line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(plotX, plotY + plotH);
  ctx.lineTo(plotX + plotW, plotY + plotH);
  ctx.stroke();

  // Draw Histogram Columns
  const numCats = cats.length;
  const stepW = plotW / numCats;
  const barW = Math.min(68, stepW * 0.72);

  cats.forEach((cat, idx) => {
    const colH = Math.max(4, (cat.pct / maxAxis) * plotH);
    const bx = plotX + idx * stepW + (stepW - barW) / 2;
    const by = plotY + plotH - colH;

    // Bar Gradient
    const barGrad = ctx.createLinearGradient(0, by, 0, plotY + plotH);
    barGrad.addColorStop(0, lightenHex(cat.color, 25));
    barGrad.addColorStop(1, cat.color);
    ctx.fillStyle = barGrad;

    // Rounded Top Rect
    const radius = 6;
    ctx.beginPath();
    ctx.moveTo(bx, by + radius);
    ctx.arcTo(bx, by, bx + radius, by, radius);
    ctx.arcTo(bx + barW, by, bx + barW, by + radius, radius);
    ctx.lineTo(bx + barW, plotY + plotH);
    ctx.lineTo(bx, plotY + plotH);
    ctx.closePath();
    ctx.fill();

    // Top Glowing Cap
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx + 4, by);
    ctx.lineTo(bx + barW - 4, by);
    ctx.stroke();

    // Percentage Label Above Bar
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 13px "JetBrains Mono", monospace';
    ctx.fillText(`${cat.pct.toFixed(1)}%`, bx + barW / 2, Math.max(plotY - 8, by - 10));

    // Occurrence Count Label Below Percentage
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(`${cat.count.toLocaleString()}`, bx + barW / 2, Math.max(plotY + 8, by - 24));

    // Category Label Below Bar
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13.5px "Sora", sans-serif';
    ctx.fillText(cat.cat, bx + barW / 2, plotY + plotH + 24);
  });

  // Footer Watermark Band
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(50, H - 65, W - 100, 45);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(50, H - 65, W - 100, 45);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 12.5px "JetBrains Mono", monospace';
  ctx.fillText('•  LINGUA-X CORPUS ENGINE  •  ACCREDITED ON-DEVICE NLP  •  VERIFIED HISTOGRAM', W / 2, H - 42);

  ctx.fillStyle = '#64748b';
  ctx.font = '600 10.5px "JetBrains Mono", monospace';
  ctx.fillText(`Generated by LinguaX Arc  •  ${new Date().toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' })}`, W / 2, H - 26);

  // Export to Gallery via Native Bridge or Browser Download
  const dataUrl = canvas.toDataURL('image/png');
  const base64Data = dataUrl.split(',')[1];
  const fileName = `LinguaX_POS_Histogram_${Date.now()}.png`;

  if (window.AndroidBridge && typeof window.AndroidBridge.saveFile === 'function') {
    window.AndroidBridge.saveFile(base64Data, fileName, 'image/png', 'LinguaX');
    playFeedback('success');
    toast('POS Histogram saved to Gallery (Pictures/LinguaX)!');
  } else {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    a.click();
    playFeedback('success');
    toast('POS Histogram image downloaded!');
  }
}
window.savePOSHistogramToGallery = savePOSHistogramToGallery;

function highlightPOSCategory(catName) {
  if (!_currentPOSAnalysis) return;
  const cat = _currentPOSAnalysis.categories.find(c => c.cat === catName);
  if (!cat) return;

  document.querySelectorAll('.hist-bar').forEach(el => {
    if (el.getAttribute('data-cat') === catName) {
      el.style.stroke = '#ffffff';
      el.style.strokeWidth = '2.5px';
      el.style.filter = 'drop-shadow(0 0 12px rgba(255,255,255,0.7))';
      el.style.transform = 'scaleY(1.03)';
      el.style.opacity = '1';
    } else {
      el.style.stroke = 'rgba(255,255,255,0.1)';
      el.style.strokeWidth = '1px';
      el.style.filter = '';
      el.style.transform = '';
      el.style.opacity = '0.38';
    }
  });

  document.querySelectorAll('.pos-legend-item').forEach(el => {
    if (el.getAttribute('data-cat') === catName) {
      el.classList.add('active-item');
    } else {
      el.classList.remove('active-item');
    }
  });
}
window.highlightPOSCategory = highlightPOSCategory;

function resetPOSHighlight() {
  document.querySelectorAll('.hist-bar').forEach(el => {
    el.style.stroke = 'rgba(255,255,255,0.2)';
    el.style.strokeWidth = '1px';
    el.style.filter = '';
    el.style.transform = '';
    el.style.opacity = '1';
  });
  document.querySelectorAll('.pos-legend-item').forEach(el => {
    el.classList.remove('active-item');
  });
}
window.resetPOSHighlight = resetPOSHighlight;

function renderPOSHistogram(pos) {
  if (!pos || !pos.categories || pos.categories.length === 0) return '';
  const cats = pos.categories;
  const total = pos.totalWords || cats.reduce((acc, c) => acc + c.count, 0) || 1;

  const maxPct = Math.max(...cats.map(c => c.pct), 5);
  const maxAxis = Math.ceil(maxPct / 5) * 5;

  const svgW = 560;
  const svgH = 260;
  const plotX = 45;
  const plotY = 32;
  const plotW = svgW - 65;
  const plotH = 175;

  const stepW = plotW / cats.length;
  const barW = Math.min(38, stepW * 0.72);

  // Y-axis grid
  const ticks = 4;
  let gridSvg = '';
  for (let i = 0; i <= ticks; i++) {
    const val = (maxAxis / ticks) * i;
    const yPos = plotY + plotH - (plotH / ticks) * i;
    gridSvg += `
      <line x1="${plotX}" y1="${yPos}" x2="${plotX + plotW}" y2="${yPos}" stroke="var(--stroke-2)" stroke-dasharray="3,3" stroke-width="1" />
      <text x="${plotX - 8}" y="${yPos + 3.5}" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="9px" font-weight="700" fill="var(--ink-soft)" style="user-select:none; -webkit-user-select:none;">${val.toFixed(0)}%</text>
    `;
  }

  let barsSvg = '';
  let defsSvg = '';

  cats.forEach((cat, idx) => {
    const colH = Math.max(3, (cat.pct / maxAxis) * plotH);
    const bx = plotX + idx * stepW + (stepW - barW) / 2;
    const by = plotY + plotH - colH;
    const gradId = `posHistGrad_${idx}`;

    defsSvg += `
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${lightenHex(cat.color, 25)}" />
        <stop offset="100%" stop-color="${cat.color}" />
      </linearGradient>
    `;

    barsSvg += `
      <g class="hist-col-group" style="user-select:none; -webkit-user-select:none; pointer-events:none;">
        <title>${esc(cat.cat)}: ${cat.count.toLocaleString()} occurrences (${cat.pct.toFixed(1)}%)</title>
        <!-- Bar Column - Strictly unselectable visual display -->
        <rect x="${bx}" y="${by}" width="${barW}" height="${colH}" rx="5" fill="url(#${gradId})" stroke="rgba(255,255,255,0.2)" stroke-width="1" class="hist-bar" data-cat="${esc(cat.cat)}" style="pointer-events:none; user-select:none; -webkit-user-select:none;" />
        <!-- Top glowing line -->
        <line x1="${bx + 2}" y1="${by}" x2="${bx + barW - 2}" y2="${by}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
        <!-- Value Above Bar -->
        <text x="${bx + barW / 2}" y="${Math.max(14, by - 6)}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9.5px" font-weight="900" fill="var(--ink)" style="user-select:none; -webkit-user-select:none; pointer-events:none;">${cat.pct.toFixed(1)}%</text>
        <!-- X-axis Label -->
        <text x="${bx + barW / 2}" y="224" text-anchor="middle" font-family="'Sora', sans-serif" font-size="10px" font-weight="700" fill="var(--ink)" style="user-select:none; -webkit-user-select:none; pointer-events:none;">${esc(cat.cat)}</text>
        <text x="${bx + barW / 2}" y="238" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8px" font-weight="700" fill="var(--ink-soft)" style="user-select:none; -webkit-user-select:none; pointer-events:none;">${cat.count.toLocaleString()}</text>
      </g>
    `;
  });

  return `
    <div style="width: 100%; display: flex; flex-direction: column; gap: 14px; user-select:none; -webkit-user-select:none;">
      <!-- Swipe Notice & Watermark Top Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div class="hist-swipe-hint-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle; display:inline-block;"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
          <span>Swipe left / right to pan</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle; display:inline-block;"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>
        </div>
        <div class="chart-corner-watermark" style="position:static; margin:0;">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/></svg>
          LINGUA-X HISTOGRAM
        </div>
      </div>

      <!-- SVG Histogram Card (Scrollable with initial peek animation) -->
      <div id="posHistScrollCard" class="hist-scroll-card" style="position: relative; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; background: var(--row); border: 1.5px solid var(--stroke-2); border-radius: 16px; padding: 14px 6px 12px 6px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); user-select:none; -webkit-user-select:none;">
        <svg viewBox="0 0 ${svgW} ${svgH}" style="width: 100%; min-width: 480px; height: auto; display: block; overflow: visible; user-select:none; -webkit-user-select:none; pointer-events:none;">
          <defs>
            ${defsSvg}
          </defs>
          <!-- Grid Lines -->
          ${gridSvg}
          <!-- X-axis baseline -->
          <line x1="${plotX}" y1="${plotY + plotH}" x2="${plotX + plotW}" y2="${plotY + plotH}" stroke="var(--ink-soft)" stroke-width="1.5" stroke-opacity="0.5" />
          <!-- Histogram Bars -->
          ${barsSvg}
          <!-- In-SVG Watermark -->
          <text x="${svgW / 2}" y="254" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8.5px" font-weight="800" fill="currentColor" opacity="0.28" letter-spacing="0.14em">
            LINGUA-X CORPUS ENGINE • ACCREDITED ANALYTICS
          </text>
        </svg>
      </div>

      <!-- Category Legend Grid (Unselectable display) -->
      <div class="pos-legend-grid" style="user-select:none; -webkit-user-select:none;">
        ${cats.map(cat => `
          <div class="pos-legend-item" style="cursor:default; user-select:none; -webkit-user-select:none;" title="${esc(cat.cat)}: ${cat.count.toLocaleString()} occurrences (${cat.pct.toFixed(1)}%)">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
              <div style="display:flex; align-items:center; gap:6px; min-width:0;">
                <span style="display:inline-block; width:10px; height:10px; border-radius:3px; background:${cat.color}; flex-shrink:0; box-shadow:0 0 8px ${cat.color}88;"></span>
                <span style="font-size:12px; font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(cat.cat)}</span>
              </div>
              <div style="display:flex; align-items:center; gap:5px; flex-shrink:0;">
                <span style="font-size:12px; font-weight:800; color:var(--ink); font-family:'JetBrains Mono', monospace;">${cat.pct.toFixed(1)}%</span>
                <span style="font-size:10.5px; font-weight:700; color:var(--ink-soft); font-family:'JetBrains Mono', monospace;">(${cat.count.toLocaleString()})</span>
              </div>
            </div>
            <div class="pos-legend-progress-track">
              <div class="pos-legend-progress-bar" style="width:${Math.min(100, Math.max(3, cat.pct))}%; background:${cat.color};"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function drawPOSHistogram(pos) {
  if (!pos || !pos.categories || pos.categories.length === 0) return '';
  _currentPOSAnalysis = pos;
  setTimeout(() => {
    try {
      const el = document.getElementById('posHistScrollCard');
      if (el && el.scrollWidth > el.clientWidth) {
        let start = null;
        const dur = 1000;
        function step(ts) {
          if (!start) start = ts;
          const p = (ts - start) / dur;
          if (p < 1) {
            el.scrollLeft = Math.sin(p * Math.PI) * 45;
            requestAnimationFrame(step);
          } else {
            el.scrollLeft = 0;
          }
        }
        setTimeout(() => requestAnimationFrame(step), 350);
      }
    } catch(e) {}
  }, 60);
  return `
    <div id="posHistogramContainer">
      ${renderPOSHistogram(pos)}
    </div>
  `;
}
function drawPOSChart(pos) {
  return drawPOSHistogram(pos);
}
function drawPOSPieChart(pos) {
  return drawPOSHistogram(pos);
}

async function savePunctuationPyramidToGallery() {
  if (!_currentPunctAnalysis || !_currentPunctAnalysis.categories || !_currentPunctAnalysis.categories.length) {
    toast('No punctuation data available to save', false);
    return;
  }
  playFeedback('click');
  const cats = _currentPunctAnalysis.categories;
  const totalPunct = _currentPunctAnalysis.totalPunct || 1;

  const canvas = document.createElement('canvas');
  const W = 1200, H = 820;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background - Crisp Luxury White Academic Card
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#ffffff');
  bgGrad.addColorStop(0.5, '#f8fafc');
  bgGrad.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Outer Border
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(12, 12, W - 24, H - 24);

  // Header Title
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 28px "Sora", sans-serif';
  ctx.fillText('LinguaX Arc — Punctuation Frequency Pyramid', 50, 60);

  // Subtitle
  ctx.fillStyle = '#475569';
  ctx.font = '600 15px "Sora", sans-serif';
  ctx.fillText(`Total Corpus Marks: ${totalPunct.toLocaleString()} occurrences  •  Hierarchical Frequency Tiers`, 50, 92);

  // Top Right Brand Tag
  ctx.fillStyle = '#d97706';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('● LINGUA-X CORPUS ENGINE', W - 50, 60);
  ctx.fillStyle = '#64748b';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillText('ACCREDITED NLP ANALYTICS', W - 50, 82);
  ctx.textAlign = 'left';

  // Divider Line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(50, 115);
  ctx.lineTo(W - 50, 115);
  ctx.stroke();

  // Subtle Center Watermark Stamp
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-15 * Math.PI / 180);
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.038)';
  ctx.font = '900 70px "Sora", sans-serif';
  ctx.fillText('LINGUA-X CORPUS ENGINE', 0, -10);
  ctx.font = '700 22px "JetBrains Mono", monospace';
  ctx.fillText('ACCREDITED NLP PYRAMID ANALYTICS', 0, 36);
  ctx.restore();

  // Draw Pyramid Geometry
  const N = cats.length;
  const pyrTopY = 150;
  const pyrH = 500;
  const gap = 6;
  const tierH = (pyrH - (N - 1) * gap) / N;
  const cx = W / 2;
  const apexW = 240;
  const baseW = 960;

  cats.forEach((cat, idx) => {
    const yTop = pyrTopY + idx * (tierH + gap);
    const yBottom = yTop + tierH;
    const wTop = apexW + (baseW - apexW) * (idx / N);
    const wBottom = apexW + (baseW - apexW) * ((idx + 1) / N);

    const x1 = cx - wTop / 2;
    const x2 = cx + wTop / 2;
    const x3 = cx + wBottom / 2;
    const x4 = cx - wBottom / 2;

    // Gradient for Tier
    const tierGrad = ctx.createLinearGradient(0, yTop, 0, yBottom);
    tierGrad.addColorStop(0, lightenHex(cat.color, 25));
    tierGrad.addColorStop(1, cat.color);

    ctx.beginPath();
    ctx.moveTo(x1, yTop);
    ctx.lineTo(x2, yTop);
    ctx.lineTo(x3, yBottom);
    ctx.lineTo(x4, yBottom);
    ctx.closePath();

    ctx.fillStyle = tierGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Glowing top highlight line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1 + 4, yTop + 1);
    ctx.lineTo(x2 - 4, yTop + 1);
    ctx.stroke();

    // Tier Text
    const centerY = (yTop + yBottom) / 2;

    // Left rank badge
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px "JetBrains Mono", monospace';
    ctx.fillText(`#${idx + 1}`, Math.max(x4 + 18, cx - wTop / 2 + 18), centerY + 4);

    // Center Label: Symbol + Category
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 15px "Sora", sans-serif';
    ctx.fillText(`${cat.cat}`, cx, centerY - 2);

    // Sub-label: Percentage and Occurrences
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 12.5px "JetBrains Mono", monospace';
    ctx.fillText(`${cat.pct.toFixed(1)}%  (${cat.count.toLocaleString()} occurrences)`, cx, centerY + 16);
  });

  // Footer Watermark Band
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(50, H - 65, W - 100, 45);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(50, H - 65, W - 100, 45);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#d97706';
  ctx.font = 'bold 12.5px "JetBrains Mono", monospace';
  ctx.fillText('•  LINGUA-X CORPUS ENGINE  •  ACCREDITED ON-DEVICE NLP  •  VERIFIED PYRAMID HIERARCHY', W / 2, H - 42);

  ctx.fillStyle = '#64748b';
  ctx.font = '600 10.5px "JetBrains Mono", monospace';
  ctx.fillText(`Generated by LinguaX Arc  •  ${new Date().toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' })}`, W / 2, H - 26);

  // Native Gallery Save
  const dataUrl = canvas.toDataURL('image/png');
  const base64Data = dataUrl.split(',')[1];
  const fileName = `LinguaX_Punctuation_Pyramid_${Date.now()}.png`;

  if (window.AndroidBridge && typeof window.AndroidBridge.saveFile === 'function') {
    window.AndroidBridge.saveFile(base64Data, fileName, 'image/png', 'LinguaX');
    playFeedback('success');
    toast('Punctuation Pyramid saved to Gallery (Pictures/LinguaX)!');
  } else {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    a.click();
    playFeedback('success');
    toast('Punctuation Pyramid image downloaded!');
  }
}
window.savePunctuationPyramidToGallery = savePunctuationPyramidToGallery;

function drawPunctuationPyramid(punct) {
  if (!punct || !punct.categories || punct.categories.length === 0) return '';
  _currentPunctAnalysis = punct;
  const cats = punct.categories;
  const N = cats.length;

  const svgW = 560;
  const svgH = 340;
  const cx = svgW / 2;
  const pyrTopY = 32;
  const pyrH = 265;
  const gap = 3.5;
  const tierH = (pyrH - (N - 1) * gap) / N;
  const apexW = 140;
  const baseW = 510;

  let defsSvg = '';
  let tiersSvg = '';

  cats.forEach((cat, idx) => {
    const yTop = pyrTopY + idx * (tierH + gap);
    const yBottom = yTop + tierH;
    const wTop = apexW + (baseW - apexW) * (idx / N);
    const wBottom = apexW + (baseW - apexW) * ((idx + 1) / N);

    const x1 = cx - wTop / 2;
    const x2 = cx + wTop / 2;
    const x3 = cx + wBottom / 2;
    const x4 = cx - wBottom / 2;

    const gradId = `punctPyrGrad_${idx}`;
    defsSvg += `
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${lightenHex(cat.color, 25)}" />
        <stop offset="100%" stop-color="${cat.color}" />
      </linearGradient>
    `;

    const centerY = (yTop + yBottom) / 2;

    tiersSvg += `
      <g class="pyr-tier-group" style="user-select:none; -webkit-user-select:none;">
        <title>${esc(cat.cat)}: #${idx + 1} · ${cat.count.toLocaleString()} occurrences (${cat.pct.toFixed(1)}%)</title>
        <!-- Tier Trapezoid -->
        <polygon points="${x1},${yTop} ${x2},${yTop} ${x3},${yBottom} ${x4},${yBottom}" fill="url(#${gradId})" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.15));" />
        <!-- Top glowing line -->
        <line x1="${x1 + 3}" y1="${yTop + 1}" x2="${x2 - 3}" y2="${yTop + 1}" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" stroke-opacity="0.8" />
        <!-- Left Rank Badge -->
        <text x="${Math.max(x4 + 14, cx - wTop / 2 + 14)}" y="${centerY + 4}" font-family="'JetBrains Mono', monospace" font-size="9px" font-weight="900" fill="#ffffff" text-anchor="start">#${idx + 1}</text>
        <!-- Tier Center Label -->
        <text x="${cx}" y="${tierH > 32 ? centerY - 2 : centerY + 3.5}" text-anchor="middle" font-family="'Sora', sans-serif" font-size="${tierH > 32 ? 11.5 : 10.5}px" font-weight="800" fill="#ffffff" style="text-shadow:0 1px 3px rgba(0,0,0,0.5);">${esc(cat.cat)}</text>
        ${tierH > 32 ? `
          <text x="${cx}" y="${centerY + 12}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8.5px" font-weight="700" fill="rgba(255,255,255,0.95)">${cat.pct.toFixed(1)}% · ${cat.count.toLocaleString()} occ.</text>
        ` : ''}
      </g>
    `;
  });

  return `
    <div style="width: 100%; display: flex; flex-direction: column; gap: 14px; user-select:none; -webkit-user-select:none;">
      <!-- SVG Pyramid Container -->
      <div style="position: relative; width: 100%; background: var(--row); border: 1.5px solid var(--stroke-2); border-radius: 16px; padding: 14px 6px 12px 6px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); overflow: hidden;">
        <!-- Watermark Corner Badge -->
        <div class="chart-corner-watermark" style="top: 10px; right: 12px;">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 22 22 2 22"/></svg>
          LINGUA-X PYRAMID
        </div>

        <svg viewBox="0 0 ${svgW} ${svgH}" style="width: 100%; height: auto; display: block; overflow: visible;">
          <defs>
            ${defsSvg}
          </defs>
          ${tiersSvg}
          <!-- In-SVG Watermark -->
          <text x="${svgW / 2}" y="322" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8.5px" font-weight="800" fill="currentColor" opacity="0.32" letter-spacing="0.14em">
            LINGUA-X CORPUS ENGINE • ACCREDITED ANALYTICS
          </text>
        </svg>
      </div>

      <!-- Pyramid Hierarchy Breakdown Grid -->
      <div class="pos-legend-grid">
        ${cats.map((cat, idx) => `
          <div class="pos-legend-item" style="cursor:default;" title="${esc(cat.cat)}: #${idx + 1} · ${cat.count.toLocaleString()} occurrences (${cat.pct.toFixed(1)}%)">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
              <div style="display:flex; align-items:center; gap:6px; min-width:0;">
                <span style="font-family:'JetBrains Mono', monospace; font-size:10px; font-weight:900; color:${cat.color}; background:${cat.color}22; padding:2px 6px; border-radius:6px; border:1px solid ${cat.color}44;">#${idx + 1}</span>
                <span style="display:inline-block; width:10px; height:10px; border-radius:3px; background:${cat.color}; flex-shrink:0; box-shadow:0 0 8px ${cat.color}88;"></span>
                <span style="font-size:12px; font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(cat.cat)}</span>
              </div>
              <div style="display:flex; align-items:center; gap:5px; flex-shrink:0;">
                <span style="font-size:12px; font-weight:800; color:var(--ink); font-family:'JetBrains Mono', monospace;">${cat.pct.toFixed(1)}%</span>
                <span style="font-size:10.5px; font-weight:700; color:var(--ink-soft); font-family:'JetBrains Mono', monospace;">(${cat.count.toLocaleString()})</span>
              </div>
            </div>
            <div class="pos-legend-progress-track">
              <div class="pos-legend-progress-bar" style="width:${Math.min(100, Math.max(3, cat.pct))}%; background:${cat.color};"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
function drawPunctuationBarChart(punct) {
  return drawPunctuationPyramid(punct);
}
function drawPunctuationChart(punct) {
  return drawPunctuationPyramid(punct);
}

/* ---------- pattern matcher & search ---------- */
function matcher(term, cs, rx){
  if(!term || !term.trim()) return null;
  try{
    if(rx) { const re = new RegExp('^(?:'+term+')$', cs?'u':'iu'); return t => re.test(t); }
    const trimmed = term.trim();
    const pat = trimmed
      .replace(/[.+^${}()|[\]\\]/g,'\\$&')
      .replace(/\*/g,'[\\p{L}\\p{N}\']*')
      .replace(/\?/g,'[\\p{L}\\p{N}\']');
    const re = new RegExp('^'+pat+'$', cs?'u':'iu');
    return t => re.test(t);
  }catch(e){ toast('Invalid pattern', false); return null; }
}
function getHits(term, cs, rx){
  if(!term || !term.trim()) return [];
  const trimmed = term.trim();
  const parts = trimmed.split(/\s+/);
  const files = S.files || [];
  
  // Multi-word phrase search
  if (parts.length > 1 && !rx) {
    const hasWildcards = parts.some(p => p.includes('*') || p.includes('?'));
    if (!hasWildcards) {
      // Blazing fast direct string comparison for multi-word phrases
      const lowerParts = cs ? null : parts.map(p => p.toLowerCase());
      const pLen = parts.length;
      const hits = [];
      for (let fi = 0; fi < files.length; fi++) {
        const toks = files[fi].toks || [];
        const maxTi = toks.length - pLen;
        for (let ti = 0; ti <= maxTi; ti++) {
          let matched = true;
          for (let pi = 0; pi < pLen; pi++) {
            const tok = toks[ti + pi];
            if (cs ? (tok.w !== parts[pi]) : (tok.l !== lowerParts[pi])) {
              matched = false;
              break;
            }
          }
          if (matched) {
            hits.push({ f: fi, i: ti, len: pLen });
          }
        }
      }
      return hits;
    }

    const matchers = parts.map(p => matcher(p, cs, false));
    if (matchers.some(m => !m)) return [];
    const hits = [];
    for (let fi = 0; fi < files.length; fi++) {
      const toks = files[fi].toks || [];
      const maxTi = toks.length - matchers.length;
      for (let ti = 0; ti <= maxTi; ti++) {
        let allMatch = true;
        for (let pi = 0; pi < matchers.length; pi++) {
          if (!matchers[pi](toks[ti + pi].w)) {
            allMatch = false;
            break;
          }
        }
        if (allMatch) {
          hits.push({ f: fi, i: ti, len: matchers.length });
        }
      }
    }
    return hits;
  }

  // Single word search
  const hasWildcards = trimmed.includes('*') || trimmed.includes('?');
  if (!rx && !hasWildcards) {
    // Ultrafast equality check (5-8ms across 1M words)
    const hits = [];
    if (cs) {
      for (let fi = 0; fi < files.length; fi++) {
        const toks = files[fi].toks || [];
        for (let ti = 0; ti < toks.length; ti++) {
          if (toks[ti].w === trimmed) hits.push({ f: fi, i: ti, len: 1 });
        }
      }
    } else {
      const lower = trimmed.toLowerCase();
      for (let fi = 0; fi < files.length; fi++) {
        const toks = files[fi].toks || [];
        for (let ti = 0; ti < toks.length; ti++) {
          if (toks[ti].l === lower) hits.push({ f: fi, i: ti, len: 1 });
        }
      }
    }
    return hits;
  }

  // Regex or Wildcards
  const m = matcher(trimmed, cs, rx);
  if(!m) return [];
  const hits = [];
  for (let fi = 0; fi < files.length; fi++) {
    const toks = files[fi].toks || [];
    for (let ti = 0; ti < toks.length; ti++) {
      if(m(toks[ti].w)) hits.push({ f: fi, i: ti, len: 1 });
    }
  }
  return hits;
}
function convertToRTF(rows, baseName) {
  let rtf = '{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}{\\f1\\fnil\\fcharset0 Courier New;}}\n';
  rtf += '{\\colortbl ;\\red240\\green240\\blue240;\\red124\\green58\\blue237;\\red51\\green51\\blue51;}\n';
  rtf += '\\viewkind4\\uc1\\pard\\qc\\b\\fs30 LinguaX Arc Export - ' + baseName + '\\b0\\fs20\\par\n';
  rtf += 'Generated on: ' + new Date().toLocaleString() + '\\par\\par\n';
  
  rows.forEach((r, idx) => {
    const isHeader = idx === 0;
    rtf += '\\trowd\\trgaph70\\trleft100\\trbrdrh\\brdrs\\brdrw10\\trbrdrv\\brdrs\\brdrw10\n';
    
    // Cell widths
    let cellWidth = 2400; 
    r.forEach((_, cidx) => {
      rtf += '\\clbrdrt\\brdrs\\brdrw10\\clbrdrb\\brdrs\\brdrw10\\clbrdrl\\brdrs\\brdrw10\\clbrdrr\\brdrs\\brdrw10';
      if (isHeader) rtf += '\\clcbpat1';
      rtf += '\\cellx' + ((cidx + 1) * cellWidth) + '\n';
    });
    
    r.forEach(val => {
      let cellText = String(val)
        .replace(/\\/g, '\\\\')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\n/g, '\\par ');
      rtf += ' ' + (isHeader ? '\\b ' : '') + cellText + (isHeader ? '\\b0 ' : '') + '\\cell\n';
    });
    rtf += '\\row\n';
  });
  rtf += '}';
  return rtf;
}

function getOrganizedFolderName(type) {
  const base = S.settings.outputFolder || 'LinguaX';
  const cleanBase = base.replace(/^(Documents|Downloads)\//i, '').trim() || 'LinguaX';
  if (type === 'summaries') return cleanBase + '/Summaries';
  if (type === 'sentiment') return cleanBase + '/Sentiment_Analysis';
  if (type === 'cloud') return cleanBase + '/Word_Clouds';
  return cleanBase + '/Analysis';
}

function promptExportFormatSelection() {
  return new Promise((resolve) => {
    let overlay = document.getElementById('export-format-modal');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'export-format-modal';
    overlay.className = 'modal-overlay';
    
    const defaultFormat = S.settings.exportFormat || 'csv';
    
    overlay.innerHTML = `
      <div class="modal-content glass" style="max-width: 440px; border-radius: 20px; border: 1px solid var(--stroke); box-shadow: 0 16px 40px var(--glow-shadow);">
        <div class="modal-header" style="margin-bottom: 20px;">
          <h3 style="margin: 0; font-family: 'Sora'; font-size: 16px; font-weight: 700; color: var(--ink);">Export Result Settings</h3>
          <button class="modal-close" onclick="closeExportFormatModal()" style="font-size: 20px; font-weight: 600; line-height: 1; padding: 4px; border-radius: 6px;">&times;</button>
        </div>
        
        <div style="margin-bottom: 16px; font-size: 12.5px; color: var(--ink-soft); line-height: 1.5;">
          Select your preferred file format for this export. Your default export format is currently configured in Settings.
        </div>

        <div class="export-options-grid" style="display: flex; flex-direction: column; gap: 10px;">
          <button class="export-opt-btn ${defaultFormat === 'pdf' ? 'selected' : ''}" onclick="selectExportFormatOption('pdf')" style="display: flex; align-items: center; gap: 14px; background: var(--modal-card-bg); border: ${defaultFormat === 'pdf' ? '1.5px solid var(--a1)' : '1px solid var(--modal-card-border)'}; border-radius: 14px; padding: 12px 14px; text-align: left; cursor: pointer; transition: all 0.15s; width: 100%; box-shadow: ${defaultFormat === 'pdf' ? '0 0 0 3px var(--a1-focus)' : 'var(--macos-btn-shadow)'};">
            <div class="opt-icon" style="width: 36px; height: 36px; border-radius: 10px; background: rgba(239, 68, 68, 0.15); color: #ef4444; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px; height:18px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h2"/><path d="M9 17h6"/></svg>
            </div>
            <div class="opt-details" style="flex: 1;">
              <div class="opt-title" style="font-family: var(--macos-font, 'Sora'); font-size: 13.5px; font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 6px;">
                Publication PDF Document (.pdf) ${defaultFormat === 'pdf' ? '<span style="font-size:10px; padding:2px 6px; background:var(--a1-focus); border-radius:12px; color:var(--a1); font-weight:600;">Default</span>' : ''}
              </div>
              <div class="opt-desc" style="font-size: 11px; color: var(--ink-soft); margin-top: 1px;">High-grade formatted PDF report with LinguaX Arc watermark, official logo badge, and APA citation.</div>
            </div>
          </button>
          
          <button class="export-opt-btn ${defaultFormat === 'csv' ? 'selected' : ''}" onclick="selectExportFormatOption('csv')" style="display: flex; align-items: center; gap: 14px; background: var(--modal-card-bg); border: ${defaultFormat === 'csv' ? '1.5px solid var(--a1)' : '1px solid var(--modal-card-border)'}; border-radius: 14px; padding: 12px 14px; text-align: left; cursor: pointer; transition: all 0.15s; width: 100%; box-shadow: ${defaultFormat === 'csv' ? '0 0 0 3px var(--a1-focus)' : 'var(--macos-btn-shadow)'};">
            <div class="opt-icon" style="width: 36px; height: 36px; border-radius: 10px; background: var(--a1-focus); color: var(--a1); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px; height:18px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h6"/></svg>
            </div>
            <div class="opt-details" style="flex: 1;">
              <div class="opt-title" style="font-family: var(--macos-font, 'Sora'); font-size: 13.5px; font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 6px;">
                Spreadsheet Table (.csv) ${defaultFormat === 'csv' ? '<span style="font-size:10px; padding:2px 6px; background:var(--a1-focus); border-radius:12px; color:var(--a1); font-weight:600;">Default</span>' : ''}
              </div>
              <div class="opt-desc" style="font-size: 11px; color: var(--ink-soft); margin-top: 1px;">Compatible with Microsoft Excel, Google Sheets, or other tabular research tools.</div>
            </div>
          </button>
          
          <button class="export-opt-btn ${defaultFormat === 'txt' ? 'selected' : ''}" onclick="selectExportFormatOption('txt')" style="display: flex; align-items: center; gap: 14px; background: var(--modal-card-bg); border: ${defaultFormat === 'txt' ? '1.5px solid var(--a1)' : '1px solid var(--modal-card-border)'}; border-radius: 14px; padding: 12px 14px; text-align: left; cursor: pointer; transition: all 0.15s; width: 100%; box-shadow: ${defaultFormat === 'txt' ? '0 0 0 3px var(--a1-focus)' : 'var(--macos-btn-shadow)'};">
            <div class="opt-icon" style="width: 36px; height: 36px; border-radius: 10px; background: var(--a1-focus); color: var(--a1); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px; height:18px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div class="opt-details" style="flex: 1;">
              <div class="opt-title" style="font-family: var(--macos-font, 'Sora'); font-size: 13.5px; font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 6px;">
                Plain Text Document (.txt) ${defaultFormat === 'txt' ? '<span style="font-size:10px; padding:2px 6px; background:var(--a1-focus); border-radius:12px; color:var(--a1); font-weight:600;">Default</span>' : ''}
              </div>
              <div class="opt-desc" style="font-size: 11px; color: var(--ink-soft); margin-top: 1px;">Sleekly aligned, padded tabular columns for reading directly in any standard text editor.</div>
            </div>
          </button>
          
          <button class="export-opt-btn ${defaultFormat === 'word' ? 'selected' : ''}" onclick="selectExportFormatOption('word')" style="display: flex; align-items: center; gap: 14px; background: var(--modal-card-bg); border: ${defaultFormat === 'word' ? '1.5px solid var(--a1)' : '1px solid var(--modal-card-border)'}; border-radius: 14px; padding: 12px 14px; text-align: left; cursor: pointer; transition: all 0.15s; width: 100%; box-shadow: ${defaultFormat === 'word' ? '0 0 0 3px var(--a1-focus)' : 'var(--macos-btn-shadow)'};">
            <div class="opt-icon" style="width: 36px; height: 36px; border-radius: 10px; background: var(--a1-focus); color: var(--a1); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px; height:18px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <div class="opt-details" style="flex: 1;">
              <div class="opt-title" style="font-family: var(--macos-font, 'Sora'); font-size: 13.5px; font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 6px;">
                Rich Word Document (.doc) ${defaultFormat === 'word' ? '<span style="font-size:10px; padding:2px 6px; background:var(--a1-focus); border-radius:12px; color:var(--a1); font-weight:600;">Default</span>' : ''}
              </div>
              <div class="opt-desc" style="font-size: 11px; color: var(--ink-soft); margin-top: 1px;">Fully styled Word document complete with professional metadata and formatted tables.</div>
            </div>
          </button>
        </div>

        <!-- Academic Citation Note Banner -->
        <div style="margin-top: 14px; padding: 10px 12px; border-radius: 10px; background: rgba(79, 70, 229, 0.08); border: 1px solid rgba(79, 70, 229, 0.2); display: flex; align-items: center; justify-content: space-between; gap: 10px;">
          <div style="font-size: 11.5px; color: var(--ink); line-height: 1.4;">
            <span style="font-weight: 700; color: var(--a1);">Academic Citation:</span> APA 7th Edition citation &amp; LinguaX Arc watermark are included in your output file.
          </div>
          <button type="button" class="btn ghost small" onclick="openCitationModal()" style="font-size: 11px; padding: 4px 10px; border-radius: 8px; flex-shrink: 0;">
            Formats
          </button>
        </div>
        
        <div style="margin-top: 18px; display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn ghost small" onclick="closeExportFormatModal()">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.classList.add('show');
    }, 20);

    window.selectExportFormatOption = function(format) {
      cleanup();
      resolve(format);
    };

    window.closeExportFormatModal = function() {
      cleanup();
      resolve(null);
    };

    function cleanup() {
      overlay.classList.remove('show');
      setTimeout(() => {
        overlay.remove();
      }, 350);
      delete window.selectExportFormatOption;
      delete window.closeExportFormatModal;
    }
  });
}

const CITATIONS = {
  apa: "Tahir, A. (2026). LinguaX Arc: A Fully Offline Mobile Corpus Analysis Toolkit (Version v6.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.22706552",
  mla: "Tahir, Arslan. LinguaX Arc: A Fully Offline Mobile Corpus Analysis Toolkit. Version v6.0, 2026, Zenodo, doi.org/10.5281/zenodo.22706552.",
  chicago: "Tahir, Arslan. 2026. LinguaX Arc: A Fully Offline Mobile Corpus Analysis Toolkit. Version v6.0. Computer software. Zenodo. https://doi.org/10.5281/zenodo.22706552."
};

function openCitationModal() {
  const m = document.getElementById('citationModal');
  if (m) m.classList.add('open');
}

function closeCitationModal() {
  const m = document.getElementById('citationModal');
  if (m) m.classList.remove('open');
}

function copyCitation(type) {
  let text = '';
  if (type === 'apa') text = CITATIONS.apa;
  else if (type === 'mla') text = CITATIONS.mla;
  else if (type === 'chicago') text = CITATIONS.chicago;
  else if (type === 'all') {
    text = `APA 7th Edition:\n${CITATIONS.apa}\n\nMLA 9th Edition:\n${CITATIONS.mla}\n\nChicago (17th Edition):\n${CITATIONS.chicago}`;
  }
  
  const finish = () => {
    toast('Citation copied to clipboard!');
    triggerVibration('success');
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(finish).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }

  function fallbackCopy(val) {
    const ta = document.createElement('textarea');
    ta.value = val;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      finish();
    } catch(e) {
      toast('Copy failed', false);
    }
    ta.remove();
  }
}

function showPostExportCitationPrompt(finalName) {
  toast(`Saved: ${finalName}`);
  triggerVibration('success');
}

function uint8ArrayToBase64(uint8) {
  let binary = '';
  const len = uint8.byteLength;
  const chunk = 8192;
  for (let i = 0; i < len; i += chunk) {
    binary += String.fromCharCode.apply(null, uint8.subarray(i, Math.min(i + chunk, len)));
  }
  return btoa(binary);
}

function drawLinguaXLogo(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  const s = size / 100;
  ctx.scale(s, s);
  
  // Background circle
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(50, 50, 48, 0, Math.PI * 2);
  ctx.fill();
  
  // Border ring
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // White LX Monogram
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // L stroke
  ctx.beginPath();
  ctx.moveTo(24, 25);
  ctx.lineTo(24, 64);
  ctx.arcTo(24, 75, 35, 75, 11);
  ctx.lineTo(76, 25);
  ctx.stroke();

  // Diagonal cross stroke
  ctx.beginPath();
  ctx.moveTo(42, 25);
  ctx.lineTo(76, 75);
  ctx.stroke();

  ctx.restore();
}

function drawWatermark(ctx, width, height) {
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-28 * Math.PI / 180);
  ctx.font = 'bold 84px "Sora", sans-serif';
  ctx.fillStyle = 'rgba(79, 70, 229, 0.06)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LinguaX Arc', 0, -25);
  ctx.font = 'bold 22px "Sora", sans-serif';
  ctx.fillStyle = 'rgba(79, 70, 229, 0.05)';
  ctx.fillText('Official Corpus Analytics · Verified Output', 0, 32);
  ctx.restore();
}

function buildPdfFromCanvases(canvases) {
  const pageW = 595.28;
  const pageH = 841.89;
  const numPages = canvases.length;
  
  const pageObjIds = [];
  const contentObjIds = [];
  const imageObjIds = [];
  
  let nextId = 3;
  for (let i = 0; i < numPages; i++) pageObjIds.push(nextId++);
  for (let i = 0; i < numPages; i++) contentObjIds.push(nextId++);
  for (let i = 0; i < numPages; i++) imageObjIds.push(nextId++);
  
  const chunks = [];
  const offsets = [0];
  let currentByteLength = 0;
  
  function writeString(str) {
    const bytes = new TextEncoder().encode(str);
    chunks.push(bytes);
    currentByteLength += bytes.byteLength;
  }
  function writeBytes(bytes) {
    chunks.push(bytes);
    currentByteLength += bytes.byteLength;
  }
  
  writeString('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  
  // 1: Catalog
  offsets[1] = currentByteLength;
  writeString(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  
  // 2: Pages
  offsets[2] = currentByteLength;
  const kidsStr = pageObjIds.map(id => `${id} 0 R`).join(' ');
  writeString(`2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${numPages} >>\nendobj\n`);
  
  // Pages
  for (let i = 0; i < numPages; i++) {
    const pId = pageObjIds[i];
    const cId = contentObjIds[i];
    const imId = imageObjIds[i];
    offsets[pId] = currentByteLength;
    writeString(`${pId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents ${cId} 0 R /Resources << /XObject << /Im${i+1} ${imId} 0 R >> >> >>\nendobj\n`);
  }
  
  // Contents
  for (let i = 0; i < numPages; i++) {
    const cId = contentObjIds[i];
    offsets[cId] = currentByteLength;
    const streamContent = `q\n${pageW.toFixed(2)} 0 0 ${pageH.toFixed(2)} 0 0 cm\n/Im${i+1} Do\nQ\n`;
    const cLen = new TextEncoder().encode(streamContent).byteLength;
    writeString(`${cId} 0 obj\n<< /Length ${cLen} >>\nstream\n${streamContent}\nendstream\nendobj\n`);
  }
  
  // Images
  for (let i = 0; i < numPages; i++) {
    const imId = imageObjIds[i];
    const canvas = canvases[i];
    const dataUrl = canvas.toDataURL('image/jpeg', 0.96);
    const b64 = dataUrl.split(',')[1];
    const binaryStr = atob(b64);
    const imgBytes = new Uint8Array(binaryStr.length);
    for (let b = 0; b < binaryStr.length; b++) {
      imgBytes[b] = binaryStr.charCodeAt(b);
    }
    
    offsets[imId] = currentByteLength;
    const imgHeader = `${imId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.byteLength} >>\nstream\n`;
    writeString(imgHeader);
    writeBytes(imgBytes);
    writeString('\nendstream\nendobj\n');
  }
  
  // Cross reference
  const startxref = currentByteLength;
  const totalObjs = nextId;
  writeString(`xref\n0 ${totalObjs}\n0000000000 65535 f \n`);
  for (let i = 1; i < totalObjs; i++) {
    const offsetStr = String(offsets[i]).padStart(10, '0');
    writeString(`${offsetStr} 00000 n \n`);
  }
  
  writeString(`trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`);
  
  const finalPdf = new Uint8Array(currentByteLength);
  let cur = 0;
  for (const chunk of chunks) {
    finalPdf.set(chunk, cur);
    cur += chunk.byteLength;
  }
  return finalPdf;
}

function generateTablePDF(rows, baseName, type) {
  const W = 1240;
  const H = 1754; // A4 @ 150 DPI
  
  if (!rows || rows.length === 0) return null;
  const headerRow = rows[0];
  const totalCols = headerRow.length;
  
  // Clean title
  const cleanTitle = baseName.replace(/^(LinguaX_Report_|Report_)/i, '').replace(/_/g, ' ');
  
  // Column Width calculations
  const colWidths = new Array(totalCols).fill(0);
  const sampleRows = rows.slice(0, 50);
  for (let c = 0; c < totalCols; c++) {
    let maxLen = 0;
    sampleRows.forEach(r => {
      const len = String(r[c] !== undefined ? r[c] : '').length;
      if (len > maxLen) maxLen = len;
    });
    colWidths[c] = Math.max(maxLen, 6);
  }
  const sumLen = colWidths.reduce((a, b) => a + b, 0) || 1;
  const tableMarginLeft = 60;
  const tableMarginRight = 60;
  const availableTableW = W - tableMarginLeft - tableMarginRight;
  const pixelColWidths = colWidths.map(l => Math.max(65, Math.floor((l / sumLen) * availableTableW)));
  
  const actualTableW = pixelColWidths.reduce((a, b) => a + b, 0);
  const colPositions = [tableMarginLeft];
  for (let c = 0; c < totalCols; c++) {
    colPositions.push(colPositions[c] + (pixelColWidths[c] / actualTableW) * availableTableW);
  }
  
  const rowH = 32;
  const headerH = 38;
  const footerH = 75;
  const bottomLimit = H - footerH - 10;
  
  // Allow maximum export rows
  const maxExportRows = 2000;
  const isTruncated = rows.length > (maxExportRows + 1);
  const dataRows = rows.slice(1, maxExportRows + 1);
  
  const p1AvailableH = bottomLimit - 240;
  const p1MaxRows = Math.floor((p1AvailableH - headerH) / rowH);
  const otherPageMaxRows = Math.floor((bottomLimit - 120 - headerH) / rowH);
  
  const pagesData = [];
  let remaining = dataRows.slice();
  pagesData.push(remaining.splice(0, p1MaxRows));
  while (remaining.length > 0) {
    pagesData.push(remaining.splice(0, otherPageMaxRows));
  }
  const totalPages = Math.max(1, pagesData.length);
  
  const canvases = [];
  
  for (let p = 0; p < totalPages; p++) {
    const pageRows = pagesData[p] || [];
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Clean background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    
    // Diagonal Watermark across the page
    drawWatermark(ctx, W, H);
    
    let currentY = 0;
    
    if (p === 0) {
      // PAGE 1 HEADER
      drawLinguaXLogo(ctx, 60, 48, 56);
      
      ctx.fillStyle = '#1e1b4b';
      ctx.font = 'bold 26px "Sora", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('LinguaX Arc', 128, 48);
      
      ctx.fillStyle = '#4f46e5';
      ctx.font = 'bold 12.5px "Sora", sans-serif';
      ctx.fillText('A Mobile Corpus Toolkit (Version 6.0) · Academic Research Analytics', 128, 80);
      
      ctx.fillStyle = '#64748b';
      ctx.font = '11px "Sora", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, W - 60, 52);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px "Sora", sans-serif';
      ctx.fillText('● Verified Dataset', W - 60, 74);
      
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, 118);
      ctx.lineTo(W - 60, 118);
      ctx.stroke();
      
      // Report Title Banner
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      drawRoundedRect(ctx, 60, 132, W - 120, 72, 10);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px "Sora", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`Analysis Report: ${cleanTitle}`, 78, 146);
      
      ctx.fillStyle = '#475569';
      ctx.font = '12px "Sora", sans-serif';
      const fileCountText = S.files ? `${S.files.length} active corpus file(s)` : 'Dataset';
      const recordCountText = `Total Entries: ${rows.length - 1} records`;
      ctx.fillText(`Scope: ${fileCountText} · ${recordCountText} · Exported Format: PDF Document`, 78, 174);
      
      currentY = 224;
    } else {
      // SUBSEQUENT PAGES HEADER
      drawLinguaXLogo(ctx, 60, 36, 38);
      
      ctx.fillStyle = '#1e1b4b';
      ctx.font = 'bold 17px "Sora", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('LinguaX Arc (v6.0) — Report Continued', 108, 38);
      
      ctx.fillStyle = '#64748b';
      ctx.font = '11px "Sora", sans-serif';
      ctx.fillText(`Document: ${cleanTitle}`, 108, 60);
      
      ctx.textAlign = 'right';
      ctx.fillText(`Page ${p + 1} of ${totalPages}`, W - 60, 48);
      
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 84);
      ctx.lineTo(W - 60, 84);
      ctx.stroke();
      
      currentY = 96;
    }
    
    // DRAW TABLE HEADER
    ctx.fillStyle = '#1e1b4b';
    drawRoundedRect(ctx, tableMarginLeft, currentY, availableTableW, headerH, 6);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Sora", sans-serif';
    ctx.textBaseline = 'middle';
    for (let c = 0; c < totalCols; c++) {
      const colX = colPositions[c];
      const colW = colPositions[c + 1] - colX;
      const isNumeric = c > 0 && pageRows.length > 0 && !isNaN(Number(pageRows[0][c]));
      ctx.textAlign = isNumeric ? 'right' : 'left';
      const textX = isNumeric ? (colX + colW - 12) : (colX + 12);
      ctx.fillText(String(headerRow[c] || ''), textX, currentY + headerH / 2);
    }
    currentY += headerH + 2;
    
    // DRAW TABLE ROWS
    pageRows.forEach((row, rIdx) => {
      ctx.fillStyle = rIdx % 2 === 0 ? '#f8fafc' : '#ffffff';
      ctx.fillRect(tableMarginLeft, currentY, availableTableW, rowH);
      
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(tableMarginLeft, currentY + rowH);
      ctx.lineTo(tableMarginLeft + availableTableW, currentY + rowH);
      ctx.stroke();
      
      ctx.textBaseline = 'middle';
      for (let c = 0; c < totalCols; c++) {
        const val = String(row[c] !== undefined ? row[c] : '');
        const colX = colPositions[c];
        const colW = colPositions[c + 1] - colX;
        const isNumeric = c > 0 && !isNaN(Number(val)) && val.trim() !== '';
        
        ctx.fillStyle = isNumeric ? '#334155' : (c === 0 ? '#1e1b4b' : '#0f172a');
        ctx.font = isNumeric ? '11.5px "JetBrains Mono", monospace' : (c === 0 ? 'bold 11.5px "Sora", sans-serif' : '11.5px "Sora", sans-serif');
        ctx.textAlign = isNumeric ? 'right' : 'left';
        const textX = isNumeric ? (colX + colW - 12) : (colX + 12);
        
        let displayVal = val;
        while (ctx.measureText(displayVal).width > (colW - 20) && displayVal.length > 3) {
          displayVal = displayVal.substring(0, displayVal.length - 2) + '…';
        }
        ctx.fillText(displayVal, textX, currentY + rowH / 2);
      }
      currentY += rowH;
    });
    
    // Truncation note if applicable
    if (p === totalPages - 1 && isTruncated) {
      ctx.fillStyle = '#fffbeb';
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 1;
      drawRoundedRect(ctx, tableMarginLeft, currentY + 6, availableTableW, 28, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 11px "Sora", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`[Displaying top ${maxExportRows} entries in PDF document. For exhaustive raw tables with all ${rows.length - 1} entries, export as CSV.]`, W / 2, currentY + 20);
    }
    
    // PAGE FOOTER (EVERY PAGE)
    const footerTop = H - footerH;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, footerTop);
    ctx.lineTo(W - 60, footerTop);
    ctx.stroke();
    
    // Line 1: Official APA 7th Edition Citation
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 10.5px "Sora", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Academic Citation (APA 7th Edition):', 60, footerTop + 8);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = '9.5px "JetBrains Mono", monospace';
    ctx.fillText('Tahir, A. (2026). LinguaX Arc: A Fully Offline Mobile Corpus Analysis Toolkit (Version v6.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.22706552', 60, footerTop + 24);
    
    // Line 2: Watermark verification notice & page number
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px "Sora", sans-serif';
    ctx.fillText('Watermark: Official Output Generated by LinguaX Arc · Zero-Cloud Research Privacy', 60, footerTop + 44);
    
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 11px "Sora", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Page ${p + 1} of ${totalPages}`, W - 60, footerTop + 44);
    
    canvases.push(canvas);
  }
  
  return buildPdfFromCanvases(canvases);
}

async function exportChartAsPDF(svg, filename) {
  if (!svg) return toast('Chart not found', false);
  
  const card = svg.closest('.chart-card');
  const titleText = card ? card.querySelector('h3').textContent.trim() : 'Analysis Chart';
  const groups = svg.querySelectorAll('.chart-bar-group');
  if (!groups || groups.length === 0) return toast('No data in chart to save', false);
  
  const W = 1240;
  const H = 1754; // A4 @ 150 DPI
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  
  // LinguaX Arc diagonal watermark
  drawWatermark(ctx, W, H);
  
  // Header with Logo
  drawLinguaXLogo(ctx, 60, 48, 56);
  ctx.fillStyle = '#1e1b4b';
  ctx.font = 'bold 26px "Sora", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('LinguaX Arc', 128, 48);
  
  ctx.fillStyle = '#4f46e5';
  ctx.font = 'bold 12.5px "Sora", sans-serif';
  ctx.fillText('A Mobile Corpus Toolkit (Version 6.0) · Academic Data Visualization', 128, 80);
  
  ctx.fillStyle = '#64748b';
  ctx.font = '11px "Sora", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, W - 60, 52);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 11px "Sora", sans-serif';
  ctx.fillText('● Verified Visualization', W - 60, 74);
  
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(60, 118);
  ctx.lineTo(W - 60, 118);
  ctx.stroke();
  
  // Chart Section Box
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 60, 134, W - 120, 60, 10);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px "Sora", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Chart Visualization: ${titleText}`, 80, 148);
  
  ctx.fillStyle = '#475569';
  ctx.font = '12px "Sora", sans-serif';
  ctx.fillText('High-Resolution Analytical Distribution Diagram · Official LinguaX Arc Publication Export', 80, 172);
  
  // Render the SVG bar chart items onto the canvas with crisp dimensions
  let chartTop = 220;
  const chartBoxH = 680;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 60, chartTop, W - 120, chartBoxH, 12);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = '#1e1b4b';
  ctx.font = 'bold 15px "Sora", sans-serif';
  ctx.fillText(`${titleText} — Frequency & Distribution`, 85, chartTop + 24);
  
  // Extract items from SVG
  const chartItems = [];
  groups.forEach(group => {
    const texts = group.querySelectorAll('text');
    const rects = group.querySelectorAll('rect');
    const labelText = texts[0] ? texts[0].textContent.trim() : '';
    const valText = texts[1] ? texts[1].textContent.trim() : '';
    const bgRect = rects[0];
    const fillRect = rects[1];
    const fillColor = fillRect ? fillRect.getAttribute('fill') : '#4ea8de';
    chartItems.push({ label: labelText, value: valText, color: fillColor, bgRect, fillRect });
  });
  
  const totalChartItems = chartItems.length;
  const availableBarH = chartBoxH - 80;
  const barRowH = Math.min(48, Math.floor(availableBarH / Math.max(totalChartItems, 1)));
  const barH = Math.max(14, barRowH - 12);
  
  let curY = chartTop + 60;
  chartItems.forEach((item, idx) => {
    const rowCenter = curY + barRowH / 2;
    
    // Label
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px "Sora", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.label, 230, rowCenter);
    
    // Background bar
    const barX = 250;
    const maxBarW = W - 120 - 360;
    ctx.fillStyle = '#f1f5f9';
    drawRoundedRect(ctx, barX, rowCenter - barH / 2, maxBarW, barH, 4);
    ctx.fill();
    
    let fillRatio = 1 - (idx / Math.max(totalChartItems, 1)) * 0.7;
    if (item.bgRect && item.fillRect) {
      const origW = parseFloat(item.bgRect.getAttribute('width')) || 1;
      const fW = parseFloat(item.fillRect.getAttribute('width')) || 1;
      fillRatio = Math.min(1, Math.max(0.02, fW / origW));
    }
    const currentBarW = Math.max(8, maxBarW * fillRatio);
    ctx.fillStyle = item.color || '#4f46e5';
    drawRoundedRect(ctx, barX, rowCenter - barH / 2, currentBarW, barH, 4);
    ctx.fill();
    
    // Value text
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(item.value, barX + currentBarW + 12, rowCenter);
    
    curY += barRowH;
  });
  
  // Top 10 Data Table underneath chart
  const tableTop = chartTop + chartBoxH + 30;
  ctx.fillStyle = '#1e1b4b';
  drawRoundedRect(ctx, 60, tableTop, W - 120, 36, 6);
  ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px "Sora", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Rank', 80, tableTop + 18);
  ctx.fillText('Feature / Term', 160, tableTop + 18);
  ctx.textAlign = 'right';
  ctx.fillText('Distribution / Frequency', W - 80, tableTop + 18);
  
  let rowY = tableTop + 38;
  const topItems = chartItems.slice(0, 10);
  topItems.forEach((it, i) => {
    ctx.fillStyle = i % 2 === 0 ? '#f8fafc' : '#ffffff';
    ctx.fillRect(60, rowY, W - 120, 30);
    
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(60, rowY + 30);
    ctx.lineTo(W - 60, rowY + 30);
    ctx.stroke();
    
    ctx.fillStyle = '#4f46e5';
    ctx.font = 'bold 11px "Sora", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${i + 1}`, 80, rowY + 15);
    
    ctx.fillStyle = '#0f172a';
    ctx.fillText(it.label, 160, rowY + 15);
    
    ctx.fillStyle = '#334155';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(it.value, W - 80, rowY + 15);
    
    rowY += 30;
  });
  
  // Footer
  const footerTop = H - 75;
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, footerTop);
  ctx.lineTo(W - 60, footerTop);
  ctx.stroke();
  
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 10.5px "Sora", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Academic Citation (APA 7th Edition):', 60, footerTop + 8);
  
  ctx.fillStyle = '#1e293b';
  ctx.font = '9.5px "JetBrains Mono", monospace';
  ctx.fillText('Tahir, A. (2026). LinguaX Arc: A Fully Offline Mobile Corpus Analysis Toolkit (Version v6.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.22706552', 60, footerTop + 24);
  
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 10px "Sora", sans-serif';
  ctx.fillText('Watermark: Official Output Generated by LinguaX Arc · Zero-Cloud Research Privacy', 60, footerTop + 44);
  
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 11px "Sora", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Page 1 of 1', W - 60, footerTop + 44);
  
  const pdfBytes = buildPdfFromCanvases([canvas]);
  let cleanName = filename.replace(/\.(pdf|png|jpg)$/i, '');
  if (!/^linguax/i.test(cleanName)) cleanName = 'LinguaX_Report_' + cleanName;
  const finalName = cleanName + '.pdf';
  const base64Data = uint8ArrayToBase64(pdfBytes);
  
  if (window.AndroidBridge && typeof window.AndroidBridge.saveFile === 'function') {
    window.AndroidBridge.saveFile(base64Data, finalName, 'application/pdf', getCleanFolderName());
    showPostExportCitationPrompt(finalName);
    return;
  }
  
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = finalName;
  a.click();
  URL.revokeObjectURL(a.href);
  showPostExportCitationPrompt(finalName);
}

function generateWordExport(rows, baseName, type) {
  const cleanTitle = baseName.replace(/^(LinguaX_Report_|Report_)/i, '').replace(/_/g, ' ');
  let rowsHtml = '';
  rows.forEach((r, idx) => {
    const isH = idx === 0;
    rowsHtml += '<tr>';
    r.forEach((c, cidx) => {
      const isNum = cidx > 0 && !isNaN(Number(c));
      const align = isNum ? 'right' : 'left';
      if (isH) {
        rowsHtml += `<th style="background:#1e1b4b; color:#ffffff; padding:10px 12px; font-family:'Segoe UI', Arial, sans-serif; font-size:11pt; text-align:${align}; border:1px solid #1e1b4b;">${esc(String(c))}</th>`;
      } else {
        const bg = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
        rowsHtml += `<td style="background:${bg}; padding:8px 12px; font-family:'Segoe UI', Arial, sans-serif; font-size:10pt; text-align:${align}; border:1px solid #e2e8f0; color:#0f172a;">${esc(String(c))}</td>`;
      }
    });
    rowsHtml += '</tr>';
  });

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>LinguaX Arc - ${esc(cleanTitle)}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; }
        .watermark-banner { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 14px; font-size: 9pt; color: #475569; margin-bottom: 20px; }
        h1 { color: #1e1b4b; font-size: 20pt; margin-bottom: 4px; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; }
        .meta { color: #64748b; font-size: 9.5pt; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; }
        .citation-box { background: #f8fafc; border-left: 4px solid #4f46e5; padding: 14px 18px; margin-top: 30px; font-size: 9.5pt; }
        .citation-title { font-weight: bold; color: #1e1b4b; margin-bottom: 4px; }
        .citation-text { font-family: 'Courier New', monospace; color: #1e293b; line-height: 1.4; }
      </style>
    </head>
    <body>
      <div class="watermark-banner">
        <b>WATERMARK:</b> Official Output Generated by LinguaX Arc (Version v6.0) · Zero-Cloud Research Privacy
      </div>
      
      <h1>LinguaX Arc — ${esc(cleanTitle)}</h1>
      <div class="meta">
        A Mobile Corpus Toolkit (v6.0) · Generated on: ${new Date().toLocaleString()} · Dataset Records: ${rows.length - 1}
      </div>

      <table>
        ${rowsHtml}
      </table>

      <div class="citation-box">
        <div class="citation-title">Academic Citation (APA 7th Edition):</div>
        <div class="citation-text">
          Tahir, A. (2026). LinguaX Arc: A Fully Offline Mobile Corpus Analysis Toolkit (Version v6.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.22706552
        </div>
      </div>
    

</body>
    </html>
  `;
}

function generateTxtExport(rows, baseName, type) {
  const cleanTitle = baseName.replace(/^(LinguaX_Report_|Report_)/i, '').replace(/_/g, ' ');
  const colWidths = [];
  rows.forEach(r => {
    r.forEach((c, idx) => {
      const len = String(c).length;
      colWidths[idx] = Math.max(colWidths[idx] || 0, len);
    });
  });

  const sep = '='.repeat(80);
  const thinSep = '-'.repeat(80);
  
  let out = '';
  out += sep + '\r\n';
  out += '  LINGUAX ARC (Version v6.0) - ACADEMIC RESEARCH REPORT\r\n';
  out += `  Analysis: ${cleanTitle}\r\n`;
  out += `  Generated: ${new Date().toLocaleString()}\r\n`;
  out += '  WATERMARK: Official Output Generated by LinguaX Arc\r\n';
  out += sep + '\r\n\r\n';

  rows.forEach((r, idx) => {
    out += r.map((c, cidx) => String(c).padEnd(colWidths[cidx] + 3)).join('') + '\r\n';
    if (idx === 0) out += thinSep + '\r\n';
  });

  out += '\r\n' + sep + '\r\n';
  out += 'ACADEMIC CITATION (APA 7th Edition):\r\n';
  out += 'Tahir, A. (2026). LinguaX Arc: A Fully Offline Mobile Corpus Analysis Toolkit (Version v6.0)\r\n';
  out += '[Computer software]. Zenodo.\r\n';
  out += 'https://doi.org/10.5281/zenodo.22706552\r\n';
  out += sep + '\r\n';
  return out;
}

function generateCsvExport(rows) {
  let csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\r\n');
  csv += '\r\n\r\n';
  csv += '"# WATERMARK","Official Output Generated by LinguaX Arc (Version v6.0) · Zero-Cloud Research Privacy"\r\n';
  csv += '"# ACADEMIC CITATION (APA 7th Edition)","Tahir, A. (2026). LinguaX Arc: A Fully Offline Mobile Corpus Analysis Toolkit (Version v6.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.22706552"\r\n';
  return csv;
}

async function exportCSV(rows, name, type){
  if(!rows || !rows.length) return toast('Nothing to export', false);
  
  const chosenFormat = await promptExportFormatSelection();
  if (!chosenFormat) return; // User cancelled
  
  const format = chosenFormat;
  const folder = getOrganizedFolderName(type || 'analysis');
  
  let baseName = name.replace(/\.(csv|txt|doc|xls|pdf)$/i, '');
  if (!/^linguax/i.test(baseName)) {
    baseName = 'LinguaX_Report_' + baseName;
  }

  // 1. PDF EXPORT HANDLER
  if (format === 'pdf') {
    const ext = 'pdf';
    const mimeType = 'application/pdf';
    const finalName = baseName + '.' + ext;
    
    toast('Generating PDF document...');
    const pdfBytes = generateTablePDF(rows, baseName, type);
    if (!pdfBytes) return toast('PDF generation failed', false);
    
    const base64Data = uint8ArrayToBase64(pdfBytes);
    
    if (window.AndroidBridge && typeof window.AndroidBridge.saveFile === 'function') {
      try {
        window.AndroidBridge.saveFile(base64Data, finalName, mimeType, folder);
        showPostExportCitationPrompt(finalName);
        return;
      } catch(e) {
        toast('Native save failed: ' + e, false);
      }
    }
    
    const C = window.Capacitor;
    if (C && C.isNativePlatform && C.isNativePlatform()) {
      try {
        const FS = C.Plugins.Filesystem, SH = C.Plugins.Share;
        let writePath = folder + '/' + finalName;
        const res = await FS.writeFile({
          path: writePath,
          data: base64Data,
          directory: 'DOCUMENTS',
          recursive: true
        });
        await SH.share({ title: finalName, url: res.uri, dialogTitle: 'Save or share ' + finalName });
        showPostExportCitationPrompt(finalName);
      } catch(e) {
        try {
          const FS = C.Plugins.Filesystem, SH = C.Plugins.Share;
          const res = await FS.writeFile({ path: finalName, data: base64Data, directory: 'CACHE' });
          await SH.share({ title: finalName, url: res.uri, dialogTitle: 'Save or share ' + finalName });
          showPostExportCitationPrompt(finalName);
        } catch(err) {
          const msg = String(err && err.message || err);
          if(!/cancel/i.test(msg)) toast('Export failed: '+msg, false);
        }
      }
      return;
    }
    
    const blob = new Blob([pdfBytes], { type: mimeType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = finalName;
    a.click();
    URL.revokeObjectURL(a.href);
    showPostExportCitationPrompt(finalName);
    return;
  }
  
  // 2. WORD / TEXT / CSV EXPORT HANDLERS
  let ext = 'csv';
  let mimeType = 'text/csv';
  let dataContent = '';
  
  if (format === 'word') {
    ext = 'doc';
    mimeType = 'application/msword';
    dataContent = generateWordExport(rows, baseName, type);
  } else if (format === 'txt') {
    ext = 'txt';
    mimeType = 'text/plain';
    dataContent = generateTxtExport(rows, baseName, type);
  } else {
    ext = 'csv';
    mimeType = 'text/csv';
    dataContent = generateCsvExport(rows);
  }
  
  const finalName = baseName + '.' + ext;
  
  if (window.AndroidBridge && typeof window.AndroidBridge.saveFile === 'function') {
    try {
      const base64Data = btoa(unescape(encodeURIComponent(dataContent)));
      window.AndroidBridge.saveFile(base64Data, finalName, mimeType, folder);
      showPostExportCitationPrompt(finalName);
      return;
    } catch(e) {
      toast('Native save failed: ' + e, false);
    }
  }
  
  const C = window.Capacitor;
  if(C && C.isNativePlatform && C.isNativePlatform()){
    try{
      const FS = C.Plugins.Filesystem, SH = C.Plugins.Share;
      let writePath = folder + '/' + finalName;
      const res = await FS.writeFile({
        path: writePath,
        data: dataContent,
        directory: 'DOCUMENTS',
        encoding: 'utf8',
        recursive: true
      });
      await SH.share({title:finalName, url:res.uri, dialogTitle:'Save or share ' + finalName});
      showPostExportCitationPrompt(finalName);
    }catch(e){
      try {
        const FS = C.Plugins.Filesystem, SH = C.Plugins.Share;
        const res = await FS.writeFile({path: finalName, data: dataContent, directory: 'CACHE', encoding: 'utf8'});
        await SH.share({title: finalName, url: res.uri, dialogTitle: 'Save or share ' + finalName});
        showPostExportCitationPrompt(finalName);
      } catch(err) {
        const msg = String(err && err.message || err);
        if(!/cancel/i.test(msg)) toast('Export failed: '+msg, false);
      }
    }
    return;
  }
  
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([dataContent], {type: mimeType}));
  a.download = finalName; a.click(); URL.revokeObjectURL(a.href);
  showPostExportCitationPrompt(finalName);
}

function getCleanFolderName() {
  return getOrganizedFolderName('analysis');
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

async function exportChartAsPNG(svg, filename) {
  if (!svg) return toast('Chart not found', false);
  
  const card = svg.closest('.chart-card');
  const titleText = card ? card.querySelector('h3').textContent.trim() : 'Analysis Report';
  
  // Extract data from already-rendered SVG elements
  const groups = svg.querySelectorAll('.chart-bar-group');
  if (!groups || groups.length === 0) return toast('No data in chart to save', false);
  
  const computedStyles = getComputedStyle(document.body);
  const isDark = document.body.classList.contains('dark') || (S.settings && S.settings.theme === 'dark');
  const bg = isDark ? '#131722' : '#ffffff';
  const ink = isDark ? '#ffffff' : '#111115';
  const inkSoft = isDark ? '#8a8a94' : '#555566';
  
  const width = svg.viewBox?.baseVal?.width || 540;
  const originalHeight = svg.viewBox?.baseVal?.height || 300;
  const titleHeight = 50;
  const footerHeight = 36;
  const height = originalHeight + titleHeight + footerHeight;
  
  // Highly reliable manual canvas drawing that works on EVERY Android WebView without any image loading bugs
  const canvas = document.createElement('canvas');
  const scale = 2.5; // Premium super-sampled crisp output
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  
  // Draw background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  
  // Diagonal watermark across the chart canvas
  drawWatermark(ctx, width, height);
  
  // Draw LinguaX Arc circular logo badge
  drawLinguaXLogo(ctx, 16, 12, 26);
  
  // Draw Chart Title
  ctx.fillStyle = ink;
  ctx.font = "bold 13.5px 'Sora', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(titleText, 50, 25);

  // Draw LinguaX Arc Watermark Header Badge
  ctx.fillStyle = isDark ? '#818cf8' : '#4f46e5';
  ctx.font = "bold 11px 'Sora', sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText("LinguaX Arc (v6.0)", width - 20, 25);
  
  // Draw separator line under title
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(16, 44);
  ctx.lineTo(width - 16, 44);
  ctx.stroke();
  
  // Draw elements
  groups.forEach(group => {
    const texts = group.querySelectorAll('text');
    const rects = group.querySelectorAll('rect');
    
    // Label
    const labelEl = texts[0];
    const labelText = labelEl ? labelEl.textContent.trim() : '';
    
    // Background bar rect
    const bgRectEl = rects[0];
    const bgX = bgRectEl ? parseFloat(bgRectEl.getAttribute('x')) : 120;
    const bgY = bgRectEl ? parseFloat(bgRectEl.getAttribute('y')) : 0;
    const bgW = bgRectEl ? parseFloat(bgRectEl.getAttribute('width')) : 360;
    const bgH = bgRectEl ? parseFloat(bgRectEl.getAttribute('height')) : 22;
    
    // Filled bar rect
    const fillRectEl = rects[1];
    const fillX = fillRectEl ? parseFloat(fillRectEl.getAttribute('x')) : 120;
    const fillY = fillRectEl ? parseFloat(fillRectEl.getAttribute('y')) : 0;
    const fillW = fillRectEl ? parseFloat(fillRectEl.getAttribute('width')) : 0;
    const fillH = fillRectEl ? parseFloat(fillRectEl.getAttribute('height')) : 22;
    const fillColor = fillRectEl ? fillRectEl.getAttribute('fill') : '#4ea8de';
    
    // Value text
    const valEl = texts[1];
    const valText = valEl ? valEl.textContent.trim() : '';
    
    const canvasY = bgY + titleHeight;
    const canvasFillY = fillY + titleHeight;
    
    // Draw background bar
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    drawRoundedRect(ctx, bgX, canvasY, bgW, bgH, 4);
    ctx.fill();
    
    // Draw filled colored bar
    ctx.fillStyle = fillColor;
    drawRoundedRect(ctx, fillX, canvasFillY, fillW, fillH, 4);
    ctx.fill();
    
    // Draw right-aligned label
    ctx.fillStyle = ink;
    ctx.font = "bold 11px 'Sora', sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(labelText, bgX - 10, canvasY + bgH/2);
    
    // Draw left-aligned value text
    ctx.fillStyle = inkSoft;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(valText, bgX + fillW + 8, canvasY + bgH/2);
  });
  
  // Draw Citation & Watermark Footer
  const footerY = height - 20;
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(16, height - 32);
  ctx.lineTo(width - 16, height - 32);
  ctx.stroke();

  ctx.fillStyle = inkSoft;
  ctx.font = "bold 9px 'Sora', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("APA 7th: Tahir, A. (2026). LinguaX Arc: A Fully Offline Mobile Corpus Analysis Toolkit (v6.0). Zenodo.", 16, footerY);

  ctx.textAlign = "right";
  ctx.fillText("Official Watermark · LinguaX Arc", width - 16, footerY);
  
  const mime = 'image/png';
  const dataUrl = canvas.toDataURL(mime, 0.95);
  const base64Data = dataUrl.split(',')[1];
  let cleanName = filename.replace(/\.(png|jpg|jpeg)$/i, '');
  if (!/^linguax/i.test(cleanName)) {
    cleanName = 'LinguaX_Report_' + cleanName;
  }
  const finalName = cleanName + '.png';
  
  if (window.AndroidBridge && typeof window.AndroidBridge.saveFile === 'function') {
    window.AndroidBridge.saveFile(base64Data, finalName, mime, getCleanFolderName());
    showPostExportCitationPrompt(finalName);
  } else {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = finalName;
    a.click();
    showPostExportCitationPrompt(finalName);
  }
}

async function exportCloudAsPNG() {
  const box = document.getElementById('cloudBox');
  if (!box) return toast('No cloud generated yet', false);
  const spans = box.querySelectorAll('span');
  if (!spans.length) return toast('No cloud generated yet', false);
  
  const W = 1000, H = 1000;
  const canvas = document.createElement('canvas');
  canvas.width = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);
  
  const computedStyles = getComputedStyle(document.documentElement);
  const isDark = document.body.classList.contains('dark') || (computedStyles.getPropertyValue('--bg').trim() === '#070709') || (S.settings && S.settings.theme === 'dark');
  const bg = isDark ? '#0b0f1a' : '#ffffff';
  const ink = isDark ? '#ffffff' : '#000000';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  
  spans.forEach(span => {
    const text = span.textContent;
    const x = parseFloat(span.style.left) || 0;
    const y = parseFloat(span.style.top) || 0;
    const fontSize = parseFloat(span.style.fontSize) || 12;
    const colorVar = span.style.color;
    
    let color = colorVar || ink;
    if (color.includes('var(')) {
      const match = color.match(/var\(([^)]+)\)/);
      if (match) {
        const varName = match[1].trim();
        const resolved = computedStyles.getPropertyValue(varName).trim();
        if (resolved) color = resolved;
      }
    }
    
    ctx.fillStyle = color || ink;
    ctx.font = `bold ${fontSize}px Sora, sans-serif`;
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
  });
  
  // Draw LinguaX Arc Logo Badge & Watermark
  drawWatermark(ctx, W, H);
  drawLinguaXLogo(ctx, 35, H - 75, 48);
  
  ctx.fillStyle = isDark ? '#ffffff' : '#111115';
  ctx.font = "bold 20px Sora, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("LinguaX Arc (v6.0)", 95, H - 60);

  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = "bold 13px Sora, sans-serif";
  ctx.fillText("APA 7th: Tahir, A. (2026). LinguaX Arc: A Fully Offline Mobile Corpus Analysis Toolkit (v6.0). Zenodo.", 95, H - 38);
  
  const dataUrl = canvas.toDataURL('image/png');
  const base64Data = dataUrl.split(',')[1];
  const finalName = 'LinguaX_Report_WordCloud.png';
  
  if (window.AndroidBridge && typeof window.AndroidBridge.saveFile === 'function') {
    window.AndroidBridge.saveFile(base64Data, finalName, 'image/png', getCleanFolderName());
    showPostExportCitationPrompt(finalName);
    return;
  }
  
  const C = window.Capacitor;
  const folder = S.settings.outputFolder || 'Documents/LinguaX';
  
  if (C && C.isNativePlatform && C.isNativePlatform()) {
    const FS = C.Plugins.Filesystem, SH = C.Plugins.Share;
    
    let writePath = finalName;
    if (folder) {
      const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
      writePath = cleanFolder + '/' + finalName;
    }
    
    try {
      const res = await FS.writeFile({
        path: writePath,
        data: base64Data,
        directory: 'DOCUMENTS',
        recursive: true
      });
      await SH.share({
        title: finalName,
        url: res.uri,
        dialogTitle: 'Save Word Cloud'
      });
      showPostExportCitationPrompt(finalName);
    } catch(err) {
      toast('Export failed: ' + err, false);
    }
  } else {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = finalName;
    a.click();
    showPostExportCitationPrompt(finalName);
  }
}

function drawCanvasRoundRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function exportDispersionPlotsAsPNG(isShare = false) {
  const plotFiles = document.querySelectorAll('.plotfile');
  if (!plotFiles.length) return toast('No plot generated yet', false);
  
  const W = 1100;
  const cardH = 120;
  const gap = 16;
  const headerH = 110;
  const footerH = 75;
  const H = headerH + (plotFiles.length * (cardH + gap)) + footerH + 20;
  
  const canvas = document.createElement('canvas');
  canvas.width = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);
  
  // Clean executive publication background with frame
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(16, 16, W - 32, H - 32);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(16, 16, W - 32, H - 32);
  
  // Diagonal Watermark across the canvas
  drawWatermark(ctx, W, H);
  
  // Brand Logo
  drawLinguaXLogo(ctx, 40, 24, 44);

  // Header Title & Meta
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px Sora, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Concordance Dispersion Plot — "${S.q.term}"`, 98, 38);
  
  ctx.fillStyle = '#64748b';
  ctx.font = '600 11.5px Sora, sans-serif';
  ctx.fillText(`Lexical distribution analysis across ${plotFiles.length} file(s)  •  Generated ${new Date().toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' })}`, 98, 58);
  
  // Top-Right Modern Report Pill
  drawCanvasRoundRect(ctx, W - 230, 26, 190, 32, 16);
  ctx.fillStyle = '#fef3c7';
  ctx.fill();
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 10.5px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('• LINGUA-X REPORT •', W - 135, 42);
  ctx.textAlign = 'left';
  
  // Header Divider Line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(40, 84);
  ctx.lineTo(W - 40, 84);
  ctx.stroke();
  
  let currentY = 102;
  
  for (let i = 0; i < plotFiles.length; i++) {
    const pf = plotFiles[i];
    const headSpan = pf.querySelector('.pf-head span');
    const titleText = headSpan ? headSpan.textContent : `Document ${i + 1}`;
    
    const hitChip = pf.querySelector('.pf-chip.hit-chip');
    const hitsText = hitChip ? hitChip.textContent : '';
    
    const rateChip = pf.querySelector('.pf-chip.rate-chip');
    const rateText = rateChip ? rateChip.textContent : '';
    
    const lenChip = pf.querySelector('.pf-chip.len-chip');
    const lenText = lenChip ? lenChip.textContent : '';
    
    // File Card Box
    drawCanvasRoundRect(ctx, 40, currentY, W - 80, cardH, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    
    // File Icon Indicator
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(60, currentY + 22, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // File Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13.5px Sora, sans-serif';
    ctx.fillText(titleText, 74, currentY + 22);
    
    // File Stats Chips on Right
    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748b';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillText(`${lenText ? lenText + '  •  ' : ''}${rateText}`, W - 150, currentY + 22);
    
    // Hit Count Pill
    if (hitsText) {
      drawCanvasRoundRect(ctx, W - 136, currentY + 10, 80, 24, 7);
      ctx.fillStyle = '#d97706';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(hitsText, W - 96, currentY + 22);
    }
    ctx.textAlign = 'left';
    
    // Barcode Channel Track
    const trackX = 56;
    const trackY = currentY + 38;
    const trackW = W - 112;
    const trackH = 46;
    
    drawCanvasRoundRect(ctx, trackX, trackY, trackW, trackH, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Milestone Grid Lines in Track
    [0.25, 0.5, 0.75].forEach(pct => {
      const gx = trackX + pct * trackW;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(gx, trackY + 4);
      ctx.lineTo(gx, trackY + trackH - 4);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    
    // Draw Needles / Strikes
    const lines = pf.querySelectorAll('line.barcode-strike').length ? pf.querySelectorAll('line.barcode-strike') : pf.querySelectorAll('line');
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'butt';
    
    lines.forEach(line => {
      const x1Attr = parseFloat(line.getAttribute('x1')) || 0;
      const scaleX = Math.max(0, Math.min(1, (x1Attr - 3) / 994));
      const drawX = trackX + scaleX * trackW;
      
      ctx.beginPath();
      ctx.moveTo(drawX, trackY + 6);
      ctx.lineTo(drawX, trackY + trackH - 6);
      ctx.stroke();
    });
    
    // Scale Bar Below Track
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('0% (Start)', trackX + 2, currentY + 100);
    ctx.textAlign = 'center';
    ctx.fillText('25%', trackX + trackW * 0.25, currentY + 100);
    ctx.fillText('50% (Midpoint)', trackX + trackW * 0.5, currentY + 100);
    ctx.fillText('75%', trackX + trackW * 0.75, currentY + 100);
    ctx.textAlign = 'right';
    ctx.fillText('100% (End)', trackX + trackW - 2, currentY + 100);
    ctx.textAlign = 'left';
    
    currentY += cardH + gap;
  }
  
  // Footer Watermark Band
  const footerBoxY = H - 65;
  drawCanvasRoundRect(ctx, 40, footerBoxY, W - 80, 42, 10);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('•  LINGUA-X CORPUS ENGINE  •  ACCREDITED ON-DEVICE NLP  •  VERIFIED DISPERSION REPORT', 56, footerBoxY + 21);
  
  ctx.fillStyle = '#64748b';
  ctx.font = '600 9.5px Sora, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('APA 7th: Tahir, A. (2026). LinguaX Arc (v6.0). Zenodo.', W - 56, footerBoxY + 21);
  ctx.textAlign = 'left';
  
  const dataUrl = canvas.toDataURL('image/png');
  const base64Data = dataUrl.split(',')[1];
  const finalName = `LinguaX_Report_Dispersion_Plot_${S.q.term.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
  
  if (isShare) {
    if (window.AndroidBridge && typeof window.AndroidBridge.shareFile === 'function') {
      window.AndroidBridge.shareFile(base64Data, finalName, 'image/png');
      showPostExportCitationPrompt(finalName);
      return;
    }
    if (navigator.share) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], finalName, { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: 'Dispersion Plot',
          text: `Dispersion Plot for ${S.q.term}`
        });
        showPostExportCitationPrompt(finalName);
      } catch(err) {
        toast('Share failed: ' + err, false);
      }
    } else {
      toast('Native sharing is not available', false);
    }
    return;
  }
  
  if (window.AndroidBridge && typeof window.AndroidBridge.saveFile === 'function') {
    window.AndroidBridge.saveFile(base64Data, finalName, 'image/png', 'LinguaX');
    playFeedback('success');
    toast('Dispersion Plot saved to Gallery (Pictures/LinguaX)!');
    showPostExportCitationPrompt(finalName);
    return;
  }
  
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = finalName;
  a.click();
  showPostExportCitationPrompt(finalName);
}

function needCorpus(){
  return `<div class="empty">${I.folder}<br>No corpus loaded yet.<br>Open the <b>Corpus</b> tab to add .txt files or load the sample corpus.</div>`;
}

function resHead(count, csvFn, imgFn, shareFn){
  const fmt = (S.settings.exportFormat || 'csv').toUpperCase();
  const imgBtn = imgFn ? `<button class="btn ghost small" onclick="${imgFn}" style="display: inline-flex; align-items: center; gap: 4px;">Save Image</button>` : '';
  const shareBtn = shareFn ? `<button class="btn ghost small" onclick="${shareFn}" style="display: inline-flex; align-items: center; gap: 4px; padding: 0 10px; width: 34px; height: 34px; border-radius: 11px; justify-content: center;" title="Share Plot">${I.share}</button>` : '';
  return `<div class="res-head" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;"><span class="count" style="flex: 1; min-width: 200px;">${count}</span>
    <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
      <button class="btn ghost small" onclick="${csvFn}">${I.dl} Export (${fmt})</button>
      ${imgBtn}
      ${shareBtn}
    </div></div>`;
}

/* ---------- custom glass dropdown (replaces native <select>) ---------- */
const GSEL_CHANGE = {};
function gsel(id, options, selected, labelFn, onChange){
  labelFn = labelFn || (v=>String(v));
  if(onChange) GSEL_CHANGE[id] = onChange;
  const selLabel = esc(labelFn(selected));
  const opts = options.map(v=>{
    const val = String(v);
    const on = val===String(selected);
    return `<div class="gsel-opt ${on?'on':''}" onclick="gselPick('${id}','${esc(val)}',this)">${esc(labelFn(v))}</div>`;
  }).join('');
  return `<div class="gsel" id="gsel-${id}" data-value="${esc(String(selected))}">
    <button type="button" class="gsel-btn" onclick="gselToggle('${id}')"><span>${selLabel}</span>${I.chev}</button>
    <div class="gsel-panel" id="gsel-panel-${id}">${opts}</div>
  </div>`;
}
function gselToggle(id){
  const panel = document.getElementById('gsel-panel-'+id);
  if (!panel) return;
  const wrap = document.getElementById('gsel-'+id);
  const btn = wrap ? wrap.querySelector('.gsel-btn') : panel.previousElementSibling;
  const willOpen = !panel.classList.contains('open');

  document.querySelectorAll('.gsel-panel.open').forEach(p=>p.classList.remove('open'));
  document.querySelectorAll('.gsel-btn.open').forEach(b=>b.classList.remove('open'));
  document.querySelectorAll('.gsel.open').forEach(g=>g.classList.remove('open'));
  document.querySelectorAll('.gsel-active').forEach(a=>a.classList.remove('gsel-active'));

  if(willOpen){
    panel.classList.add('open');
    if (btn) btn.classList.add('open');
    if (wrap) {
      wrap.classList.add('open');
      const fld = wrap.closest('.field');
      if (fld) fld.classList.add('gsel-active');
      const crow = wrap.closest('.controls-row') || wrap.closest('.controls') || wrap.closest('.fv-quick-jump-bar');
      if (crow) crow.classList.add('gsel-active');
    }
  }
}
function gselPick(id, val, el){
  const wrap = document.getElementById('gsel-'+id);
  if (!wrap) return;
  wrap.dataset.value = val;
  const panel = document.getElementById('gsel-panel-'+id);
  if (panel) {
    panel.querySelectorAll('.gsel-opt').forEach(o=>o.classList.toggle('on', o===el));
    panel.classList.remove('open');
  }
  const btn = wrap.querySelector('.gsel-btn');
  if (btn) {
    btn.classList.remove('open');
    const span = btn.querySelector('span');
    if (span && el) span.textContent = el.textContent;
  }
  wrap.classList.remove('open');
  document.querySelectorAll('.gsel-active').forEach(a=>a.classList.remove('gsel-active'));
  if(GSEL_CHANGE[id]) GSEL_CHANGE[id](val);
}
function gselVal(id){
  const el = document.getElementById('gsel-'+id);
  return el ? el.dataset.value : null;
}
document.addEventListener('click', (e)=>{
  if(!e.target.closest('.gsel')){
    document.querySelectorAll('.gsel-panel.open').forEach(p=>p.classList.remove('open'));
    document.querySelectorAll('.gsel-btn.open').forEach(b=>b.classList.remove('open'));
    document.querySelectorAll('.gsel.open').forEach(g=>g.classList.remove('open'));
    document.querySelectorAll('.gsel-active').forEach(a=>a.classList.remove('gsel-active'));
  }
});


/* ---------- sample corpus ---------- */
const SAMPLES = [
["speech_and_society.txt",`Language lives in the mouths of speakers, and every community shapes its speech to fit its own needs. In the markets of a busy city, traders switch between languages in a single breath, borrowing a word here and bending a phrase there. Linguists who study this behaviour find that code switching is not confusion but skill. A speaker chooses each form for a reason, signalling closeness, distance, humour, or respect. Over time these small choices settle into patterns, and the patterns become the grammar of a new variety. What sounds like casual talk in the street today may become the standard language of a nation tomorrow. The history of every major language is, at its heart, a history of ordinary people talking.

Social stratification exerts a powerful gravitational pull on linguistic variation. Sociolinguists have consistently demonstrated that phonological variables, grammatical inflections, and lexical selections correlate with socioeconomic background, gender, generation, and peer network density. In urban speech communities, vernacular prestige often operates in opposition to institutional standard norms. While formal schooling inculcates codified grammar and standard pronunciation, informal social networks foster covert prestige, cementing regional identity and group solidarity. Vernacular dialects exhibit systematic, rule-governed regularities that challenge persistent folk prejudices regarding correctness and communicative deficiency.

Moreover, the acceleration of global communication and digital media has profoundly reorganized communicative repertoires. Multilingual individuals navigate cross-border linguistic spaces where traditional national boundaries dissolve. In online discourse, micro-communities generate idiosyncratic idioms, pragmatic markers, and orthographic conventions at breakneck speed. Far from corrupting language, these digital practices reveal the adaptive plasticity of human communication. Speakers repurpose conventional linguistic resources to negotiate relational nuances, forge collective belonging, and project multi-layered social identities across ever-shifting conversational contexts.`],
["corpus_methods.txt",`A corpus is a body of real language collected for study. Instead of asking what speakers might say, the corpus linguist observes what speakers actually say and write. Frequency counts reveal which words carry the weight of a text, while concordance lines show each word at work in its natural habitat. Collocation analysis uncovers the quiet partnerships between words, the way heavy rain feels natural while strong rain does not. Keyword analysis compares one collection of texts against another and points to the vocabulary that makes a discourse distinctive. With a corpus of millions of words, patterns emerge that no single reader could ever notice alone. The method is simple, patient counting, but the findings often overturn confident intuitions about language.

Empirical corpus methodologies rely on rigorous statistical measures to distinguish meaningful lexical associations from random chance. Mutual information, t-scores, and log-likelihood statistics enable researchers to identify salient collocational frameworks, semantic prosodies, and discourse preferences. When evaluating concordances, looking at varying spans—such as four words to the left and four words to the right—illuminates how grammatical structures interact with lexical selections. Lexical bundles, recurrent formulaic sequences of three or more words, serve as building blocks in academic writing, journalistic prose, and spoken discourse, providing fluency and structural cohesion.

Furthermore, quantitative corpus investigations demand representative sampling design and balanced stratification. A corpus must capture stylistic registers, temporal periods, and demographic profiles proportionally to avoid skewed distributions. Lemmatization and accurate part-of-speech annotation enrich raw tokens with grammatical metadata, enabling researchers to disambiguate homographs and track syntactic transformations. From lexicography and historical linguistics to forensic author profiling, corpus linguistics replaces subjective introspection with reproducible empirical evidence, unveiling the deep structural architecture of natural language.`],
["classroom_notes.txt",`The morning class began with a simple question written on the board. What makes a sentence feel natural? Students offered answers about grammar rules and word order, but the discussion soon turned to habit and exposure. A learner who reads widely absorbs thousands of patterns without effort, the teacher explained, and those patterns guide every sentence the learner later writes. Practice in the classroom works best when it echoes real language use. Reading authentic texts, listening to genuine conversation, and writing for real readers all build the quiet knowledge that rules alone cannot supply. By the end of the lesson the board was covered with examples, and the students left arguing happily about which sentence sounded most natural.

Second language acquisition research reinforces the critical distinction between explicit grammatical knowledge and implicit communicative competence. While deliberate study of grammatical rules provides declarative scaffolding, spontaneous fluent production depends upon deeply automatized lexical chunks. Learners encounter difficulty not because their abstract syntax is flawed, but because their collocational repertoire lacks idiomatic depth. Encouraging students to examine concordance lines directly through data-driven learning empowers them to discover usage regularities autonomously, transforming language learners into active linguistic investigators.

In contemporary communicative language teaching, formative feedback and task-based interaction replace repetitive drills. When students collaborate on meaningful problem-solving activities, negotiating meaning through iterative clarification requests, their communicative competence expands organically. Authentic spoken interaction exposes learners to prosodic modulation, discourse markers, and conversational turn-taking strategies that textbook dialogues routinely neglect. Ultimately, linguistic proficiency flourishes when classrooms become dynamic ecosystems of genuine inquiry, authentic cultural materials, and continuous communicative engagement.`],
["computational_linguistics.txt",`Computational linguistics bridges formal linguistic theory and modern algorithmic processing. At its foundation, natural language processing seeks to convert unstructured human language into structured mathematical representations. Raw textual input undergoes multi-stage preprocessing pipelines, beginning with robust tokenization, sentence boundary disambiguation, and stop-word normalization. Morphological analyzers and lemmatizers dissect inflected forms into lexical roots, while probabilistic part-of-speech taggers assign grammatical categories based on contextual probabilities and syntactic constraints.

Statistical parsing algorithms further decompose linear sequences of tokens into hierarchical syntactic trees, modeling constituent dependencies and recursive sentence structures. Recent advances in distribution semantics and neural word embeddings have revolutionized semantic processing by mapping linguistic tokens into dense, continuous vector spaces. In these multidimensional vector geometries, semantic similarity manifests as spatial proximity, allowing computational architectures to capture subtle nuances of synonymy, semantic analogy, and polysemy.

Modern language technologies harness these computational representations to execute complex downstream tasks, including neural machine translation, abstractive text summarization, sentiment classification, and named entity recognition. By combining vast empirical corpora with deep neural network architectures, computational systems continuously learn statistical distributions of linguistic structures across diverse domains and languages. Yet despite these extraordinary computational breakthroughs, challenges remain in resolving pragmatic ambiguity, world knowledge reasoning, and cross-cultural communicative nuance.`]
,
  ["the_whispering_library.txt",`Deep beneath the cobblestone streets of the old university city lay the Whispering Library, a vault of forgotten manuscripts and leather-bound journals known only to a handful of scholars. Every evening at dusk, when the bells of the central cathedral chimed seven times, Professor Elena Vance unlocked the bronze gate with an ancient iron key.

Elena had spent twenty-five years researching ancient dialects and archaic linguistic forms. The library was not merely quiet; it breathed with history. On the third tier of mahogany shelves rested the Chronicles of Aldoria, handwritten records kept by desert traders and seafarers across centuries. Elena opened the brittle parchment, carefully brushing aside dust that smelled of dried lavender and cedar wood.

"Language lives where ink meets memory," she whispered aloud to herself. Her young apprentice, Julian, entered with a brass lantern, his footsteps echoing softly along the stone corridor. Julian had uncovered an intriguing passage written in a rare dialect spoken by high-altitude pastoralists in the northern mountains.

Together, the two researchers examined the syntactic structure of the merchant covenants. They observed how loanwords entered coastal dialects during maritime trade expeditions, transforming regional phonology and syntax. Outside, winter rain lashed against the arched stained-glass windows, but within the subterranean library, the centuries spoke with unwavering clarity.`],
  ["the_lighthouse_keeper_chronicle.txt",`For forty years, Angus MacLeod lived upon the craggy outpost of St. Jude's Rock, maintaining the lighthouse that guided cargo vessels through the perilous Atlantic straits. In his solitary quarters, Angus maintained a meticulously documented daily logbook, recording tidal fluctuations, barometric pressure, wind speeds, and radio communications with passing ships.

Each entry began with the exact hour and weather conditions. Angus was a keen observer of maritime jargon and dialects, noting how sailors from Liverpool, Glasgow, Lisbon, and Halifax used distinctive idioms when broadcasting distress calls or navigation reports over high-frequency radio.

One stormy November evening, hurricane-force gusts severed the island's generator cable, plunging the beacon into total darkness. Without hesitation, Angus climbed the spiral cast-iron staircase of three hundred and twenty steps, carrying emergency paraffin lamps and manual reflectors. Working against torrential gale winds, he lit the emergency mantle and cranked the clockwork lenses by hand until dawn broke across the cresting waves.

In his logbook that morning, Angus penned a concise reflection: "The beacon held firm. Words transmitted across the radio gave hope to the freighter crews in the trough of the sea. Light and communication remain our only shields against the storm." His journals became a treasured treasure trove for coastal sociolinguists studying the evolution of maritime English.`],
  ["news_global_tech_ai_breakthrough.txt",`GENEVA — In an international summit hosted this morning, leading computer scientists and computational linguists unveiled a revolutionary neural language architecture capable of real-time translation across two hundred low-resource indigenous languages.

The milestone, announced jointly by researchers from the European Centre for Artificial Intelligence and university consortiums worldwide, addresses a longstanding challenge in natural language processing: the scarcity of digitized training data for endangered and regional dialects.

Dr. Sophia Morales, chief research scientist on the initiative, explained that the new model utilizes self-supervised cross-lingual phonetic embeddings rather than relying exclusively on vast parallel text corpora. "By analyzing acoustic patterns and universal grammatical primitives across language families, the system maps semantic intent with unprecedented fidelity," Dr. Morales stated during the keynote address.

Technology analysts observe that the breakthrough will democratize digital information access for rural healthcare practitioners, disaster response teams, and educational institutions in remote regions. Several national ministries of education have already initiated pilot implementations to deliver multilingual digital curriculum to primary school students across developing economies.`],
  ["news_archeological_ancient_script.txt",`CAIRO — Archeologists excavating a subterranean palace complex near the ancient Nile delta have discovered a remarkable bilingual stone tablet, dating back to the third century BCE. The artifact contains administrative decrees inscribed in both Egyptian Demotic script and an early variant of Hellenistic Greek.

Epigraphers and philologists from the Supreme Council of Antiquities described the find as one of the most significant epigraphic discoveries of the past century. The decree details grain distribution, irrigation tax exemptions, and seasonal festival schedules issued under the reign of Pharaoh Ptolemy III.

"The bilingual inscription provides an extraordinary window into Hellenistic administrative bilingualism and official language policy," noted lead excavator Dr. Tariq Al-Mansoor. "We observe systematic phonological transliterations of indigenous Egyptian place names and agricultural terms into Greek vocabulary, illustrating dynamic linguistic synthesis in administrative record-keeping."

The artifact will undergo multi-spectral imaging and 3D laser scanning at the Grand Egyptian Museum before being made accessible to international researchers via open-access digital corpus archives.`]
];
const SAMPLE_REF = ["reference_general.txt",`The committee met on Monday to review the annual budget and the schedule of public works. Roads in the northern district require repair before winter, and the water supply project remains behind schedule. Members discussed funding options, including a modest increase in local fees and an application for a national development grant. The chairman asked each department to submit revised estimates by the end of the month. In other business, the committee approved the purchase of new equipment for the health centre and noted the successful completion of the school building. The meeting closed with a reminder that the public consultation on the transport plan will be held in the community hall next week, and all residents are welcome to attend and share their views.

The director of municipal infrastructure presented a comprehensive technical report evaluating civic water distribution networks and wastewater treatment facilities. Following stringent regional regulatory standards, the board resolved to allocate supplementary capital reserves for upgrading aging pipelines and telemetry monitoring units. Financial officers emphasized that fiscal responsibility necessitates phased project execution across consecutive quarters, mitigating inflationary cost overruns and ensuring regulatory compliance with state environmental protection directives.

Additionally, the municipal planning commission deliberated on proposed amendments to commercial zoning guidelines and residential development permits. Representatives from civic associations submitted written memorandums regarding pedestrian safety corridors, bicycle transit lanes, and municipal waste reduction initiatives. After deliberating on statutory notice requirements and administrative procedures, the board voted unanimously to adopt the revised development framework, scheduling formal stakeholder hearings for the upcoming legislative calendar.`];

/* ---------- theme ---------- */
function setTheme(t){
  S.theme = t;
  document.documentElement.setAttribute('data-theme', t);
  document.querySelector('meta[name=theme-color]').content = t==='dark' ? '#0b0f1a' : '#eef1f8';
  $('#themeBtn').innerHTML = t==='dark' ? I.sun : I.moon;
  const C = window.Capacitor;
  if(C && C.isNativePlatform && C.isNativePlatform()){
    try{
      const SB = C.Plugins.StatusBar;
      SB.setStyle({style: t==='dark' ? 'DARK' : 'LIGHT'});
    }catch(e){}
  }
  saveSettings();
}

/* ---------- dock ---------- */
function renderDock(){
  $('#dock').innerHTML = TOOLS.map(([id,label,icon]) =>
    `<button class="dock-btn dock-btn-${id} ${S.tool===id?'on':''}" onclick="go('${id}')" onpointerdown="handleDockPointerDown(event, '${id}')" aria-label="${label}">${icon}<span>${label}</span></button>`
  ).join('');
}

let lastDockActivation = 0;
function handleDockPointerDown(event, id) {
  // Ultra-responsive immediate touch activation on initial contact
  if (event.pointerType === 'touch' || event.pointerType === 'pen') {
    const now = performance.now();
    if (now - lastDockActivation > 160) {
      lastDockActivation = now;
      go(id);
    }
  }
}
const navHistory = [];

function go(id, isBack = false){
  // Immediately toggle dock button active state for 0ms tactile responsiveness
  const dockBtn = document.querySelector(`.dock-btn-${id}`);
  if (dockBtn) {
    document.querySelectorAll('#dock .dock-btn').forEach(btn => btn.classList.remove('on'));
    dockBtn.classList.add('on');
  }

  playFeedback('click');
  const out = $('#out');
  if (out && S.cachedOut) {
    S.cachedOut[S.tool] = out.innerHTML;
  }
  // Preserve textarea inputs and output before navigating
  const sumInp = document.getElementById('summaryInput');
  if (sumInp) S.summary.text = sumInp.value;
  const sumOut = document.getElementById('summaryOut');
  if (sumOut && sumOut.innerHTML.trim()) S.summary.outHtml = sumOut.innerHTML;
  const sentInp = document.getElementById('sentimentInput');
  if (sentInp) S.sentiment.text = sentInp.value;

  if (id === 'dashboard' || id === 'workspace') {
    id = 'history';
    S.dashboardTab = 'history';
  } else if (id === 'stats') {
    id = 'history';
    S.dashboardTab = 'stats';
  } else if (id === 'history') {
    if (!S.dashboardTab) S.dashboardTab = 'history';
  }

  if (!isBack && S.tool && S.tool !== id) {
    if (navHistory.length === 0 || navHistory[navHistory.length - 1] !== S.tool) {
      navHistory.push(S.tool);
    }
  }
  S.tool = id;
  render();
  window.scrollTo(0, 0);
}

function handleAppBack() {
  const openModal = document.querySelector('.modal-bg.open');
  if (openModal) {
    openModal.classList.remove('open');
    return true;
  }
  if (navHistory.length > 0) {
    const prevTool = navHistory.pop();
    go(prevTool, true);
    return true;
  }
  if (S.tool !== 'corpus') {
    go('corpus', true);
    return true;
  }
  return false;
}
window.handleAppBack = handleAppBack;

/* ---------- render root ---------- */
function render(){
  const hasAndroidBridge = typeof AndroidBridge !== 'undefined' && typeof AndroidBridge.stopSpeaking === 'function';
  if (hasAndroidBridge) {
    AndroidBridge.stopSpeaking();
  } else if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  
  // Dynamic header translation
  const appBarTitle = $('#appbar-title');
  if (appBarTitle) {
    appBarTitle.innerHTML = _t('appTitle', '<span class="brand-fixed">LinguaX</span> <span class="arc-animated">Arc</span>');
  }
  const logoSub = $('#logo-subtitle');
  if (logoSub) {
    logoSub.textContent = _t('logoSub', 'Corpus Toolkit');
  }

  renderDock();
  document.body.setAttribute('data-tab', S.tool || 'corpus');
  const v = $('#view');
  const map = {
    corpus: vCorpus,
    history: vHistory,
    dashboard: vHistory,
    stats: vHistory,
    workspace: vHistory,
    kwic: vKwic,
    plot: vPlot,
    fileview: vFileView,
    cluster: vCluster,
    ngram: vNgram,
    collocate: vColl,
    wordlist: vWordList,
    keyword: vKeyword,
    cloud: vCloud,
    summary: vSummary,
    sentiment: vSentiment,
    settings: vSettings
  };
  v.innerHTML = (map[S.tool] || map['corpus'])();
  afterRender();
}
function afterRender(){
  if (S.tool === 'sentiment' && S.sentiment && S.sentiment.data) {
    CURRENT_SENTIMENT_DATA = S.sentiment.data;
    if (S.sentiment.filter) CURRENT_SENTIMENT_FILTER = S.sentiment.filter;
    renderSentimentResults();
  }
  if (S.cachedOut && S.cachedOut[S.tool]) {
    const out = $('#out');
    if (out) {
      out.innerHTML = S.cachedOut[S.tool];
    }
  }
  const dz = $('#dz');
  if(dz){
    dz.onclick = () => $('#filePick').click();
    ['dragover','dragenter'].forEach(e => dz.addEventListener(e, ev => {ev.preventDefault(); dz.classList.add('over');}));
    ['dragleave','drop'].forEach(e => dz.addEventListener(e, ev => {ev.preventDefault(); dz.classList.remove('over');}));
    dz.addEventListener('drop', ev => readPicked(ev.dataTransfer.files, 'corpus'));
  }
  document.querySelectorAll('input[type=search]').forEach(inp =>
    inp.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); inp.closest('.card').querySelector('.btn.run')?.click(); } }));
}

const SEARCH_TARGETS = [
  { id: 'corpus', keywords: ['corpus', 'corpora', 'files', 'upload', 'file', 'source', 'text', 'doc', 'pdf', 'txt', 'data', 'main', 'home', 'linguistic', 'nlp'] },
  { id: 'history', keywords: ['history', 'analysis history', 'past analyses', 'date', 'log', 'tasks', 'file history', 'analyses performed', 'recent tasks'] },
  { id: 'kwic', keywords: ['kwic', 'concordance', 'search', 'concordancing', 'find', 'context', 'matches', 'word search', 'key word in context', 'lines'] },
  { id: 'plot', keywords: ['plot', 'dispersion', 'distribution', 'barcodes', 'visualize', 'chart', 'frequency plot', 'dispersion plot'] },
  { id: 'fileview', keywords: ['fileview', 'file view', 'read', 'viewer', 'document', 'text view', 'read document'] },
  { id: 'cluster', keywords: ['cluster', 'clusters', 'phrases', 'collocational clusters', 'ngrams list', 'bundle', 'bundles', 'lexical bundles'] },
  { id: 'ngram', keywords: ['ngram', 'ngrams', 'n-grams', 'n-gram', 'sequences', 'patterns', 'word patterns', 'frequency of n-grams'] },
  { id: 'collocate', keywords: ['collocate', 'collocates', 'collocations', 'collocational', 'span', 'mi', 't-score', 'association', 'stats'] },
  { id: 'wordlist', keywords: ['wordlist', 'word list', 'frequency', 'vocab', 'vocabulary', 'count', 'frequencies', 'list'] },
  { id: 'keyword', keywords: ['keyword', 'keywords', 'keyness', 'chi-square', 'log-likelihood', 'comparison', 'key words', 'effect size', 'log ratio'] },
  { id: 'cloud', keywords: ['cloud', 'word cloud', 'tag cloud', 'visualizer', 'wordcloud', 'tagcloud'] },
  { id: 'summary', keywords: ['summary', 'summarizer', 'academic', 'extract', 'abstract', 'brief', 'outline', 'summarize'] },
  { id: 'sentiment', keywords: ['sentiment', 'emotion', 'tone', 'polarity', 'opinion', 'feeling', 'emotions', 'sentiment analysis'] },
  { id: 'workspace', keywords: ['workspace', 'history', 'logs', 'saved', 'past analyses', 'offline storage', 'reports', 'my workspace', 'analysis history', 'recent tasks'] },
  { id: 'settings', keywords: ['settings', 'theme', 'preference', 'preferences', 'languages', 'language', 'export', 'about', 'help', 'config', 'dark mode', 'rate'] }
];

function performQuickNavigation(searchTerm) {
  const query = searchTerm.toLowerCase().trim();
  if (!query) return false;
  
  let matchedTool = null;
  
  // 1. Exact match of tool ID or translated label
  for (const target of SEARCH_TARGETS) {
    const label = _t(target.id, target.id).toLowerCase();
    if (query === target.id || query === label) {
      matchedTool = target;
      break;
    }
  }
  
  // 2. Exact match of keywords
  if (!matchedTool) {
    for (const target of SEARCH_TARGETS) {
      if (target.keywords.includes(query)) {
        matchedTool = target;
        break;
      }
    }
  }
  
  // 3. Partial match (substring) in keywords or labels
  if (!matchedTool) {
    for (const target of SEARCH_TARGETS) {
      const label = _t(target.id, target.id).toLowerCase();
      if (label.includes(query) || target.id.includes(query)) {
        matchedTool = target;
        break;
      }
      const hasPartialKeyword = target.keywords.some(kw => kw.includes(query));
      if (hasPartialKeyword) {
        matchedTool = target;
        break;
      }
    }
  }
  
  if (matchedTool) {
    go(matchedTool.id);
    const friendlyName = _t(matchedTool.id, matchedTool.id);
    toast(`Navigated to: ${friendlyName}`);
    return true;
  }
  return false;
}

const quickSearchOpts = { matchCase: false, wholeWord: true, isRegex: false };

function toggleQuickSearchOpt(optKey) {
  if (optKey in quickSearchOpts) {
    quickSearchOpts[optKey] = !quickSearchOpts[optKey];
    updateQuickSearchOptButtons();
    const input = document.getElementById('quickSearchInput');
    renderQuickSearchSuggestions(input ? input.value : '');
  }
}

function updateQuickSearchOptButtons() {
  const mcBtn = document.getElementById('optMatchCaseBtn');
  if (mcBtn) {
    if (quickSearchOpts.matchCase) mcBtn.classList.add('active');
    else mcBtn.classList.remove('active');
  }
  const wwBtn = document.getElementById('optWholeWordBtn');
  if (wwBtn) {
    if (quickSearchOpts.wholeWord) {
      wwBtn.classList.add('active');
      wwBtn.textContent = 'Exact Word';
    } else {
      wwBtn.classList.remove('active');
      wwBtn.textContent = 'Partial / Substring';
    }
  }
}

function clearQuickSearchInput() {
  const input = document.getElementById('quickSearchInput');
  if (input) {
    input.value = '';
    const clr = document.getElementById('quickSearchClearBtn');
    if (clr) clr.style.display = 'none';
    input.focus();
    renderQuickSearchSuggestions('');
  }
}

function searchWordInModal(word) {
  const input = document.getElementById('quickSearchInput');
  if (input) {
    input.value = word;
    const clr = document.getElementById('quickSearchClearBtn');
    if (clr) clr.style.display = 'block';
    input.focus();
    renderQuickSearchSuggestions(word);
  }
}

function getTopCorpusWords(limit = 8) {
  if (!S.files || !S.files.length) return [];
  const counts = new Map();
  for (const f of S.files) {
    if (!f.toks) continue;
    for (const t of f.toks) {
      const w = t.l;
      if (w && w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w)) {
        counts.set(w, (counts.get(w) || 0) + 1);
      }
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function openSearchInTool(toolId, term, fileIdx = 0, tokenIndex = null) {
  const opts = quickSearchOpts;
  if (toolId === 'kwic') {
    S.q.term = term;
    S.q.cs = !!opts.matchCase;
    S.q.rx = false;
    go('kwic');
    runKwic();
  } else if (toolId === 'plot') {
    S.q.term = term;
    S.q.cs = !!opts.matchCase;
    S.q.rx = false;
    go('plot');
    runPlot();
  } else if (toolId === 'collocate') {
    S.coll.term = term;
    go('collocate');
    runColl();
  } else if (toolId === 'cluster') {
    S.cluster.term = term;
    go('cluster');
    runCluster();
  } else if (toolId === 'fileview') {
    jumpFile(fileIdx !== null && fileIdx !== undefined ? fileIdx : 0, term, tokenIndex);
  } else {
    go(toolId);
  }
  closeQuickSearchModal();
  toast(`Opened in ${_t(toolId, toolId)}`);
}

function openQuickSearchModal() {
  const modal = document.getElementById('searchNavModal');
  if (modal) {
    modal.classList.add('open');
    $('#searchModalIcon').innerHTML = I.search;
    $('#searchModalInputIcon').innerHTML = I.search;
    updateQuickSearchOptButtons();
    const input = document.getElementById('quickSearchInput');
    const clr = document.getElementById('quickSearchClearBtn');
    if (input) {
      input.value = '';
      if (clr) clr.style.display = 'none';
      setTimeout(() => input.focus(), 150);
    }
    renderQuickSearchSuggestions('');
  }
}

function closeQuickSearchModal() {
  const modal = document.getElementById('searchNavModal');
  if (modal) {
    modal.classList.remove('open');
  }
}

function renderQuickSearchSuggestions(query) {
  const container = document.getElementById('quickSearchSuggestions');
  if (!container) return;

  const rawQ = query || '';
  const q = rawQ.trim();
  const hasCorpus = S.files && S.files.length > 0;

  if (!hasCorpus) {
    container.innerHTML = `
      <div style="background: var(--row); border: 1px solid var(--stroke-2); border-radius: 18px; padding: 22px 16px; text-align: center;">
        <div style="display:inline-flex; width:44px; height:44px; border-radius:14px; background:var(--hit-bg); align-items:center; justify-content:center; color:var(--a1); margin-bottom:10px;">
          ${I.folder}
        </div>
        <div style="font-family:'Sora'; font-weight:700; font-size:15px; color:var(--ink); margin-bottom:6px;">No Corpus Files Uploaded</div>
        <div style="font-size:12.5px; color:var(--ink-soft); line-height:1.5; margin-bottom:14px;">
          Please upload your files (.txt, .docx, .pdf) or load the sample corpus to search and count word occurrences.
        </div>
        <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
          <button type="button" class="btn" style="padding:8px 18px; font-size:12.5px; font-weight:700; display:inline-flex; align-items:center; gap:6px;" onclick="loadSampleCorpus(); setTimeout(()=>{renderQuickSearchSuggestions(document.getElementById('quickSearchInput')?.value || '');},350);"><span style="display:inline-flex; width:15px; height:15px;">${I.sparkle}</span> Load Sample Corpus</button>
          <button type="button" class="btn ghost" style="padding:8px 18px; font-size:12.5px; display:inline-flex; align-items:center; gap:6px;" onclick="go('corpus'); closeQuickSearchModal();"><span style="display:inline-flex; width:15px; height:15px;">${I.folder}</span> Open Corpus Tab</button>
        </div>
      </div>
    `;
    return;
  }

  // When search input is empty:
  if (!q) {
    const totals = corpusTotals(S.files);
    const topWords = getTopCorpusWords(12);

    container.innerHTML = `
      <div style="background: var(--row); border: 1px solid var(--stroke-2); border-radius: 16px; padding: 14px 16px; text-align: center;">
        <div style="font-size:13px; font-weight:600; color:var(--ink-soft); margin-bottom:4px;">
          Loaded: <b>${S.files.length}</b> file${S.files.length>1?'s':''} · <b>${(totals.tok || 0).toLocaleString()}</b> total words
        </div>
        <div style="font-size:12px; color:var(--ink-soft);">
          Type any word in the box above to see how many times it appeared.
        </div>
      </div>

      ${topWords.length ? `
        <div style="background:var(--glass-2); border:1px solid var(--stroke-2); border-radius:16px; padding:14px; margin-top:4px;">
          <div style="font-size:12px; font-weight:700; color:var(--ink); margin-bottom:10px; display:flex; align-items:center; gap:6px;">
            <span style="display:inline-flex; width:15px; height:15px; color:var(--a1);">${I.bulb}</span> Frequent Words in Corpus (Tap to count):
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${topWords.map(([w, cnt]) => `
              <span class="corpus-word-chip" style="cursor:pointer; padding:6px 12px; border-radius:10px; background:var(--row); border:1px solid var(--stroke-2); font-size:12.5px; font-weight:600; color:var(--ink); display:inline-flex; align-items:center; gap:6px;" onclick="searchWordInModal('${esc(w)}')">
                ${esc(w)} <b class="chip-badge" style="color:var(--a1); font-weight:800;">${cnt.toLocaleString()}</b>
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
    return;
  }

  // User entered a word! Calculate exact frequency:
  let searchRes = executeCorpusSearch(q, false, true);
  let isSubstringFallback = false;
  if (searchRes.totalCount === 0 && !q.includes('*') && !q.includes('?')) {
    const partialRes = executeCorpusSearch(q, false, false);
    if (partialRes.totalCount > 0) {
      searchRes = partialRes;
      isSubstringFallback = true;
    }
  }

  const { totalCount, fileHits } = searchRes;
  const numFiles = Object.keys(fileHits).length;

  if (totalCount > 0) {
    container.innerHTML = `
      <div style="background:var(--card-glow-bg); border:2px solid var(--a1); border-radius:20px; padding:28px 18px; text-align:center; box-shadow:0 8px 30px rgba(0,0,0,0.12); margin:4px 0;">
        <div style="font-size:12.5px; font-weight:800; color:var(--ink-soft); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">
          Total Count for <span style="color:var(--ink); font-weight:900;">“${esc(q)}”</span>
        </div>
        <div style="font-size:64px; font-weight:900; color:var(--a1); line-height:1; margin:12px 0; font-family:'Sora',sans-serif;">
          ${totalCount.toLocaleString()}
        </div>
        <div style="font-size:16px; font-weight:800; color:var(--ink);">
          ${totalCount === 1 ? '1 Occurrence' : `${totalCount.toLocaleString()} Occurrences`}
          ${isSubstringFallback ? '<span style="font-size:12.5px; font-weight:500; color:var(--ink-soft); display:block; margin-top:2px;">(Partial match)</span>' : ''}
        </div>

        ${numFiles > 1 ? `
          <div style="margin-top:18px; padding-top:14px; border-top:1px solid var(--stroke-2);">
            <div style="font-size:11px; font-weight:700; color:var(--ink-soft); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">Breakdown by File:</div>
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px;">
              ${Object.entries(fileHits).map(([fi, cnt]) => `
                <span style="font-size:12px; padding:5px 12px; border-radius:10px; background:var(--row); border:1px solid var(--stroke-2); color:var(--ink); display:inline-flex; align-items:center; gap:5px;">
                  <span style="display:inline-flex; width:13px; height:13px;">${I.file}</span> ${esc(S.files[+fi]?.name || 'File '+(+fi+1))}: <b style="color:var(--a1); font-weight:800;">${cnt.toLocaleString()} ${cnt === 1 ? 'hit' : 'hits'}</b>
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="background:var(--row); border:1px solid var(--stroke-2); border-radius:20px; padding:28px 18px; text-align:center; margin:4px 0;">
        <div style="font-size:52px; font-weight:900; color:var(--ink-soft); line-height:1; margin-bottom:8px;">0</div>
        <div style="font-size:16px; font-weight:800; color:var(--ink); margin-bottom:4px;">No Occurrences Found</div>
        <div style="font-size:13px; color:var(--ink-soft);">Word “${esc(q)}” was not found in the corpus (0 occurrences).</div>
      </div>
    `;
  }
}

function navigateFromQuickSearch(id) {
  go(id);
  const friendlyName = _t(id, id);
  toast(`Navigated to: ${friendlyName}`);
  closeQuickSearchModal();
}

function executeCorpusSearch(query, matchCase, wholeWord) {
  const q = (query || '').trim();
  if (!q || !S.files || !S.files.length) {
    return { totalCount: 0, fileHits: {}, hits: [] };
  }

  const isMultiWord = /\s+/.test(q);
  const hasWildcard = q.includes('*') || q.includes('?');
  const hits = [];
  const fileHits = {};
  let totalCount = 0;

  if (isMultiWord || hasWildcard) {
    let regex = null;
    try {
      if (hasWildcard) {
        const pat = q.replace(/[-/\\^$+.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
        regex = new RegExp(wholeWord ? ('(?:^|[^\\p{L}\\p{N}_])(' + pat + ')(?=[^\\p{L}\\p{N}_]|$)') : pat, matchCase ? 'gu' : 'giu');
      } else if (wholeWord) {
        const escaped = q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
        regex = new RegExp('(?:^|[^\\p{L}\\p{N}_])(' + escaped + ')(?=[^\\p{L}\\p{N}_]|$)', matchCase ? 'gu' : 'giu');
      } else {
        const escaped = q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
        regex = new RegExp(escaped, matchCase ? 'gu' : 'giu');
      }
    } catch(e) {
      const escaped = q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
      regex = new RegExp(escaped, matchCase ? 'g' : 'gi');
    }

    for (let fi = 0; fi < S.files.length; fi++) {
      const file = S.files[fi];
      const text = file.text || '';
      if (!text) continue;
      let countInFile = 0;
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(text)) !== null) {
        countInFile++;
        totalCount++;
        if (hits.length < 50) {
          let matchStart = m.index;
          let matchStr = m[0];
          if (m.length > 1 && m[1] !== undefined) {
            matchStart = m.index + m[0].indexOf(m[1]);
            matchStr = m[1];
          }
          const leftStart = Math.max(0, matchStart - 45);
          const leftText = text.substring(leftStart, matchStart).replace(/[\r\n\t]+/g, ' ');
          const rightEnd = Math.min(text.length, matchStart + matchStr.length + 45);
          const rightText = text.substring(matchStart + matchStr.length, rightEnd).replace(/[\r\n\t]+/g, ' ');

          let tokIndex = 0;
          if (file.toks && file.toks.length) {
            let low = 0, high = file.toks.length - 1;
            while (low <= high) {
              const mid = (low + high) >> 1;
              if (file.toks[mid].s <= matchStart) {
                tokIndex = mid;
                low = mid + 1;
              } else {
                high = mid - 1;
              }
            }
          }

          hits.push({
            f: fi,
            i: tokIndex,
            w: matchStr,
            left: leftText,
            node: matchStr,
            right: rightText
          });
        }
        if (m.index === regex.lastIndex) regex.lastIndex++;
      }
      if (countInFile > 0) fileHits[fi] = countInFile;
    }
  } else {
    // Single word: test against file.toks for speed and precision, and fall back to file.text if toks are empty
    const needle = matchCase ? q : q.toLowerCase();
    const testFn = wholeWord
      ? (w => (matchCase ? w : w.toLowerCase()) === needle)
      : (w => (matchCase ? w : w.toLowerCase()).includes(needle));

    for (let fi = 0; fi < S.files.length; fi++) {
      const file = S.files[fi];
      const toks = file.toks || [];
      if (!toks.length) {
        const text = file.text || '';
        if (!text) continue;
        let regex;
        try {
          regex = new RegExp(wholeWord ? ('(?:^|[^\\p{L}\\p{N}_])(' + q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ')(?=[^\\p{L}\\p{N}_]|$)') : q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), matchCase ? 'gu' : 'giu');
        } catch(e) {
          regex = new RegExp(q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), matchCase ? 'g' : 'gi');
        }
        let m;
        let countInFile = 0;
        while ((m = regex.exec(text)) !== null) {
          countInFile++;
          totalCount++;
          if (hits.length < 50) {
            let mStart = m.index;
            let mStr = m[0];
            if (m.length > 1 && m[1] !== undefined) {
              mStart = m.index + m[0].indexOf(m[1]);
              mStr = m[1];
            }
            hits.push({
              f: fi,
              i: 0,
              w: mStr,
              left: text.substring(Math.max(0, mStart - 45), mStart).replace(/[\r\n\t]+/g, ' '),
              node: mStr,
              right: text.substring(mStart + mStr.length, Math.min(text.length, mStart + mStr.length + 45)).replace(/[\r\n\t]+/g, ' ')
            });
          }
          if (m.index === regex.lastIndex) regex.lastIndex++;
        }
        if (countInFile > 0) fileHits[fi] = countInFile;
        continue;
      }

      let countInFile = 0;
      for (let ti = 0; ti < toks.length; ti++) {
        const tok = toks[ti];
        if (testFn(tok.w) || (!matchCase && testFn(tok.l))) {
          totalCount++;
          countInFile++;
          if (hits.length < 50) {
            const c = 5;
            const L = toks.slice(Math.max(0, ti - c), ti).map(t => t.w).join(' ');
            const R = toks.slice(ti + 1, Math.min(toks.length, ti + 1 + c)).map(t => t.w).join(' ');
            hits.push({
              f: fi,
              i: ti,
              w: tok.w,
              left: L,
              node: tok.w,
              right: R
            });
          }
        }
      }
      if (countInFile > 0) fileHits[fi] = countInFile;
    }
  }

  return { totalCount, fileHits, hits };
}

function handleQuickSearchSubmit(event) {
  if (event) event.preventDefault();
  const input = document.getElementById('quickSearchInput');
  const val = input ? input.value.trim() : '';
  if (!val) return;
  renderQuickSearchSuggestions(val);
}

function handleQuickSearchKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleQuickSearchSubmit(event);
  }
}

let _quickSearchDebounceTimer = null;
function handleQuickSearchInput(event) {
  const val = event.target.value;
  const clr = document.getElementById('quickSearchClearBtn');
  if (clr) clr.style.display = val.trim() ? 'block' : 'none';
  if (_quickSearchDebounceTimer) clearTimeout(_quickSearchDebounceTimer);
  _quickSearchDebounceTimer = setTimeout(() => {
    renderQuickSearchSuggestions(val);
  }, 100);
}
/* ================= TOOL VIEWS ================= */

/* ---------- Corpus manager ---------- */

/* ---------- General Welcome Banner Controller (✕ dismiss & 10s auto-fade) ---------- */
function dismissWelcomeBanner() {
  const card = document.getElementById('welcomeBannerCard');
  if (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(-10px) scale(0.98)';
    card.style.maxHeight = '0';
    card.style.paddingTop = '0';
    card.style.paddingBottom = '0';
    card.style.marginBottom = '0';
    try {
      sessionStorage.setItem('linguax_welcome_banner_dismissed', 'true');
    } catch(e) {}
    setTimeout(() => {
      try { card.remove(); } catch(e) {}
    }, 500);
  }
}

function vCorpus(){
  const t = corpusTotals(S.files), r = corpusTotals(S.ref);
  const textStats = S.files.length ? corpusTextStats(S.files) : { sentences: 0, punctTotal: 0 };
  const pos = S.files.length ? analyzeCorpusPOS(S.files) : null;
  const punct = S.files.length ? analyzeCorpusPunctuation(S.files) : null;

  const fileRows = arr => arr.map((f,i) => {
    const sCnt = (f._sCnt !== undefined) ? f._sCnt : (f._sCnt = countSentences(f.text || ''));
    const pCnt = (f._pCnt !== undefined) ? f._pCnt : (f._pCnt = punctBreakdown(f.text || '').total);
    const tokCount = (f.toks ? f.toks.length : 0);
    return `
    <div class="filerow"><div class="fname" title="${esc(f.name)}">${esc(f.name)}</div>
      <div class="fmeta"><b>${tokCount.toLocaleString()}</b> words &middot; <b>${sCnt.toLocaleString()}</b> sentences &middot; <b>${pCnt.toLocaleString()}</b> punct</div>
      <button class="del" onclick="promptDelSingleFile(${i}, '${arr===S.ref?'ref':'main'}')" aria-label="Remove file">${I.trash}</button></div>`;
  }).join('');

  return `
  <!-- Unified Welcome & Institutional Trust Card with Integrated Learn More -->
  <section class="card glass welcome-banner-card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.03)), var(--card); border: 1.5px solid var(--stroke-2); border-radius: 22px; padding: 22px 22px 18px 22px; margin-bottom: 16px; box-shadow: 0 4px 22px rgba(0, 0, 0, 0.06);">
    <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); width: 220px; height: 100px; background: radial-gradient(circle, var(--a1) 0%, transparent 70%); opacity: 0.16; filter: blur(24px); pointer-events: none;"></div>

    <!-- Centered Header in One Clean Line -->
    <div style="text-align: center; margin-bottom: 6px;">
      <h3 style="margin: 0; font-family: 'Sora', sans-serif; font-size: 17.5px; font-weight: 800; color: var(--ink); letter-spacing: -0.015em; white-space: nowrap;">
        Welcome to LinguaX Arc
      </h3>
    </div>

    <!-- Centered Sleek Light Green Pill with Pulsing Green LED Diode: 100% Trusted Offline -->
    <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 14px;">
      <span class="on-device-pill-green">
        <span class="pulsing-green-led"></span>
        100% Trusted Offline
      </span>
    </div>

    <!-- Justified Formatting for Welcome Message Paragraph -->
    <p style="margin: 0 0 14px 0; font-family: 'Merriweather', 'Georgia', serif; font-size: 13.5px; line-height: 1.85; color: var(--ink); opacity: 0.95; text-align: justify; text-justify: inter-word;">
      Built under open academic standards adhering to the <b>Massachusetts Institute of Technology (MIT) License</b> and <b>Apache 2.0 License</b> frameworks. LinguaX Arc is trusted worldwide across universities, research laboratories, and linguistic scholars for high-precision corpus linguistics, KWIC concordance, and complete local privacy.
    </p>

    <!-- Bottom Action Row: Version 6.0 Badge on Left, Transparent Learn More Button on Far-Right -->
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding-top: 10px; border-top: 1px dashed var(--stroke);">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: var(--ink); background: var(--row); border: 1px solid var(--stroke-2); padding: 3px 9px; border-radius: 8px; display: inline-flex; align-items: center; gap: 5px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width: 12px; height: 12px; color: var(--a1);"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          LinguaX Arc v6.0
        </span>
      </div>

      <!-- Lower-Right Corner Transparent "Learn More" Button -->
      <button type="button" class="welcome-learn-more-trans" onclick="openHelpModal()" title="Open Features Guide and Study Notes">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 13px; height: 13px; color: var(--a1);"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
        <span>Learn More</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 12px; height: 12px; opacity: 0.6;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  </section>

  <section class="card glass">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; flex-wrap:wrap; gap:8px;">
      <h2 style="margin:0;">${I.folder} Corpus files</h2>
    </div>
    <p class="sub">Add .txt, .docx, or .pdf files to build your target corpus. Everything is processed entirely on your device.</p>
    <div class="dropzone" id="dz"><b>Tap to add .txt, .docx, or .pdf files</b><br>or drag and drop them here</div>
    <div class="controls" style="margin-top:12px">
      <button class="btn" onclick="document.getElementById('filePick').click()">Add files</button>
      <button class="btn ghost" onclick="loadSample()">Load sample corpus</button>
      ${S.files.length ? `<button class="btn ghost" style="color:var(--danger, #ef4444); display:inline-flex; align-items:center; gap:6px;" onclick="promptClearCorpusFiles()" title="Clear all loaded corpus files">${I.trash} Clear all</button>`:''}
    </div>

    ${S.files.length ? `<div style="margin-top:10px">${fileRows(S.files)}</div>` : ''}
  </section>

  ${S.files.length ? `
  <!-- Prominent Basic Corpus Metadata Section -->
  <section class="card glass" style="background: var(--card-glow-bg); border: 1.5px solid var(--stroke); padding: 18px 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.16);">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
      <h2 style="margin:0; display:flex; align-items:center; gap:8px; font-size:16px;">
        <span style="display:inline-flex; width:22px; height:22px; color:var(--a1);">${I.doc}</span>
        Basic Corpus Metadata
      </h2>
      <span style="font-size:11px; font-weight:700; padding:4px 10px; border-radius:8px; background:var(--a1-focus); border:1px solid var(--stroke-2); color:var(--a1); font-family:'JetBrains Mono', monospace;">
        ${S.files.length} ${S.files.length === 1 ? 'FILE' : 'FILES'} LOADED
      </span>
    </div>
    <p class="sub" style="margin-bottom:14px;">Essential volume, structural metrics, and vocabulary overview across your loaded documents.</p>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
      <!-- Words (Tokens) -->
      <div style="background:var(--row); border:1.5px solid var(--stroke-2); border-radius:14px; padding:14px 16px; display:flex; flex-direction:column; gap:6px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span style="font-size:11px; font-weight:700; color:var(--ink-soft); text-transform:uppercase; letter-spacing:0.05em;">Words (Tokens)</span>
          <span style="display:inline-flex; width:14px; height:14px; color:var(--a1);">${I.list}</span>
        </div>
        <div style="font-family:'JetBrains Mono', monospace; font-size:22px; font-weight:900; color:var(--a1); letter-spacing:-0.02em;">
          ${t.tok.toLocaleString()}
        </div>
        <div style="font-size:10px; color:var(--ink-soft); font-weight:600;">Total running words</div>
      </div>

      <!-- Sentences -->
      <div style="background:var(--row); border:1.5px solid var(--stroke-2); border-radius:14px; padding:14px 16px; display:flex; flex-direction:column; gap:6px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span style="font-size:11px; font-weight:700; color:var(--ink-soft); text-transform:uppercase; letter-spacing:0.05em;">Sentences</span>
          <span style="display:inline-flex; width:14px; height:14px; color:#10b981;">${I.sparkle}</span>
        </div>
        <div style="font-family:'JetBrains Mono', monospace; font-size:22px; font-weight:900; color:#10b981; letter-spacing:-0.02em;">
          ${textStats.sentences.toLocaleString()}
        </div>
        <div style="font-size:10px; color:var(--ink-soft); font-weight:600;">Sentence units</div>
      </div>

      <!-- Punctuation -->
      <div style="background:var(--row); border:1.5px solid var(--stroke-2); border-radius:14px; padding:14px 16px; display:flex; flex-direction:column; gap:6px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span style="font-size:11px; font-weight:700; color:var(--ink-soft); text-transform:uppercase; letter-spacing:0.05em;">Punctuation</span>
          <span style="display:inline-flex; width:14px; height:14px; color:#f59e0b;">${I.search}</span>
        </div>
        <div style="font-family:'JetBrains Mono', monospace; font-size:22px; font-weight:900; color:#f59e0b; letter-spacing:-0.02em;">
          ${textStats.punctTotal.toLocaleString()}
        </div>
        <div style="font-size:10px; color:var(--ink-soft); font-weight:600;">Punctuation marks</div>
      </div>

      <!-- Vocabulary (Types) -->
      <div style="background:var(--row); border:1.5px solid var(--stroke-2); border-radius:14px; padding:14px 16px; display:flex; flex-direction:column; gap:6px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span style="font-size:11px; font-weight:700; color:var(--ink-soft); text-transform:uppercase; letter-spacing:0.05em;">Vocabulary</span>
          <span style="display:inline-flex; width:14px; height:14px; color:#a855f7;">${I.key}</span>
        </div>
        <div style="font-family:'JetBrains Mono', monospace; font-size:22px; font-weight:900; color:#a855f7; letter-spacing:-0.02em;">
          ${t.types.toLocaleString()}
        </div>
        <div style="font-size:10px; color:var(--ink-soft); font-weight:600;">Unique word types</div>
      </div>
    </div>
  </section>` : ''}

  ${!S.files.length ? `
  <!-- Empty State Prompt -->
  <section class="card glass" style="border: 1.5px dashed var(--stroke); padding: 24px; text-align: center; margin-top: 14px; background: var(--card-glow-bg);">
    <div style="width: 48px; height: 48px; border-radius: 14px; background: var(--a1-focus); color: var(--a1); display: grid; place-items: center; margin: 0 auto 10px;">
      <span style="display:inline-flex; width:22px; height:22px; color:var(--a1);">${I.donut}</span>
    </div>
    <h3 style="font-family: 'Sora'; font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 6px;">
      Parts of Speech (POS) Distribution
    </h3>
    <p style="font-size: 12px; color: var(--ink-soft); max-width: 440px; margin: 0 auto 14px; line-height: 1.5;">
      Load the sample corpus or upload your documents to view the grammatical POS Donut chart.
    </p>
    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
      <button type="button" class="btn" onclick="loadSample()" style="padding: 9px 18px; font-size: 12.5px; font-weight: 700; display: inline-flex; align-items: center; gap: 7px;">
        <span style="display:inline-flex; width:14px; height:14px;">${I.sparkle}</span> Load Sample Corpus
      </button>
      <button type="button" class="btn ghost" onclick="document.getElementById('filePick').click()" style="padding: 9px 16px; font-size: 12.5px; display: inline-flex; align-items: center; gap: 7px;">
        <span style="display:inline-flex; width:14px; height:14px;">${I.folder}</span> Upload Files
      </button>
    </div>
  </section>` : ''}

  ${pos ? `
  <!-- Parts of Speech (POS) Distribution as Verified Histogram -->
  <section class="card glass pos-chart-card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
      <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--a1)" stroke-width="2.3">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        Parts of Speech (POS) Histogram
      </h2>
      <button type="button" class="btn glass" onclick="savePOSHistogramToGallery()" style="display:inline-flex; align-items:center; gap:7px; padding:6px 14px; font-size:12px; font-weight:700; border-radius:10px; background:linear-gradient(135deg, rgba(14,165,233,0.18), rgba(99,102,241,0.18)); border:1.5px solid rgba(56,189,248,0.4); color:var(--ink); cursor:pointer; box-shadow:0 2px 8px rgba(14,165,233,0.15);" title="Save POS Histogram to Gallery (One Click)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>Save to Gallery</span>
      </button>
    </div>
    <p class="sub" style="margin-bottom:12px;">Grammatical category distribution across your corpus as a verified histogram.</p>

    <!-- Verified POS Histogram with Interactive Highlighting & Watermark -->
    ${drawPOSHistogram(pos)}
  </section>` : ''}

  ${punct && punct.totalPunct > 0 ? `
  <!-- Punctuation Distribution as Verified Pyramid Hierarchy with Watermark & Gallery Save -->
  <section class="card glass pos-chart-card punct-chart-card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
      <h2 style="margin:0; display:flex; align-items:center; gap:8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.3">
          <polygon points="12 2 22 22 2 22"/>
          <line x1="7" y1="12" x2="17" y2="12"/>
          <line x1="4.5" y1="17" x2="19.5" y2="17"/>
        </svg>
        Punctuation Pyramid Hierarchy
      </h2>
      <button type="button" class="btn glass" onclick="savePunctuationPyramidToGallery()" style="display:inline-flex; align-items:center; gap:7px; padding:6px 14px; font-size:12px; font-weight:700; border-radius:10px; background:linear-gradient(135deg, rgba(245,158,11,0.18), rgba(239,68,68,0.18)); border:1.5px solid rgba(245,158,11,0.45); color:var(--ink); cursor:pointer; box-shadow:0 2px 8px rgba(245,158,11,0.15);" title="Save Punctuation Pyramid image to Gallery with Watermark">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>Save to Gallery</span>
      </button>
    </div>
    <p class="sub" style="margin-bottom:12px;">Hierarchical frequency tiers of punctuation marks across your corpus.</p>

    <!-- Verified Punctuation Pyramid & Watermark -->
    ${drawPunctuationPyramid(punct)}
  </section>` : ''}

  <!-- Reference Corpus Card -->
  <section class="card glass">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; flex-wrap:wrap; gap:8px;">
      <div>
        <h2 style="margin:0; display:flex; align-items:center; gap:8px;">${I.key} Reference Corpus</h2>
        <p style="margin:3px 0 0 0; font-size:11.5px; color:var(--ink-soft); font-weight:500;">For keyword keyness comparison</p>
      </div>
      ${S.ref.length && S.files.length ? `
        <span style="font-size:11px; font-weight:700; padding:4px 10px; border-radius:8px; background:var(--row-alt); border:1px solid var(--stroke-2); color:var(--ok, #10b981); font-family:'JetBrains Mono';">
          Ratio 1 : ${(r.tok / Math.max(1, t.tok)).toFixed(2)} (Keyness Ready)
        </span>
      ` : ''}
    </div>
    <p class="sub" style="margin-top:6px;">A baseline reference corpus used to compute statistical keyness (Log-Likelihood G² and Chi-Square). ${S.ref.length? `${S.ref.length} file(s) · ${r.tok.toLocaleString()} tokens · ${r.types.toLocaleString()} types.`:'None loaded yet.'}</p>
    <div class="controls">
      <button class="btn ghost" onclick="document.getElementById('refPick').click()">Add reference files</button>
      <button class="btn ghost" onclick="loadSampleRef()">Load sample reference</button>
      ${S.ref.length ? `<button class="btn ghost" style="color:var(--danger, #ef4444); display:inline-flex; align-items:center; gap:6px;" onclick="promptClearRefFiles()" title="Clear reference corpus files">${I.trash} Clear all</button>`:''}
    </div>
    ${S.ref.length ? fileRows(S.ref) : ''}
  </section>`;
}
async function delFile(i, which){
  const arr = which==='ref'?S.ref:S.files;
  const item = arr.splice(i,1)[0];
  if(item) {
    await removeFileFromStorage(which==='ref'?'ref':'main', item.name);
    await removeFileFromStorage(which==='ref'?'ref':'corpus', item.name);
  }
  clearTabCache();
  render();
}
async function clearFiles(which){
  if(which==='ref') {
    S.ref=[];
    await clearStorageFiles('ref');
  } else {
    S.files=[];
    await clearStorageFiles('main');
    await clearStorageFiles('corpus');
  }
  clearTabCache();
  render();
}
function loadSample(){ addTexts(SAMPLES.map(([name,text])=>({name,text})), 'main'); }
function loadSampleCorpus(){ loadSample(); }
window.loadSampleCorpus = loadSampleCorpus;
function loadSampleRef(){ addTexts([{name:SAMPLE_REF[0], text:SAMPLE_REF[1]}], 'ref'); }

/* ---------- shared search controls ---------- */
function searchBar(runFn, term, cs, rx, extra=''){
  const historyHtml = renderHistoryChips('q', runFn);
  return `<div class="controls">
    <div class="search-row" style="position:relative;">
      <div class="suggest-container">
        <input type="search" id="q" placeholder="Search term (use * ? wildcards)" value="${esc(term)}" oninput="handleSearchInput(this)" onkeydown="handleSearchKey(event, '${runFn}')">
        <div id="suggest-box" class="suggest-box" style="display:none;"></div>
      </div>
      <button class="btn run btn-analyze" onclick="${runFn}">Analyze</button>
    </div>
    <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center">
      <span class="chip ${cs?'on':''}" onclick="this.classList.toggle('on')" data-opt="cs">Case sensitive</span>
      <span class="chip ${rx?'on':''}" onclick="this.classList.toggle('on')" data-opt="rx">Regex</span>
    </div>
    ${extra}
    ${historyHtml}
  </div>`;
}
function saveSearchHistory(term){
  if(!S.settings.recordHistory) return;
  if(!term || !term.trim()) return;
  const t = term.trim();
  if(!S.history) S.history = [];
  S.history = S.history.filter(h => h !== t);
  S.history.unshift(t);
  if(S.history.length > 5) S.history.pop();
  try{ localStorage.setItem('linguax_history', JSON.stringify(S.history)); }catch(e){}
}
function loadSearchHistory(){
  if(!S.settings.recordHistory) {
    S.history = [];
    return;
  }
  try{
    const saved = localStorage.getItem('linguax_history');
    if(saved) S.history = JSON.parse(saved);
  }catch(e){}
  if(!S.history) S.history = [];
}
function renderHistoryChips(targetInputId, runFnName){
  if(!S.history || !S.history.length) return '';
  const chips = S.history.map(h => 
    `<span class="chip history-chip" onclick="applyHistorySearch('${targetInputId}', '${esc(h).replace(/'/g,"\\'")}', ${runFnName})">${esc(h)}</span>`
  ).join('');
  return `<div class="history-chips-row" style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap; align-items:center">
    <span style="font-size:11px; color:var(--ink-soft); font-weight:600">Recent:</span>
    ${chips}
  </div>`;
}
function applyHistorySearch(inputId, val, runFn){
  const input = document.getElementById(inputId);
  if(input) {
    input.value = val;
    runFn();
  }
}
function readOpts(){
  S._cs = !!document.querySelector('[data-opt=cs].on');
  S._rx = !!document.querySelector('[data-opt=rx].on');
  return [$('#q').value, S._cs, S._rx];
}

let kwicAnimationFrames = [];

function stopAllKwicScrollAnimations() {
  kwicAnimationFrames.forEach(id => {
    try { cancelAnimationFrame(id); } catch(e) {}
  });
  kwicAnimationFrames = [];
}

function animateKwicScrollHint(wrap, centerScroll, startDelay = 0) {
  const maxScroll = wrap.scrollWidth - wrap.clientWidth;
  if (maxScroll <= 15) return;

  const peekRight = Math.min(240, Math.max(30, maxScroll - centerScroll));
  const peekLeft = Math.min(240, Math.max(30, centerScroll));
  if (peekRight < 15 && peekLeft < 15) return;

  let startTimestamp = null;
  let isCancelled = false;

  const cancelHandler = () => {
    isCancelled = true;
    wrap.removeEventListener('touchstart', cancelHandler);
    wrap.removeEventListener('mousedown', cancelHandler);
    wrap.removeEventListener('wheel', cancelHandler);
  };
  wrap.addEventListener('touchstart', cancelHandler, { passive: true });
  wrap.addEventListener('mousedown', cancelHandler, { passive: true });
  wrap.addEventListener('wheel', cancelHandler, { passive: true });

  const totalDuration = 2200;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function frame(timestamp) {
    if (isCancelled) return;
    if (!startTimestamp) startTimestamp = timestamp;
    const elapsed = timestamp - startTimestamp;

    if (elapsed < startDelay) {
      const animId = requestAnimationFrame(frame);
      kwicAnimationFrames.push(animId);
      return;
    }

    const t = Math.min(1, (elapsed - startDelay) / totalDuration);
    let target = centerScroll;

    if (t < 0.28) {
      // Smoothly glide right to peek right context
      const p = easeInOutCubic(t / 0.28);
      target = centerScroll + peekRight * p;
    } else if (t < 0.38) {
      // Hold right peek so words can be read
      target = centerScroll + peekRight;
    } else if (t < 0.72) {
      // Smoothly glide all the way across center to left context
      const p = easeInOutCubic((t - 0.38) / (0.72 - 0.38));
      target = (centerScroll + peekRight) - (peekRight + peekLeft) * p;
    } else if (t < 0.82) {
      // Hold left peek so words can be read
      target = centerScroll - peekLeft;
    } else {
      // Smoothly return and settle in the center
      const p = easeInOutCubic((t - 0.82) / (1.0 - 0.82));
      target = (centerScroll - peekLeft) + peekLeft * p;
    }

    wrap.scrollLeft = target;

    if (t < 1) {
      const animId = requestAnimationFrame(frame);
      kwicAnimationFrames.push(animId);
    } else {
      wrap.scrollLeft = centerScroll;
      wrap.removeEventListener('touchstart', cancelHandler);
      wrap.removeEventListener('mousedown', cancelHandler);
      wrap.removeEventListener('wheel', cancelHandler);
    }
  }

  const animId = requestAnimationFrame(frame);
  kwicAnimationFrames.push(animId);
}

function centerKwicLinesAndHint() {
  stopAllKwicScrollAnimations();
  const wraps = document.querySelectorAll('.kwic-scroll-wrap');
  wraps.forEach((wrap, idx) => {
    const node = wrap.querySelector('.knode');
    if (node) {
      const nodeCenter = node.offsetLeft + (node.offsetWidth / 2);
      const wrapCenter = wrap.clientWidth / 2;
      const targetScroll = Math.max(0, nodeCenter - wrapCenter);
      wrap.scrollLeft = targetScroll;
      wrap.dataset.centerScroll = targetScroll;

      // Automatically run subtle peek hint once on the first row
      if (idx === 0 && !window._kwicHintAnimatedOnce) {
        window._kwicHintAnimatedOnce = true;
        animateKwicScrollHint(wrap, targetScroll, 160);
      }
    }
  });
}

function centerAllKwic() {
  stopAllKwicScrollAnimations();
  const wraps = document.querySelectorAll('.kwic-scroll-wrap');
  wraps.forEach(wrap => {
    const node = wrap.querySelector('.knode');
    let target = +wrap.dataset.centerScroll || 0;
    if (node) {
      const nodeCenter = node.offsetLeft + (node.offsetWidth / 2);
      const wrapCenter = wrap.clientWidth / 2;
      target = Math.max(0, nodeCenter - wrapCenter);
      wrap.dataset.centerScroll = target;
    }
    wrap.scrollTo({ left: target, behavior: 'smooth' });
  });
}

function peekAllKwic(dir) {
  stopAllKwicScrollAnimations();
  const wraps = document.querySelectorAll('.kwic-scroll-wrap');
  wraps.forEach(wrap => {
    const center = +wrap.dataset.centerScroll || 0;
    const maxScroll = wrap.scrollWidth - wrap.clientWidth;
    const target = dir === 'left' ? Math.max(0, center - 220) : Math.min(maxScroll, center + 220);
    wrap.scrollTo({ left: target, behavior: 'smooth' });
  });
}

function centerAllKwic() {
  stopAllKwicScrollAnimations();
  const wraps = document.querySelectorAll('.kwic-scroll-wrap');
  wraps.forEach(wrap => {
    const center = +wrap.dataset.centerScroll || 0;
    wrap.scrollTo({ left: center, behavior: 'smooth' });
  });
}

let kwicAllSentencesOpen = false;
function toggleAllKwicSentences() {}

function toggleKwicFullSentence(k) {
  const drawer = document.getElementById(`kwic-full-sentence-${k}`);
  const lbl = document.getElementById(`kwic-btn-lbl-${k}`);
  if (!drawer) return;
  const isHidden = drawer.style.display === 'none';
  if (isHidden) {
    const body = drawer.querySelector('.kwic-full-sentence-body');
    if (body) {
      const fileIdx = +drawer.dataset.fileIdx;
      const tokIdx = +drawer.dataset.tokIdx;
      const hitLen = +drawer.dataset.hitLen || 1;
      const fileObj = (S.files && !isNaN(fileIdx) && S.files[fileIdx]) ? S.files[fileIdx] : null;
      body.innerHTML = getFullSentenceForHit(fileObj, tokIdx, hitLen);
    }
    drawer.style.display = 'block';
    if (lbl) lbl.textContent = 'Hide Sentence ▴';
  } else {
    drawer.style.display = 'none';
    if (lbl) lbl.textContent = 'Full Sentence ▾';
  }
}

function handleKwicRowClick(event, k) {
  // Clicks handled cleanly without drawer opening
}

function copyKwicSentence(k) {
  const drawer = document.getElementById(`kwic-full-sentence-${k}`);
  if (!drawer) return;
  const body = drawer.querySelector('.kwic-full-sentence-body');
  if (!body) return;
  const text = (body.textContent || body.innerText || '').trim();
  if (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }
}

function getFullSentenceForHit(fileObj, tokenIdx, hitLen = 1) {
  if (!fileObj) {
    return '<span style="color:var(--ink-soft); font-style:italic;">Sentence context not available</span>';
  }
  const toks = fileObj.toks || [];
  const text = fileObj.text || '';
  const matchLen = Math.max(1, hitLen || 1);

  if (!toks.length || tokenIdx === undefined || tokenIdx === null || tokenIdx < 0 || tokenIdx >= toks.length) {
    const rawText = (text || '').trim();
    if (rawText) {
      return esc(rawText.slice(0, 320)) + (rawText.length > 320 ? '...' : '');
    }
    return '<span style="color:var(--ink-soft); font-style:italic;">No sentence context available</span>';
  }

  const hitTok = toks[tokenIdx];
  const matchedTokens = toks.slice(tokenIdx, tokenIdx + matchLen);
  const targetWord = matchedTokens.map(t => t.w).join(' ') || (hitTok ? hitTok.w : '');

  // 1. Try precise sentence extraction from raw source document text
  if (text && text.length > 0) {
    let charIdx = (hitTok && typeof hitTok.s === 'number') ? hitTok.s : -1;

    // Realignment check: verify if text[charIdx] matches hitTok.w
    if (charIdx >= 0 && hitTok && hitTok.w) {
      const expectedWord = hitTok.w;
      if (text.substring(charIdx, charIdx + expectedWord.length) !== expectedWord) {
        const searchNear = text.indexOf(expectedWord, Math.max(0, charIdx - 160));
        if (searchNear !== -1 && Math.abs(searchNear - charIdx) < 320) {
          charIdx = searchNear;
        } else {
          const directFind = text.indexOf(expectedWord);
          if (directFind !== -1) charIdx = directFind;
        }
      }
    } else if (hitTok && hitTok.w) {
      const found = text.indexOf(hitTok.w);
      if (found !== -1) charIdx = found;
    }

    if (charIdx >= 0 && charIdx < text.length) {
      const lastMatchedTok = matchedTokens[matchedTokens.length - 1] || hitTok;
      let hitCharEnd = (lastMatchedTok && typeof lastMatchedTok.s === 'number' && lastMatchedTok.s >= 0)
        ? (lastMatchedTok.s + (lastMatchedTok.w ? lastMatchedTok.w.length : 0))
        : (charIdx + (targetWord ? targetWord.length : 1));

      if (hitCharEnd <= charIdx || hitCharEnd > text.length) {
        hitCharEnd = Math.min(text.length, charIdx + (targetWord ? targetWord.length : 1));
      }

      // Backward search for sentence punctuation or paragraph break
      let startIdx = charIdx;
      while (startIdx > 0 && (charIdx - startIdx) < 600) {
        const prevCh = text[startIdx - 1];
        if (prevCh === '.' || prevCh === '?' || prevCh === '!' || prevCh === '۔' || prevCh === '؟' || prevCh === '\n' || prevCh === '\n') {
          break;
        }
        startIdx--;
      }
      while (startIdx < charIdx && /\s/.test(text[startIdx])) {
        startIdx++;
      }

      // Forward search for sentence terminal punctuation
      let endIdx = hitCharEnd;
      while (endIdx < text.length && (endIdx - hitCharEnd) < 700) {
        const ch = text[endIdx];
        if (ch === '.' || ch === '?' || ch === '!' || ch === '۔' || ch === '؟' || ch === '\n' || ch === '\n') {
          endIdx++;
          while (endIdx < text.length && /['"”’)]/.test(text[endIdx])) {
            endIdx++;
          }
          break;
        }
        endIdx++;
      }
      while (endIdx > hitCharEnd && /\s/.test(text[endIdx - 1])) {
        endIdx--;
      }

      const before = text.substring(startIdx, charIdx).trimStart();
      const actualTarget = text.substring(charIdx, hitCharEnd) || targetWord;
      const after = text.substring(hitCharEnd, endIdx).trimEnd();

      // Only return if we actually captured surrounding context beyond just target word
      if (before || after) {
        return esc(before) + (before ? ' ' : '') + '<mark class="knode-inline">' + esc(actualTarget) + '</mark>' + (after ? ' ' : '') + esc(after);
      }
    }
  }

  // 2. High-performance fallback: construct sentence window directly from tokens
  const isBoundaryTok = (w) => /[.?!۔؟]/.test(w) || (typeof w === 'string' && (w.endsWith('.') || w.endsWith('!') || w.endsWith('?') || w.endsWith('۔') || w.endsWith('؟')));

  let leftBound = tokenIdx;
  while (leftBound > 0 && (tokenIdx - leftBound) < 35) {
    if (isBoundaryTok(toks[leftBound - 1].w)) {
      break;
    }
    leftBound--;
  }

  let rightBound = tokenIdx + matchLen;
  while (rightBound < toks.length && (rightBound - (tokenIdx + matchLen)) < 35) {
    if (isBoundaryTok(toks[rightBound - 1].w)) {
      break;
    }
    rightBound++;
  }

  // If left or right bound collapsed to target itself, expand to generous token window
  if (leftBound === tokenIdx && rightBound === tokenIdx + matchLen) {
    leftBound = Math.max(0, tokenIdx - 20);
    rightBound = Math.min(toks.length, tokenIdx + matchLen + 20);
  } else if (leftBound === tokenIdx) {
    leftBound = Math.max(0, tokenIdx - 15);
  } else if (rightBound === tokenIdx + matchLen) {
    rightBound = Math.min(toks.length, tokenIdx + matchLen + 15);
  }

  const leftTokens = toks.slice(leftBound, tokenIdx).map(t => t.w).join(' ');
  const rightTokens = toks.slice(tokenIdx + matchLen, rightBound).map(t => t.w).join(' ');

  return esc(leftTokens) + (leftTokens ? ' ' : '') + '<mark class="knode-inline">' + esc(targetWord) + '</mark>' + (rightTokens ? ' ' : '') + esc(rightTokens);
}

/* ---------- KPF (KWIC Pattern Frequency) Calculator ---------- */
const KpfCalculator = (function(){
  const SENTINEL = "<KPF_BOUNDARY>";

  function calculateKpfTotalScore(levelFrequencies) {
    if (!levelFrequencies || !levelFrequencies.length) return 0;
    let sum = 0;
    for (let i = 0; i < levelFrequencies.length; i++) {
      sum += (levelFrequencies[i] || 0);
    }
    return sum;
  }

  function getTokenAtPosition(toks, hitIndex, hitLen, posCode) {
    if (!toks || !toks.length) return SENTINEL;
    if (posCode === "C") {
      const slice = toks.slice(hitIndex, hitIndex + hitLen);
      return slice.map(t => t.w).join(" ");
    }
    if (posCode.endsWith("L")) {
      const num = parseInt(posCode.slice(0, -1), 10) || 1;
      const idx = hitIndex - num;
      if (idx < 0 || idx >= toks.length) return SENTINEL;
      return toks[idx].w;
    }
    if (posCode.endsWith("R")) {
      const num = parseInt(posCode.slice(0, -1), 10) || 1;
      const idx = (hitIndex + hitLen - 1) + num;
      if (idx < 0 || idx >= toks.length) return SENTINEL;
      return toks[idx].w;
    }
    return SENTINEL;
  }

  function normalizeToken(token, isCaseSensitive) {
    if (token === SENTINEL) return SENTINEL;
    return isCaseSensitive ? token : token.toLowerCase();
  }

  function analyze(hits, files, options) {
    const sortLevels = (options && options.sortLevels && options.sortLevels.length) ? options.sortLevels : ["1R", "2R", "3R"];
    const isCaseSensitive = !!(options && options.isCaseSensitive);

    const items = hits.map((h, originalIndex) => {
      const f = files[h.f];
      const toks = (f && f.toks) ? f.toks : [];
      const hitLen = h.len || 1;
      const rawValues = sortLevels.map(p => getTokenAtPosition(toks, h.i, hitLen, p));
      const normValues = rawValues.map(v => normalizeToken(v, isCaseSensitive));
      return {
        hit: h,
        originalIndex,
        rawValues,
        normValues
      };
    });

    const levelPrefixMaps = sortLevels.map(() => new Map());

    items.forEach(item => {
      let prefix = "";
      for (let L = 0; L < sortLevels.length; L++) {
        const val = item.normValues[L];
        prefix = L === 0 ? val : (prefix + "\u001f" + val);
        const map = levelPrefixMaps[L];
        map.set(prefix, (map.get(prefix) || 0) + 1);
      }
    });

    const evaluated = items.map(item => {
      const levelFrequencies = [];
      let prefix = "";
      for (let L = 0; L < sortLevels.length; L++) {
        const val = item.normValues[L];
        prefix = L === 0 ? val : (prefix + "\u001f" + val);
        const freq = levelPrefixMaps[L].get(prefix) || 0;
        levelFrequencies.push(freq);
      }
      const kpfTotalScore = calculateKpfTotalScore(levelFrequencies);
      const kpfPatternCount = levelFrequencies[levelFrequencies.length - 1] || 0;
      const kpfPatternKey = prefix;
      return {
        ...item,
        kpfLevelValues: item.rawValues,
        kpfNormValues: item.normValues,
        kpfLevelFrequencies: levelFrequencies,
        kpfTotalScore,
        kpfPatternCount,
        kpfPatternKey
      };
    });

    return {
      evaluated,
      sortLevels,
      isCaseSensitive
    };
  }

  function sortEvaluated(evaluatedList, orderMode) {
    const sorted = evaluatedList.slice();
    if (orderMode === "value") {
      sorted.sort((a, b) => {
        for (let L = 0; L < a.kpfNormValues.length; L++) {
          const va = a.kpfNormValues[L];
          const vb = b.kpfNormValues[L];
          if (va !== vb) return va < vb ? -1 : 1;
        }
        return a.originalIndex - b.originalIndex;
      });
    } else {
      sorted.sort((a, b) => {
        for (let L = 0; L < a.kpfLevelFrequencies.length; L++) {
          const diff = (b.kpfLevelFrequencies[L] || 0) - (a.kpfLevelFrequencies[L] || 0);
          if (diff !== 0) return diff;
        }
        for (let L = 0; L < a.kpfNormValues.length; L++) {
          const va = a.kpfNormValues[L];
          const vb = b.kpfNormValues[L];
          if (va !== vb) return va < vb ? -1 : 1;
        }
        return a.originalIndex - b.originalIndex;
      });
    }
    return sorted;
  }

  function buildGroups(sortedList, foldGroups, groupSingletons) {
    const groups = [];
    let i = 0;
    while (i < sortedList.length) {
      const cur = sortedList[i];
      if (groupSingletons && cur.kpfPatternCount === 1) {
        const members = [cur];
        let j = i + 1;
        while (j < sortedList.length && sortedList[j].kpfPatternCount === 1) {
          members.push(sortedList[j]);
          j++;
        }
        if (members.length > 1) {
          groups.push({
            isGroup: true,
            isSingletonGroup: true,
            representative: cur,
            members: members,
            groupSize: members.length,
            kpfDisplay: `${cur.kpfTotalScore}:${cur.kpfPatternCount} (${members.length})`
          });
        } else {
          groups.push({
            isGroup: false,
            isSingletonGroup: false,
            representative: cur,
            members: [cur],
            groupSize: 1,
            kpfDisplay: `${cur.kpfTotalScore}:${cur.kpfPatternCount}`
          });
        }
        i = j;
      } else if (foldGroups && cur.kpfPatternCount > 1) {
        const members = [cur];
        let j = i + 1;
        while (j < sortedList.length && sortedList[j].kpfPatternKey === cur.kpfPatternKey) {
          members.push(sortedList[j]);
          j++;
        }
        if (members.length > 1) {
          groups.push({
            isGroup: true,
            isSingletonGroup: false,
            representative: cur,
            members: members,
            groupSize: members.length,
            kpfDisplay: `${cur.kpfTotalScore}:${cur.kpfPatternCount} (${members.length})`
          });
        } else {
          groups.push({
            isGroup: false,
            isSingletonGroup: false,
            representative: cur,
            members: [cur],
            groupSize: 1,
            kpfDisplay: `${cur.kpfTotalScore}:${cur.kpfPatternCount}`
          });
        }
        i = j;
      } else {
        groups.push({
          isGroup: false,
          isSingletonGroup: false,
          representative: cur,
          members: [cur],
          groupSize: 1,
          kpfDisplay: `${cur.kpfTotalScore}:${cur.kpfPatternCount}`
        });
        i++;
      }
    }
    return groups;
  }

  return {
    SENTINEL,
    calculateKpfTotalScore,
    getTokenAtPosition,
    normalizeToken,
    analyze,
    sortEvaluated,
    buildGroups
  };
})();

/* ---------- KWIC ---------- */
const KWIC_POS_OPTIONS = ['3L', '2L', '1L', 'C', '1R', '2R', '3R'];

function vKwic(){
  if(!S.files.length) return `<section class="card glass"><h2>${I.search} KWIC concordance</h2>${needCorpus()}</section>`;
  
  const sortMode = S.q.sortMode || 'freq';
  const sort1 = S.q.sort1 || '1R';
  const sort2 = S.q.sort2 || '2R';
  const sort3 = S.q.sort3 || '3R';
  const foldGroups = !!S.q.foldGroups;
  const groupSingletons = !!S.q.groupSingletons;

  const extra = `
  <div class="controls-row" style="flex-wrap: wrap; gap: 8px;">
    <div class="field"><label>Context</label>${gsel('ctx', [5,10,15,25], S.q.ctx || 10, n=>n+' words')}</div>
    <div class="field"><label>Sort Order</label>${gsel('kpf_mode', ['freq', 'value'], sortMode, m=>m==='freq'?'Order by Frequency':'Order by Value', v=>{ S.q.sortMode=v; if(S.lastHits&&S.lastHits.length) runKwic(); })}</div>
    <div class="field"><label>Sort 1</label>${gsel('kpf_s1', KWIC_POS_OPTIONS, sort1, s=>s, v=>{ S.q.sort1=v; if(S.lastHits&&S.lastHits.length) runKwic(); })}</div>
    <div class="field"><label>Sort 2</label>${gsel('kpf_s2', KWIC_POS_OPTIONS, sort2, s=>s, v=>{ S.q.sort2=v; if(S.lastHits&&S.lastHits.length) runKwic(); })}</div>
    <div class="field"><label>Sort 3</label>${gsel('kpf_s3', KWIC_POS_OPTIONS, sort3, s=>s, v=>{ S.q.sort3=v; if(S.lastHits&&S.lastHits.length) runKwic(); })}</div>
  </div>
  <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-top:6px;">
    <span class="chip ${foldGroups?'on':''}" onclick="this.classList.toggle('on'); S.q.foldGroups=this.classList.contains('on'); if(S.lastHits&&S.lastHits.length) runKwic();" data-opt="fold_groups">Fold KPF Groups</span>
    <span class="chip ${groupSingletons?'on':''}" onclick="this.classList.toggle('on'); S.q.groupSingletons=this.classList.contains('on'); if(S.lastHits&&S.lastHits.length) runKwic();" data-opt="group_singletons">Group KPF Singletons</span>
  </div>`;
  
  return `<section class="card glass">
    <h2>${I.search} KWIC concordance</h2>
    <p class="sub">Key Word In Context with Positional Pattern Frequency (KPF). Swipe horizontally to read full concordance contexts cleanly aligned.</p>
    <div class="term-def"><b>KWIC</b> shows every occurrence of your search word lined up in a column with <b>KPF (KWIC Pattern Frequency)</b>. Sort 1 → Sort 2 → Sort 3 dynamically shape frequency-ranked patterns.</div>
    ${searchBar('runKwic()', S.q.term, S.q.cs, S.q.rx, extra)}
    <div id="out">${S.q.term ? '' : `<div class="empty">${I.search}<br>Enter a search term to see concordance lines.</div>`}</div>
  </section>`;
}

function toggleKpfGroupExpand(groupIdx) {
  const container = document.getElementById(`kpf-group-children-${groupIdx}`);
  const btn = document.getElementById(`kpf-group-btn-${groupIdx}`);
  if (!container) return;
  const isHidden = container.style.display === 'none';
  if (isHidden) {
    if (container.dataset.rendered !== "true") {
      renderKpfGroupChildren(groupIdx, container);
    }
    container.style.display = 'flex';
    setTimeout(() => { try { centerKwicLinesAndHint(); } catch(e){} }, 40);
    if (btn) btn.textContent = 'Hide Group ▴';
  } else {
    container.style.display = 'none';
    if (btn) {
      const grp = S.kwicGroups ? S.kwicGroups[groupIdx] : null;
      const count = grp ? grp.groupSize : '';
      btn.textContent = grp && grp.isSingletonGroup ? `Expand ${count} Singletons ▾` : `Expand ${count} Hits ▾`;
    }
  }
}

function renderKpfGroupChildren(groupIdx, container) {
  if (!S.kwicGroups || !S.kwicGroups[groupIdx]) return;
  const grp = S.kwicGroups[groupIdx];
  if (!grp.members || grp.members.length <= 1) return;
  
  const startK = +container.dataset.startK || 0;
  const c = S.q.ctx || 10;
  const sortLevels = S.kwicSortLevels || [S.q.sort1, S.q.sort2, S.q.sort3];
  
  const membersToRender = grp.members.slice(1);
  const maxInitial = Math.min(membersToRender.length, 40);
  
  function renderChildItem(item, mk) {
    const h = item.hit;
    const f = S.files[h.f] || { name: 'Unknown', toks: [] };
    const hitLen = h.len || 1;
    const toks = f.toks || [];
    const L = toks.slice(Math.max(0, h.i - c), h.i).map(t => t.w).join(' ').trim();
    const R = toks.slice(h.i + hitLen, h.i + hitLen + c).map(t => t.w).join(' ').trim();
    const N = toks.slice(h.i, h.i + hitLen).map(t => t.w).join(' ');
    const fullSentenceHtml = getFullSentenceForHit(f, h.i, hitLen);

    return `<div class="kwic-line kpf-child-line" id="kwic-row-${mk}" onclick="handleKwicRowClick(event, ${mk})">
      <div class="kwic-scroll-wrap" data-row-idx="${mk}">
        <div class="kwic-track">
          <div class="kl"><span>${esc(L)}</span></div>
          <span class="knode">${esc(N)}</span>
          <div class="kr"><span>${esc(R)}</span></div>
        </div>
      </div>
      <div class="kwic-action-bar">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="kfile">#${mk + 1} · ${esc(f.name)} · token ${h.i + 1}</span>
          <span class="kpf-badge" title="KPF Pattern Score : Count (${sortLevels.join(' → ')})">KPF ${item.kpfTotalScore}:${item.kpfPatternCount}</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">

          <button type="button" class="kwic-btn-jump" onclick="jumpFile(${h.f},'${esc(S.q.term).replace(/'/g,"\\'")}',${h.i}); event.stopPropagation();">
            Open File ↗
          </button>
        </div>
      </div>
      <div id="kwic-full-sentence-${mk}" class="kwic-full-sentence-drawer" style="display:none;" data-row-k="${mk}" data-file-idx="${h.f}" data-tok-idx="${h.i}" data-hit-len="${hitLen}">
        <div class="kwic-full-sentence-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div class="kwic-full-sentence-label" style="margin:0;">Complete Sentence in Context</div>
          <button type="button" class="kwic-btn-copy-sentence" onclick="copyKwicSentence(${mk}); event.stopPropagation();" title="Copy sentence text">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px; height:12px;"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            Copy
          </button>
        </div>
        <div class="kwic-full-sentence-body" id="kwic-sentence-body-${mk}">${fullSentenceHtml}</div>
      </div>
    </div>`;
  }
  
  let html = '';
  for (let i = 0; i < maxInitial; i++) {
    html += renderChildItem(membersToRender[i], startK + i);
  }
  
  if (membersToRender.length > maxInitial) {
    const remaining = membersToRender.length - maxInitial;
    html += `<div id="kpf-more-wrap-${groupIdx}" style="text-align:center; padding:10px;">
      <button type="button" class="btn ghost small" onclick="renderMoreKpfGroupMembers(${groupIdx}, ${maxInitial}); event.stopPropagation();" style="font-size:12px; padding:6px 14px; border-radius:8px;">
        Show next ${Math.min(remaining, 50)} hits (${remaining.toLocaleString()} remaining)...
      </button>
    </div>`;
  }
  
  container.innerHTML = html;
  container.dataset.rendered = "true";
}

function renderMoreKpfGroupMembers(groupIdx, currentOffset) {
  const container = document.getElementById(`kpf-group-children-${groupIdx}`);
  const grp = S.kwicGroups ? S.kwicGroups[groupIdx] : null;
  if (!container || !grp) return;
  
  const moreWrap = document.getElementById(`kpf-more-wrap-${groupIdx}`);
  if (moreWrap) moreWrap.remove();
  
  const startK = +container.dataset.startK || 0;
  const c = S.q.ctx || 10;
  const sortLevels = S.kwicSortLevels || [S.q.sort1, S.q.sort2, S.q.sort3];
  const membersToRender = grp.members.slice(1);
  const nextChunk = Math.min(membersToRender.length, currentOffset + 50);
  
  let html = '';
  for (let i = currentOffset; i < nextChunk; i++) {
    const item = membersToRender[i];
    const mk = startK + i;
    const h = item.hit;
    const f = S.files[h.f] || { name: 'Unknown', toks: [] };
    const hitLen = h.len || 1;
    const toks = f.toks || [];
    const L = toks.slice(Math.max(0, h.i - c), h.i).map(t => t.w).join(' ').trim();
    const R = toks.slice(h.i + hitLen, h.i + hitLen + c).map(t => t.w).join(' ').trim();
    const N = toks.slice(h.i, h.i + hitLen).map(t => t.w).join(' ');
    const fullSentenceHtml = getFullSentenceForHit(f, h.i, hitLen);

    html += `<div class="kwic-line kpf-child-line" id="kwic-row-${mk}" onclick="handleKwicRowClick(event, ${mk})">
      <div class="kwic-scroll-wrap" data-row-idx="${mk}">
        <div class="kwic-track">
          <div class="kl"><span>${esc(L)}</span></div>
          <span class="knode">${esc(N)}</span>
          <div class="kr"><span>${esc(R)}</span></div>
        </div>
      </div>
      <div class="kwic-action-bar">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="kfile">#${mk + 1} · ${esc(f.name)} · token ${h.i + 1}</span>
          <span class="kpf-badge" title="KPF Pattern Score : Count (${sortLevels.join(' → ')})">KPF ${item.kpfTotalScore}:${item.kpfPatternCount}</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">

          <button type="button" class="kwic-btn-jump" onclick="jumpFile(${h.f},'${esc(S.q.term).replace(/'/g,"\\'")}',${h.i}); event.stopPropagation();">
            Open File ↗
          </button>
        </div>
      </div>
      <div id="kwic-full-sentence-${mk}" class="kwic-full-sentence-drawer" style="display:none;" data-row-k="${mk}" data-file-idx="${h.f}" data-tok-idx="${h.i}" data-hit-len="${hitLen}">
        <div class="kwic-full-sentence-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div class="kwic-full-sentence-label" style="margin:0;">Complete Sentence in Context</div>
          <button type="button" class="kwic-btn-copy-sentence" onclick="copyKwicSentence(${mk}); event.stopPropagation();" title="Copy sentence text">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px; height:12px;"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            Copy
          </button>
        </div>
        <div class="kwic-full-sentence-body" id="kwic-sentence-body-${mk}">${fullSentenceHtml}</div>
      </div>
    </div>`;
  }
  
  if (membersToRender.length > nextChunk) {
    const remaining = membersToRender.length - nextChunk;
    html += `<div id="kpf-more-wrap-${groupIdx}" style="text-align:center; padding:10px;">
      <button type="button" class="btn ghost small" onclick="renderMoreKpfGroupMembers(${groupIdx}, ${nextChunk}); event.stopPropagation();" style="font-size:12px; padding:6px 14px; border-radius:8px;">
        Show next ${Math.min(remaining, 50)} hits (${remaining.toLocaleString()} remaining)...
      </button>
    </div>`;
  }
  
  container.insertAdjacentHTML('beforeend', html);
}

function getKwicExportRows() {
  if (S.lastRows && S.lastRows.length) return S.lastRows;
  if (!S.kwicSortedEvaluated || !S.kwicSortedEvaluated.length) return [];
  const rows = [['Hit', 'File', 'KPF', 'Left Context', 'Hit', 'Right Context', 'KPF_TotalScore', 'KPF_PatternCount']];
  const c = S.q.ctx || 10;
  let rowCounter = 0;
  S.kwicSortedEvaluated.forEach((item) => {
    rowCounter++;
    const h = item.hit;
    const f = S.files[h.f];
    const hitLen = h.len || 1;
    const L = f.toks.slice(Math.max(0, h.i - c), h.i).map(t => t.w).join(' ').trim();
    const R = f.toks.slice(h.i + hitLen, h.i + hitLen + c).map(t => t.w).join(' ').trim();
    const N = f.toks.slice(h.i, h.i + hitLen).map(t => t.w).join(' ');
    rows.push([rowCounter, f.name, `${item.kpfTotalScore}:${item.kpfPatternCount}`, L, N, R, item.kpfTotalScore, item.kpfPatternCount]);
  });
  S.lastRows = rows;
  return rows;
}

function exportKwicCSV() {
  const rows = getKwicExportRows();
  if (!rows || !rows.length) {
    toast('No KWIC data to export', false);
    return;
  }
  exportCSV(rows, `kwic_kpf_${(S.q.term || 'corpus').toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`);
}

function runKwic(){
  [S.q.term, S.q.cs, S.q.rx] = readOpts();
  saveSearchHistory(S.q.term);
  S.q.ctx = +gselVal('ctx') || S.q.ctx || 10;
  S.q.sortMode = gselVal('kpf_mode') || S.q.sortMode || 'freq';
  S.q.sort1 = gselVal('kpf_s1') || S.q.sort1 || '1R';
  S.q.sort2 = gselVal('kpf_s2') || S.q.sort2 || '2R';
  S.q.sort3 = gselVal('kpf_s3') || S.q.sort3 || '3R';
  S.q.foldGroups = !!document.querySelector('[data-opt=fold_groups].on');
  S.q.groupSingletons = !!document.querySelector('[data-opt=group_singletons].on');

  const out = $('#out');
  if (!S.q.term || !S.q.term.trim()) {
    if (out) out.innerHTML = `<div class="empty">${I.search}<br>Enter a search term to see concordance lines.</div>`;
    return;
  }

  // Show immediate feedback for large corpora
  if (out && S.files && S.files.length) {
    out.innerHTML = `<div class="empty" style="padding:28px 10px;"><div style="display:inline-block; width:22px; height:22px; border:2.5px solid var(--a1); border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-bottom:8px;"></div><br>Searching concordance across corpus...</div>`;
  }

  setTimeout(() => {
    executeKwicSearch();
  }, 10);
}

function executeKwicSearch() {
  const hits = getHits(S.q.term, S.q.cs, S.q.rx);
  S.lastHits = hits;
  S.lastRows = null;
  const out = $('#out');
  if(!hits.length){
    out.innerHTML = `<div class="empty">No hits for “${esc(S.q.term)}”.</div>`;
    return;
  }

  // 1. KPF Analysis with active sort levels and case mode
  const sortLevels = [S.q.sort1, S.q.sort2, S.q.sort3];
  const analysis = KpfCalculator.analyze(hits, S.files, {
    sortLevels: sortLevels,
    isCaseSensitive: S.q.cs
  });

  // 2. Sort using KPF hierarchical frequency or value order
  const sortedEvaluated = KpfCalculator.sortEvaluated(analysis.evaluated, S.q.sortMode);

  // 3. Build Folded/Grouped structure
  const groups = KpfCalculator.buildGroups(sortedEvaluated, S.q.foldGroups, S.q.groupSingletons);

  S.kwicGroups = groups;
  S.kwicSortedEvaluated = sortedEvaluated;
  S.kwicSortLevels = sortLevels;
  S.q.page = 1;

  logWorkspaceTask({
    type: 'kwic',
    typeName: 'KWIC Concordance',
    title: `KWIC: "${S.q.term}" (KPF: ${sortLevels.join('→')})`,
    corpusSummary: `${S.files.length} file(s) · ${hits.length.toLocaleString()} matches`,
    summarySnippet: `KPF Concordance analysis for "${S.q.term}" with positional levels [${sortLevels.join(', ')}] (${S.q.sortMode === 'freq' ? 'Frequency Order' : 'Value Order'}).`,
    metrics: { Matches: hits.length, Context: `±${S.q.ctx || 10}`, KPF_Levels: sortLevels.join('→'), Sort: S.q.sortMode },
    params: { ...S.q },
    exportFilename: `kwic_kpf_${S.q.term.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`
  });

  renderKwicPage(1);
}

function goToKwicPage(pageNum) {
  renderKwicPage(pageNum);
  const out = $('#out');
  if (out) {
    try {
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch(e) {}
  }
}

function changeKwicPageSize(newSize) {
  S.q.pageSize = Math.max(25, Math.min(1000, newSize || 100));
  S.q.page = 1;
  renderKwicPage(1);
}

function renderKwicPage(pageNum) {
  const out = $('#out');
  if (!out || !S.kwicGroups) return;
  const groups = S.kwicGroups;
  const hits = S.lastHits || [];
  const sortLevels = S.kwicSortLevels || [S.q.sort1, S.q.sort2, S.q.sort3];
  const c = S.q.ctx || 10;
  const pageSize = S.q.pageSize || 100;
  const totalItems = groups.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(totalPages, Math.max(1, pageNum || S.q.page || 1));
  S.q.page = page;

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(totalItems, startIndex + pageSize);
  const pageGroups = groups.slice(startIndex, endIndex);

  // Compute starting hit index for sequential numbering across pages
  let runningK = 0;
  for (let i = 0; i < startIndex; i++) {
    runningK += groups[i].isGroup ? groups[i].groupSize : 1;
  }

  function renderKwicItemHtml(item, k, isChild = false) {
    const h = item.hit;
    const f = S.files[h.f] || { name: 'Unknown', toks: [] };
    const hitLen = h.len || 1;
    const toks = f.toks || [];
    const L = toks.slice(Math.max(0, h.i - c), h.i).map(t => t.w).join(' ').trim();
    const R = toks.slice(h.i + hitLen, h.i + hitLen + c).map(t => t.w).join(' ').trim();
    const N = toks.slice(h.i, h.i + hitLen).map(t => t.w).join(' ');
    // Pre-calculate full sentence for smooth instant display
    const fullSentenceHtml = getFullSentenceForHit(f, h.i, hitLen);

    return `<div class="kwic-line ${isChild ? 'kpf-child-line' : ''}" id="kwic-row-${k}" onclick="handleKwicRowClick(event, ${k})">
      <div class="kwic-scroll-wrap" data-row-idx="${k}">
        <div class="kwic-track">
          <div class="kl"><span>${esc(L)}</span></div>
          <span class="knode">${esc(N)}</span>
          <div class="kr"><span>${esc(R)}</span></div>
        </div>
      </div>
      <div class="kwic-action-bar">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="kfile">#${k + 1} · ${esc(f.name)} · token ${h.i + 1}</span>
          <span class="kpf-badge" title="KPF Pattern Score : Count (${sortLevels.join(' → ')})">KPF ${item.kpfTotalScore}:${item.kpfPatternCount}</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">

          <button type="button" class="kwic-btn-jump" onclick="jumpFile(${h.f},'${esc(S.q.term).replace(/'/g,"\\'")}',${h.i}); event.stopPropagation();">
            Open File ↗
          </button>
        </div>
      </div>
      <div id="kwic-full-sentence-${k}" class="kwic-full-sentence-drawer" style="display:none;" data-row-k="${k}" data-file-idx="${h.f}" data-tok-idx="${h.i}" data-hit-len="${hitLen}">
        <div class="kwic-full-sentence-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div class="kwic-full-sentence-label" style="margin:0;">Complete Sentence in Context</div>
          <button type="button" class="kwic-btn-copy-sentence" onclick="copyKwicSentence(${k}); event.stopPropagation();" title="Copy sentence text">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px; height:12px;"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            Copy
          </button>
        </div>
        <div class="kwic-full-sentence-body" id="kwic-sentence-body-${k}">${fullSentenceHtml}</div>
      </div>
    </div>`;
  }

  const html = pageGroups.map((grp, localIdx) => {
    const gIdx = startIndex + localIdx;
    if (!grp.isGroup) {
      const item = grp.representative;
      const k = runningK++;
      return renderKwicItemHtml(item, k);
    }

    // Group header line
    const rep = grp.representative;
    const repK = runningK++;
    const repF = S.files[rep.hit.f] || { name: 'Unknown', toks: [] };
    const hitLen = rep.hit.len || 1;
    const repToks = repF.toks || [];
    const L = repToks.slice(Math.max(0, rep.hit.i - c), rep.hit.i).map(t => t.w).join(' ').trim();
    const R = repToks.slice(rep.hit.i + hitLen, rep.hit.i + hitLen + c).map(t => t.w).join(' ').trim();
    const N = repToks.slice(rep.hit.i, rep.hit.i + hitLen).map(t => t.w).join(' ');
    const fullSentenceHtml = getFullSentenceForHit(repF, rep.hit.i, hitLen);

    // Group members: lazy container with metadata (saves thousands of off-screen DOM nodes on 1M corpora)
    const startMemberK = repK + 1;
    runningK += (grp.members.length - 1);

    return `<div class="kwic-line" id="kwic-row-${repK}" onclick="handleKwicRowClick(event, ${repK})" style="border-left: 3px solid var(--a1);">
      <div class="kwic-scroll-wrap" data-row-idx="${repK}">
        <div class="kwic-track">
          <div class="kl"><span>${esc(L)}</span></div>
          <span class="knode">${esc(N)}</span>
          <div class="kr"><span>${esc(R)}</span></div>
        </div>
      </div>
      <div class="kwic-action-bar">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="kfile">#${repK + 1} · ${esc(repF.name)} · token ${rep.hit.i + 1}</span>
          <span class="kpf-badge kpf-badge-group" title="KPF Pattern Score : Count (Group Size)">KPF ${grp.kpfDisplay}</span>
          <button type="button" class="kpf-group-toggle-btn" id="kpf-group-btn-${gIdx}" onclick="toggleKpfGroupExpand(${gIdx}); event.stopPropagation();">
            ${grp.isSingletonGroup ? `Expand ${grp.groupSize} Singletons ▾` : `Expand ${grp.groupSize} Hits ▾`}
          </button>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">

          <button type="button" class="kwic-btn-jump" onclick="jumpFile(${rep.hit.f},'${esc(S.q.term).replace(/'/g,"\\'")}',${rep.hit.i}); event.stopPropagation();">
            Open File ↗
          </button>
        </div>
      </div>
      <div id="kwic-full-sentence-${repK}" class="kwic-full-sentence-drawer" style="display:none;" data-row-k="${repK}" data-file-idx="${rep.hit.f}" data-tok-idx="${rep.hit.i}" data-hit-len="${hitLen}">
        <div class="kwic-full-sentence-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div class="kwic-full-sentence-label" style="margin:0;">Complete Sentence in Context</div>
          <button type="button" class="kwic-btn-copy-sentence" onclick="copyKwicSentence(${repK}); event.stopPropagation();" title="Copy sentence text">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px; height:12px;"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            Copy
          </button>
        </div>
        <div class="kwic-full-sentence-body" id="kwic-sentence-body-${repK}">${fullSentenceHtml}</div>
      </div>
      <div id="kpf-group-children-${gIdx}" class="kpf-group-children" style="display:none;" data-group-idx="${gIdx}" data-start-k="${startMemberK}" data-rendered="false"></div>
    </div>`;
  }).join('');

  function renderPaginationControls() {
    if (totalPages <= 1 && totalItems <= 50) return '';
    return `<div class="kwic-pagination-bar">
      <div class="kwic-page-info">
        <span>Displaying <b>${startIndex + 1}–${endIndex}</b> of <b>${totalItems.toLocaleString()}</b> ${S.q.foldGroups || S.q.groupSingletons ? 'groups' : 'lines'} (${hits.length.toLocaleString()} total hits)</span>
        <span class="kwic-page-badge">Page ${page} of ${totalPages}</span>
      </div>
      <div class="kwic-page-buttons">
        <button type="button" class="kwic-page-btn ${page <= 1 ? 'disabled' : ''}" onclick="goToKwicPage(1)" ${page <= 1 ? 'disabled' : ''}>⏮ First</button>
        <button type="button" class="kwic-page-btn ${page <= 1 ? 'disabled' : ''}" onclick="goToKwicPage(${page - 1})" ${page <= 1 ? 'disabled' : ''}>◀ Prev</button>
        <div class="kwic-page-jump-wrap">
          <label>Page</label>
          <input type="number" min="1" max="${totalPages}" value="${page}" class="kwic-page-input" onchange="goToKwicPage(+this.value)" onkeydown="if(event.key==='Enter') goToKwicPage(+this.value)">
          <span>/ ${totalPages}</span>
        </div>
        <button type="button" class="kwic-page-btn ${page >= totalPages ? 'disabled' : ''}" onclick="goToKwicPage(${page + 1})" ${page >= totalPages ? 'disabled' : ''}>Next ▶</button>
        <button type="button" class="kwic-page-btn ${page >= totalPages ? 'disabled' : ''}" onclick="goToKwicPage(${totalPages})" ${page >= totalPages ? 'disabled' : ''}>Last ⏭</button>
        <div class="kwic-page-size-wrap">
          <label>Page size:</label>
          ${gsel('kwicPageSize', [50, 100, 250, 500], pageSize, n => String(n), val => changeKwicPageSize(+val))}
        </div>
      </div>
    </div>`;
  }

  const sortLabel = `${S.q.sortMode === 'freq' ? 'Frequency-ranked' : 'Lexical-ranked'} [${sortLevels.join(' → ')}]`;
  const groupStatus = S.q.foldGroups || S.q.groupSingletons ? ` · ${groups.length} groups` : '';

  const paginationHtml = renderPaginationControls();

  out.innerHTML = resHead(`${hits.length.toLocaleString()} hits · KPF: ${sortLabel}${groupStatus}`, "exportKwicCSV()") +
    `<div class="kwic-hint-banner-container">
      <div class="kwic-hint-banner">
        <div class="kwic-hint-left-group">
          <button type="button" class="kwic-pill-peek-btn" onclick="peekAllKwic('left')">◀ Left</button>
          <button type="button" class="kwic-pill-peek-btn" onclick="peekAllKwic('right')">Right ▶</button>
          <button type="button" class="kwic-pill-peek-btn center" onclick="centerAllKwic()"><span style="display:inline-flex; width:12px; height:12px; margin-right:3px;">${I.target}</span> Center</button>
        </div>
        <div class="kwic-hint-center-text">
          <span class="kwic-hint-arrows">⟵</span>
          <span>Swipe horizontally to inspect context</span>
          <span class="kwic-hint-arrows">⟶</span>
        </div>
        
      </div>
    </div>` +
    paginationHtml +
    `<div class="tablewrap">${html}</div>` +
    paginationHtml;

  // Initial immediate centering on render
  setTimeout(() => {
    try {
      centerKwicLinesAndHint();
    } catch(e) {}
  }, 40);

  // Clear any existing 5-second re-centering timer
  if (window._kwicAutoCenterTimer) {
    clearTimeout(window._kwicAutoCenterTimer);
  }
  // User request: automatically smooth-center all searched words after 5 seconds
  window._kwicAutoCenterTimer = setTimeout(() => {
    try {
      if (S.tab === 'kwic') {
        centerAllKwic();
      }
    } catch(e) {}
  }, 5000);
}
function jumpFile(fi, term, tokenIndex = null){ S.fv.file=fi; S.fv.term=term; S.fv.tokenIndex=tokenIndex; go('fileview'); runFileView(); }

/* ---------- Plot ---------- */
function vPlot(){
  if(!S.files.length) return `<section class="card glass"><h2>${I.plot} Concordance plot</h2>${needCorpus()}</section>`;
  return `<section class="card glass">
    <h2>${I.plot} Concordance plot</h2>
    <p class="sub">A barcode view of where your search term appears across each file. Dense stripes mean clustering; even spread means dispersion.</p>
    <div class="term-def"><b>Dispersion plot</b> maps where a word falls across a text, from beginning to end, as vertical marks. It reveals whether a word is used steadily throughout, or only clusters in certain sections.</div>
    ${searchBar('runPlot()', S.q.term, S.q.cs, S.q.rx)}
    <div id="out"></div></section>`;
}
function runPlot(){
  const [term, cs, rx] = readOpts(); S.q.term=term; S.q.cs=cs; S.q.rx=rx;
  saveSearchHistory(term);
  const hits = getHits(term, cs, rx);
  const out = $('#out');
  if(!hits.length){ out.innerHTML = `<div class="empty">No hits for “${esc(term)}”.</div>`; return; }
  const byFile = new Map();
  hits.forEach(h => { if(!byFile.has(h.f)) byFile.set(h.f,[]); byFile.get(h.f).push(h.i); });
  const rows=[['File','Hits','Per 1,000 tokens','Positions']];
  let html='';
  byFile.forEach((pos, fi)=>{
    const f=S.files[fi], n=f.toks.length, norm=(pos.length/n*1000);
    rows.push([f.name,pos.length,norm.toFixed(2),pos.join(' ')]);

    // Density heatmap bins (30 bins across file length)
    const numBins = 30;
    const bins = new Array(numBins).fill(0);
    pos.forEach(p => {
      const b = Math.min(numBins - 1, Math.floor((p / Math.max(1, n)) * numBins));
      bins[b]++;
    });
    const maxBin = Math.max(...bins, 1);
    const binW = 996 / numBins;
    const heatSvg = '';

    // Milestone markers at 25%, 50%, 75%
    const gridMarkers = `
      <line x1="251" y1="4" x2="251" y2="56" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,3" opacity="0.4" style="pointer-events:none;" />
      <line x1="500" y1="4" x2="500" y2="56" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.5" style="pointer-events:none;" />
      <line x1="749" y1="4" x2="749" y2="56" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,3" opacity="0.4" style="pointer-events:none;" />
    `;

    // Modern strikes with rounded caps, glow, and click tooltip
    const lines = pos.map((p, idx)=>{
      const x=(p/Math.max(1,n-1)*994+3).toFixed(1);
      const pct=((p/Math.max(1,n-1))*100).toFixed(1);
      return `<line class="barcode-strike" x1="${x}" y1="8" x2="${x}" y2="52" style="cursor:pointer;" onclick="jumpFile(${fi}, '${esc(term).replace(/'/g,"\\'")}', ${p})"><title>Hit #${idx+1}: token ${p.toLocaleString()} (${pct}%)</title></line>`;
    }).join('');

    // Dispersion spread score
    const deciles = new Set(pos.map(p => Math.min(9, Math.floor((p / Math.max(1, n)) * 10))));
    const spreadScore = (deciles.size * 10);

    html += `
      <div class="plotfile">
        <div class="pf-head">
          <div class="pf-title-group">
            <div class="pf-icon-badge">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>
            </div>
            <span>${esc(f.name)}</span>
          </div>
          <div class="pf-chips-row">
            <span class="pf-chip hit-chip">${pos.length.toLocaleString()} Hits</span>
            <span class="pf-chip rate-chip">${norm.toFixed(2)} / 1k toks</span>
            <span class="pf-chip len-chip">${n.toLocaleString()} total tokens</span>
          </div>
        </div>

        <div class="barcode-container" title="Swipe or scroll horizontally for full high-resolution dispersion view">
          <div class="barcode-inner-wrap">
            <svg class="barcode" viewBox="0 0 1000 60" preserveAspectRatio="none">
              <!-- Channel background: Pure high-contrast black & white -->
              <rect x="2" y="4" width="996" height="52" rx="8" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
              <!-- Heat density glow -->
              ${heatSvg}
              <!-- Milestone Grid Lines -->
              ${gridMarkers}
              <!-- Match Needles -->
              ${lines}
              <!-- Corner Watermark Tag -->
              <text x="990" y="52" text-anchor="end" fill="#64748b" font-family="'JetBrains Mono', monospace" font-size="9px" font-weight="800" opacity="0.45" style="pointer-events: none; letter-spacing:0.08em;">LINGUA-X ARC</text>
            </svg>
            <div class="barcode-scale-bar">
              <span>0% (Start)</span>
              <span>25%</span>
              <span>50% (Midpoint)</span>
              <span>75%</span>
              <span>100% (End)</span>
            </div>
          </div>
        </div>

        <div class="barcode-action-footer">
          <div class="dispersion-metric">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m12 6 0 6 4 2"/></svg>
            <span>Spread Coverage: <b>${spreadScore}%</b> of document sections</span>
          </div>
          <button class="btn ghost small quick-jump-btn" onclick="jumpFile(${fi}, '${esc(term).replace(/'/g,"\\'")}', ${pos[0]})" style="display:inline-flex; align-items:center; gap:4px;">
            <span>First Match</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>`;
  });
  S.lastRows = rows;
  logWorkspaceTask({
    type: 'plot',
    typeName: 'Dispersion Plot',
    title: `Dispersion Plot: "${term}"`,
    corpusSummary: `${byFile.size} file(s) · ${hits.length.toLocaleString()} occurrences`,
    summarySnippet: `Generated barcode dispersion plot for "${term}" across ${byFile.size} file(s).`,
    metrics: { Hits: hits.length, Files: byFile.size },
    params: { term, cs, rx },
    exportableRows: S.lastRows,
    exportFilename: `plot_${term.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`
  });
  out.innerHTML = resHead(`${hits.length.toLocaleString()} hits in ${byFile.size} file(s). Tap any barcode line to jump directly to that point in File View.`, "exportCSV(S.lastRows,'plot.csv')", "exportDispersionPlotsAsPNG()", "exportDispersionPlotsAsPNG(true)") + html;
}

/* ---------- File View ---------- */
function vFileView(){
  if(!S.files.length) return `<section class="card glass"><h2>${I.file} File view</h2>${needCorpus()}</section>`;
  return `<section class="card glass">
    <h2>${I.file} File view</h2>
    <p class="sub">Read a full text with interactive quick-jump navigation and search term highlighting.</p>
    <div class="controls">
      <div class="field" style="flex:1; min-width:0"><label>File</label>${gsel('fvFile', S.files.map((_,i)=>i), S.fv.file, i=>S.files[i].name, val=>{ S.fv.file=+val; S.fv.currentPage=1; runFileView(); })}</div>
      <div class="search-row">
        <input type="search" id="q" placeholder="Highlight term (optional)" value="${esc(S.fv.term)}">
        <button class="btn run btn-analyze" onclick="S.fv.term=document.getElementById('q').value; runFileView()">Analyze</button>
      </div>
    </div>
    <div id="out"></div></section>`;
}

/* ---------- E-Reader File View Pagination & Fullscreen Controller ---------- */
if (!S.fv) S.fv = {};
if (!S.fv.readerTheme) S.fv.readerTheme = 'white'; // 'white', 'paper', 'night'
if (!S.fv.readerFont) S.fv.readerFont = 'serif';   // 'serif', 'sans', 'mono'
if (!S.fv.readerSize) S.fv.readerSize = 15;        // px

function setEReaderTheme(theme) {
  S.fv.readerTheme = theme;
  document.querySelectorAll('.fv-ereader-page-viewport, .fv-fullscreen-overlay').forEach(el => {
    el.classList.remove('theme-paper', 'theme-white', 'theme-night');
    el.classList.add(`theme-${theme}`);
  });
  // Update both normal view (.fv-seg-btn) and fullscreen (.fv-theme-btn) buttons
  document.querySelectorAll('.fv-seg-btn[data-theme], .fv-theme-btn[data-theme]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
  });
}

function setEReaderFont(font) {
  S.fv.readerFont = font;
  document.querySelectorAll('.fv-ereader-page-viewport, .fv-fs-content').forEach(el => {
    el.classList.remove('font-serif', 'font-sans', 'font-mono');
    el.classList.add(`font-${font}`);
  });
  document.querySelectorAll('.fv-font-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.font === font);
  });
}

function changeEReaderFontSize(delta) {
  const current = S.fv.readerSize || 15;
  const next = Math.max(12, Math.min(24, current + delta));
  S.fv.readerSize = next;
  document.querySelectorAll('.fv-ereader-page-viewport, .fv-fs-content').forEach(el => {
    el.style.fontSize = `${next}px`;
  });
}

function toggleEReaderFullscreen() {
  const overlay = document.getElementById('fvFullscreenOverlay');
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = '';
    return;
  }
  
  const f = S.files[S.fv.file];
  if (!f) return;
  
  const totalPages = S.fv.totalPages || 1;
  const curPage = S.fv.currentPage || 1;
  const pageTextHtml = getEReaderPageHtml(curPage);
  const pct = Math.round((curPage / totalPages) * 100);

  const fsEl = document.createElement('div');
  fsEl.id = 'fvFullscreenOverlay';
  fsEl.className = `fv-fullscreen-overlay theme-${S.fv.readerTheme || 'white'}`;
  fsEl.innerHTML = `
    <div class="fv-fs-topbar">
      <div style="display:flex; align-items:center; gap:6px; flex:1 1 auto; min-width:110px; overflow:hidden;">
        <button type="button" class="fv-ereader-btn" onclick="toggleEReaderFullscreen()" title="Exit full screen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:13px; height:13px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <span>Exit</span>
        </button>
        <span style="font-family:'Sora',sans-serif; font-size:12px; font-weight:700; color:inherit; opacity:0.85; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(f.name)}</span>
      </div>
      <div style="display:flex; align-items:center; gap:4px; flex-shrink:0;">
        <button type="button" class="fv-ereader-btn fv-theme-btn ${S.fv.readerTheme==='white'?'active':''}" data-theme="white" onclick="setEReaderTheme('white')">White</button>
        <button type="button" class="fv-ereader-btn fv-theme-btn ${S.fv.readerTheme==='paper'?'active':''}" data-theme="paper" onclick="setEReaderTheme('paper')">Sepia</button>
        <button type="button" class="fv-ereader-btn fv-theme-btn ${S.fv.readerTheme==='night'?'active':''}" data-theme="night" onclick="setEReaderTheme('night')">Night</button>
        <button type="button" class="fv-ereader-btn" onclick="changeEReaderFontSize(-1)" title="Smaller font">A-</button>
        <button type="button" class="fv-ereader-btn" onclick="changeEReaderFontSize(1)" title="Larger font">A+</button>
      </div>
    </div>
    <div class="fv-fs-content font-${S.fv.readerFont || 'serif'}" id="fvFsContent" style="font-size:${S.fv.readerSize || 15}px;">
      <div class="fv-ereader-page-text">${pageTextHtml}</div>
    </div>
    <div class="fv-fs-bottombar">
      <div class="fv-ereader-progress-track" onclick="handleEReaderTrackClick(event, true)">
        <div class="fv-ereader-progress-fill" id="fvFsProgressFill" style="width:${pct}%;"></div>
      </div>
      <div class="fv-ereader-nav-row">
        <button type="button" class="fv-ereader-pager-btn" id="fvFsPrevBtn" onclick="goEReaderPage(${curPage - 1})" ${curPage <= 1 ? 'disabled' : ''}>
          ◀ Prev
        </button>
        <div class="fv-ereader-page-counter">
          <span>Page <b id="fvFsCurPage">${curPage}</b> of <b id="fvFsTotalPages">${totalPages}</b></span>
          <span class="fv-ereader-page-sub">${pct}% read</span>
        </div>
        <button type="button" class="fv-ereader-pager-btn" id="fvFsNextBtn" onclick="goEReaderPage(${curPage + 1})" ${curPage >= totalPages ? 'disabled' : ''}>
          Next ▶
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(fsEl);
  document.body.style.overflow = 'hidden';
}

function getEReaderPageHtml(pageNum) {
  const f = S.files[S.fv.file];
  if (!f) return '';
  if (!f.toks || !f.toks.length) {
    // If tokens are empty, lazy tokenize or return text
    if (f.text) {
      f.toks = tokenize(f.text);
    }
  }
  if (!f.toks || !f.toks.length) return esc(f.text || '');

  const PAGE_TOKENS = 350;
  const totalPages = Math.max(1, Math.ceil(f.toks.length / PAGE_TOKENS));
  const validPage = Math.max(1, Math.min(totalPages, parseInt(pageNum, 10) || 1));

  const startTokIdx = (validPage - 1) * PAGE_TOKENS;
  const endTokIdx = Math.min(f.toks.length, validPage * PAGE_TOKENS);

  const startTok = f.toks[startTokIdx];
  const endTok = f.toks[endTokIdx - 1];

  const startChar = startTok ? startTok.s : 0;
  const endChar = endTok ? (endTok.s + endTok.w.length) : (f.text ? f.text.length : 0);

  const m = matcher(S.fv.term, false, false);
  const targetTi = S.fv.tokenIndex;

  let cur = startChar;
  const parts = [];

  for (let ti = startTokIdx; ti < endTokIdx; ti++) {
    const t = f.toks[ti];
    if (ti === targetTi) {
      parts.push(esc(f.text.slice(cur, t.s)), `<mark class="fv-match target-token">${esc(t.w)}</mark>`);
      cur = t.s + t.w.length;
    } else if (m && m(t.w)) {
      parts.push(esc(f.text.slice(cur, t.s)), `<mark class="fv-match">${esc(t.w)}</mark>`);
      cur = t.s + t.w.length;
    }
  }
  parts.push(esc(f.text.slice(cur, endChar)));
  return parts.join('');
}

function goEReaderPage(targetPage) {
  const f = S.files[S.fv.file];
  if (!f) return;
  
  const PAGE_TOKENS = 350;
  const numToks = (f.toks && f.toks.length) ? f.toks.length : Math.max(1, Math.ceil((f.text || '').length / 6));
  const totalPages = Math.max(1, Math.ceil(numToks / PAGE_TOKENS));
  S.fv.totalPages = totalPages;
  
  const nextPage = Math.max(1, Math.min(totalPages, parseInt(targetPage, 10) || 1));
  S.fv.currentPage = nextPage;
  
  const pageHtml = getEReaderPageHtml(nextPage);
  const pct = Math.round((nextPage / totalPages) * 100);

  // Update in-page reader content & scroll to top of page
  const inPageContent = document.getElementById('fvEReaderPageContent');
  if (inPageContent) {
    inPageContent.innerHTML = pageHtml;
    const viewport = document.getElementById('fvEReaderViewport');
    if (viewport) viewport.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Update in-page page number indicators
  const inPageCur = document.getElementById('fvEReaderCurPage');
  if (inPageCur) inPageCur.textContent = nextPage;
  const inPageTotal = document.getElementById('fvEReaderTotalPages');
  if (inPageTotal) inPageTotal.textContent = totalPages;
  const inPagePct = document.getElementById('fvEReaderPct');
  if (inPagePct) inPagePct.textContent = `${pct}% read`;
  const inPageFill = document.getElementById('fvEReaderProgressFill');
  if (inPageFill) inPageFill.style.width = `${pct}%`;
  
  // Dynamically update Prev button: disabled state and direct onclick
  const prevBtn = document.getElementById('fvEReaderPrevBtn');
  if (prevBtn) {
    prevBtn.disabled = (nextPage <= 1);
    prevBtn.onclick = () => goEReaderPage(nextPage - 1);
  }
  
  // Dynamically update Next button: disabled state and direct onclick
  const nextBtn = document.getElementById('fvEReaderNextBtn');
  if (nextBtn) {
    nextBtn.disabled = (nextPage >= totalPages);
    nextBtn.onclick = () => goEReaderPage(nextPage + 1);
  }

  // Update in-page input value
  const pageInput = document.getElementById('fvEReaderPageInput');
  if (pageInput) {
    pageInput.value = nextPage;
    pageInput.max = totalPages;
  }

  // Update fullscreen overlay if active
  const fsContent = document.getElementById('fvFsContent');
  if (fsContent) {
    const textWrap = fsContent.querySelector('.fv-ereader-page-text');
    if (textWrap) textWrap.innerHTML = pageHtml;
    fsContent.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const fsCur = document.getElementById('fvFsCurPage');
  if (fsCur) fsCur.textContent = nextPage;
  const fsTotal = document.getElementById('fvFsTotalPages');
  if (fsTotal) fsTotal.textContent = totalPages;
  const fsFill = document.getElementById('fvFsProgressFill');
  if (fsFill) fsFill.style.width = `${pct}%`;
  
  const fsPrev = document.getElementById('fvFsPrevBtn');
  if (fsPrev) {
    fsPrev.disabled = (nextPage <= 1);
    fsPrev.onclick = () => goEReaderPage(nextPage - 1);
  }
  const fsNext = document.getElementById('fvFsNextBtn');
  if (fsNext) {
    fsNext.disabled = (nextPage >= totalPages);
    fsNext.onclick = () => goEReaderPage(nextPage + 1);
  }
}

function handleEReaderTrackClick(e, isFs = false) {
  const track = e.currentTarget;
  const rect = track.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  const totalPages = S.fv.totalPages || 1;
  const targetPage = Math.max(1, Math.min(totalPages, Math.ceil(ratio * totalPages)));
  goEReaderPage(targetPage);
}

function runFileView(){
  const f = S.files[S.fv.file];
  if(!f) return;
  const out = $('#out');
  const PAGE_TOKENS = 350;
  const totalPages = Math.max(1, Math.ceil(f.toks.length / PAGE_TOKENS));
  S.fv.totalPages = totalPages;

  // If opening from a KWIC search hit, navigate to the specific page containing that token
  if (typeof S.fv.tokenIndex === 'number' && S.fv.tokenIndex >= 0) {
    S.fv.currentPage = Math.max(1, Math.min(totalPages, Math.floor(S.fv.tokenIndex / PAGE_TOKENS) + 1));
  } else if (!S.fv.currentPage || S.fv.currentPage > totalPages) {
    S.fv.currentPage = 1;
  }

  const curPage = S.fv.currentPage || 1;
  const pageTextHtml = getEReaderPageHtml(curPage);
  const pct = Math.round((curPage / totalPages) * 100);

  // Count search matches across the document
  const m = matcher(S.fv.term, false, false);
  let totalMatches = 0;
  if (m) {
    f.toks.forEach(t => { if (m(t.w)) totalMatches++; });
  }

  const pageOptions = [];
  for (let i = 1; i <= totalPages; i++) {
    pageOptions.push(`<option value="${i}" ${i === curPage ? 'selected' : ''}>Page ${i} / ${totalPages}</option>`);
  }

  const currentTheme = S.fv.readerTheme || 'white';
  const currentFont = S.fv.readerFont || 'serif';
  const currentSize = S.fv.readerSize || 15;

  const html = `
    <div class="fv-ereader-reader">
      <!-- E-Reader Top App Bar: Perfectly Organized 2-Tier Layout -->
      <div class="fv-ereader-header">
        <div class="fv-ereader-header-top">
          <div class="fv-ereader-title-block">
            <div class="fv-ereader-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px; height:15px;">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div style="min-width:0; flex:1;">
              <div class="fv-ereader-doc-name" title="${esc(f.name)}">${esc(f.name)}</div>
              <div style="font-size:11px; color:var(--ink-soft); font-family:'JetBrains Mono',monospace;">
                ${f.toks.length.toLocaleString()} tokens ${totalMatches > 0 ? `· <span style="color:var(--a1); font-weight:700;">${totalMatches.toLocaleString()} matches</span>` : ''}
              </div>
            </div>
          </div>
          <!-- Fullscreen Accent Button -->
          <button type="button" class="fv-ereader-btn fv-ereader-fs-btn" onclick="toggleEReaderFullscreen()" title="Open immersive full screen reader">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:13px; height:13px;"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            <span>Full Screen</span>
          </button>
        </div>

        <!-- Controls Row: All controls guaranteed on a single unified line -->
        <div class="fv-ereader-toolbar-row">
          <div class="fv-segmented-group">
            <button type="button" class="fv-seg-btn ${currentTheme==='white'?'active':''}" data-theme="white" onclick="setEReaderTheme('white')">White</button>
            <button type="button" class="fv-seg-btn ${currentTheme==='paper'?'active':''}" data-theme="paper" onclick="setEReaderTheme('paper')">Sepia</button>
            <button type="button" class="fv-seg-btn ${currentTheme==='night'?'active':''}" data-theme="night" onclick="setEReaderTheme('night')">Night</button>
          </div>
          <div class="fv-segmented-group">
            <button type="button" class="fv-seg-btn" onclick="changeEReaderFontSize(-1)" title="Smaller text">A−</button>
            <button type="button" class="fv-seg-btn" onclick="changeEReaderFontSize(1)" title="Larger text">A+</button>
          </div>
        </div>
      </div>

      <!-- E-Reader Reading Canvas Viewport -->
      <div class="fv-ereader-page-viewport theme-${currentTheme} font-${currentFont}" id="fvEReaderViewport" style="font-size:${currentSize}px;">
        <div class="fv-ereader-page-text" id="fvEReaderPageContent">${pageTextHtml}</div>
      </div>

      <!-- E-Reader Pager & Progress Bar Footer -->
      <div class="fv-ereader-footer">
        <!-- Progress Bar Indicator -->
        <div class="fv-ereader-progress-track" onclick="handleEReaderTrackClick(event)" title="Click anywhere to jump through book">
          <div class="fv-ereader-progress-fill" id="fvEReaderProgressFill" style="width:${pct}%;"></div>
        </div>

        <div class="fv-ereader-nav-row">
          <button type="button" class="fv-ereader-pager-btn" id="fvEReaderPrevBtn" onclick="goEReaderPage(${curPage - 1})" ${curPage <= 1 ? 'disabled' : ''}>
            ◀ Prev
          </button>

          <div class="fv-ereader-page-counter">
            <div class="fv-page-select-container">
              <span>Page</span>
              <input type="number" id="fvEReaderPageInput" min="1" max="${totalPages}" value="${curPage}" class="fv-page-num-input" onchange="goEReaderPage(+this.value)" onkeydown="if(event.key==='Enter')goEReaderPage(+this.value)">
              <span>of <b id="fvEReaderTotalPages">${totalPages}</b></span>
            </div>
            <span class="fv-ereader-page-sub" id="fvEReaderPct">${pct}% read</span>
          </div>

          <button type="button" class="fv-ereader-pager-btn" id="fvEReaderNextBtn" onclick="goEReaderPage(${curPage + 1})" ${curPage >= totalPages ? 'disabled' : ''}>
            Next ▶
          </button>
        </div>
      </div>
    </div>
  `;

  out.innerHTML = html;
  S.fv.tokenIndex = null; // reset
}

function onFileViewScroll(el) {
  if (!el) return;
  const anchors = el.querySelectorAll('.fv-page-anchor');
  if (!anchors || anchors.length === 0) return;
  const containerTop = el.scrollTop;
  let activePage = 1;
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i];
    if (a.offsetTop - el.offsetTop <= containerTop + 80) {
      activePage = parseInt(a.getAttribute('data-page'), 10) || 1;
    } else {
      break;
    }
  }
  const curPageEl = document.getElementById('fvCurPageNum');
  if (curPageEl) curPageEl.textContent = activePage;
  const gselWrap = document.getElementById('gsel-fvPageSelect');
  if (gselWrap && gselWrap.getAttribute('data-value') !== String(activePage)) {
    gselWrap.setAttribute('data-value', String(activePage));
    const btnSpan = gselWrap.querySelector('.gsel-btn span');
    const f = S.files[S.fv.file];
    const PAGE_SIZE = 280;
    const totalPages = Math.max(1, Math.ceil((f ? f.toks.length : 1) / PAGE_SIZE));
    if (btnSpan) btnSpan.textContent = `Page ${activePage} / ${totalPages}`;
  }
  S.fv.currentPage = activePage;
}

function jumpFileViewPage(pageArg) {
  const f = S.files[S.fv.file];
  if (!f) return;
  const PAGE_SIZE = 280;
  const totalPages = Math.max(1, Math.ceil(f.toks.length / PAGE_SIZE));
  let targetPage = 1;
  const curPage = S.fv.currentPage || 1;
  if (pageArg === 'prev') {
    targetPage = Math.max(1, curPage - 1);
  } else if (pageArg === 'next') {
    targetPage = Math.min(totalPages, curPage + 1);
  } else {
    targetPage = Math.max(1, Math.min(totalPages, parseInt(pageArg, 10) || 1));
  }
  S.fv.currentPage = targetPage;
  const anchor = document.getElementById(`fv-anchor-page-${targetPage}`);
  const container = document.querySelector('.filetext');
  if (anchor && container) {
    const offset = Math.max(0, anchor.offsetTop - container.offsetTop - 10);
    container.scrollTo({ top: offset, behavior: 'smooth' });
  }
  const curPageEl = document.getElementById('fvCurPageNum');
  if (curPageEl) curPageEl.textContent = targetPage;
  const gselWrap = document.getElementById('gsel-fvPageSelect');
  if (gselWrap) {
    gselWrap.setAttribute('data-value', String(targetPage));
    const btnSpan = gselWrap.querySelector('.gsel-btn span');
    if (btnSpan) btnSpan.textContent = `Page ${targetPage} / ${totalPages}`;
  }
}

function jumpFileViewPercent(pct) {
  const container = document.querySelector('.filetext');
  if (!container) return;
  const maxScroll = container.scrollHeight - container.clientHeight;
  const target = Math.max(0, Math.min(maxScroll, (pct / 100) * maxScroll));
  container.scrollTo({ top: target, behavior: 'smooth' });
}

function navigateFileViewMatch(dir) {
  if (!S.fv.matchesCount || S.fv.matchesCount <= 0) return;
  
  const oldActive = document.querySelector('.fv-match.active-match');
  if (oldActive) oldActive.classList.remove('active-match');
  
  S.fv.currentMatchIndex = (S.fv.currentMatchIndex + dir + S.fv.matchesCount) % S.fv.matchesCount;
  
  const curSpan = document.getElementById('fv-match-current');
  if (curSpan) curSpan.textContent = S.fv.currentMatchIndex + 1;
  
  scrollToCurrentMatch();
}

function scrollToCurrentMatch() {
  const el = document.getElementById(`fv-match-${S.fv.currentMatchIndex}`);
  if (el) {
    el.classList.add('active-match');
    const container = el.closest('.filetext');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const elemTop = (elRect.top - containerRect.top) + container.scrollTop;
      const containerHeight = container.clientHeight;
      const elemHeight = elRect.height;
      const targetScrollTop = elemTop - (containerHeight / 2) + (elemHeight / 2);
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
/* ---------- Clusters ---------- */
function vCluster(){
  if(!S.files.length) return `<section class="card glass"><h2>${I.cluster} Clusters</h2>${needCorpus()}</section>`;
  const extra = `<div class="controls-row" style="display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end;">
    <div class="field" style="flex:1; min-width:80px;"><label>Size</label>${gsel('csize', [2,3,4,5], S.cluster.size)}</div>
    <div class="field" style="flex:1; min-width:80px;"><label>Side</label>${gsel('cside', ['right','left'], S.cluster.side, v=>v==='right'?'Right':'Left')}</div>
    <div class="field" style="flex:1; min-width:80px;"><label>Min freq</label>${gsel('cmin', [1,2,3,5,10], S.cluster.min||1, v=>`Freq ≥ ${v}`)}</div>
  </div>`;
  return `<section class="card glass">
    <h2>${I.cluster} Clusters</h2>
    <p class="sub">Multi-word units built around your search term, ranked by frequency.</p>
    <div class="term-def"><b>Clusters</b> are short, repeated word sequences that form around your search term, such as "kind of" clustering around "kind". They reveal fixed phrases your word tends to appear in.</div>
    ${searchBar('runCluster()', S.cluster.term, false, false, extra)}
    <div id="out"></div></section>`;
}
function runCluster(){
  const [term, cs, rx] = readOpts();
  saveSearchHistory(term);
  S.cluster.term=term; S.cluster.size=+gselVal('csize'); S.cluster.side=gselVal('cside'); S.cluster.min=Math.max(1,+(gselVal('cmin')||$('#cmin')?.value||1));
  const hits = getHits(term, cs, rx), out=$('#out');
  if(!hits.length){ out.innerHTML=`<div class="empty">No hits for “${esc(term)}”.</div>`; return; }
  const n=S.cluster.size, counts=new Map(), range=new Map();
  hits.forEach(h=>{
    const toks=S.files[h.f].toks;
    const seg = S.cluster.side==='right' ? toks.slice(h.i, h.i+n) : toks.slice(Math.max(0,h.i-n+1), h.i+1);
    if(seg.length<n) return;
    const g=seg.map(t=>t.l).join(' ');
    counts.set(g,(counts.get(g)||0)+1);
    if(!range.has(g)) range.set(g,new Set()); range.get(g).add(h.f);
  });
  const list=[...counts].filter(([,f])=>f>=S.cluster.min).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  const rows=[['Rank','Cluster','Freq','Range']];
  const html=list.map(([g,f],k)=>{rows.push([k+1,g,f,range.get(g).size]);
    return `<tr><td class="num">${k+1}</td><td class="word">${esc(g)}</td><td class="num">${f}</td><td class="num">${range.get(g).size}</td></tr>`;}).join('');
  S.lastRows=rows;
  logWorkspaceTask({
    type: 'cluster',
    typeName: 'Clusters',
    title: `Clusters of "${term}" (size ${n})`,
    corpusSummary: `${S.files.length} file(s) · ${list.length.toLocaleString()} clusters`,
    summarySnippet: `Extracted ${list.length.toLocaleString()} ${n}-word clusters around "${term}".`,
    metrics: { Clusters: list.length, Size: n, Side: S.cluster.side },
    params: { ...S.cluster },
    exportableRows: S.lastRows,
    exportFilename: `clusters_${term.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`
  });
  const chartHtml = drawBarChart(`Top 10 Clusters of “${esc(term)}” by Frequency`, list.map(([g,f])=>({cluster:g, freq:f})), 'cluster', 'freq', 'kwic');
  
  out.innerHTML = resHead(`${list.length.toLocaleString()} cluster types`, "exportCSV(S.lastRows,'clusters.csv')") + chartHtml +
    `<div class="tablewrap"><table><thead><tr><th class="num">#</th><th>Cluster</th><th class="num">Freq</th><th class="num">Range</th></tr></thead><tbody>${html}</tbody></table></div>`;
}

/* ---------- N-Grams ---------- */
function vNgram(){
  if(!S.files.length) return `<section class="card glass"><h2>${I.ngram} N-Grams</h2>${needCorpus()}</section>`;
  return `<section class="card glass">
    <h2>${I.ngram} N-Grams</h2>
    <p class="sub">Every recurring word sequence in the corpus, with frequency and range (number of files it appears in).</p>
    <div class="term-def"><b>N-Grams</b> are sequences of N consecutive words that repeat anywhere in the corpus, for example "as well as" is a 3-gram. Unlike Clusters, N-Grams are not tied to one search term, they surface the corpus's most common phrases overall.</div>
    <div class="controls-row" style="display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end;">
      <div class="field" style="flex:1; min-width:80px;"><label>Size</label>${gsel('nsize', [2,3,4,5], S.ngram.size)}</div>
      <div class="field" style="flex:1; min-width:80px;"><label>Min freq</label>${gsel('nmin', [1,2,3,5,10], S.ngram.min||1, v=>`Freq ≥ ${v}`)}</div>
      <div class="field" style="flex:1; min-width:100px;"><label>Sort by</label>${gsel('nsort', ['freq','range','alpha'], S.ngram.sortBy, v=>({freq:'Frequency',range:'Range',alpha:'Alphabetical'}[v]))}</div>
      <button class="btn run btn-analyze" onclick="runNgram()">Analyze</button>
    </div>
    <div id="out"></div></section>`;
}
function runNgram(){
  S.ngram.size=+gselVal('nsize'); S.ngram.min=Math.max(1,+(gselVal('nmin')||$('#nmin')?.value||1)); S.ngram.sortBy=gselVal('nsort');
  const n=S.ngram.size, counts=new Map(), range=new Map();
  S.files.forEach((f,fi)=>{
    for(let i=0;i+n<=f.toks.length;i++){
      const g=f.toks.slice(i,i+n).map(t=>t.l).join(' ');
      counts.set(g,(counts.get(g)||0)+1);
      if(!range.has(g)) range.set(g,new Set()); range.get(g).add(fi);
    }
  });
  let list=[...counts].filter(([,f])=>f>=S.ngram.min);
  const by=S.ngram.sortBy;
  list.sort((a,b)=> by==='alpha' ? a[0].localeCompare(b[0])
    : by==='range' ? (range.get(b[0]).size-range.get(a[0]).size || b[1]-a[1])
    : (b[1]-a[1] || a[0].localeCompare(b[0])));
  const rows=[['Rank','N-Gram','Freq','Range']]; const out=$('#out');
  if(!list.length){ out.innerHTML=`<div class="empty">No ${n}-grams meet the minimum frequency of ${S.ngram.min}. Try lowering it.</div>`; return; }
  const html=list.map(([g,f],k)=>{rows.push([k+1,g,f,range.get(g).size]);
    return `<tr><td class="num">${k+1}</td><td class="word">${esc(g)}</td><td class="num">${f}</td><td class="num">${range.get(g).size}</td></tr>`;}).join('');
  S.lastRows=rows;
  logWorkspaceTask({
    type: 'ngram',
    typeName: 'N-Grams',
    title: `${n}-Grams Analysis (min freq ${S.ngram.min})`,
    corpusSummary: `${S.files.length} file(s) · ${list.length.toLocaleString()} n-grams`,
    summarySnippet: `Extracted ${list.length.toLocaleString()} recurring ${n}-grams sorted by ${by}.`,
    metrics: { 'N-Grams': list.length, Size: n, MinFreq: S.ngram.min },
    params: { ...S.ngram },
    exportableRows: S.lastRows,
    exportFilename: `ngrams_${n}gram.csv`
  });
  const chartMetric = by === 'range' ? 'range' : 'freq';
  const chartMetricLabel = by === 'range' ? 'Range' : 'Frequency';
  const chartData = list.map(([g,f])=>({ngram:g, freq:f, range:range.get(g).size}));
  const chartHtml = drawBarChart(`Top 10 ${n}-Grams by ${chartMetricLabel}`, chartData, 'ngram', chartMetric, 'kwic');
  
  out.innerHTML = resHead(`${list.length.toLocaleString()} ${n}-gram types`,
    "exportCSV(S.lastRows,'ngrams.csv')") + chartHtml +
    `<div class="tablewrap"><table><thead><tr><th class="num">#</th><th>N-Gram</th><th class="num">Freq</th><th class="num">Range</th></tr></thead><tbody>${html}</tbody></table></div>`;
}

/* ---------- Collocates ---------- */
function vColl(){
  if(!S.files.length) return `<section class="card glass"><h2>${I.link} Collocates</h2>${needCorpus()}</section>`;
  const extra = `<div class="controls-row" style="display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end;">
    <div class="field" style="flex:1; min-width:80px;"><label>Left span</label>${gsel('cl', [0,1,2,3,4,5], S.coll.L)}</div>
    <div class="field" style="flex:1; min-width:80px;"><label>Right span</label>${gsel('cr', [0,1,2,3,4,5], S.coll.R)}</div>
    <div class="field" style="flex:1; min-width:80px;"><label>Min co-freq</label>${gsel('comin', [1,2,3,5,10], S.coll.min||1, v=>`Co-freq ≥ ${v}`)}</div>
    <div class="field" style="flex:1; min-width:90px;"><label>Rank by</label>${gsel('cstat', ['MI','LL','T','Dice','Freq'], S.coll.stat)}</div>
  </div>`;
  return `<section class="card glass">
    <h2>${I.link} Collocates</h2>
    <p class="sub">Words that co-occur with your search term more often than chance predicts, scored with Mutual Information, log-likelihood, t-score, and Dice coefficient.</p>
    <div class="term-def"><b>Collocates</b> are words that keep turning up near your search term more than random chance would predict, like "heavy" next to "rain". <b>MI</b> (Mutual Information) highlights strong but rarer pairings; <b>LL</b> (log-likelihood) and <b>T</b> (t-score) favour pairings backed by more evidence; <b>Dice</b> measures direct cohesive association strength.</div>
    ${searchBar('runColl()', S.coll.term, false, false, extra)}
    <div id="out"></div></section>`;
}
function runColl(){
  const [term, cs, rx] = readOpts();
  saveSearchHistory(term);
  S.coll.term=term; S.coll.L=+gselVal('cl'); S.coll.R=+gselVal('cr');
  S.coll.min=Math.max(1,+(gselVal('comin')||$('#comin')?.value||1)); S.coll.stat=gselVal('cstat');
  const hits=getHits(term, cs, rx), out=$('#out');
  if(!hits.length){ out.innerHTML=`<div class="empty">No hits for “${esc(term)}”.</div>`; return; }
  const N=corpusTotals(S.files).tok, W=S.coll.L+S.coll.R, fw=hits.length;
  if(!W){ out.innerHTML=`<div class="empty">Set a left or right span greater than zero.</div>`; return; }
  const co=new Map(), coL=new Map(), coR=new Map();
  hits.forEach(h=>{
    const toks=S.files[h.f].toks;
    for(let d=-S.coll.L; d<=S.coll.R; d++){
      if(d===0) continue; const t=toks[h.i+d]; if(!t) continue;
      co.set(t.l,(co.get(t.l)||0)+1);
      (d<0?coL:coR).set(t.l,((d<0?coL:coR).get(t.l)||0)+1);
    }
  });
  const totals=new Map();
  S.files.forEach(f=>f.toks.forEach(t=>totals.set(t.l,(totals.get(t.l)||0)+1)));
  const list=[];
  co.forEach((fcw, w)=>{
    if(fcw<S.coll.min) return;
    const fc=totals.get(w)||fcw, E=fw*fc*W/N;
    const MI=Math.log2(fcw/E), T=(fcw-E)/Math.sqrt(fcw);
    const LL=2*(fcw*Math.log(fcw/E)-(fcw-E));
    const Dice=(2*fcw)/(fw+fc);
    list.push({w, fcw, fL:coL.get(w)||0, fR:coR.get(w)||0, fc, MI, LL, T, Dice});
  });
  const key=S.coll.stat;
  list.sort((a,b)=> key==='Freq' ? b.fcw-a.fcw : b[key]-a[key]);
  const rows=[['Rank','Collocate','Co-freq','Left','Right','Total freq','MI','LL','T','Dice']];
  const html=list.map((c,k)=>{
    rows.push([k+1,c.w,c.fcw,c.fL,c.fR,c.fc,c.MI.toFixed(3),c.LL.toFixed(3),c.T.toFixed(3),c.Dice.toFixed(4)]);
    return `<tr><td class="num">${k+1}</td><td class="word">${esc(c.w)}</td><td class="num">${c.fcw}</td><td class="num">${c.fL}</td><td class="num">${c.fR}</td><td class="num">${c.fc}</td><td class="num">${c.MI.toFixed(2)}</td><td class="num">${c.LL.toFixed(2)}</td><td class="num">${c.T.toFixed(2)}</td><td class="num">${c.Dice.toFixed(4)}</td></tr>`;}).join('');
  S.lastRows=rows;
  logWorkspaceTask({
    type: 'collocate',
    typeName: 'Collocates',
    title: `Collocates of "${term}" (${key})`,
    corpusSummary: `${S.files.length} file(s) · ${list.length.toLocaleString()} collocates`,
    summarySnippet: `Identified ${list.length.toLocaleString()} statistically associated collocates ranked by ${key}.`,
    metrics: { Collocates: list.length, Metric: key, Window: `${S.coll.L}L–${S.coll.R}R` },
    params: { ...S.coll },
    exportableRows: S.lastRows,
    exportFilename: `collocates_${term.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`
  });
  const chartHtml = drawBarChart(`Top 10 Collocates of “${esc(term)}” by ${key}`, list.map(c=>({colloc:c.w, val: key==='Freq' ? c.fcw : c[key]})), 'colloc', 'val', 'kwic');
  
  out.innerHTML = resHead(`${list.length.toLocaleString()} collocates of “${esc(term)}” (window ${S.coll.L}L–${S.coll.R}R)`,
    "exportCSV(S.lastRows,'collocates.csv')") + chartHtml +
    `<div class="tablewrap"><table><thead><tr><th class="num">#</th><th>Collocate</th><th class="num" style="white-space:nowrap !important; min-width:72px;">Co&#8209;Freq</th><th class="num" style="white-space:nowrap !important;">L</th><th class="num" style="white-space:nowrap !important;">R</th><th class="num" style="white-space:nowrap !important;">Fr</th><th class="num" style="white-space:nowrap !important;">MI</th><th class="num" style="white-space:nowrap !important;">LL</th><th class="num" style="white-space:nowrap !important;">T</th><th class="num" style="white-space:nowrap !important;">Dice</th></tr></thead><tbody>${html}</tbody></table></div>`;
}
/* ---------- Word List ---------- */
function buildWordCounts(arr){
  const counts=new Map(), range=new Map();
  arr.forEach((f,fi)=>f.toks.forEach(t=>{
    counts.set(t.l,(counts.get(t.l)||0)+1);
    if(!range.has(t.l)) range.set(t.l,new Set()); range.get(t.l).add(fi);
  }));
  return {counts, range};
}
function vWordList(){
  if(!S.files.length) return `<section class="card glass"><h2>${I.list} Word list</h2>${needCorpus()}</section>`;
  return `<section class="card glass">
    <h2>${I.list} Word list</h2>
    <p class="sub">Every word type in the corpus with frequency, normalised frequency and range.</p>
    <div class="term-def"><b>Word list</b> ranks every distinct word (type) by how often it occurs. <b>Range</b> is how many different files a word appears in, not just how often; a word in every file has wide range even at modest frequency.</div>
    <div class="controls-row" style="display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end;">
      <div class="field" style="flex:2; min-width:140px;">
        <label>Search Word</label>
        <input type="search" id="wsearch" placeholder="Type word to search..." value="${esc(S.wl.search||'')}" oninput="S.wl.search=this.value; runWordList()" style="width:100%; height:38px; box-sizing:border-box;">
      </div>
      <div class="field" style="flex:1; min-width:100px;"><label>Sort by</label>${gsel('wsort', ['freq','alpha','range'], S.wl.sortBy, v=>({freq:'Frequency',alpha:'Alphabetical',range:'Range'}[v]))}</div>
      <div style="display:flex; align-items:center; height:38px;">
        <span class="chip ${S.wl.stop?'on':''}" data-opt="stop" onclick="this.classList.toggle('on')">Hide function words</span>
      </div>
      <button class="btn run btn-analyze" onclick="runWordList()">Analyze</button>
    </div>
    <div id="out"></div></section>`;
}
function runWordList(){
  S.wl.sortBy=gselVal('wsort'); S.wl.stop=!!document.querySelector('[data-opt=stop].on');
  S.wl.search = $('#wsearch') ? $('#wsearch').value : (S.wl.search || '');
  const {counts, range}=buildWordCounts(S.files);
  const N=corpusTotals(S.files).tok;
  let list=[...counts]; if(S.wl.stop) list=list.filter(([w])=>!STOP.has(w));
  if(S.wl.search && S.wl.search.trim()){
    const q = S.wl.search.toLowerCase().trim();
    list = list.filter(([w]) => w.toLowerCase().includes(q));
  }
  const by=S.wl.sortBy;
  list.sort((a,b)=> by==='alpha' ? a[0].localeCompare(b[0])
    : by==='range' ? (range.get(b[0]).size-range.get(a[0]).size || b[1]-a[1])
    : (b[1]-a[1] || a[0].localeCompare(b[0])));
  const rows=[['Rank','Word','Freq','Per 1,000','Range']];
  const html=list.map(([w,f],k)=>{
    rows.push([k+1,w,f,(f/N*1000).toFixed(2),range.get(w).size]);
    return `<tr><td class="num">${k+1}</td><td class="word">${esc(w)}</td><td class="num">${f}</td><td class="num">${(f/N*1000).toFixed(2)}</td><td class="num">${range.get(w).size}</td></tr>`;}).join('');
  S.lastRows=rows;
  logWorkspaceTask({
    type: 'wordlist',
    typeName: 'Word List',
    title: `Corpus Frequency Word List`,
    corpusSummary: `${S.files.length} file(s) · ${list.length.toLocaleString()} types · ${N.toLocaleString()} tokens`,
    summarySnippet: `Generated full corpus vocabulary frequency list of ${list.length.toLocaleString()} word types.`,
    metrics: { Types: list.length, Tokens: N, Sort: by },
    params: { ...S.wl },
    exportableRows: S.lastRows,
    exportFilename: 'corpus_wordlist.csv'
  });
  const chartMetric = by === 'range' ? 'range' : 'freq';
  const chartMetricLabel = by === 'range' ? 'Range' : 'Frequency';
  const chartData = list.map(([w,f])=>({word:w, freq:f, range:range.get(w).size}));
  const chartHtml = drawBarChart(`Top 10 Words by ${chartMetricLabel}`, chartData, 'word', chartMetric, 'kwic');
  
  $('#out').innerHTML = resHead(`${list.length.toLocaleString()} word types · ${N.toLocaleString()} tokens`,
    "exportCSV(S.lastRows,'wordlist.csv')") + chartHtml +
    `<div class="tablewrap"><table><thead><tr><th class="num">#</th><th>Word</th><th class="num">Freq</th><th class="num">/1k</th><th class="num">Range</th></tr></thead><tbody>${html}</tbody></table></div>`;
}

/* ---------- Corpus Statistics & Lexical Density Suite ---------- */
function calculateSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word || word.length <= 2) return 1;
  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  word = word.replace(/^y/, '');
  const syl = word.match(/[aeiouy]{1,2}/g);
  return syl ? Math.max(1, syl.length) : 1;
}

function computeCorpusStats(fileList) {
  let totalTok = 0, totalChars = 0, totalSyllables = 0, complexWords = 0;
  let totalSentences = 0, totalParagraphs = 0;
  const typeMap = new Map();
  const fileStats = [];

  fileList.forEach(f => {
    const text = f.text || '';
    const toks = f.toks || [];
    const nTok = toks.length;
    totalTok += nTok;
    
    // Characters
    const chars = text.length;
    totalChars += chars;
    
    // Paragraphs
    const paras = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || 1;
    totalParagraphs += paras;
    
    // Sentences
    const sents = text.match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g) || [];
    const nSent = Math.max(1, sents.filter(s => s.trim().length > 2).length);
    totalSentences += nSent;
    
    // Types in this file
    const fTypes = new Map();
    let fSyllables = 0, fComplex = 0;
    
    toks.forEach(t => {
      const w = t.l;
      typeMap.set(w, (typeMap.get(w) || 0) + 1);
      fTypes.set(w, (fTypes.get(w) || 0) + 1);
      
      const syl = calculateSyllables(w);
      fSyllables += syl;
      totalSyllables += syl;
      if (syl >= 3) {
        fComplex++;
        complexWords++;
      }
    });
    
    // Per-file metrics
    const fTtr = nTok ? (fTypes.size / nTok) * 100 : 0;
    let fContentWords = 0;
    toks.forEach(t => {
      if (!STOP.has(t.l)) fContentWords++;
    });
    const fLexDensity = nTok ? (fContentWords / nTok) * 100 : 0;
    const fMeanSentLen = nTok / nSent;
    const fFre = nTok && nSent ? (206.835 - (1.015 * (nTok / nSent)) - (84.6 * (fSyllables / nTok))) : 0;
    
    fileStats.push({
      name: f.name,
      tokens: nTok,
      types: fTypes.size,
      ttr: fTtr,
      lexDensity: fLexDensity,
      sentences: nSent,
      meanSentLen: fMeanSentLen,
      fre: Math.max(0, Math.min(100, fFre))
    });
  });

  const totalTypes = typeMap.size;
  const ttr = totalTok ? (totalTypes / totalTok) * 100 : 0;
  
  // Standardized TTR (STTR) moving slice (100-word segments)
  let sttrSum = 0, sttrSlices = 0;
  const allToks = [];
  fileList.forEach(f => f.toks.forEach(t => allToks.push(t.l)));
  const sliceSize = 100;
  for (let i = 0; i + sliceSize <= allToks.length; i += sliceSize) {
    const sliceSet = new Set(allToks.slice(i, i + sliceSize));
    sttrSum += (sliceSet.size / sliceSize) * 100;
    sttrSlices++;
  }
  const sttr = sttrSlices ? (sttrSum / sttrSlices) : ttr;
  
  // Hapax Legomena (V1) & Dis Legomena (V2)
  let hapaxCount = 0, disCount = 0;
  typeMap.forEach(count => {
    if (count === 1) hapaxCount++;
    else if (count === 2) disCount++;
  });
  const hapaxVocabPct = totalTypes ? (hapaxCount / totalTypes) * 100 : 0;
  const hapaxTokenPct = totalTok ? (hapaxCount / totalTok) * 100 : 0;
  
  // Advanced Lexical Diversity Indices
  const guiraud = totalTok ? (totalTypes / Math.sqrt(totalTok)) : 0;
  const herdanC = (totalTok > 1 && totalTypes > 1) ? (Math.log(totalTypes) / Math.log(totalTok)) : 0;
  
  // Yule's Characteristic K & Simpson's D
  let yuleSum = 0, simpsonSum = 0;
  typeMap.forEach(count => {
    yuleSum += Math.pow(count, 2);
    simpsonSum += count * (count - 1);
  });
  const yuleK = (totalTok > 1) ? 10000 * ((yuleSum - totalTok) / Math.pow(totalTok, 2)) : 0;
  const simpsonD = (totalTok > 1) ? simpsonSum / (totalTok * (totalTok - 1)) : 0;
  
  // Lexical Density (Content vs Function words)
  let contentWordsCount = 0;
  allToks.forEach(w => {
    if (!STOP.has(w)) contentWordsCount++;
  });
  const lexicalDensity = totalTok ? (contentWordsCount / totalTok) * 100 : 0;
  const functionWordPct = 100 - lexicalDensity;
  
  // Mean sentence length and readability
  const meanSentLen = totalSentences ? (totalTok / totalSentences) : 0;
  const meanWordLen = totalTok ? (totalChars / totalTok) : 0;
  const fre = (totalTok && totalSentences) ? (206.835 - (1.015 * meanSentLen) - (84.6 * (totalSyllables / totalTok))) : 0;
  const fkgl = (totalTok && totalSentences) ? ((0.39 * meanSentLen) + (11.8 * (totalSyllables / totalTok)) - 15.59) : 0;
  const ari = (totalTok && totalSentences) ? (4.71 * (totalChars / totalTok) + 0.5 * meanSentLen - 21.43) : 0;
  const gunningFog = (totalTok && totalSentences) ? 0.4 * (meanSentLen + (100 * (complexWords / totalTok))) : 0;
  
  let freLabel = "Standard";
  if (fre >= 90) freLabel = "Very Easy (5th Grade)";
  else if (fre >= 80) freLabel = "Easy (6th Grade)";
  else if (fre >= 70) freLabel = "Fairly Easy (7th Grade)";
  else if (fre >= 60) freLabel = "Standard / Plain English";
  else if (fre >= 50) freLabel = "Fairly Difficult (High School)";
  else if (fre >= 30) freLabel = "Difficult (College / Academic)";
  else freLabel = "Very Difficult / Scientific Research";

  // Build Export Rows
  const exportRows = [
    ["Metric", "Value", "Notes / Benchmark"],
    ["Total Tokens (N)", totalTok.toLocaleString(), "Total running word count"],
    ["Total Types (V)", totalTypes.toLocaleString(), "Unique distinct vocabulary"],
    ["Type-Token Ratio (TTR)", `${ttr.toFixed(2)}%`, "Raw vocabulary richness"],
    ["Standardized TTR (STTR-100)", `${sttr.toFixed(2)}%`, "Sample-size normalized TTR"],
    ["Lexical Density", `${lexicalDensity.toFixed(2)}%`, "Content words (nouns, verbs, adjs, advs)"],
    ["Function Word Ratio", `${functionWordPct.toFixed(2)}%`, "Grammar & structural tokens"],
    ["Hapax Legomena (V1)", hapaxCount.toLocaleString(), `${hapaxVocabPct.toFixed(1)}% of unique vocabulary`],
    ["Dis Legomena (V2)", disCount.toLocaleString(), "Words appearing exactly twice"],
    ["Guiraud's R Index", guiraud.toFixed(3), "V / sqrt(N)"],
    ["Herdan's C Index", herdanC.toFixed(4), "log(V) / log(N)"],
    ["Yule's K Characteristic", yuleK.toFixed(2), "Repeat rate index"],
    ["Simpson's Diversity D", simpsonD.toFixed(5), "Vocabulary concentration"],
    ["Total Sentences", totalSentences.toLocaleString(), "Punctuation-bounded units"],
    ["Total Paragraphs", totalParagraphs.toLocaleString(), "Structural divisions"],
    ["Mean Sentence Length", `${meanSentLen.toFixed(1)} words`, "Words per sentence"],
    ["Mean Word Length", `${meanWordLen.toFixed(1)} chars`, "Characters per word"],
    ["Flesch Reading Ease", fre.toFixed(2), freLabel],
    ["Flesch-Kincaid Grade Level", fkgl.toFixed(1), "US school grade level"],
    ["Automated Readability Index (ARI)", ari.toFixed(1), "Character-based grade"],
    ["Gunning Fog Index", gunningFog.toFixed(1), "Complex word grade estimate"]
  ];

  return {
    tokens: totalTok,
    types: totalTypes,
    ttr,
    sttr,
    lexicalDensity,
    functionWordPct,
    hapaxCount,
    hapaxVocabPct,
    hapaxTokenPct,
    disCount,
    guiraud,
    herdanC,
    yuleK,
    simpsonD,
    sentences: totalSentences,
    paragraphs: totalParagraphs,
    meanSentLen,
    meanWordLen,
    fre: Math.max(0, Math.min(100, fre)),
    freLabel,
    fkgl: Math.max(0, fkgl),
    ari: Math.max(0, ari),
    gunningFog: Math.max(0, gunningFog),
    fileStats,
    exportRows
  };
}

function setDashboardTab(tab) {
  S.dashboardTab = "history";
  S.tool = "history";
  render();
}

function vStats() {
  S.tool = "history";
  return vHistory();
}

function vWorkspace() {
  S.tool = "history";
  return vHistory();
}

function vHistory() {
  const history = S.workspaceHistory || [];
  const query = (S.workspace.searchQuery || "").toLowerCase().trim();
  
  const filtered = history.filter(item => {
    if (!query) return true;
    const textToMatch = (item.dateStr || "") + " " + (item.timeStr || "") + " " + (item.fileName || item.corpusSummary || "") + " " + (item.title || "") + " " + (item.typeName || "") + " " + (item.summarySnippet || "");
    return textToMatch.toLowerCase().includes(query);
  });

  let cardsHtml = "";
  if (!filtered.length) {
    cardsHtml = `
      <div class="empty" style="padding: 44px 16px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 12px; color: var(--ink-soft); opacity: 0.5;">${I.history}</div>
        <b style="font-size: 16px; color: var(--ink);">${query ? "No matching analysis history" : "No analysis history yet"}</b><br>
        <span style="font-size: 13px; color: var(--ink-soft); display: inline-block; max-width: 380px; margin: 8px auto 18px; line-height: 1.5;">
          ${query ? "Try searching for a different file name, date, or analysis type." : "Whenever you analyze any file in the app (KWIC, Summarizer, Sentiment, Collocates, N-Grams, Word List, etc.), the record will appear here."}
        </span><br>
        ${!query ? `<button class="btn run" onclick="go('corpus')">Go to Corpus</button>` : `<button class="btn ghost" onclick="handleWorkspaceSearch('')">Clear Search</button>`}
      </div>
    `;
  } else {
    cardsHtml = filtered.map(item => {
      const meta = getTabCategoryMeta(item.type);
      const fileDisplay = item.fileName || item.corpusSummary || "Corpus File";
      return `
        <div class="workspace-card ws-card" style="margin-bottom:12px; padding:15px; border-radius:14px; border:1px solid var(--stroke); background:var(--card-glow-bg);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <div style="font-size:12.5px; font-weight:700; color:var(--ink-soft); display:inline-flex; align-items:center; gap:6px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px; height:14px; color:var(--a1);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>${esc(item.dateStr || "")} · ${esc(item.timeStr || "")}</span>
            </div>
            <div style="display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:8px; font-size:12px; font-weight:700; background:${meta.color}18; color:${meta.color}; border:1px solid ${meta.color}35;">
              <span style="display:inline-flex; align-items:center; width:14px; height:14px;">${meta.icon}</span>
              <span>${esc(item.typeName || meta.label)}</span>
            </div>
          </div>

          <div style="display:flex; align-items:flex-start; gap:8px; margin-bottom:8px; font-size:13.5px; font-weight:700; color:var(--ink);">
            <span style="display:inline-flex; align-items:center; color:var(--a1); width:16px; height:16px; flex-shrink:0; margin-top:2px;">${I.folder}</span>
            <span>File Analyzed: <span style="color:var(--a1); word-break:break-all;">${esc(fileDisplay)}</span></span>
          </div>

          <div style="font-size:12.5px; color:var(--ink-soft); line-height:1.45; margin-bottom:12px; padding:9px 12px; background:var(--row); border-radius:8px; border:1px solid var(--stroke-2);">
            <div><b style="color:var(--ink);">Analysis Performed:</b> ${esc(item.title || item.typeName)}</div>
            ${item.summarySnippet ? `<div style="font-size:11.5px; margin-top:5px; opacity:0.9; color:var(--ink);">${esc(item.summarySnippet)}</div>` : ""}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <button class="btn run small" onclick="revisitWorkspaceItem('${item.id}')" style="display:inline-flex; align-items:center; gap:6px; font-size:12px; padding:6px 12px;">
              ${I.search} Revisit
            </button>
            <div style="display:flex; gap:6px;">
              ${item.exportableRows ? `
                <button class="btn ghost small" onclick="exportWorkspaceItem('${item.id}')" style="display:inline-flex; align-items:center; gap:5px; font-size:11.5px; padding:6px 10px;">
                  ${I.dl} Export
                </button>
              ` : ""}
              <button class="btn ghost small" onclick="deleteWorkspaceItem('${item.id}')" style="color:var(--danger, #ef4444); display:inline-flex; align-items:center; gap:5px; font-size:11.5px; padding:6px 10px;" title="Delete log">
                ${I.trash} Delete
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  return `
    <section class="card glass">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
        <div>
          <h2>${I.history} Analysis History</h2>
          <p class="sub">Log of all analyses: date, file analyzed, and analysis performed.</p>
        </div>
        ${history.length > 0 ? `
          <button class="btn ghost small" onclick="confirmClearWorkspace(this)" style="color:var(--danger, #ef4444); display:inline-flex; align-items:center; gap:5px; font-size:11.5px;">
            ${I.trash} Clear History
          </button>
        ` : ""}
      </div>

      ${history.length > 0 ? `
        <div class="search-row" style="margin-bottom:16px;">
          <input type="search" placeholder="Search by file name, analysis, date..." value="${esc(S.workspace.searchQuery || "")}" oninput="handleWorkspaceSearch(this.value)">
          ${S.workspace.searchQuery ? `<button class="btn ghost" onclick="handleWorkspaceSearch('')">Clear</button>` : ""}
        </div>
        <div style="font-size:12px; font-weight:600; color:var(--ink-soft); margin-bottom:12px;">
          Showing <b style="color:var(--ink);">${filtered.length}</b> of ${history.length} analysis log(s)
        </div>
      ` : ""}

      <div class="workspace-list" style="display:flex; flex-direction:column;">
        ${cardsHtml}
      </div>
    </section>
  `;
}
const vDashboard = vHistory;

function runStats(){
  if(!S.files.length) return;
  const stats = computeCorpusStats(S.files);
  S.lastRows = stats.exportRows;
  
  // Log to workspace & task counter
  logWorkspaceTask({
    type: 'stats',
    typeName: 'Corpus Statistics',
    title: `Corpus Summary & Lexical Density`,
    corpusSummary: `${S.files.length} file(s) · ${stats.tokens.toLocaleString()} tokens`,
    summarySnippet: `TTR: ${stats.ttr.toFixed(1)}% · STTR: ${stats.sttr.toFixed(1)}% · Lexical Density: ${stats.lexicalDensity.toFixed(1)}% · Readability: ${stats.fre.toFixed(1)} (${stats.freLabel})`,
    metrics: { Tokens: stats.tokens, Types: stats.types, TTR: `${stats.ttr.toFixed(1)}%`, STTR: `${stats.sttr.toFixed(1)}%`, Density: `${stats.lexicalDensity.toFixed(1)}%`, Hapax: stats.hapaxCount },
    params: {},
    exportableRows: stats.exportRows,
    exportFilename: `corpus_stats_report.csv`
  });

  const heroHtml = `
  <div class="stat-hero-grid">
    <!-- Card 1: Lexical Richness -->
    <div class="stat-hero-card">
      <div>
        <div class="hero-label"><span class="inline-svg-icon" style="color:var(--a1); width:14px; height:14px;">${I.list}</span> Lexical Richness</div>
        <div class="hero-val">${stats.ttr.toFixed(1)}<span style="font-size:16px; font-weight:600; color:var(--ink-soft);">% TTR</span></div>
        <div class="metric-bar-wrap">
          <div class="metric-bar-fill" style="width:${Math.min(100, stats.ttr)}%; background:linear-gradient(90deg, var(--a2), var(--a1));"></div>
        </div>
      </div>
      <div class="hero-sub">
        <b>${stats.types.toLocaleString()}</b> types in <b>${stats.tokens.toLocaleString()}</b> tokens<br>
        <span style="color:var(--ink);">STTR (100-word slices): <b>${stats.sttr.toFixed(1)}%</b></span>
      </div>
    </div>

    <!-- Card 2: Lexical Density -->
    <div class="stat-hero-card">
      <div>
        <div class="hero-label"><span class="inline-svg-icon" style="color:#10b981; width:14px; height:14px;">${I.cluster}</span> Lexical Density</div>
        <div class="hero-val">${stats.lexicalDensity.toFixed(1)}<span style="font-size:16px; font-weight:600; color:var(--ink-soft);">% Content</span></div>
        <div class="metric-bar-wrap" style="display:flex;">
          <div style="width:${stats.lexicalDensity}%; background:#10b981; height:100%;"></div>
          <div style="width:${stats.functionWordPct}%; background:var(--stroke-2); height:100%;"></div>
        </div>
      </div>
      <div class="hero-sub">
        Content words: <b>${stats.lexicalDensity.toFixed(1)}%</b> (Nouns, Verbs, Adjs)<br>
        Function words: <b>${stats.functionWordPct.toFixed(1)}%</b> (Grammar words)
      </div>
    </div>

    <!-- Card 3: Hapax Legomena & Vocabulary -->
    <div class="stat-hero-card">
      <div>
        <div class="hero-label"><span class="inline-svg-icon" style="color:#f59e0b; width:14px; height:14px;">${I.tag}</span> Hapax Legomena</div>
        <div class="hero-val">${stats.hapaxCount.toLocaleString()}<span style="font-size:14px; font-weight:600; color:var(--ink-soft);"> words</span></div>
        <div class="metric-bar-wrap">
          <div class="metric-bar-fill" style="width:${Math.min(100, stats.hapaxVocabPct)}%; background:#f59e0b;"></div>
        </div>
      </div>
      <div class="hero-sub">
        <b>${stats.hapaxVocabPct.toFixed(1)}%</b> of unique types appear only once<br>
        Dis legomena (V2): <b>${stats.disCount.toLocaleString()}</b> words
      </div>
    </div>

    <!-- Card 4: Readability & Complexity -->
    <div class="stat-hero-card">
      <div>
        <div class="hero-label"><span class="inline-svg-icon" style="color:#a855f7; width:14px; height:14px;">${I.doc}</span> Readability (FRE)</div>
        <div class="hero-val">${stats.fre.toFixed(1)}<span style="font-size:14px; font-weight:600; color:var(--ink-soft);"> / 100</span></div>
        <div class="metric-bar-wrap">
          <div class="metric-bar-fill" style="width:${Math.max(5, Math.min(100, stats.fre))}%; background:linear-gradient(90deg, #a855f7, #ec4899);"></div>
        </div>
      </div>
      <div class="hero-sub">
        Level: <b style="color:var(--ink);">${stats.freLabel}</b><br>
        Grade: <b>FKGL ${stats.fkgl.toFixed(1)}</b> · ARI: <b>${stats.ari.toFixed(1)}</b>
      </div>
    </div>
  </div>`;

  // Per-file comparison table (if multiple files)
  let fileTableHtml = '';
  if (stats.fileStats.length > 1) {
    const fRows = stats.fileStats.map((fs, idx) => `
      <tr>
        <td class="num">${idx + 1}</td>
        <td class="word" style="font-weight:600;">${esc(fs.name)}</td>
        <td class="num">${fs.tokens.toLocaleString()}</td>
        <td class="num">${fs.types.toLocaleString()}</td>
        <td class="num">${fs.ttr.toFixed(1)}%</td>
        <td class="num">${fs.lexDensity.toFixed(1)}%</td>
        <td class="num">${fs.meanSentLen.toFixed(1)}</td>
        <td class="num" style="font-weight:700;">${fs.fre.toFixed(1)}</td>
      </tr>
    `).join('');
    
    fileTableHtml = `
    <div style="margin: 20px 0 10px;">
      <h3 style="font-size:15px; font-family:'Sora'; margin:0 0 8px 0; color:var(--ink);">Individual File Breakdown</h3>
      <div class="tablewrap">
        <table>
          <thead>
            <tr>
              <th class="num">#</th>
              <th>File Name</th>
              <th class="num">Tokens</th>
              <th class="num">Types</th>
              <th class="num">TTR</th>
              <th class="num">Density</th>
              <th class="num">Mean Sent</th>
              <th class="num">FRE</th>
            </tr>
          </thead>
          <tbody>${fRows}</tbody>
        </table>
      </div>
    </div>`;
  }

  // Summary Metrics Table
  const tableRowsHtml = stats.exportRows.slice(1).map(([metric, val, note]) => `
    <tr>
      <td class="word" style="font-weight:600; color:var(--ink);">${esc(metric)}</td>
      <td class="num" style="font-weight:700; font-family:'Sora'; color:var(--a1);">${esc(val)}</td>
      <td style="font-size:12px; color:var(--ink-soft);">${esc(note)}</td>
    </tr>
  `).join('');

  S.lastRows = stats.exportRows;

  logWorkspaceTask({
    type: 'stats',
    typeName: 'Corpus Statistics',
    title: `Corpus Statistics & Diversity Audit`,
    corpusSummary: `${S.files.length} file(s) · ${stats.tokens.toLocaleString()} tokens`,
    summarySnippet: `TTR: ${stats.ttr.toFixed(1)}%, STTR: ${stats.sttr.toFixed(1)}%, Lexical Density: ${stats.lexDensity.toFixed(1)}%, FRE: ${stats.fre.toFixed(1)} (${stats.freLabel})`,
    metrics: { Tokens: stats.tokens, Types: stats.types, TTR: `${stats.ttr.toFixed(1)}%`, STTR: `${stats.sttr.toFixed(1)}%`, FRE: stats.fre.toFixed(1) },
    exportableRows: stats.exportRows,
    exportFilename: 'corpus_stats_report.csv'
  });

  $('#out').innerHTML = resHead(`Corpus Audit · ${stats.tokens.toLocaleString()} tokens across ${S.files.length} file(s)`, "exportCSV(S.lastRows, 'corpus_stats_report.csv')") +
    heroHtml +
    fileTableHtml +
    `<div style="margin-top:16px;">
      <h3 style="font-size:15px; font-family:'Sora'; margin:0 0 8px 0; color:var(--ink);">Detailed Linguistic Metrics &amp; Diversity Indices</h3>
      <div class="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Metric Formula / Index</th>
              <th class="num">Calculated Value</th>
              <th>Benchmark &amp; Interpretation</th>
            </tr>
          </thead>
          <tbody>${tableRowsHtml}</tbody>
        </table>
      </div>
    </div>`;
}

/* ---------- Empirical Keyword & Keyness Analysis Suite ---------- */
function vKeyword(){
  if(!S.files.length) return `<section class="card glass"><h2>${I.key} Keyness &amp; Keyword Analysis</h2>${needCorpus()}</section>`;
  if(!S.ref.length) return `<section class="card glass">
    <h2>${I.key} Keyness &amp; Keyword Analysis</h2>
    <div class="empty" style="padding:24px 16px;">
      <div style="font-size:28px; margin-bottom:8px;">${I.key}</div>
      <b style="font-size:16px; color:var(--ink);">Reference Corpus Required</b><br>
      <span style="font-size:13px; color:var(--ink-soft); line-height:1.5; display:inline-block; max-width:400px; margin-top:4px;">
        Keyness compares your loaded target corpus against a reference baseline using Log-Likelihood (G²) or Chi-Square (χ²) to identify statistically distinctive words.
      </span>
    </div>
    <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:12px;">
      <button class="btn run" onclick="loadSampleRef(); go('keyword');">Load Built-in Reference Corpus</button>
      <button class="btn ghost" onclick="go('corpus')">Upload Custom Reference Files</button>
    </div>
  </section>`;
  
  return `<section class="card glass">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
      <div>
        <h2>${I.key} Keyness &amp; Keyword Analysis</h2>
        <p class="sub">Empirical keyness comparison of target corpus against reference corpus using Log-Likelihood (G²), Chi-Square (χ²), and Log Ratio Effect Size (Hardie, 2014).</p>
      </div>
    </div>
    <div class="term-def"><b>Keyness</b> isolates words with statistically significant differences in usage between your target text and reference baseline. <b>Log-Likelihood (G²)</b> measures statistical evidence strength, while <b>Log Ratio</b> quantifies effect size in powers of 2.</div>
    
    <div class="controls" style="display:flex; flex-direction:column; gap:12px;">
      <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
        <span class="chip ${S.kw.show==='pos'?'on':''}" id="kwPos" onclick="S.kw.show='pos'; runKeyword()">Positive keywords (Overused)</span>
        <span class="chip ${S.kw.show==='neg'?'on':''}" id="kwNeg" onclick="S.kw.show='neg'; runKeyword()">Negative keywords (Underused)</span>
        <span class="chip ${S.kw.removeStop?'on':''}" id="kwStopChip" onclick="this.classList.toggle('on'); S.kw.removeStop=this.classList.contains('on'); runKeyword()">Hide function words</span>
      </div>
      
      <div class="controls-row" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px; width:100%; box-sizing:border-box;">
        <div class="field" style="min-width:0;">
          <label>Ranking Metric</label>
          ${gsel('kwMetric', ['LL','Chi','LR'], S.kw.metric||'LL', v=>({LL:'Log-Likelihood (G²)', Chi:'Chi-Square (χ²)', LR:'Log Ratio (Effect Size)'}[v]))}
        </div>
        <div class="field" style="min-width:0;">
          <label>Significance Cutoff</label>
          ${gsel('kwSig', ['all','p05','p01','p001'], S.kw.sigFilter||'all', v=>({all:'All Words', p05:'p < 0.05 (*)', p01:'p < 0.01 (**)', p001:'p < 0.001 (***)'}[v]))}
        </div>
        <div class="field" style="min-width:0;">
          <label>Min Frequency: <b style="color:var(--a1); font-weight:800;">${S.kw.minFreq||2}</b></label>
          ${gsel('kwMinFreq', [1,2,5,10], S.kw.minFreq||2, v => `Freq ≥ ${v}`, val => { S.kw.minFreq = +val; runKeyword(); })}
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; margin-top:2px;">
        <button class="btn run btn-analyze" onclick="runKeyword()">Analyze</button>
      </div>
    </div>
    <div id="out"></div>
  </section>`;
}

function runKeyword(){
  $('#kwPos')?.classList.toggle('on', S.kw.show==='pos');
  $('#kwNeg')?.classList.toggle('on', S.kw.show==='neg');
  S.kw.metric = gselVal('kwMetric') || S.kw.metric || 'LL';
  S.kw.sigFilter = gselVal('kwSig') || S.kw.sigFilter || 'all';
  S.kw.minFreq = +(gselVal('kwMinFreq') || S.kw.minFreq || 2);
  S.kw.removeStop = $('#kwStopChip') ? $('#kwStopChip').classList.contains('on') : S.kw.removeStop;

  const tgt = buildWordCounts(S.files).counts, ref = buildWordCounts(S.ref).counts;
  const c = corpusTotals(S.files).tok, d = corpusTotals(S.ref).tok;
  if (!c || !d) {
    $('#out').innerHTML = `<div class="empty">Corpus or Reference is empty.</div>`;
    return;
  }

  const words = new Set([...tgt.keys(), ...ref.keys()]);
  const list = [];

  words.forEach(w => {
    if (S.kw.removeStop && STOP.has(w)) return;
    const a = tgt.get(w) || 0, b = ref.get(w) || 0;
    if (a + b < S.kw.minFreq) return;

    // Expected frequencies
    const E1 = c * (a + b) / (c + d);
    const E2 = d * (a + b) / (c + d);

    // Log-Likelihood (G²)
    let LL = 0;
    if (a > 0) LL += a * Math.log(a / E1);
    if (b > 0) LL += b * Math.log(b / E2);
    LL *= 2;

    // Chi-Square (χ²) with Yates correction safeguard
    const chi = (Math.pow(a - E1, 2) / (E1 || 1)) + (Math.pow(b - E2, 2) / (E2 || 1));

    // Log Ratio (Hardie, 2014) effect size
    const LR = Math.log2(((a || 0.5) / c) / ((b || 0.5) / d));
    
    // % Difference
    const pctDiff = (((a / c) - (b / d)) / ((b / d) || 0.00001)) * 100;
    const pos = (a / c) >= (b / d);

    // Significance p-value markers
    let sigStr = "n.s.", sigLevel = 0;
    if (LL >= 15.13) { sigStr = "p < 0.0001 (****)"; sigLevel = 4; }
    else if (LL >= 10.83) { sigStr = "p < 0.001 (***)"; sigLevel = 3; }
    else if (LL >= 6.63) { sigStr = "p < 0.01 (**)"; sigLevel = 2; }
    else if (LL >= 3.84) { sigStr = "p < 0.05 (*)"; sigLevel = 1; }

    list.push({ w, a, b, E1, E2, LL, chi, LR, pctDiff, pos, sigStr, sigLevel });
  });

  // Filter direction
  let shown = list.filter(x => S.kw.show === 'pos' ? x.pos : !x.pos);

  // Filter significance
  if (S.kw.sigFilter === 'p05') shown = shown.filter(x => x.sigLevel >= 1);
  else if (S.kw.sigFilter === 'p01') shown = shown.filter(x => x.sigLevel >= 2);
  else if (S.kw.sigFilter === 'p001') shown = shown.filter(x => x.sigLevel >= 3);

  // Sort by chosen metric
  if (S.kw.metric === 'Chi') shown.sort((x, y) => y.chi - x.chi);
  else if (S.kw.metric === 'LR') shown.sort((x, y) => Math.abs(y.LR) - Math.abs(x.LR));
  else shown.sort((x, y) => y.LL - x.LL);

  const rows = [['Rank', 'Keyword', 'Target Freq (a)', 'Target /1k', 'Ref Freq (b)', 'Ref /1k', 'Log-Likelihood (G²)', 'Chi-Square (χ²)', 'Log Ratio (Effect Size)', '% Difference', 'Significance']];
  
  const html = shown.map((x, k) => {
    const tgtPerK = (x.a / c * 1000).toFixed(2);
    const refPerK = (x.b / d * 1000).toFixed(2);
    rows.push([k + 1, x.w, x.a, tgtPerK, x.b, refPerK, x.LL.toFixed(3), x.chi.toFixed(3), x.LR.toFixed(3), x.pctDiff.toFixed(1) + '%', x.sigStr]);
    const sigClass = x.sigLevel >= 3 ? 'high' : '';
    return `<tr>
      <td class="num">${k + 1}</td>
      <td class="word"><a href="javascript:void(0)" onclick="searchKeywordInKwic('${esc(x.w).replace(/'/g, "\\'")}')" style="color:var(--ink); font-weight:700; text-decoration:none;">${esc(x.w)}</a></td>
      <td class="num">${x.a.toLocaleString()}</td>
      <td class="num">${tgtPerK}</td>
      <td class="num">${x.b.toLocaleString()}</td>
      <td class="num">${refPerK}</td>
      <td class="num" style="font-weight:700; color:var(--a1);">${x.LL.toFixed(2)}</td>
      <td class="num">${x.chi.toFixed(2)}</td>
      <td class="num">${x.LR > 0 ? '+' : ''}${x.LR.toFixed(2)}</td>
      <td><span class="sig-badge ${sigClass}">${esc(x.sigStr)}</span></td>
    </tr>`;
  }).join('');

  S.lastRows = rows;
  
  // Log to workspace & increment task count
  logWorkspaceTask({
    type: 'keyword',
    typeName: 'Keyness Analysis',
    title: `${S.kw.show==='pos'?'Positive':'Negative'} Keywords (${S.kw.metric})`,
    corpusSummary: `Target: ${c.toLocaleString()} tok · Ref: ${d.toLocaleString()} tok`,
    summarySnippet: `Extracted ${shown.length.toLocaleString()} distinctive ${S.kw.show==='pos'?'positive':'negative'} keywords using ${S.kw.metric}.`,
    metrics: { Keywords: shown.length, Metric: S.kw.metric, Direction: S.kw.show, TargetTokens: c, RefTokens: d },
    params: { ...S.kw },
    exportableRows: S.lastRows,
    exportFilename: `keyness_${S.kw.show}_${S.kw.metric.toLowerCase()}.csv`
  });

  const keywordType = S.kw.show === 'pos' ? 'Positive (Overused)' : 'Negative (Underused)';
  const chartMetricKey = S.kw.metric === 'Chi' ? 'chi' : (S.kw.metric === 'LR' ? 'LR' : 'LL');
  const chartLabel = S.kw.metric === 'Chi' ? 'Chi-Square (χ²)' : (S.kw.metric === 'LR' ? 'Log Ratio' : 'Log-Likelihood (G²)');
  const chartHtml = drawBarChart(`Top 10 ${keywordType} Keywords by ${chartLabel}`, shown.map(x => ({ keyword: x.w, val: Math.abs(x[chartMetricKey]) })), 'keyword', 'val', 'kwic');

  $('#out').innerHTML = resHead(`${shown.length.toLocaleString()} ${S.kw.show==='pos'?'positive':'negative'} keywords · Target ${c.toLocaleString()} vs Ref ${d.toLocaleString()} tokens`,
    "exportCSV(S.lastRows,'keywords.csv')") + chartHtml +
    `<div class="tablewrap"><table><thead><tr>
      <th class="num">#</th>
      <th>Keyword</th>
      <th class="num">Tgt Freq</th>
      <th class="num">Tgt /1k</th>
      <th class="num">Ref Freq</th>
      <th class="num">Ref /1k</th>
      <th class="num">LL (G²)</th>
      <th class="num">Chi (χ²)</th>
      <th class="num">LogR</th>
      <th>Significance</th>
    </tr></thead><tbody>${html}</tbody></table></div>`;
}

function searchKeywordInKwic(term) {
  S.q.term = term;
  go('kwic');
  setTimeout(() => {
    const input = document.getElementById('q');
    if (input) input.value = term;
    runKwic();
  }, 100);
}

/* ---------- Word Cloud ---------- */
S.cloudZoom = 1.0;
S.cloudPanX = 0;
S.cloudPanY = 0;
S.cloud = S.cloud || { hideFunctionWords: false };

function applyCloudTransform() {
  const inner = document.getElementById('cloudInner');
  if (!inner) return;
  inner.style.transform = `translate(${S.cloudPanX}px, ${S.cloudPanY}px) scale(${S.cloudZoom})`;
  inner.style.transformOrigin = '500px 500px';
  const val = document.getElementById('zoomVal');
  if (val) {
    val.textContent = Math.round(S.cloudZoom * 100) + '%';
  }
}

function zoomCloud(diff, reset=false) {
  const inner = document.getElementById('cloudInner');
  if (inner) inner.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
  if (reset) {
    S.cloudZoom = 1.0;
    S.cloudPanX = 0;
    S.cloudPanY = 0;
  } else {
    S.cloudZoom = Math.max(0.35, Math.min(3.5, S.cloudZoom + diff));
  }
  applyCloudTransform();
}

function toggleCloudStopwords(el) {
  el.classList.toggle('on');
  if (!S.cloud) S.cloud = {};
  S.cloud.hideFunctionWords = el.classList.contains('on');
  if (S.files && S.files.length && document.getElementById('cloudInner')) {
    runCloud();
  }
}

function initCloudTouchZoom(box) {
  if (!box || box._touchZoomAttached) return;
  box._touchZoomAttached = true;

  let initialPinchDist = null;
  let startPinchZoom = 1.0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let startPanX = 0;
  let startPanY = 0;

  box.addEventListener('touchstart', (e) => {
    const inner = document.getElementById('cloudInner');
    if (inner) inner.style.transition = 'none';

    if (e.touches.length === 2) {
      isDragging = false;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      startPinchZoom = S.cloudZoom || 1.0;
    } else if (e.touches.length === 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      startPanX = S.cloudPanX || 0;
      startPanY = S.cloudPanY || 0;
    }
  }, { passive: false });

  box.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialPinchDist) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (initialPinchDist > 5) {
        const factor = currentDist / initialPinchDist;
        S.cloudZoom = Math.max(0.35, Math.min(3.5, startPinchZoom * factor));
        applyCloudTransform();
      }
    } else if (e.touches.length === 1 && isDragging) {
      const dx = (e.touches[0].clientX - dragStartX) / (S.cloudZoom || 1);
      const dy = (e.touches[0].clientY - dragStartY) / (S.cloudZoom || 1);
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        e.preventDefault();
        S.cloudPanX = startPanX + dx;
        S.cloudPanY = startPanY + dy;
        applyCloudTransform();
      }
    }
  }, { passive: false });

  const stopTouch = () => {
    initialPinchDist = null;
    isDragging = false;
    const inner = document.getElementById('cloudInner');
    if (inner) inner.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
  };
  box.addEventListener('touchend', stopTouch);
  box.addEventListener('touchcancel', stopTouch);

  box.addEventListener('wheel', (e) => {
    e.preventDefault();
    const diff = e.deltaY < 0 ? 0.15 : -0.15;
    zoomCloud(diff, false);
  }, { passive: false });
}

function vCloud(){
  if(!S.files.length) return `<section class="card glass"><h2>${I.cloud} Word cloud</h2>${needCorpus()}</section>`;
  const isStopOn = !!(S.cloud && S.cloud.hideFunctionWords);
  return `<section class="card glass">
    <h2>${I.cloud} Word cloud</h2>
    <p class="sub">Vibrant visual word summaries. Generated entirely offline on your device.</p>
    <div class="term-def"><b>Word cloud</b> is a quick visual summary: the bigger a word appears, the more often it occurs. <b>Click on any word to instantly search for it in the KWIC concordance!</b></div>
    <div class="controls" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <button class="btn run btn-analyze" onclick="runCloud()">Analyze</button>
      <span class="chip ${isStopOn ? 'on' : ''}" id="cloudStopChip" onclick="toggleCloudStopwords(this)" style="cursor:pointer; user-select:none;">Hide function words</span>
      <button class="btn ghost small" id="saveCloudBtn" onclick="exportCloudAsPNG()" style="display: none; height: 38px; border-radius: 10px; align-items: center; gap: 4px; border: 1px solid var(--stroke-2); background: var(--row-btn, rgba(255,255,255,0.03)); cursor: pointer; padding: 0 14px; font-weight: 600;">Save Image</button>
      
      <!-- Zoom controls! -->
      <div id="cloudZoomControls" style="display: none; align-items: center; gap: 4px; background: var(--stroke-2); padding: 4px; border-radius: 10px; margin-left: auto;">
        <span style="font-size: 11px; font-weight: 700; color: var(--ink-soft); padding: 0 8px;">Zoom: <span id="zoomVal">100%</span></span>
        <button class="btn ghost small" style="padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; display:inline-flex; align-items:center;" onclick="zoomCloud(-0.15)"><span style="display:inline-flex; width:12px; height:12px;">${I.minus}</span></button>
        <button class="btn ghost small" style="padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; display:inline-flex; align-items:center;" onclick="zoomCloud(0.15)"><span style="display:inline-flex; width:12px; height:12px;">${I.plus}</span></button>
        <button class="btn ghost small" style="padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;" onclick="zoomCloud(0, true)">Reset</button>
      </div>
    </div>
    <div id="out"></div></section>`;
}
const CLOUD_COLS = [
  '#f43f5e', // Vivid Rose
  '#ec4899', // Hot Pink
  '#d946ef', // Electric Magenta
  '#a855f7', // Vivid Purple
  '#8b5cf6', // Violet
  '#6366f1', // Indigo Glow
  '#3b82f6', // Electric Blue
  '#0ea5e9', // Sky Blue
  '#06b6d4', // Bright Cyan
  '#00f5d4', // Neon Teal
  '#10b981', // Emerald Green
  '#22c55e', // Vivid Green
  '#84cc16', // Lime
  '#eab308', // Amber Gold
  '#f97316', // Vivid Orange
  '#ff007f', // Cyber Pink
  '#ffd166', // Bright Yellow
  '#ff6b6b'  // Coral Red
];

async function runCloud(){
  const {counts}=buildWordCounts(S.files);
  const stopChip = document.getElementById('cloudStopChip');
  const hideStops = stopChip ? stopChip.classList.contains('on') : !!(S.cloud && S.cloud.hideFunctionWords);
  let list = [...counts].filter(([w]) => w && w.length > 1);
  if (hideStops) {
    list = list.filter(([w]) => !STOP.has(w.toLowerCase()));
  }
  list = list.sort((a,b)=>b[1]-a[1]).slice(0, 200);
  const out = $('#out');
  if(!list.length){ out.innerHTML=`<div class="empty">Not enough words to display in cloud.</div>`; return; }
  
  logWorkspaceTask({
    type: 'cloud',
    typeName: 'Word Cloud',
    title: 'Word Cloud Visualization',
    corpusSummary: `${S.files.length} file(s) · top ${list.length} salient keywords`,
    summarySnippet: `Generated interactive word cloud featuring ${list.length} terms (${hideStops ? 'excluding function words' : 'all terms'}).`,
    metrics: { Keywords: list.length, MaxFreq: list[0][1], TopWord: list[0][0], FunctionWordsHidden: hideStops ? 'Yes' : 'No' },
    exportableRows: [['Keyword', 'Frequency'], ...list],
    exportFilename: 'word_cloud_terms.csv'
  });

  out.innerHTML = `
    <div class="cloud-canvas" id="cloudBox" style="height:480px; width:100%; display:flex; align-items:center; justify-content:center; background:var(--row); border-radius:16px; border:1px solid var(--stroke-2); overflow:hidden; position:relative; touch-action:none; user-select:none;">
      <div class="empty">Preparing cloud rendering...</div>
    </div>
  `;
  
  await renderLocalCloud(list);
}

async function renderLocalCloud(list) {
  const box = $('#cloudBox');
  box.style.display = 'flex'; // Ensure centering for the spinner
  box.innerHTML = `<div class="empty"><div class="spinner"></div>Rendering offline interactive cloud...</div>`;
  
  if(document.fonts && document.fonts.load){
    try {
      document.fonts.load('700 16px Sora');
      document.fonts.load('700 50px Sora');
    } catch(e) {}
  }
  
  const W = 1000, H = 1000;
  box.style.display = 'block'; // Switch to block display for absolute viewport centering
  box.innerHTML = `
    <div id="cloudInner" style="width:${W}px; height:${H}px; position:absolute; left:50%; top:50%; margin-left:-${W/2}px; margin-top:-${H/2}px; transform-origin:500px 500px; will-change:transform;"></div>
  `;
  
  const inner = $('#cloudInner');
  const packed = packWordCloud(list, W, H);
  inner.innerHTML = packed.map((p,k) => {
    const col = CLOUD_COLS[k % CLOUD_COLS.length];
    const animDelay = (k * 0.035).toFixed(2);
    const driftDelay = ((k * 0.17) % 3.5).toFixed(2);
    return `<span class="cloud-word-item" style="position:absolute; left:${p.x.toFixed(1)}px; top:${p.y.toFixed(1)}px; font-size:${p.fontSize}px; color:${col}; text-shadow:0 0 14px ${col}44; font-family:'Sora',sans-serif; font-weight:700; white-space:nowrap; animation-delay:${animDelay}s, ${driftDelay}s;" title="${p.f}×" onclick="S.q.term='${esc(p.w)}'; go('kwic'); runKwic()">${esc(p.w)}</span>`;
  }).join('');

  // Show zoom controls and reset state
  const zoomCtrl = document.getElementById('cloudZoomControls');
  if (zoomCtrl) zoomCtrl.style.display = 'inline-flex';
  const saveBtn = document.getElementById('saveCloudBtn');
  if (saveBtn) saveBtn.style.display = 'inline-flex';
  zoomCloud(0, true);

  // Attach touch listeners for pinch-to-zoom and panning
  initCloudTouchZoom(box);
}

function packWordCloud(list, W, H){
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const max = list[0][1];
  const placed = [];
  const out = [];
  const cx = W/2, cy = H/2;
  
  const maxFontSize = 48;
  const minFontSize = 11;

  list.forEach(([w,f]) => {
    let fontSize = Math.max(minFontSize, Math.round(minFontSize + (maxFontSize - minFontSize) * Math.sqrt(f/max)));
    
    let ok = false;
    let x = 0, y = 0, tw = 0, th = 0;
    
    for (let attempts = 0; attempts < 3; attempts++) {
      ctx.font = `700 ${fontSize}px Sora, sans-serif`;
      tw = ctx.measureText(w).width + 8;
      th = fontSize * 1.15;
      
      let theta = 0;
      const step = 0.12;
      const maxIterations = 900;
      
      for (let i = 0; i < maxIterations; i++) {
        const radius = 4.5 * theta;
        const tx = cx + radius * Math.cos(theta) * 1.35 - tw / 2;
        const ty = cy + radius * Math.sin(theta) * 0.85 - th / 2;
        
        if (tx >= 10 && tx + tw <= W - 10 && ty >= 10 && ty + th <= H - 10) {
          const rect = { l: tx, t: ty, r: tx + tw, b: ty + th };
          
          const hit = placed.some(p => !(rect.r < p.l - 4 || rect.l > p.r + 4 || rect.b < p.t - 4 || rect.t > p.b + 4));
          if (!hit) {
            x = tx;
            y = ty;
            ok = true;
            break;
          }
        }
        theta += step;
      }
      
      if (ok) break;
      fontSize = Math.round(fontSize * 0.7);
    }
    
    if (ok) {
      placed.push({ l: x, t: y, r: x + tw, b: y + th });
      out.push({ w, f, fontSize, x, y });
    }
  });
  return out;
}



/* ---------- Toolkit Section Switcher ---------- */
function changeToolkitSection(sec) {
  S.toolkit.activeSection = sec;
  render();
}

/* ---------- Corpus Vocabulary & Auto-Suggest Cache ---------- */
function getCorpusWordFreqs() {
  if (S.corpusWordFreqs) return S.corpusWordFreqs;
  const freqs = new Map();
  S.files.forEach(f => {
    f.toks.forEach(t => {
      const word = t.l;
      freqs.set(word, (freqs.get(word) || 0) + 1);
    });
  });
  // Convert to array of [word, freq] and sort by frequency descending
  S.corpusWordFreqs = [...freqs.entries()].sort((a, b) => b[1] - a[1]);
  return S.corpusWordFreqs;
}

function getSuggestions(query) {
  if (!query || query.trim().length < 1) return [];
  const q = query.trim().toLowerCase();
  const wordFreqs = getCorpusWordFreqs();
  const matching = [];
  for (let i = 0; i < wordFreqs.length; i++) {
    const [word, freq] = wordFreqs[i];
    if (word.startsWith(q)) {
      matching.push(word);
      if (matching.length >= 8) break;
    }
  }
  return matching;
}

let currentSuggestIdx = -1;

function handleSearchInput(input) {
  const query = input.value;
  const box = document.getElementById('suggest-box');
  if (!box) return;
  
  const suggestions = getSuggestions(query);
  if (!suggestions.length) {
    box.style.display = 'none';
    box.innerHTML = '';
    currentSuggestIdx = -1;
    return;
  }
  
  currentSuggestIdx = -1;
  const freqs = getCorpusWordFreqs();
  const freqMap = new Map(freqs);
  
  box.innerHTML = suggestions.map((word, idx) => {
    const f = freqMap.get(word) || 0;
    return `<div class="suggest-item" data-idx="${idx}" data-word="${esc(word)}" onclick="selectSuggestion('${esc(word)}')">
      <span style="font-weight: 600;">${esc(word)}</span>
      <span class="freq">${f.toLocaleString()} instances</span>
    </div>`;
  }).join('');
  box.style.display = 'block';
}

function selectSuggestion(word) {
  const input = document.getElementById('q');
  if (input) {
    input.value = word;
    const box = document.getElementById('suggest-box');
    if (box) {
      box.style.display = 'none';
      box.innerHTML = '';
    }
    currentSuggestIdx = -1;
  }
}

function handleSearchKey(event, runFn) {
  const box = document.getElementById('suggest-box');
  if (!box || box.style.display === 'none') return;
  
  const items = box.getElementsByClassName('suggest-item');
  if (!items.length) return;
  
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (currentSuggestIdx < items.length - 1) {
      if (currentSuggestIdx >= 0) items[currentSuggestIdx].classList.remove('active');
      currentSuggestIdx++;
      items[currentSuggestIdx].classList.add('active');
      items[currentSuggestIdx].scrollIntoView({ block: 'nearest' });
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (currentSuggestIdx > 0) {
      items[currentSuggestIdx].classList.remove('active');
      currentSuggestIdx--;
      items[currentSuggestIdx].classList.add('active');
      items[currentSuggestIdx].scrollIntoView({ block: 'nearest' });
    }
  } else if (event.key === 'Enter') {
    if (currentSuggestIdx >= 0 && currentSuggestIdx < items.length) {
      event.preventDefault();
      const word = items[currentSuggestIdx].getAttribute('data-word');
      selectSuggestion(word);
    }
  } else if (event.key === 'Escape') {
    box.style.display = 'none';
    currentSuggestIdx = -1;
  }
}

// Close suggestion box when clicking outside
document.addEventListener('click', (e) => {
  const box = document.getElementById('suggest-box');
  const input = document.getElementById('q');
  if (box && e.target !== input && !box.contains(e.target)) {
    box.style.display = 'none';
    currentSuggestIdx = -1;
  }
});

// Cleaner helpers
function toggleCleanOpt(opt) {
  S.toolkit.cleanOpts[opt] = !S.toolkit.cleanOpts[opt];
  saveSettings();
}

function updateCleanStopwords(val) {
  S.toolkit.cleanOpts.customStopwords = val;
  saveSettings();
}

function runCleanTextAlgorithm(text, opts) {
  let out = text;
  if (opts.lowercase) {
    out = out.toLowerCase();
  }
  if (opts.removeUrls) {
    out = out.replace(/https?:\/\/[^\s]+/g, ' ');
    out = out.replace(/www\.[^\s]+/g, ' ');
  }
  if (opts.removeEmojis) {
    out = out.replace(/[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u2600-\u26FF\u2700-\u27BF\u3000-\u303F]/g, ' ');
  }
  if (opts.removeDigits) {
    out = out.replace(/\d+/g, ' ');
  }
  if (opts.removePunct) {
    out = out.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’“]/g, ' ');
  }
  if (opts.removeStopwords) {
    const stops = new Set(opts.customStopwords.toLowerCase().split(/\s+/).filter(Boolean));
    const words = out.split(/\s+/);
    const filtered = words.filter(w => !stops.has(w.toLowerCase().replace(/[^a-z0-9]/g, '')));
    out = filtered.join(' ');
  }
  if (opts.onlyAlpha) {
    const words = out.split(/\s+/);
    const filtered = words.filter(w => /^[a-zA-Z]+$/.test(w));
    out = filtered.join(' ');
  }
  if (opts.normalizeSpaces) {
    out = out.replace(/\s+/g, ' ').trim();
  }
  return out;
}

function cleanPasteTextNow() {
  const txt = S.toolkit.cleanPaste || "";
  if (!txt.trim()) {
    toast("Please enter or paste some text first", false);
    return;
  }
  const opts = S.toolkit.cleanOpts;
  const cleaned = runCleanTextAlgorithm(txt, opts);
  S.toolkit.cleanedPasteOutput = cleaned;
  
  const block = document.getElementById("clean-output-block");
  const textEl = document.getElementById("clean-output-text");
  if (block && textEl) {
    textEl.textContent = cleaned;
    block.style.display = "block";
    toast("Text cleaned successfully!");
  }
}

function cleanCorpusInPlaceNow() {
  if (!S.files || !S.files.length) {
    toast("No files loaded in corpus to clean", false);
    return;
  }
  if (!confirm("Are you sure you want to clean your entire loaded corpus in-place? This will instantly modify and re-tokenize all loaded files.")) {
    return;
  }
  const opts = S.toolkit.cleanOpts;
  let totalWordsBefore = 0;
  let totalWordsAfter = 0;
  
  S.files.forEach(f => {
    totalWordsBefore += f.toks.length;
    f.text = runCleanTextAlgorithm(f.text, opts);
    f.toks = tokenize(f.text);
    f.types = new Set(f.toks.map(t => t.l)).size;
    totalWordsAfter += f.toks.length;
  });
  
  clearTabCache();
  render();
  toast(`Cleaned in-place! Words: ${totalWordsBefore} → ${totalWordsAfter}`);
}

async function handleCleanFilesPicked(fileList) {
  const files = [...fileList];
  if (!files.length) return;
  
  S.toolkit.cleanFiles = S.toolkit.cleanFiles || [];
  toast(`Reading ${files.length} file(s) for cleaning...`);
  
  for (const f of files) {
    try {
      const text = await readOneFile(f);
      S.toolkit.cleanFiles.push({ name: f.name, text: text });
    } catch(e) {
      toast(`Could not read ${f.name}`, false);
    }
  }
  
  render();
}

function cleanUploadedFilesNow() {
  const files = S.toolkit.cleanFiles || [];
  if (!files.length) {
    toast("No files uploaded to clean", false);
    return;
  }
  const opts = S.toolkit.cleanOpts;
  S.toolkit.cleanedFilesOutputs = files.map(f => {
    const cleanedText = runCleanTextAlgorithm(f.text, opts);
    return { name: f.name, cleanedText: cleanedText };
  });
  
  toast("Files cleaned successfully!");
  render();
}

function downloadCleanedFileItem(idx) {
  const outputs = S.toolkit.cleanedFilesOutputs || [];
  const item = outputs[idx];
  if (!item) return;
  const nameParts = item.name.split('.');
  if (nameParts.length > 1) nameParts.pop();
  const baseName = nameParts.join('.');
  saveFileHelper(item.cleanedText, `${baseName}_cleaned.txt`, "text/plain", "Documents/LinguaX/Cleaned");
}

function copyCleanedFileItem(idx) {
  const outputs = S.toolkit.cleanedFilesOutputs || [];
  const item = outputs[idx];
  if (!item) return;
  navigator.clipboard.writeText(item.cleanedText).then(() => {
    toast("Copied to clipboard!");
  }).catch(() => {
    toast("Copy failed", false);
  });
}

function downloadAllCleanedFilesCombined() {
  const outputs = S.toolkit.cleanedFilesOutputs || [];
  if (!outputs.length) return;
  const combined = outputs.map(f => `--- CLEANED FILE: ${f.name} ---\n\n${f.cleanedText}`).join('\n\n\n');
  saveFileHelper(combined, "cleaned_combined_files.txt", "text/plain", "Documents/LinguaX/Cleaned");
}

function downloadCleanedText() {
  const content = S.toolkit.cleanedPasteOutput;
  if (!content) return;
  saveFileHelper(content, "cleaned_text.txt", "text/plain", "Documents/LinguaX/Cleaned");
}

function copyCleanedText() {
  const content = S.toolkit.cleanedPasteOutput;
  if (!content) return;
  navigator.clipboard.writeText(content).then(() => {
    toast("Copied to clipboard!");
  }).catch(() => {
    toast("Copy failed", false);
  });
}

function saveFileHelper(textData, fileName, mimeType, folder) {
  const binaryString = unescape(encodeURIComponent(textData));
  const base64Data = btoa(binaryString);
  if (window.AndroidBridge && typeof window.AndroidBridge.saveFile === 'function') {
    window.AndroidBridge.saveFile(base64Data, fileName, mimeType, folder);
    toast(`Saved successfully: ${fileName}`);
  } else {
    const blob = new Blob([textData], {type: mimeType});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast(`Downloaded successfully: ${fileName}`);
  }
}

// Merger helpers
function toggleMergeOpt(opt) {
  S.toolkit.mergeOpts[opt] = !S.toolkit.mergeOpts[opt];
  saveSettings();
}

function setMergeTarget(target) {
  S.toolkit.mergeOpts.target = target;
  render();
}

async function handleMergeFilesPicked(fileList) {
  const files = [...fileList];
  if (!files.length) return;
  
  S.toolkit.mergeFiles = S.toolkit.mergeFiles || [];
  toast(`Reading ${files.length} file(s) for merger...`);
  
  for (const f of files) {
    try {
      const text = await readOneFile(f);
      S.toolkit.mergeFiles.push({ name: f.name, text: text });
    } catch(e) {
      toast(`Could not read ${f.name}`, false);
    }
  }
  
  render();
  triggerMergeOfFiles();
}

function triggerMergeOfFiles() {
  const list = S.toolkit.mergeFiles || [];
  if (!list.length) return;
  
  const opts = S.toolkit.mergeOpts;
  let merged = "";
  list.forEach((f, idx) => {
    if (opts.insertHeader) {
      merged += `\r\n\r\n--- START OF FILE: ${f.name} ---\r\n\r\n`;
    } else if (idx > 0) {
      merged += opts.extraLines ? "\r\n\r\n\r\n" : "\r\n";
    }
    merged += f.text;
  });
  
  S.toolkit.mergedOutput = merged;
  S.toolkit.mergedName = "merged_documents";
  
  const block = document.getElementById("merge-download-block");
  if (block) {
    block.style.display = "block";
  }
}

function mergeAllCorpusFilesNow() {
  if (!S.files || !S.files.length) {
    toast("No loaded corpus files to merge", false);
    return;
  }
  const opts = S.toolkit.mergeOpts;
  let merged = "";
  S.files.forEach((f, idx) => {
    if (opts.insertHeader) {
      merged += `\r\n\r\n--- START OF FILE: ${f.name} ---\r\n\r\n`;
    } else if (idx > 0) {
      merged += opts.extraLines ? "\r\n\r\n\r\n" : "\r\n";
    }
    merged += f.text;
  });
  
  S.toolkit.mergedOutput = merged;
  S.toolkit.mergedName = "merged_corpus";
  
  toast("All corpus files merged!");
  const block = document.getElementById("merge-download-block");
  if (block) {
    block.style.display = "block";
    window.scrollTo({ top: block.offsetTop, behavior: 'smooth' });
  }
}

function downloadMergedFileNow() {
  const content = S.toolkit.mergedOutput;
  if (!content) return;
  const isWord = S.toolkit.mergeOpts.target === 'word';
  const name = S.toolkit.mergedName + (isWord ? ".doc" : ".txt");
  const mime = isWord ? "application/msword" : "text/plain";
  
  const finalContent = isWord ? convertToRTF([[content]], S.toolkit.mergedName) : content;
  saveFileHelper(finalContent, name, mime, "Documents/LinguaX/Merged");
}

function loadMergedIntoCorpusNow() {
  const content = S.toolkit.mergedOutput;
  if (!content) return;
  const name = S.toolkit.mergedName + "_combined.txt";
  addTexts([{ name, text: content }], 'corpus');
  toast("Merged file added back to corpus list!");
}

// Converter helpers
function setConvTarget(target) {
  S.toolkit.convOpts.target = target;
  render();
}

async function handleConvFilesPicked(fileList) {
  const files = [...fileList];
  if (!files.length) return;
  
  S.toolkit.convFiles = S.toolkit.convFiles || [];
  toast(`Converting ${files.length} file(s)...`);
  
  for (const f of files) {
    const item = { name: f.name, status: 'converting', file: f };
    S.toolkit.convFiles.push(item);
    render();
    
    try {
      const text = await readOneFile(f);
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      const baseName = f.name.replace(/\.[^/.]+$/, "");
      
      let outContent = "";
      let outName = "";
      let mime = "";
      
      const targetFormat = S.toolkit.convOpts.target;
      if (targetFormat === 'word') {
        outContent = convertToRTF([[text]], baseName);
        outName = baseName + ".doc";
        mime = "application/msword";
      } else {
        outContent = text;
        outName = baseName + ".txt";
        mime = "text/plain";
      }
      
      item.status = 'success';
      item.outputName = outName;
      item.outputContent = outContent;
      item.outputMime = mime;
    } catch (err) {
      item.status = 'error';
      item.errorMsg = err.message;
      toast(`Failed to convert ${f.name}`, false);
    }
    render();
  }
}

function downloadConvertedFile(idx) {
  const list = S.toolkit.convFiles || [];
  const item = list[idx];
  if (item && item.status === 'success') {
    saveFileHelper(item.outputContent, item.outputName, item.outputMime, "Documents/LinguaX/Converted");
  }
}

/* ---------- Toolkit View ---------- */
function vToolkit() {
  S.toolkit.mergeFiles = S.toolkit.mergeFiles || [];
  S.toolkit.convFiles = S.toolkit.convFiles || [];
  
  let sectionHtml = "";
  
  if (S.toolkit.activeSection === 'cleaner') {
    const cleanFilesList = S.toolkit.cleanFiles || [];
    let cleanFilesHtml = "";
    if (cleanFilesList.length) {
      cleanFilesHtml = `
      <div style="margin-top:12px; padding:12px; background:var(--row); border-radius:12px; border:1px solid var(--stroke-2); display:flex; flex-direction:column; gap:6px;">
        <span style="font-size:12.5px; font-weight:700; color:var(--ink)">Selected files for cleaning (${cleanFilesList.length}):</span>
        ${cleanFilesList.map((f, i) => `
          <div style="display:flex; justify-content:space-between; align-items:center; font-family:monospace; font-size:11.5px; color:var(--ink)">
            <span style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:70%">${i+1}. ${f.name}</span>
            <button class="btn danger-btn ghost" style="padding:2px 8px; font-size:10px; border-radius:6px; height:24px;" onclick="S.toolkit.cleanFiles.splice(${i}, 1); render();">Remove</button>
          </div>
        `).join('')}
        <div style="margin-top:8px; display:flex; gap:10px;">
          <button class="btn small" onclick="cleanUploadedFilesNow()">Clean Selected Files</button>
          <button class="btn ghost small" onclick="S.toolkit.cleanFiles = []; S.toolkit.cleanedFilesOutputs = []; render();">Clear All</button>
        </div>
      </div>`;
    }

    const cleanedOutputs = S.toolkit.cleanedFilesOutputs || [];
    let cleanedOutputsHtml = "";
    if (cleanedOutputs.length) {
      cleanedOutputsHtml = `
      <div id="clean-files-output-block" style="border-top:1.5px solid var(--stroke); padding-top:16px; margin-top:16px;">
        <h4 style="margin:0 0 10px 0; color:var(--ink); font-size:14px; font-weight:700; display:flex; align-items:center; gap:6px;">${I.broom} Cleaned Files Output:</h4>
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;">
          ${cleanedOutputs.map((f, i) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--row); border-radius:10px; border:1px solid var(--stroke-2);">
              <div style="min-width:0; flex:1; margin-right:12px;">
                <span style="font-size:12.5px; font-weight:600; color:var(--ink); display:block; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${f.name}</span>
                <span style="font-size:11px; color:var(--ink-soft);">${f.cleanedText.length.toLocaleString()} characters</span>
              </div>
              <div style="display:flex; gap:8px;">
                <button class="btn ghost small" style="padding:4px 8px; font-size:11px; height:28px;" onclick="downloadCleanedFileItem(${i})">Download</button>
                <button class="btn ghost small" style="padding:4px 8px; font-size:11px; height:28px;" onclick="copyCleanedFileItem(${i})">Copy</button>
              </div>
            </div>
          `).join('')}
        </div>
        ${cleanedOutputs.length > 1 ? `
          <div style="display:flex; gap:10px;">
            <button class="btn small" onclick="downloadAllCleanedFilesCombined()">Download All Combined</button>
          </div>
        ` : ''}
      </div>`;
    }

    sectionHtml = `
    <section class="card glass">
      <h2>${I.broom} ${_t('corpusCleaner', 'Corpus Cleaner')}</h2>
      <p class="sub">${_t('cleanerIntro', 'Clean, lowercase, strip punctuation, remove stop words, or normalize whitespaces.')}</p>
      
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin-top:16px; margin-bottom:16px;">
        <label class="setting-row" style="border:none; padding:4px 0; cursor:pointer;">
          <span style="color:var(--ink); font-size:13.5px;">${_t('optLowercase', 'Lowercase All Text')}</span>
          <input type="checkbox" ${S.toolkit.cleanOpts.lowercase?'checked':''} onchange="toggleCleanOpt('lowercase')" style="width:18px; height:18px; accent-color:var(--a1);">
        </label>
        <label class="setting-row" style="border:none; padding:4px 0; cursor:pointer;">
          <span style="color:var(--ink); font-size:13.5px;">${_t('optRemovePunct', 'Remove Punctuation')}</span>
          <input type="checkbox" ${S.toolkit.cleanOpts.removePunct?'checked':''} onchange="toggleCleanOpt('removePunct')" style="width:18px; height:18px; accent-color:var(--a1);">
        </label>
        <label class="setting-row" style="border:none; padding:4px 0; cursor:pointer;">
          <span style="color:var(--ink); font-size:13.5px;">${_t('optRemoveDigits', 'Remove Numbers & Digits')}</span>
          <input type="checkbox" ${S.toolkit.cleanOpts.removeDigits?'checked':''} onchange="toggleCleanOpt('removeDigits')" style="width:18px; height:18px; accent-color:var(--a1);">
        </label>
        <label class="setting-row" style="border:none; padding:4px 0; cursor:pointer;">
          <span style="color:var(--ink); font-size:13.5px;">${_t('optRemoveUrls', 'Remove Web Links (URLs)')}</span>
          <input type="checkbox" ${S.toolkit.cleanOpts.removeUrls?'checked':''} onchange="toggleCleanOpt('removeUrls')" style="width:18px; height:18px; accent-color:var(--a1);">
        </label>
        <label class="setting-row" style="border:none; padding:4px 0; cursor:pointer;">
          <span style="color:var(--ink); font-size:13.5px;">${_t('optRemoveEmojis', 'Remove Emojis & Symbols')}</span>
          <input type="checkbox" ${S.toolkit.cleanOpts.removeEmojis?'checked':''} onchange="toggleCleanOpt('removeEmojis')" style="width:18px; height:18px; accent-color:var(--a1);">
        </label>
        <label class="setting-row" style="border:none; padding:4px 0; cursor:pointer;">
          <span style="color:var(--ink); font-size:13.5px;">${_t('optRemoveStops', 'Remove Stop Words')}</span>
          <input type="checkbox" ${S.toolkit.cleanOpts.removeStopwords?'checked':''} onchange="toggleCleanOpt('removeStopwords')" style="width:18px; height:18px; accent-color:var(--a1);">
        </label>
        <label class="setting-row" style="border:none; padding:4px 0; cursor:pointer;">
          <span style="color:var(--ink); font-size:13.5px;">${_t('optNormalize', 'Normalize Whitespace')}</span>
          <input type="checkbox" ${S.toolkit.cleanOpts.normalizeSpaces?'checked':''} onchange="toggleCleanOpt('normalizeSpaces')" style="width:18px; height:18px; accent-color:var(--a1);">
        </label>
        <label class="setting-row" style="border:none; padding:4px 0; cursor:pointer;">
          <span style="color:var(--ink); font-size:13.5px;">${_t('optOnlyAlpha', 'Retain Only Letters')}</span>
          <input type="checkbox" ${S.toolkit.cleanOpts.onlyAlpha?'checked':''} onchange="toggleCleanOpt('onlyAlpha')" style="width:18px; height:18px; accent-color:var(--a1);">
        </label>
      </div>
      
      <div class="setting-row" style="flex-direction:column; align-items:stretch; gap:6px; border-top:1px solid var(--stroke-2); padding-top:12px;">
        <span style="font-size:13px; font-weight:700; color:var(--ink)">${_t('customStopsLabel', 'Custom Stop Words (space-separated):')}</span>
        <input type="text" value="${S.toolkit.cleanOpts.customStopwords}" onchange="updateCleanStopwords(this.value)" style="width:100%; max-width:100%;">
      </div>

      <div style="border-top:1px solid var(--stroke-2); padding-top:16px; margin-top:14px;">
        <span style="font-size:13.5px; font-weight:700; color:var(--ink); display:block; margin-bottom:10px;">Option A: Upload Files to Clean</span>
        <div class="dropzone" id="clean-dz" style="border:2px dashed var(--stroke); padding:24px; border-radius:16px; text-align:center; cursor:pointer; background:var(--row); transition:all 0.2s;" onmouseover="this.style.borderColor='var(--a1)'" onmouseout="this.style.borderColor='var(--stroke)'" onclick="document.getElementById('cleanFilePick').click()">
          <span style="width:32px; height:32px; display:block; margin:0 auto 8px auto; color:var(--ink-soft);">${I.folder}</span>
          <span style="font-size:13px; color:var(--ink); opacity:0.8;">Tap here to upload file or files (.txt, .docx, .pdf)</span>
        </div>
        <input type="file" id="cleanFilePick" accept=".txt,.text,.md,.pdf,.docx" multiple hidden onchange="handleCleanFilesPicked(this.files)">
        ${cleanFilesHtml}
        ${cleanedOutputsHtml}
      </div>
      
      <div style="border-top:1px solid var(--stroke-2); padding-top:16px; margin-top:14px;">
        <span style="font-size:13.5px; font-weight:700; color:var(--ink); display:block; margin-bottom:10px;">Option B: Paste or Type Raw Text</span>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <textarea id="clean-paste-area" style="width:100%; height:120px; border-radius:12px; background:var(--bg); border:1px solid var(--stroke); padding:12px; color:var(--ink); font-family:monospace; font-size:13px; line-height:1.5;" placeholder="${_t('pasteTextPlaceholder', 'Paste or type text here to clean...')}" oninput="S.toolkit.cleanPaste = this.value">${S.toolkit.cleanPaste}</textarea>
          
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <button class="btn" onclick="cleanPasteTextNow()">${_t('cleanNow', 'Clean Raw Text')}</button>
            <button class="btn ghost" onclick="cleanCorpusInPlaceNow()">${_t('cleanCorpus', 'Clean Main Corpus In-Place')}</button>
          </div>
        </div>
      </div>
      
      <div id="clean-output-block" style="${S.toolkit.cleanedPasteOutput?'display:block':'display:none'}; border-top:1.5px solid var(--stroke); padding-top:16px; margin-top:16px;">
        <h4 style="margin:0 0 10px 0; color:var(--ink); font-size:14px; font-weight:700; display:flex; align-items:center; gap:6px;">${I.broom} Cleaned Output:</h4>
        <div id="clean-output-text" style="width:100%; max-height:160px; overflow-y:auto; background:var(--row); border:1px solid var(--stroke-2); border-radius:12px; padding:12px; font-family:monospace; font-size:12.5px; white-space:pre-wrap; color:var(--ink);">${S.toolkit.cleanedPasteOutput || ''}</div>
        <div style="display:flex; gap:10px; margin-top:12px;">
          <button class="btn ghost" onclick="downloadCleanedText()">${_t('downloadClean', 'Download Cleaned')}</button>
          <button class="btn ghost" onclick="copyCleanedText()">${_t('copyText', 'Copy to Clipboard')}</button>
        </div>
      </div>
    </section>`;
  } else if (S.toolkit.activeSection === 'merger') {
    const list = S.toolkit.mergeFiles || [];
    let filesHtml = "";
    if (list.length) {
      filesHtml = `<div style="padding:10px 14px; background:var(--row); border-radius:12px; border:1px solid var(--stroke-2); display:flex; flex-direction:column; gap:6px;">
        <span style="font-size:12px; font-weight:700; color:var(--ink)">Loaded files for merging (${list.length}):</span>
        ${list.map((f, i) => `<div style="display:flex; justify-content:space-between; font-family:monospace; font-size:11.5px; color:var(--ink)"><span style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:80%">${i+1}. ${f.name}</span><button class="btn danger-btn ghost" style="padding:2px 6px; font-size:9.5px; border-radius:4px" onclick="S.toolkit.mergeFiles.splice(${i}, 1); render(); triggerMergeOfFiles();">Remove</button></div>`).join('')}
      </div>`;
    }
    
    sectionHtml = `
    <section class="card glass">
      <h2>${I.link} ${_t('fileMerger', 'File Merger & Combiner')}</h2>
      <p class="sub">${_t('mergerIntro', 'Merge multiple files (.txt, .docx, .pdf) completely offline into a single document.')}</p>
      
      <div style="display:flex; flex-direction:column; gap:14px; margin-top:16px;">
        <label class="setting-row" style="border:none; padding:4px 0; cursor:pointer;">
          <span style="color:var(--ink); font-size:13.5px;">${_t('optInsertHeader', 'Insert file name separator between files')}</span>
          <input type="checkbox" ${S.toolkit.mergeOpts.insertHeader?'checked':''} onchange="toggleMergeOpt('insertHeader'); triggerMergeOfFiles();" style="width:18px; height:18px; accent-color:var(--a1);">
        </label>
        <label class="setting-row" style="border:none; padding:4px 0; cursor:pointer;">
          <span style="color:var(--ink); font-size:13.5px;">${_t('optExtraLines', 'Add double blank lines between files')}</span>
          <input type="checkbox" ${S.toolkit.mergeOpts.extraLines?'checked':''} onchange="toggleMergeOpt('extraLines'); triggerMergeOfFiles();" style="width:18px; height:18px; accent-color:var(--a1);">
        </label>
        
        <div class="setting-row" style="flex-direction:column; align-items:stretch; gap:6px; border:none; padding:0;">
          <span style="font-size:13px; font-weight:700; color:var(--ink)">${_t('mergeTargetLabel', 'Output Merge Format:')}</span>
          <div class="palette-options">
            <button class="palette-btn ${S.toolkit.mergeOpts.target==='txt'?'active':''}" onclick="setMergeTarget('txt')">
              <div class="palette-label">Plain Text (.txt)</div>
            </button>
            <button class="palette-btn ${S.toolkit.mergeOpts.target==='word'?'active':''}" onclick="setMergeTarget('word')">
              <div class="palette-label">Word Document (.doc)</div>
            </button>
          </div>
        </div>
        
        <div style="border-top:1px solid var(--stroke-2); padding-top:16px; margin-top:8px;">
          <span style="font-size:13.5px; font-weight:700; color:var(--ink); display:block; margin-bottom:10px;">${_t('selectMergeFiles', 'Select Local Files to Merge:')}</span>
          <div class="dropzone" id="merge-dz" style="border:2px dashed var(--stroke); padding:24px; border-radius:16px; text-align:center; cursor:pointer; background:var(--row); transition:all 0.2s;" onmouseover="this.style.borderColor='var(--a1)'" onmouseout="this.style.borderColor='var(--stroke)'" onclick="document.getElementById('mergeFilePick').click()">
            <span style="width:32px; height:32px; display:block; margin:0 auto 8px auto; color:var(--ink-soft);">${I.folder}</span>
            <span style="font-size:13px; color:var(--ink); opacity:0.8;">Tap here or drag & drop files (.txt, .docx, .pdf)</span>
          </div>
          <input type="file" id="mergeFilePick" accept=".txt,.text,.md,.pdf,.docx" multiple hidden onchange="handleMergeFilesPicked(this.files)">
          
          <div id="merge-files-list" style="margin-top:12px; display:flex; flex-direction:column; gap:6px;">
            ${filesHtml}
          </div>
        </div>
        
        <div style="border-top:1px solid var(--stroke-2); padding-top:16px; margin-top:8px; display:flex; flex-direction:column; gap:12px;">
          <span style="font-size:13.5px; font-weight:700; color:var(--ink); display:block;">${_t('orMergeCorpus', 'Or merge currently loaded Corpus files:')}</span>
          <button class="btn ghost" onclick="mergeAllCorpusFilesNow()" style="align-self:flex-start; display:inline-flex; align-items:center; gap:6px;"><span class="inline-svg-icon" style="width:14px; height:14px;">${I.link}</span> ${_t('mergeCorpusBtn', 'Merge All Loaded Corpus Files')}</button>
        </div>
        
        <div id="merge-download-block" style="${S.toolkit.mergedOutput?'display:block':'display:none'}; border-top:1.5px solid var(--stroke); padding-top:16px; margin-top:16px; display:flex; flex-direction:column; gap:12px;">
          <span style="font-weight:700; color:var(--ink); font-size:14px; display:block; margin-bottom:8px;">Success! (${(S.toolkit.mergedOutput || "").length} characters)</span>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <button class="btn" onclick="downloadMergedFileNow()">Download Combined File</button>
            <button class="btn ghost" onclick="loadMergedIntoCorpusNow()">Load Into Corpus List</button>
          </div>
        </div>
      </div>
    </section>`;
  } else if (S.toolkit.activeSection === 'converter') {
    const list = S.toolkit.convFiles || [];
    let listHtml = "";
    if (list.length) {
      listHtml = `<div style="display:flex; flex-direction:column; gap:8px;">
        <span style="font-size:13px; font-weight:700; color:var(--ink)">File Conversion Queue:</span>
        ${list.map((f, idx) => {
          let badge = `<span style="background:#eab308; color:#1e1b4b; padding:2px 8px; border-radius:6px; font-size:10px; font-weight:700;">Converting</span>`;
          let dlBtn = "";
          if (f.status === 'success') {
            badge = `<span style="background:#22c55e; color:#ffffff; padding:2px 8px; border-radius:6px; font-size:10px; font-weight:700;">Converted</span>`;
            dlBtn = `<button class="btn ghost" style="padding:4px 10px; font-size:11px; border-radius:8px;" onclick="downloadConvertedFile(${idx})">Download</button>`;
          } else if (f.status === 'error') {
            badge = `<span style="background:#ef4444; color:#ffffff; padding:2px 8px; border-radius:6px; font-size:10px; font-weight:700;">Error: ${f.errorMsg || 'Failed'}</span>`;
          }
          return `<div class="setting-row" style="background:var(--row); padding:10px 14px; border-radius:12px; border:1.5px solid var(--stroke-2);">
            <div style="display:flex; flex-direction:column; gap:4px; max-width:70%;">
              <span style="font-family:monospace; font-size:12px; color:var(--ink); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${f.name}</span>
              <div>${badge}</div>
            </div>
            ${dlBtn}
          </div>`;
        }).join('')}
      </div>`;
    }
    
    sectionHtml = `
    <section class="card glass">
      <h2>${I.repeat} ${_t('fileConverter', 'Bulk File Format Converter')}</h2>
      <p class="sub">${_t('converterIntro', 'Convert .docx and .pdf files directly to .txt offline.')}</p>
      
      <div style="display:flex; flex-direction:column; gap:14px; margin-top:16px;">
        <div class="setting-row" style="flex-direction:column; align-items:stretch; gap:6px; border:none; padding:0;">
          <span style="font-size:13px; font-weight:700; color:var(--ink)">${_t('convTargetLabel', 'Target Conversion Format:')}</span>
          <div class="palette-options">
            <button class="palette-btn ${S.toolkit.convOpts.target==='txt'?'active':''}" onclick="setConvTarget('txt')">
              <div class="palette-label">Plain Text (.txt)</div>
            </button>
            <button class="palette-btn ${S.toolkit.convOpts.target==='word'?'active':''}" onclick="setConvTarget('word')">
              <div class="palette-label">Word Document (.doc)</div>
            </button>
          </div>
        </div>
        
        <div style="border-top:1px solid var(--stroke-2); padding-top:16px; margin-top:8px;">
          <span style="font-size:13.5px; font-weight:700; color:var(--ink); display:block; margin-bottom:10px;">${_t('selectConvFiles', 'Select Local Files to Convert:')}</span>
          <div class="dropzone" id="conv-dz" style="border:2px dashed var(--stroke); padding:24px; border-radius:16px; text-align:center; cursor:pointer; background:var(--row); transition:all 0.2s;" onmouseover="this.style.borderColor='var(--a1)'" onmouseout="this.style.borderColor='var(--stroke)'" onclick="document.getElementById('convFilePick').click()">
            <span style="width:32px; height:32px; display:block; margin:0 auto 8px auto; color:var(--ink-soft);">${I.repeat}</span>
            <span style="font-size:13px; color:var(--ink); opacity:0.8;">Tap here to select files (.docx, .pdf, .txt)</span>
          </div>
          <input type="file" id="convFilePick" accept=".txt,.text,.md,.pdf,.docx" multiple hidden onchange="handleConvFilesPicked(this.files)">
          
          <div id="conv-files-list" style="margin-top:16px; display:flex; flex-direction:column; gap:8px;">
            ${listHtml}
          </div>
        </div>
      </div>
    </section>`;
  }
  
  return `
  <div class="tab-title-row" style="margin-bottom:12px">
    <div style="min-width:0">
      <h2><span class="inline-svg-icon" style="color:var(--a1); width:20px; height:20px; display:inline-flex; align-items:center; vertical-align:middle; margin-right:4px;">${I.toolkit}</span> ${_t('toolkit', 'Advanced Toolkit')}</h2>
      <p class="sub">Corpus cleaning, file merges, and bulk format conversion.</p>
    </div>
  </div>
  
  <div class="palette-options" style="margin-bottom: 20px; overflow-x: auto; display: flex; flex-wrap: nowrap; gap: 8px; padding-bottom: 4px;">
    <button class="palette-btn ${S.toolkit.activeSection==='cleaner'?'active':''}" onclick="changeToolkitSection('cleaner')" style="flex:1; min-width:110px;">
      <div class="palette-label" style="display:inline-flex; align-items:center; gap:6px;"><span class="inline-svg-icon" style="width:14px; height:14px;">${I.broom}</span> Cleaner</div>
    </button>
    <button class="palette-btn ${S.toolkit.activeSection==='merger'?'active':''}" onclick="changeToolkitSection('merger')" style="flex:1; min-width:110px;">
      <div class="palette-label" style="display:inline-flex; align-items:center; gap:6px;"><span class="inline-svg-icon" style="width:14px; height:14px;">${I.link}</span> Merger</div>
    </button>
    <button class="palette-btn ${S.toolkit.activeSection==='converter'?'active':''}" onclick="changeToolkitSection('converter')" style="flex:1; min-width:110px;">
      <div class="palette-label" style="display:inline-flex; align-items:center; gap:6px;"><span class="inline-svg-icon" style="width:14px; height:14px;">${I.repeat}</span> Converter</div>
    </button>
  </div>
  
  <div id="toolkit-active-view">
    ${sectionHtml}
  </div>
  `;
}



/* ---------- Workspace & History Dashboard (100% Offline & Private) ---------- */
function _vWorkspaceLegacy() {
  const filter = S.workspace.filter || 'all';
  const query = (S.workspace.searchQuery || '').toLowerCase().trim();
  const history = S.workspaceHistory || [];
  
  let filtered = history.filter(item => {
    if (filter !== 'all' && item.type !== filter) return false;
    if (query) {
      const matchTitle = (item.title || '').toLowerCase().includes(query);
      const matchSnippet = (item.summarySnippet || '').toLowerCase().includes(query);
      const matchCorpus = (item.corpusSummary || '').toLowerCase().includes(query);
      const matchType = (item.typeName || item.type || '').toLowerCase().includes(query);
      return matchTitle || matchSnippet || matchCorpus || matchType;
    }
    return true;
  });

  const filterChips = [
    ['all', 'All Logs'],
    ['kwic', 'KWIC'],
    ['stats', 'Stats'],
    ['plot', 'Plot'],
    ['keyword', 'Keyness'],
    ['cloud', 'Word Cloud'],
    ['summary', 'Summarizer'],
    ['sentiment', 'Sentiment'],
    ['collocate', 'Collocates'],
    ['ngram', 'N-Grams'],
    ['wordlist', 'Word List'],
    ['cluster', 'Clusters']
  ].map(([fId, label]) => `
    <span class="chip ${filter === fId ? 'on' : ''}" onclick="setWorkspaceFilter('${fId}')">${label}</span>
  `).join('');

  let listHtml = '';
  if (!filtered.length) {
    listHtml = `
      <div class="empty" style="padding: 36px 16px;">
        <div style="font-size:32px; margin-bottom:10px; color:var(--ink-soft); opacity:0.6;">${I.history}</div>
        <b style="font-size:16px; color:var(--ink);">${query ? 'No matching logs found' : 'No workspace history recorded yet'}</b><br>
        <span style="font-size:13px; color:var(--ink-soft); line-height:1.5; display:inline-block; max-width:440px; margin-top:6px;">
          ${query ? 'Try a different search query or clear the filter.' : 'Run corpus tools (KWIC, Stats, Keyness, POS Tagger, Sentiment, Summarizer, Word Cloud) to automatically record offline analysis sessions here.'}
        </span>
      </div>
    `;
  } else {
    listHtml = filtered.map(item => renderWorkspaceCardHtml(item, { showDelete: true })).join('');
  }

  return `
    <section class="card glass">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
        <div>
          <h2>${I.history} My Workspace &amp; Analysis History</h2>
          <p class="sub">100% On-Device &amp; Private History. Revisit queries, inspect detailed logs, and re-export past analyses.</p>
        </div>
      </div>

      <!-- Quick Metrics Dashboard Bar -->
      <div class="stat-hero-grid" style="margin-bottom:18px;">
        <div class="stat-hero-card" style="padding:12px 14px;">
          <div class="hero-label"><span class="inline-svg-icon" style="color:var(--a1); width:14px; height:14px;">${I.check}</span> Completed Analyses</div>
          <div class="hero-val" style="font-size:24px;">${(S.taskCount || 0).toLocaleString()}</div>
          <div class="hero-sub">Total linguistics tasks executed</div>
        </div>
        <div class="stat-hero-card" style="padding:12px 14px;">
          <div class="hero-label"><span class="inline-svg-icon" style="color:#10b981; width:14px; height:14px;">${I.history}</span> Stored Sessions</div>
          <div class="hero-val" style="font-size:24px;">${history.length}</div>
          <div class="hero-sub">Cached on device memory</div>
        </div>
        <div class="stat-hero-card" style="padding:12px 14px;">
          <div class="hero-label"><span class="inline-svg-icon" style="color:#a855f7; width:14px; height:14px;">${I.reset}</span> Privacy Guarantee</div>
          <div class="hero-val" style="font-size:20px; color:#10b981;">100% Private</div>
          <div class="hero-sub">No network requests or cloud telemetry</div>
        </div>
      </div>

      <!-- Search and Filter Controls -->
      <div class="controls" style="display:flex; flex-direction:column; gap:12px;">
        <div class="search-row">
          <input type="search" placeholder="Search workspace history (term, metric, file name)..." value="${esc(S.workspace.searchQuery || '')}" oninput="handleWorkspaceSearch(this.value)">
          ${S.workspace.searchQuery ? `<button class="btn ghost" onclick="handleWorkspaceSearch('')">Clear</button>` : ''}
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:var(--ink-soft); text-transform:uppercase; margin-right:4px;">Filter:</span>
          ${filterChips}
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-top:4px; padding-top:10px; border-top:1px solid var(--stroke-2);">
          <div style="font-size:12.5px; font-weight:600; color:var(--ink-soft);">
            Showing <b style="color:var(--ink);">${filtered.length}</b> of ${history.length} record(s)
          </div>
          <div style="display:flex; gap:8px;">
            ${history.length > 0 ? `
              <button class="btn ghost small" onclick="exportAllWorkspaceLogs()">
                ${I.dl} Export All Logs
              </button>
              <button class="btn ghost small" onclick="confirmClearWorkspace(this)" style="color:var(--danger);">
                ${I.trash} Clear All
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- List of Logs -->
      <div class="workspace-list" style="margin-top:16px; display:flex; flex-direction:column; gap:12px;">
        ${listHtml}
      </div>
    </section>
  `;
}

function setWorkspaceFilter(filter) {
  S.workspace.filter = filter;
  render();
}

function handleWorkspaceSearch(q) {
  S.workspace.searchQuery = q;
  render();
}

function openWorkspaceDetailModal(id) {
  const item = (S.workspaceHistory || []).find(x => x.id === id);
  if (!item) return toast('Log record not found', false);
  
  S.workspace.activeItem = item;
  
  const titleEl = document.getElementById('wsDetailTitle');
  if (titleEl) titleEl.textContent = item.title;
  const metaEl = document.getElementById('wsDetailMeta');
  if (metaEl) metaEl.textContent = `${item.typeName || item.type.toUpperCase()} · ${item.dateStr} at ${item.timeStr} · ${item.corpusSummary}`;
  
  let metricsHtml = '';
  if (item.metrics && Object.keys(item.metrics).length > 0) {
    metricsHtml = `
      <div style="background:var(--row); border:1px solid var(--stroke-2); border-radius:14px; padding:12px; margin-bottom:12px;">
        <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--ink-soft); margin-bottom:8px;">Extracted Metrics</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:8px;">
          ${Object.entries(item.metrics).map(([k, v]) => `
            <div>
              <div style="font-size:10.5px; color:var(--ink-soft);">${esc(k)}</div>
              <div style="font-size:13.5px; font-weight:700; color:var(--ink);">${esc(String(v))}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  let tablePreviewHtml = '';
  if (item.exportableRows && item.exportableRows.length > 0) {
    const headers = item.exportableRows[0] || [];
    const sampleRows = item.exportableRows.slice(1);
    tablePreviewHtml = `
      <div style="margin-top:10px;">
        <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--ink-soft); margin-bottom:6px;">Data Rows (${item.exportableRows.length - 1} total rows)</div>
        <div class="tablewrap" style="max-height:220px; overflow-y:auto;">
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${esc(String(h))}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${sampleRows.map(r => `<tr>${r.map(c => `<td>${esc(String(c))}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  let summaryHtml = '';
  if (item.summarySnippet) {
    summaryHtml = `
      <div style="font-size:13px; line-height:1.6; color:var(--ink); background:var(--glass-2); border:1px solid var(--stroke); border-radius:14px; padding:12px;">
        ${esc(item.summarySnippet)}
      </div>
    `;
  }

  const bodyEl = document.getElementById('wsDetailBody');
  if (bodyEl) bodyEl.innerHTML = summaryHtml + metricsHtml + tablePreviewHtml;
  
  const actionsEl = document.getElementById('wsDetailActions');
  if (actionsEl) {
    actionsEl.innerHTML = `
      <button class="btn run small" onclick="revisitWorkspaceItem('${item.id}'); closeWorkspaceDetailModal();">
        ${I.search} Revisit Tool
      </button>
      ${item.exportableRows ? `
        <button class="btn ghost small" onclick="exportWorkspaceItem('${item.id}')">
          ${I.dl} Export Full Dataset
        </button>
      ` : ''}
    `;
  }

  const modal = document.getElementById('workspaceDetailModal');
  if (modal) modal.classList.add('open');
}

function closeWorkspaceDetailModal() {
  const modal = document.getElementById('workspaceDetailModal');
  if (modal) modal.classList.remove('open');
}

function deleteWorkspaceItem(id) {
  playFeedback('trash');
  S.workspaceHistory = (S.workspaceHistory || []).filter(x => x.id !== id);
  saveWorkspaceHistory();
  render();
  toast('Log entry deleted');
}

function confirmClearWorkspace(btn) {
  promptClearWorkspaceHistory();
}

function exportWorkspaceItem(id) {
  const item = (S.workspaceHistory || []).find(x => x.id === id);
  if (!item || !item.exportableRows) return toast('No export data attached to this log', false);
  exportCSV(item.exportableRows, item.exportFilename || `workspace_${item.type}_export.csv`, item.type);
}

function exportAllWorkspaceLogs() {
  const history = S.workspaceHistory || [];
  if (!history.length) return toast('Workspace history is empty', false);
  
  const rows = [
    ['Log ID', 'Timestamp', 'Date', 'Time', 'Analysis Type', 'Title', 'Corpus Source', 'Summary Snippet']
  ];
  
  history.forEach(item => {
    rows.push([
      item.id,
      item.timestamp,
      item.dateStr,
      item.timeStr,
      item.typeName || item.type,
      item.title,
      item.corpusSummary,
      item.summarySnippet
    ]);
  });
  
  exportCSV(rows, 'linguax_workspace_history_master.csv', 'workspace');
}

function revisitWorkspaceItem(id) {
  const item = (S.workspaceHistory || []).find(x => x.id === id);
  if (!item) return toast('Log record not found', false);
  
  if (item.type === 'kwic') {
    if (item.params && item.params.term) S.q.term = item.params.term;
    go('kwic');
    if (S.files.length) setTimeout(() => runKwic(), 100);
  } else if (item.type === 'stats') {
    go('stats');
    if (S.files.length) setTimeout(() => runStats(), 100);
  } else if (item.type === 'plot') {
    if (item.params && item.params.term) S.q.term = item.params.term;
    go('plot');
    if (S.files.length) setTimeout(() => runPlot(), 100);
  } else if (item.type === 'keyword') {
    if (item.params) Object.assign(S.kw, item.params);
    go('keyword');
    if (S.files.length && S.ref.length) setTimeout(() => runKeyword(), 100);
  } else if (item.type === 'cloud') {
    go('cloud');
    if (S.files.length) setTimeout(() => runCloud(), 100);
  } else if (item.type === 'summary') {
    go('summary');
  } else if (item.type === 'sentiment') {
    go('sentiment');
  } else if (item.type === 'collocate') {
    if (item.params && item.params.term) S.coll.term = item.params.term;
    go('collocate');
    if (S.files.length) setTimeout(() => runColl(), 100);
  } else if (item.type === 'ngram') {
    if (item.params) Object.assign(S.ngram, item.params);
    go('ngram');
    if (S.files.length) setTimeout(() => runNgram(), 100);
  } else if (item.type === 'wordlist') {
    go('wordlist');
    if (S.files.length) setTimeout(() => runWordList(), 100);
  } else if (item.type === 'cluster') {
    if (item.params && item.params.term) S.cluster.term = item.params.term;
    go('cluster');
    if (S.files.length) setTimeout(() => runCluster(), 100);
  } else {
    go(item.type || 'corpus');
  }
}

/* ---------- Settings ---------- */
function vSettings(){
  return `
  <section class="card glass">
    <h2>${I.gear} Display &amp; Appearance</h2>
    <div class="setting-row">
      <div class="setting-text"><b>Gradient Background</b><span>Show high-intensity glowing background colors.</span></div>
      <button class="toggle ${S.settings.showBg?'on':''}" onclick="toggleBgVisibilitySetting()" aria-label="Toggle gradient background"><span class="toggle-knob"></span></button>
    </div>
    <div class="setting-row" style="flex-direction:column; align-items:stretch; gap:10px; border-top:1px solid var(--stroke-2); padding-top:16px; margin-top:14px;">
      <div class="setting-text">
        <b>Application Theme &amp; Glow Palette</b>
        <span>Select accent color and glowing highlights.</span>
      </div>
      <div class="theme-circles-container">
        ${renderThemeCircles()}
      </div>
    </div>
  </section>
  <section class="card glass">
    <h2>${I.vibrate} Haptic Feedback</h2>
    <p class="sub">Tactile feedback configuration for user actions and app interactions.</p>
    <div class="setting-row">
      <div class="setting-text"><b>Haptic Vibrations</b><span>Trigger micro-vibrations for tactile response on buttons and tasks.</span></div>
      <button class="toggle ${S.settings.vibrationEnabled?'on':''}" onclick="toggleVibrationEnabled()" aria-label="Toggle haptic feedback"><span class="toggle-knob"></span></button>
    </div>
  </section>
  <section class="card glass">
    <h2>${I.dl} Export & Files</h2>
    <p class="sub">Configure where and in what format results are saved on the phone.</p>
    <div class="setting-row" style="flex-direction:column; align-items:stretch; gap:8px;">
      <div class="setting-text"><b>Output Folder (On Phone)</b><span>Folder inside your phone's Documents directory.</span></div>
      <input type="text" value="${S.settings.outputFolder || 'Documents/LinguaX'}" onchange="updateOutputFolder(this.value)" style="width:100%; max-width:100%;" placeholder="e.g. Documents/LinguaX">
    </div>
    <div class="setting-row" style="flex-direction:column; align-items:stretch; gap:10px; border-top:1px solid var(--stroke-2); padding-top:14px; margin-top:10px;">
      <div class="setting-text"><b>Result Export Format</b><span>Choose the output file format. Export buttons across all tabs will instantly adapt to this choice.</span></div>
      <div class="export-format-grid">
        <button class="export-format-pill ${S.settings.exportFormat==='pdf'?'active':''}" onclick="changeExportFormat('pdf')" aria-label="PDF Document Format">
          <span class="export-pill-title">PDF</span>
          <span class="export-pill-ext">.pdf</span>
        </button>
        <button class="export-format-pill ${S.settings.exportFormat==='csv'?'active':''}" onclick="changeExportFormat('csv')" aria-label="CSV Table Format">
          <span class="export-pill-title">CSV</span>
          <span class="export-pill-ext">.csv</span>
        </button>
        <button class="export-format-pill ${S.settings.exportFormat==='word'?'active':''}" onclick="changeExportFormat('word')" aria-label="Word Document Format">
          <span class="export-pill-title">Word</span>
          <span class="export-pill-ext">.doc</span>
        </button>
        <button class="export-format-pill ${S.settings.exportFormat==='txt'?'active':''}" onclick="changeExportFormat('txt')" aria-label="Plain Text Format">
          <span class="export-pill-title">Text</span>
          <span class="export-pill-ext">.txt</span>
        </button>
      </div>
    </div>
    <div class="setting-row" style="display:flex; justify-content:space-between; align-items:center; gap:12px; border-top:1px solid var(--stroke-2); padding-top:14px; margin-top:10px;">
      <div class="setting-text"><b>Academic Citation Format</b><span>Official APA, MLA, and Chicago citation references.</span></div>
      <button class="btn run small" onclick="openCitationModal()" style="font-weight:700; white-space:nowrap; padding:8px 16px; border-radius:10px; flex-shrink:0;">Click here to cite</button>
    </div>
  </section>
  <section class="card glass">
    <h2><span class="inline-svg-icon" style="color:var(--a1); width:18px; height:18px; display:inline-flex; align-items:center; vertical-align:middle; margin-right:4px;">${I.reset}</span> Privacy &amp; Search History</h2>
    <div class="setting-row">
      <div class="setting-text"><b>Record Search History</b><span>Save recent queries to quickly repeat corpus concordancing and analysis.</span></div>
      <button class="toggle ${S.settings.recordHistory?'on':''}" onclick="toggleRecordHistory()" aria-label="Toggle recording search history"><span class="toggle-knob"></span></button>
    </div>
  </section>
  <section class="card glass">
    <h2>${I.trash} Storage &amp; Data</h2>
    <p class="sub">Uploaded corpus files are stored securely inside the app and kept even if deleted from phone storage. Files remain saved until you clear your data here.</p>
    <button class="btn danger-btn" onclick="confirmClearData(this)">Clear My Data</button>
  </section>
  <section class="card glass">
    <h2>${I.info} About &amp; Version Details</h2>
    <p class="sub">LinguaX Arc ${APP_VERSION} · Dailwind Studios</p>
    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
      <button class="btn ghost" onclick="document.getElementById('aboutModal').classList.add('open')">View credits and details</button>
    </div>
  </section>`;
}
function confirmClearData(btn){
  promptClearAllData();
}

function openHelpModal() {
  $('#helpModal').classList.add('open');
}

function closeHelpModal() {
  $('#helpModal').classList.remove('open');
}

/* ---------- init ---------- */
$('#appbarSearchBtn').innerHTML = I.search;
$('#appbarSearchBtn').onclick = () => openQuickSearchModal();
if ($('#appbarSearchPillIcon')) $('#appbarSearchPillIcon').innerHTML = I.search;
$('#themeBtn').onclick = () => setTheme(S.theme==='dark' ? 'light' : 'dark');
$('#helpBtn').innerHTML = I.help;
$('#helpBtn').onclick = () => openHelpModal();
$('#aboutBtn').innerHTML = I.info;
$('#aboutBtn').onclick = () => $('#aboutModal').classList.add('open');
$('#aboutVersion').textContent = APP_VERSION;
$('#aboutModal').addEventListener('click', e => { if(e.target.id==='aboutModal') e.target.classList.remove('open'); });
$('#helpModal').addEventListener('click', e => { if(e.target.id==='helpModal') closeHelpModal(); });
$('#searchNavModal').addEventListener('click', e => { if(e.target.id==='searchNavModal') closeQuickSearchModal(); });

$('#filePick').addEventListener('change', e => { readPicked(e.target.files, 'corpus'); e.target.value=''; });
$('#refPick').addEventListener('change', e => { readPicked(e.target.files, 'ref'); e.target.value=''; });

function startSplashLoading() {
  const bar = document.getElementById('splashProgressBar');
  const text = document.getElementById('splashProgressText');
  const label = document.getElementById('splashProgressLabel');
  let progress = 0;
  const duration = 3200; // Slower, elegant splash screen loading
  const intervalTime = 20;
  const steps = duration / intervalTime;
  const increment = 100 / steps;
  
  const interval = setInterval(() => {
    progress += increment;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      try {
        localStorage.setItem('linguax_visited_before', 'true');
      } catch(e) {}
      setTimeout(() => {
        const sp = document.getElementById('splashScreen');
        if (sp) {
          sp.classList.add('hide');
          setTimeout(() => {
            sp.remove();
            
          }, 550);
        } else {
          
        }
      }, 250);
    }
    if (bar) bar.style.width = progress + '%';
    if (text) text.textContent = Math.round(progress) + '%';
    
    if (label) {
      const p = Math.round(progress);
      if (p < 15) {
        label.textContent = "Initializing Linguistics Engine...";
      } else if (p < 35) {
        label.textContent = "Loading Concordancer Modules (KWIC)...";
      } else if (p < 55) {
        label.textContent = "Compiling Statistical Association Rules...";
      } else if (p < 75) {
        label.textContent = "Preparing Data Visualization Engine...";
      } else if (p < 90) {
        label.textContent = "Securing On-Device Privacy Shield...";
      } else if (p < 99) {
        label.textContent = "Optimizing Corpus Analytics Pipelines...";
      } else {
        label.textContent = "Engine Ready!";
      }
    }
  }, intervalTime);
}

function initSplashCanvas() {
  const canvas = document.getElementById('splashCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  // Create nodes (increased by 20% from 30 to 36)
  const nodes = [];
  const numNodes = 36;
  const connectionDistance = 145;
  
  const linguisticTokens = [
    "corpus", "entropy", "zipf", "lexicon", "p < 0.05", "N = 14,204", "ngram", 
    "lemma", "token", "grammar", "semantic", "collocate", "KWIC", "0.942",
    "α", "β", "Ω", "L", "X", "θ", "concordance", "t-score", "MI", "dispersion",
    "TTR", "Hapax", "log-likelihood", "LL", "mutual info", "collocation",
    "syntax", "phoneme", "G² = 24.6", "distribution", "z-score", "p-value", "POS"
  ];
  
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "w", "x", "y", "z", "α", "β", "Ω", "?", "!", "[", "]", "{", "}", ",", "•", "λ", "σ", "μ"];
  
  for (let i = 0; i < numNodes; i++) {
    const isFloatingToken = Math.random() < 0.42;
    const isTinyLetter = Math.random() < 0.36;
    
    const angle = Math.random() * Math.PI * 2;
    const isCore = Math.random() < 0.4;
    const dist = isCore ? (45 + Math.random() * 140) : (135 + Math.random() * (Math.max(width, height) / 2));
    
    nodes.push({
      x: width / 2 + Math.cos(angle) * dist,
      y: height / 2 + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2 + 0.8,
      token: isFloatingToken ? linguisticTokens[Math.floor(Math.random() * linguisticTokens.length)] : null,
      letter: (!isFloatingToken && isTinyLetter) ? letters[Math.floor(Math.random() * letters.length)] : null,
      pulseOffset: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.015
    });
  }
  
  const curves = [];
  for (let i = 0; i < 4; i++) {
    curves.push({
      amplitude: 15 + Math.random() * 25,
      frequency: 0.002 + Math.random() * 0.004,
      phase: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.01,
      y: (0.30 + i * 0.14) * height,
      color: `rgba(212, 175, 55, ${0.07 + i * 0.035})`
    });
  }
  
  let animationFrameId;
  function draw() {
    const sp = document.getElementById('splashScreen');
    if (!sp || sp.classList.contains('hide')) {
      cancelAnimationFrame(animationFrameId);
      return;
    }
    
    ctx.clearRect(0, 0, width, height);
    
    // Grid lines are now drawn purely via high-performance CSS grid background gradient on #splashScreen!
    
    // Curves (optimized step and simplified math)
    ctx.lineWidth = 1.2;
    curves.forEach(c => {
      ctx.beginPath();
      ctx.setLineDash([5, 8]);
      ctx.strokeStyle = c.color;
      c.phase += c.speed;
      for (let x = 0; x < width; x += 16) {
        const distFromCenter = Math.abs(x - width / 2);
        const scale = distFromCenter / (width * 0.3);
        const gaussian = 1 / (1 + scale * scale);
        const y = c.y + Math.sin(x * c.frequency + c.phase) * c.amplitude * (0.3 + gaussian * 1.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);
    
    // Nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.pulseOffset += n.pulseSpeed;
      
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
      
      const sizePulse = Math.sin(n.pulseOffset) * 0.4 + 1;
      ctx.fillStyle = n.token ? 'rgba(255, 224, 130, 0.55)' : 'rgba(212, 175, 55, 0.40)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius * sizePulse, 0, Math.PI * 2);
      ctx.fill();
      
      if (n.token) {
        ctx.font = '600 9.5px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(255, 236, 179, ${0.35 + Math.sin(n.pulseOffset) * 0.12})`;
        ctx.fillText(n.token, n.x + 8, n.y + 3);
      } else if (n.letter) {
        ctx.font = '400 10.5px "Sora", sans-serif';
        ctx.fillStyle = `rgba(247, 208, 112, ${0.28 + Math.sin(n.pulseOffset) * 0.10})`;
        ctx.fillText(n.letter, n.x + 6, n.y + 3);
      }
    });
    
    // Networks (optimized to bypass Math.sqrt unless within range)
    ctx.lineWidth = 0.65;
    const connDistSq = connectionDistance * connectionDistance;
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < connDistSq) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / connectionDistance) * 0.15;
          ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }
    
    animationFrameId = requestAnimationFrame(draw);
  }
  
  draw();
}

function checkAndStartSplash() {
  initSplashCanvas();
  startSplashLoading();
}

/* ================= SHORT SUMMARY (TEXT SUMMARIZER) ================= */
function triggerSummaryFileUpload() {
  const inp = document.getElementById('summaryFileInput');
  if (inp) inp.click();
}

function handleSummaryFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    S.summary.text = text;
    const txtArea = document.getElementById('summaryInput');
    if (txtArea) {
      txtArea.value = text;
      toast(`Loaded: ${file.name} (${text.length} chars)`);
    }
  };
  reader.readAsText(file);
}

function clearSummaryForm() {
  S.summary.text = '';
  S.summary.query = '';
  S.summary.outHtml = '';
  S.summary.fileIdx = '';
  const input = $('#summaryInput'); if (input) input.value = '';
  const query = $('#summaryQuery'); if (query) query.value = '';
  const out = $('#summaryOut'); if (out) out.innerHTML = '';
  const sel = $('#summaryFileSelect'); if (sel) sel.value = '';
}

function vSummary(){
  let fileOptions = `
    <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
      <button class="btn ghost small" onclick="triggerSummaryFileUpload()" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 10px; font-size: 12.5px; height: 38px;">
        <span class="inline-svg-icon" style="color:var(--ink-soft); width:14px; height:14px; display:inline-flex; align-items:center; margin-right:2px;">${I.folder}</span> Upload Text File
      </button>
      <input type="file" id="summaryFileInput" accept=".txt,.csv,.json,.xml,.html,.css,.js,.md" style="display: none;" onchange="handleSummaryFileUpload(event)">
    </div>
  `;
  if (S.files.length) {
    fileOptions = `
      <div class="controls-row" style="margin-bottom: 12px; align-items: flex-end;">
        <div class="field" style="flex: 1; min-width: 0;">
          <label>Corpus File</label>
          ${gsel('summaryFileSelect', ['', ...S.files.map((_, i) => String(i))], S.summary.fileIdx || '', v => v === '' ? '-- Choose Corpus File --' : (S.files[+v] ? S.files[+v].name : '-- Choose Corpus File --'), val => loadSummaryFile(val))}
        </div>
        <div style="flex: none;">
          <button class="btn ghost" onclick="triggerSummaryFileUpload()" style="height: 38px; display: inline-flex; align-items: center; gap: 6px; padding: 0 14px; font-size: 13px; border-radius: 14px;">
            <span class="inline-svg-icon" style="color:var(--ink-soft); width:14px; height:14px; display:inline-flex; align-items:center;">${I.folder}</span> Upload File
          </button>
          <input type="file" id="summaryFileInput" accept=".txt,.csv,.json,.xml,.html,.css,.js,.md" style="display: none;" onchange="handleSummaryFileUpload(event)">
        </div>
      </div>
    `;
  }
  
  const curLen = S.summary.length || '5';
  const curFmt = S.summary.format || 'bullets';
  
  return `<section class="card glass">
    <h2><span class="inline-svg-icon" style="color:var(--a1); width:20px; height:20px; display:inline-flex; align-items:center; vertical-align:middle; margin-right:4px;">${I.file}</span> Professional Text Summarizer</h2>
    <p class="sub">Extract core semantic information, generate executive summaries, and analyze lexical complexity instantly on-device.</p>
    
    ${fileOptions}
    
    <div style="margin-bottom: 14px;">
      <textarea id="summaryInput" class="input" style="width: 100%; height: 180px; font-family: sans-serif; font-size: 13.5px; line-height: 1.5; padding: 12px; box-sizing: border-box; resize: none;" placeholder="Type or paste your text here..." oninput="S.summary.text=this.value">${esc(S.summary.text || '')}</textarea>
    </div>
    
    <div class="controls-row">
      <div class="field">
        <label>Length</label>
        ${gsel('summaryLength', ['3', '5', '8', '12'], curLen, v => ({ '3': 'Short (3 points)', '5': 'Medium (5 points)', '8': 'Detailed (8 points)', '12': 'Long (12 points)' }[v] || v), val => { S.summary.length = val; })}
      </div>
      <div class="field">
        <label>Format</label>
        ${gsel('summaryFormat', ['bullets', 'paragraph', 'outline'], curFmt, v => ({ 'bullets': 'Bullet Points', 'paragraph': 'Executive Abstract', 'outline': 'Structured Outline' }[v] || v), val => { S.summary.format = val; })}
      </div>
    </div>
    
    <div class="controls-row">
      <div class="field" style="flex:1;">
        <label for="summaryQuery">Focus Keyword (Optional)</label>
        <input type="text" id="summaryQuery" class="input" style="width: 100%; height: 44px; box-sizing: border-box;" placeholder="e.g. language, data" value="${esc(S.summary.query || '')}" oninput="S.summary.query=this.value">
      </div>
    </div>
    
    <div class="controls" style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-top: 12px;">
      <button class="btn run btn-analyze" onclick="runSummary()">Analyze</button>
      <button class="btn ghost" onclick="clearSummaryForm()">Clear</button>
    </div>
    
    <div id="summaryOut" style="margin-top: 18px;">${S.summary.outHtml || ''}</div>
  </section>`;
}

function loadSummaryFile(val) {
  S.summary.fileIdx = val;
  if (val === "") return;
  const idx = parseInt(val);
  const f = S.files[idx];
  if (f && f.text) {
    S.summary.text = f.text;
    const txtArea = document.getElementById('summaryInput');
    if (txtArea) {
      txtArea.value = f.text;
    }
  }
}

function runSummary() {
  const textInp = $('#summaryInput');
  const text = textInp ? textInp.value : (S.summary.text || '');
  S.summary.text = text;
  if (!text || !text.trim()) {
    toast('Please enter some text or select a file to summarize', false);
    return;
  }
  
  const lengthVal = parseInt(gselVal('summaryLength') || S.summary.length) || 5;
  const formatVal = gselVal('summaryFormat') || S.summary.format || 'bullets';
  const queryVal = ($('#summaryQuery').value || '').trim().toLowerCase();
  
  S.summary.length = String(lengthVal);
  S.summary.format = formatVal;
  S.summary.query = $('#summaryQuery').value || '';
  
  const { sentences, origWordCount, sumWordCount, stats } = summarizeTextAdvanced(text, lengthVal, queryVal, formatVal);
  
  const reduction = Math.round((1 - sumWordCount / origWordCount) * 100);
  
  let keyTermsHtml = '';
  const words = text.toLowerCase().replace(/[^\w\s\u0600-\u06FF\u4E00-\u9FFF]/g, ' ').split(/\s+/);
  const freq = {};
  words.forEach(w => {
    if (w.length > 3 && !STOP.has(w)) freq[w] = (freq[w] || 0) + 1;
  });
  const sortedFreq = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0, 6);
  if (sortedFreq.length) {
    keyTermsHtml = `<div style="margin-top: 14px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
      <span style="font-size: 11px; font-weight: bold; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.05em;">Linguistic Key Concepts:</span>
      ${sortedFreq.map(([w, f]) => `<span style="font-size: 11px; background: var(--stroke-2); color: var(--ink); padding: 3px 8px; border-radius: 6px; font-weight: 600;">${esc(w)} <span style="opacity:0.6; font-size:10px;">(${f}x)</span></span>`).join('')}
    </div>`;
  }

  let summaryContentHtml = '';
  if (formatVal === 'paragraph') {
    summaryContentHtml = `<p style="margin: 0; font-size: 14px; line-height: 1.7; color: var(--ink); text-indent: 20px;">${sentences.map(s => esc(s)).join(' ')}</p>`;
  } else if (formatVal === 'outline') {
    const splitCount = Math.ceil(sentences.length / 3);
    const sections = [
      { title: 'Context & Core Premise', items: sentences.slice(0, splitCount) },
      { title: 'Substantive Details & Arguments', items: sentences.slice(splitCount, splitCount * 2) },
      { title: 'Conclusions & Technical Implications', items: sentences.slice(splitCount * 2) }
    ];
    summaryContentHtml = sections.map(sec => {
      if (!sec.items.length) return '';
      return `<div style="margin-bottom: 14px;">
        <h5 style="margin: 0 0 6px 0; font-family: 'Sora'; font-size: 12.5px; color: var(--a1); font-weight: 700;">${sec.title}</h5>
        <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; line-height: 1.6; color: var(--ink); display: flex; flex-direction: column; gap: 6px;">
          ${sec.items.map(s => `<li style="list-style-type: square; padding-left: 4px;">${esc(s)}</li>`).join('')}
        </ul>
      </div>`;
    }).join('');
  } else {
    summaryContentHtml = `<ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6; color: var(--ink); display: flex; flex-direction: column; gap: 10px;">
      ${sentences.map(s => `<li style="list-style-type: disc; padding-left: 4px;">${esc(s)}</li>`).join('')}
    </ul>`;
  }

  $('#summaryOut').innerHTML = `
    <div class="result-stats" style="background: var(--stroke-2); border-radius: 12px; padding: 14px 16px; display: grid; grid-template-columns: repeat(auto-fit, minmax(115px, 1fr)); gap: 14px; margin-bottom: 16px;">
      <div style="display: flex; flex-direction: column; gap: 3px;">
        <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-soft); font-weight: 600;">Original Size</div>
        <div style="font-size: 14px; font-weight: 800; color: var(--ink);">${origWordCount} words</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 3px;">
        <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-soft); font-weight: 600;">Summary Size</div>
        <div style="font-size: 14px; font-weight: 800; color: var(--ink);">${sumWordCount} words</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 3px;">
        <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-soft); font-weight: 600;">Lexical Density (TTR)</div>
        <div style="font-size: 14px; font-weight: 800; color: var(--ink);">${(stats.ttr * 100).toFixed(1)}%</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 3px;">
        <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-soft); font-weight: 600;">Est. Read Time</div>
        <div style="font-size: 14px; font-weight: 800; color: var(--ink);">${stats.readTime}m &rarr; ${stats.sumReadTime}s</div>
      </div>
    </div>
    
    <div style="background: var(--bg-card); border: 1px solid var(--stroke); border-radius: 12px; padding: 18px; margin-bottom: 12px; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <h4 style="margin: 0; font-family: 'Sora'; font-size: 13px; text-transform: uppercase; color: var(--ink-soft); letter-spacing: 0.05em;">Generated Output (${reduction}% Compact)</h4>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="summary-action-btn" id="speakSummaryBtn" onclick="toggleSpeakSummary()"><span id="speakIcon" style="width:13px; height:13px; display:inline-flex; align-items:center;">${I.volume}</span> <span id="speakLabel">Speak</span></button>
          <button class="summary-action-btn" onclick="copySummaryText()"><span style="width:13px; height:13px; display:inline-flex; align-items:center;">${I.edit}</span> Copy</button>
          <button class="summary-action-btn" onclick="exportSummaryReport()"><span style="width:13px; height:13px; display:inline-flex; align-items:center;">${I.dl}</span> Export</button>
        </div>
      </div>
      
      <div id="summaryContentBody">
        ${summaryContentHtml}
      </div>
      
      ${keyTermsHtml}
    </div>
  `;
  S.summary.outHtml = $('#summaryOut').innerHTML;

  const analyzedFileName = (S.summary.fileIdx !== '' && S.files[+S.summary.fileIdx])
    ? S.files[+S.summary.fileIdx].name
    : (text.length > 50 ? text.substring(0, 40).replace(/[\r\n]+/g, ' ') + '...' : (text.trim() || 'Custom Text Input'));

  logWorkspaceTask({
    type: 'summary',
    typeName: 'Text Summarizer',
    title: `Text Summary (${reduction}% Compact)`,
    fileName: analyzedFileName,
    corpusSummary: analyzedFileName,
    summarySnippet: sentences.slice(0, 2).join(' '),
    metrics: { OriginalWords: origWordCount, SummaryWords: sumWordCount, Reduction: `${reduction}%`, Format: formatVal },
    params: { length: S.summary.length, format: S.summary.format, query: S.summary.query },
    exportableRows: [
      ['Section', 'Content'],
      ['File Analyzed', analyzedFileName],
      ['Original Word Count', String(origWordCount)],
      ['Summary Word Count', String(sumWordCount)],
      ['Reduction Percentage', `${reduction}%`],
      ['Full Summary Text', sentences.join('\n')]
    ],
    exportFilename: 'summary_report.csv'
  });
}

function copySummaryText() {
  const body = document.getElementById('summaryContentBody');
  if (!body) return;
  
  let text = '';
  const lis = body.querySelectorAll('li');
  if (lis.length) {
    const headings = body.querySelectorAll('h5');
    if (headings.length) {
      const divs = body.querySelectorAll('div');
      divs.forEach(div => {
        const h = div.querySelector('h5');
        const items = div.querySelectorAll('li');
        if (h) text += h.textContent + '\n';
        items.forEach(li => text += ' - ' + li.textContent + '\n');
        text += '\n';
      });
    } else {
      text = Array.from(lis).map(li => "• " + li.textContent).join('\n');
    }
  } else {
    const p = body.querySelector('p');
    text = p ? p.textContent : body.textContent;
  }
  
  navigator.clipboard.writeText(text.trim());
  toast('Summary copied to clipboard!');
}

function exportSummaryReport() {
  const body = document.getElementById('summaryContentBody');
  if (!body) return toast('No summary to export', false);
  
  const text = body.innerText || body.textContent;
  const rows = [
    ["LinguaX Professional Summary Report"],
    ["Generated on: " + new Date().toLocaleString()],
    ["Original Word Count: " + ($('#summaryOut .result-stats div:nth-child(1) div:nth-child(2)')?.textContent || 'N/A')],
    ["Summary Word Count: " + ($('#summaryOut .result-stats div:nth-child(2) div:nth-child(2)')?.textContent || 'N/A')],
    [""],
    ["SUMMARY DETAILS:"],
    [text]
  ];
  
  exportCSV(rows, 'academic_summary', 'summaries');
}

function toggleSpeakSummary() {
  const hasAndroidBridge = typeof AndroidBridge !== 'undefined' && typeof AndroidBridge.speak === 'function';
  if (!hasAndroidBridge && !('speechSynthesis' in window)) {
    toast('Text-to-Speech is not supported in this browser', false);
    return;
  }
  
  if (isSpeaking) {
    if (hasAndroidBridge) {
      AndroidBridge.stopSpeaking();
    } else {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    updateSpeakBtnState(false);
    toast('Speech synthesis stopped');
  } else {
    const body = document.getElementById('summaryContentBody');
    if (!body) return;
    
    let textToSpeak = '';
    const paragraphs = body.querySelectorAll('p');
    const lis = body.querySelectorAll('li');
    if (paragraphs.length) {
      textToSpeak = Array.from(paragraphs).map(p => p.textContent).join('. ');
    } else if (lis.length) {
      textToSpeak = Array.from(lis).map(li => li.textContent).join('. ');
    } else {
      textToSpeak = body.textContent;
    }
    
    if (!textToSpeak || !textToSpeak.trim()) return;
    
    isSpeaking = true;
    updateSpeakBtnState(true);

    if (hasAndroidBridge) {
      AndroidBridge.speak(textToSpeak);
      toast('Speaking summary... Tap Stop to finish.');
    } else {
      window.speechSynthesis.cancel();
      
      currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
      currentUtterance.rate = 1.05;
      currentUtterance.pitch = 1.0;
      
      currentUtterance.onend = () => {
        isSpeaking = false;
        updateSpeakBtnState(false);
      };
      
      currentUtterance.onerror = (e) => {
        isSpeaking = false;
        updateSpeakBtnState(false);
      };
      
      window.speechSynthesis.speak(currentUtterance);
      toast('Speaking summary... Tap Speak to stop.');
    }
  }
}

function updateSpeakBtnState(active) {
  const btn = document.getElementById('speakSummaryBtn');
  const icon = document.getElementById('speakIcon');
  const label = document.getElementById('speakLabel');
  if (!btn) return;
  if (active) {
    btn.style.background = 'var(--a1)';
    btn.style.color = 'var(--btn-ink)';
    btn.style.borderColor = 'transparent';
    if (icon) icon.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" style="width:12px; height:12px;"><rect x="4" y="4" width="16" height="16"/></svg>';
    if (label) label.textContent = 'Stop';
  } else {
    btn.style.background = '';
    btn.style.color = '';
    btn.style.borderColor = '';
    if (icon) icon.innerHTML = I.volume;
    if (label) label.textContent = 'Speak';
  }
}

function summarizeTextAdvanced(text, maxSentences, focusKeyword = '', format = 'bullets') {
  if (!text || !text.trim()) return { sentences: [], origWordCount: 0, sumWordCount: 0, stats: { ttr: 0, readTime: 0, sumReadTime: 0 } };
  
  const sentenceRegex = /[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g;
  let sentences = text.match(sentenceRegex) || [];
  sentences = sentences.map(s => s.trim()).filter(s => s.length > 5);
  
  const words = text.toLowerCase().replace(/[^\w\s\u0600-\u06FF\u4E00-\u9FFF]/g, ' ').split(/\s+/).filter(Boolean);
  const origWordCount = words.length;
  
  const uniqueWords = new Set(words);
  const ttr = words.length ? (uniqueWords.size / words.length) : 0;
  const readTime = Math.ceil(origWordCount / 200) || 1;
  
  if (sentences.length === 0) {
    return { sentences: [text], origWordCount, sumWordCount: origWordCount, stats: { ttr, readTime, sumReadTime: Math.ceil(origWordCount / 3) } };
  }

  // 1. Calculate Term Frequencies (TF) per sentence and globally
  const N = sentences.length;
  const wordSentenceCounts = {}; // Document frequency (DF) of words across sentences
  const sentenceWordsList = []; // Clean words per sentence
  
  sentences.forEach((sentence, idx) => {
    const sWords = sentence.toLowerCase().replace(/[^\w\s\u0600-\u06FF\u4E00-\u9FFF]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP.has(w));
    sentenceWordsList.push(sWords);
    
    // Track unique words in this sentence for document frequency calculation
    const seenInSentence = new Set(sWords);
    seenInSentence.forEach(w => {
      wordSentenceCounts[w] = (wordSentenceCounts[w] || 0) + 1;
    });
  });

  // Calculate TF-IDF word weights per sentence
  const tfidfPerSentence = [];
  
  sentences.forEach((sentence, idx) => {
    const sWords = sentenceWordsList[idx];
    const localTf = {};
    sWords.forEach(w => {
      localTf[w] = (localTf[w] || 0) + 1;
    });
    
    const localTfidf = {};
    let magnitude = 0;
    
    Object.keys(localTf).forEach(w => {
      const tf = localTf[w];
      const df = wordSentenceCounts[w] || 1;
      const idf = 1 + Math.log(N / df);
      const val = tf * idf;
      localTfidf[w] = val;
      magnitude += val * val;
    });
    
    magnitude = Math.sqrt(magnitude) || 1.0;
    tfidfPerSentence.push({ tfidf: localTfidf, magnitude });
  });

  // 2. Compute Overall Document Centroid TF-IDF Vector
  // The centroid represents the key thematic concepts in the document.
  const docWordSum = {};
  sentences.forEach((sentence, idx) => {
    const sWords = sentenceWordsList[idx];
    sWords.forEach(w => {
      const df = wordSentenceCounts[w] || 1;
      const idf = 1 + Math.log(N / df);
      docWordSum[w] = (docWordSum[w] || 0) + idf;
    });
  });
  
  // Get top 15 terms with highest document-wide relevance to represent the centroid
  const topCentroidTerms = Object.entries(docWordSum)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .reduce((acc, [w, v]) => {
      acc[w] = v;
      return acc;
    }, {});
    
  let centroidMagnitude = 0;
  Object.values(topCentroidTerms).forEach(v => {
    centroidMagnitude += v * v;
  });
  centroidMagnitude = Math.sqrt(centroidMagnitude) || 1.0;

  // 3. Compute Sentence Cosine Similarity with the Document Centroid Vector
  const scoredSentences = sentences.map((sentence, index) => {
    const sWords = sentenceWordsList[index];
    const sTfidf = tfidfPerSentence[index].tfidf;
    const sMag = tfidfPerSentence[index].magnitude;
    
    // Dot product with centroid
    let dotProduct = 0;
    Object.keys(sTfidf).forEach(w => {
      if (topCentroidTerms[w]) {
        dotProduct += sTfidf[w] * topCentroidTerms[w];
      }
    });
    
    let cosineSim = dotProduct / (sMag * centroidMagnitude);
    if (isNaN(cosineSim)) cosineSim = 0;
    
    let score = cosineSim;
    
    // Position weights
    const positionPercent = index / N;
    if (positionPercent <= 0.12) {
      score *= 1.3; // Boost introductory sentences
    } else if (positionPercent >= 0.88) {
      score *= 1.15; // Boost concluding sentences
    }
    
    // Focus Keyword boosting
    if (focusKeyword) {
      const qWords = focusKeyword.split(/\s+/).filter(Boolean);
      let queryHits = 0;
      qWords.forEach(qw => {
        if (sentence.toLowerCase().includes(qw.toLowerCase())) {
          queryHits++;
        }
      });
      if (queryHits > 0) {
        score *= (1.5 + queryHits * 0.8);
      }
    }
    
    // Ideal length factor (prefer sentences with 15-25 words)
    const idealLen = 18;
    const lenDiff = Math.abs(sWords.length - idealLen);
    const lengthFactor = 1 + (lenDiff * 0.035);
    
    return { sentence, score: score / lengthFactor, index, words: new Set(sWords) };
  });

  // 4. Redundancy Filtering (MMR - Maximal Marginal Relevance inspired selection)
  // We iteratively select sentences, penalizing candidates that are too similar to already selected ones.
  const selected = [];
  const candidates = [...scoredSentences];
  const targetCount = Math.min(maxSentences, N);
  
  while (selected.length < targetCount && candidates.length > 0) {
    let bestIndex = -1;
    let bestMmrScore = -Infinity;
    
    for (let i = 0; i < candidates.length; i++) {
      const cand = candidates[i];
      let baseScore = cand.score;
      
      // Calculate max similarity to already selected sentences (Jaccard similarity)
      let maxSim = 0;
      selected.forEach(sel => {
        const intersection = new Set([...cand.words].filter(w => sel.words.has(w)));
        const union = new Set([...cand.words, ...sel.words]);
        const jaccard = union.size ? (intersection.size / union.size) : 0;
        if (jaccard > maxSim) {
          maxSim = jaccard;
        }
      });
      
      // Penalty: heavily discount redundancy (diminishing return for duplicate info)
      let mmrScore = baseScore;
      if (selected.length > 0) {
        mmrScore = 0.7 * baseScore - 0.3 * maxSim;
      }
      
      if (mmrScore > bestMmrScore) {
        bestMmrScore = mmrScore;
        bestIndex = i;
      }
    }
    
    if (bestIndex !== -1) {
      selected.push(candidates[bestIndex]);
      candidates.splice(bestIndex, 1);
    } else {
      break;
    }
  }

  // Sort selected sentences back to their original position in the text
  selected.sort((a, b) => a.index - b.index);
  
  const finalSentences = selected.map(item => item.sentence);
  const sumText = finalSentences.join(' ');
  const sumWordCount = sumText.split(/\s+/).filter(Boolean).length;
  const sumReadTime = Math.ceil(sumWordCount / 3.3) || 5;
  
  return {
    sentences: finalSentences,
    origWordCount,
    sumWordCount,
    stats: { ttr, readTime, sumReadTime }
  };
}

/* ================= SENTIMENT & TONE ANALYSIS ================= */
let CURRENT_SENTIMENT_DATA = null;
let CURRENT_SENTIMENT_FILTER = 'all';

function triggerSentimentFileUpload() {
  const inp = document.getElementById('sentimentFileInput');
  if (inp) inp.click();
}

function handleSentimentFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    S.sentiment.text = text;
    const txtArea = document.getElementById('sentimentInput');
    if (txtArea) {
      txtArea.value = text;
      toast(`Loaded: ${file.name} (${text.length} chars)`);
    }
  };
  reader.readAsText(file);
}

function clearSentimentForm() {
  S.sentiment.text = '';
  S.sentiment.fileIdx = '';
  S.sentiment.data = null;
  CURRENT_SENTIMENT_DATA = null;
  const inp = $('#sentimentInput'); if (inp) inp.value = '';
  const out = $('#sentimentOut'); if (out) out.innerHTML = '';
  const sel = $('#sentimentFileSelect'); if (sel) sel.value = '';
}

function vSentiment(){
  let fileOptions = `
    <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
      <button class="btn ghost small" onclick="triggerSentimentFileUpload()" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 10px; font-size: 12.5px; height: 38px;">
        <span style="width:14px; height:14px; display:inline-flex; align-items:center;">${I.folder}</span> Upload Text File
      </button>
      <input type="file" id="sentimentFileInput" accept=".txt,.csv,.json,.xml,.html,.css,.js,.md" style="display: none;" onchange="handleSentimentFileUpload(event)">
    </div>
  `;
  if (S.files.length) {
    fileOptions = `
      <div class="controls-row" style="margin-bottom: 12px; align-items: flex-end;">
        <div class="field" style="flex: 1; min-width: 0;">
          <label>Corpus File</label>
          ${gsel('sentimentFileSelect', ['', ...S.files.map((_, i) => String(i))], S.sentiment.fileIdx || '', v => v === '' ? '-- Choose Corpus File --' : (S.files[+v] ? S.files[+v].name : '-- Choose Corpus File --'), val => loadSentimentFile(val))}
        </div>
        <div style="flex: none;">
          <button class="btn ghost" onclick="triggerSentimentFileUpload()" style="height: 38px; display: inline-flex; align-items: center; gap: 6px; padding: 0 14px; font-size: 13px; border-radius: 14px;">
            <span style="width:14px; height:14px; display:inline-flex; align-items:center;">${I.folder}</span> Upload File
          </button>
          <input type="file" id="sentimentFileInput" accept=".txt,.csv,.json,.xml,.html,.css,.js,.md" style="display: none;" onchange="handleSentimentFileUpload(event)">
        </div>
      </div>
    `;
  }
  
  return `<section class="card glass">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
      <div>
        <h2>${I.smile} Intelligent Sentiment & Tone Analyzer</h2>
        <p class="sub">Valence scoring, emotional tone weights, and narrative arc detection with threat flag support.</p>
      </div>
    </div>
    
    ${fileOptions}

    <div style="margin-bottom: 16px;">
      <div style="font-size: 11.5px; font-weight: 700; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">Quick Tests:</div>
      <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
        <div style="cursor: pointer; font-size: 13px; line-height: 1.5; color: var(--ink); text-decoration: none !important;" onclick="setSentimentSample('Police will kill the dangerous murderer.')">
          <span style="font-weight: 700; color: var(--a1); margin-right: 6px;">1.</span>Police will kill the dangerous murderer.
        </div>
        <div style="cursor: pointer; font-size: 13px; line-height: 1.5; color: var(--ink); text-decoration: none !important;" onclick="setSentimentSample('This service was terrible, broken and deeply frustrating!')">
          <span style="font-weight: 700; color: var(--a1); margin-right: 6px;">2.</span>This service was terrible, broken and deeply frustrating!
        </div>
        <div style="cursor: pointer; font-size: 13px; line-height: 1.5; color: var(--ink); text-decoration: none !important;" onclick="setSentimentSample('LinguaX is an incredible, brilliant toolkit! I love these features.')">
          <span style="font-weight: 700; color: var(--a1); margin-right: 6px;">3.</span>LinguaX is an incredible, brilliant toolkit! I love these features.
        </div>
        <div style="cursor: pointer; font-size: 13px; line-height: 1.5; color: var(--ink); text-decoration: none !important;" onclick="setSentimentSample('The linguistic corpus contains empirical research methodology and statistical data.')">
          <span style="font-weight: 700; color: var(--a1); margin-right: 6px;">4.</span>The linguistic corpus contains empirical research methodology and statistical data.
        </div>
      </div>
    </div>
    
    <div style="margin-bottom: 16px;">
      <textarea id="sentimentInput" class="input" style="width: 100%; height: 180px; font-family: sans-serif; font-size: 13.5px; line-height: 1.5; padding: 12px; box-sizing: border-box;" placeholder="Type or paste text here to run sentiment scoring..." oninput="S.sentiment.text=this.value">${esc(S.sentiment.text || '')}</textarea>
    </div>
    
    <div class="controls" style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <button class="btn run btn-analyze" onclick="runSentiment()">Analyze</button>
      <button class="btn ghost" onclick="clearSentimentForm()">Clear</button>
    </div>
    
    <div id="sentimentOut" style="margin-top: 18px;"></div>
  </section>`;
}

function setSentimentSample(val) {
  S.sentiment.text = val;
  const txtArea = document.getElementById('sentimentInput');
  if (txtArea) txtArea.value = val;
  runSentiment();
}

function loadSentimentFile(val) {
  S.sentiment.fileIdx = val;
  if (val === "") return;
  const idx = parseInt(val);
  const f = S.files[idx];
  if (f && f.text) {
    S.sentiment.text = f.text;
    const txtArea = document.getElementById('sentimentInput');
    if (txtArea) {
      txtArea.value = f.text;
    }
  }
}

function runSentiment() {
  const textInp = $('#sentimentInput');
  const text = textInp ? textInp.value : (S.sentiment.text || '');
  S.sentiment.text = text;
  if (!text || !text.trim()) {
    toast('Please enter some text or select a file to analyze', false);
    return;
  }
  
  const data = analyzeSentimentAdvanced(text);
  if (!data) {
    S.sentiment.data = null;
    CURRENT_SENTIMENT_DATA = null;
    $('#sentimentOut').innerHTML = `<div class="empty">Unable to analyze text sentiment.</div>`;
    return;
  }
  
  CURRENT_SENTIMENT_DATA = data;
  S.sentiment.data = data;
  CURRENT_SENTIMENT_FILTER = S.sentiment.filter || 'all';
  
  let polarityLabel = "Neutral / Objective";
  if (data.threatDetected) {
    polarityLabel = "Severe Hostile / Threat Flagged";
  } else if (data.polarity <= -0.55) {
    polarityLabel = "Severe Negative";
  } else if (data.polarity <= -0.15) {
    polarityLabel = "Negative";
  } else if (data.polarity <= -0.05) {
    polarityLabel = "Mildly Negative";
  } else if (data.polarity >= 0.55) {
    polarityLabel = "Highly Positive";
  } else if (data.polarity >= 0.15) {
    polarityLabel = "Positive";
  } else if (data.polarity >= 0.05) {
    polarityLabel = "Mildly Positive";
  }

  const rows = [
    ["Metric", "Value"],
    ["Overall Polarity Score", data.polarity.toFixed(2)],
    ["Sentiment Classification", polarityLabel],
    ["Threat Detected", data.threatDetected ? "YES (Violent/Hostile language detected)" : "None"],
    ["Optimism & Joy", `${data.emoPercentages.optimism}%`],
    ["Critical & Hostility", `${data.emoPercentages.frustration}%`],
    ["Objective & Factual", `${data.emoPercentages.academic}%`],
    ["Certainty & Confidence", `${data.emoPercentages.certainty}%`],
    ["", ""],
    ["Sentence", "Polarity Score"]
  ];
  data.sentenceDetails.forEach(s => rows.push([s.sentence, s.score.toFixed(2)]));

  const analyzedFileName = (S.sentiment.fileIdx !== '' && S.files[+S.sentiment.fileIdx])
    ? S.files[+S.sentiment.fileIdx].name
    : (text.length > 50 ? text.substring(0, 40).replace(/[\r\n]+/g, ' ') + '...' : (text.trim() || 'Custom Text Input'));

  logWorkspaceTask({
    type: 'sentiment',
    typeName: 'Sentiment & Tone',
    title: `Sentiment Analysis (${polarityLabel} · ${data.polarity.toFixed(2)})`,
    fileName: analyzedFileName,
    corpusSummary: analyzedFileName,
    summarySnippet: `Polarity: ${data.polarity.toFixed(2)} (${polarityLabel}). Tone: ${data.emoPercentages.optimism}% Optimism, ${data.emoPercentages.frustration}% Critical, ${data.emoPercentages.academic}% Objective.`,
    metrics: { Polarity: data.polarity.toFixed(2), Classification: polarityLabel, Optimism: `${data.emoPercentages.optimism}%`, Critical: `${data.emoPercentages.frustration}%` },
    params: { filter: CURRENT_SENTIMENT_FILTER },
    exportableRows: rows,
    exportFilename: 'sentiment_analysis.csv'
  });

  renderSentimentResults();
}

function exportSentimentReport() {
  const data = CURRENT_SENTIMENT_DATA;
  if (!data) return toast('No sentiment data to export', false);
  
  let polarityLabel = "Neutral / Objective";
  if (data.threatDetected) {
    polarityLabel = "Severe Hostile / Threat Flagged";
  } else if (data.polarity <= -0.55) {
    polarityLabel = "Severe Negative";
  } else if (data.polarity <= -0.15) {
    polarityLabel = "Negative";
  } else if (data.polarity <= -0.05) {
    polarityLabel = "Mildly Negative";
  } else if (data.polarity >= 0.55) {
    polarityLabel = "Highly Positive";
  } else if (data.polarity >= 0.15) {
    polarityLabel = "Positive";
  } else if (data.polarity >= 0.05) {
    polarityLabel = "Mildly Positive";
  }

  const rows = [
    ["LinguaX Sentiment & Tone Analysis Report"],
    ["Generated on: " + new Date().toLocaleString()],
    ["Overall Polarity Score", data.polarity.toFixed(2)],
    ["Sentiment Classification", polarityLabel],
    ["Threat Detected", data.threatDetected ? "YES" : "No"],
    [""],
    ["TONE CATEGORY WEIGHTS"],
    ["Optimism, Joy & Appreciation", data.emoPercentages.optimism + "%"],
    ["Critical, Tension & Anxiety", data.emoPercentages.frustration + "%"],
    ["Objective & Factual Description", data.emoPercentages.academic + "%"],
    ["Certainty, Strength & Confidence", data.emoPercentages.certainty + "%"],
    [""],
    ["SENTENCE-LEVEL POLARITY BREAKDOWN"],
    ["Sentence Text", "Polarity Score"]
  ];
  
  data.sentenceDetails.forEach(s => {
    rows.push([s.sentence, s.score.toFixed(2)]);
  });
  
  exportCSV(rows, 'sentiment_report', 'sentiment');
}

function renderSentimentResults() {
  const data = CURRENT_SENTIMENT_DATA;
  if (!data) return;
  
  const polarity = data.polarity;
  let polarityLabel = "Neutral / Objective";
  let polarityColor = "var(--ink-soft)";
  let polarityBg = "var(--stroke-2)";
  
  if (data.threatDetected || polarity <= -0.55) {
    polarityLabel = data.threatDetected ? "Severe Negative / Threat Flagged" : "Severe Negative";
    polarityColor = "#f43f5e";
    polarityBg = "rgba(244, 63, 94, 0.16)";
  } else if (polarity <= -0.15) {
    polarityLabel = "Negative";
    polarityColor = "#fb7185";
    polarityBg = "rgba(251, 113, 133, 0.12)";
  } else if (polarity <= -0.05) {
    polarityLabel = "Mildly Negative";
    polarityColor = "#f97316";
    polarityBg = "rgba(249, 115, 22, 0.1)";
  } else if (polarity >= 0.55) {
    polarityLabel = "Highly Positive";
    polarityColor = "#10b981";
    polarityBg = "rgba(16, 185, 129, 0.16)";
  } else if (polarity >= 0.15) {
    polarityLabel = "Positive";
    polarityColor = "#34d399";
    polarityBg = "rgba(52, 211, 153, 0.12)";
  } else if (polarity >= 0.05) {
    polarityLabel = "Mildly Positive";
    polarityColor = "#38bdf8";
    polarityBg = "rgba(56, 189, 248, 0.1)";
  }
  
  const scalePercent = Math.round((Math.max(-1, Math.min(1, polarity)) + 1) * 50);
  
  const w = 400, h = 100;
  const points = data.timeline.map((val, idx) => {
    const x = (idx / 4) * (w - 40) + 20;
    const y = h/2 - val * (h/2 - 15);
    return { x, y, val };
  });
  const pathData = points.map((p, i) => `${i===0?'M':'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  
  const pWords = [...new Set(data.matchedPos.map(x=>x.word))].slice(0, 15);
  const nWords = [...new Set(data.matchedNeg.map(x=>x.word))].slice(0, 15);
  
  const posTermsHtml = pWords.length 
    ? pWords.map(w => `<span style="font-size: 11px; background: rgba(16, 185, 129, 0.12); color: #10b981; padding: 3px 8px; border-radius: 6px; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.2);">${esc(w)}</span>`).join(' ')
    : '<span style="font-size:12px; color:var(--ink-soft);">None detected</span>';
    
  const negTermsHtml = nWords.length 
    ? nWords.map(w => `<span style="font-size: 11px; background: rgba(244, 63, 94, 0.12); color: #f43f5e; padding: 3px 8px; border-radius: 6px; font-weight: 600; border: 1px solid rgba(244, 63, 94, 0.2);">${esc(w)}</span>`).join(' ')
    : '<span style="font-size:12px; color:var(--ink-soft);">None detected</span>';

  let sentencesHtml = '';
  const filteredSentences = data.sentenceDetails.filter(s => {
    if (CURRENT_SENTIMENT_FILTER === 'pos') return s.score > 0.05;
    if (CURRENT_SENTIMENT_FILTER === 'neg') return s.score < -0.05;
    return true;
  });
  
  if (filteredSentences.length === 0) {
    sentencesHtml = `<div class="empty" style="padding: 14px;">No sentences match this filter.</div>`;
  } else {
    sentencesHtml = filteredSentences.map(s => {
      let bCol = 'var(--stroke-2)';
      let bg = 'transparent';
      if (s.score >= 0.05) {
        bCol = '#10b981';
        bg = 'rgba(16, 185, 129, 0.03)';
      } else if (s.score <= -0.05) {
        bCol = '#f43f5e';
        bg = 'rgba(244, 63, 94, 0.03)';
      }
      return `<div style="padding: 10px 14px; border-left: 3px solid ${bCol}; background: ${bg}; border-bottom: 1px solid var(--stroke-2); font-size: 13px; line-height: 1.5; color: var(--ink);">
        ${esc(s.sentence)}
        <div style="font-size: 10px; color: var(--ink-soft); margin-top: 4px; font-family: 'JetBrains Mono';">Score: ${s.score.toFixed(2)} ${s.threat ? `· <span style="color:#f43f5e; font-weight:bold; display:inline-flex; align-items:center; gap:3px;"><span style="display:inline-flex; width:12px; height:12px;">${I.alert}</span> Threat Flagged</span>` : ''}</div>
      </div>`;
    }).join('');
  }

  $('#sentimentOut').innerHTML = `
    ${data.threatDetected ? `
      <div style="background: rgba(244, 63, 94, 0.12); border: 1.5px solid #f43f5e; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
        <span style="width: 24px; height: 24px; display:inline-flex; align-items:center; justify-content:center; color:#f43f5e;">${I.alert}</span>
        <div>
          <div style="font-weight: 800; font-size: 13.5px; color: #f43f5e; font-family: 'Sora', sans-serif;">High Severity Negative / Violence or Threat Detected</div>
          <div style="font-size: 12px; color: var(--ink); margin-top: 2px;">
            Target words detected: ${data.matchedThreats.map(t=>`<span style="background:rgba(244,63,94,0.2); color:#f43f5e; padding:1px 6px; border-radius:4px; font-family:'JetBrains Mono'; font-weight:700;">${esc(t)}</span>`).join(' ')}. Valence accurately classified into extreme negative spectrum.
          </div>
        </div>
      </div>
    ` : ''}

    <div style="background: var(--bg-card); border: 1px solid var(--stroke); border-radius: 16px; padding: 18px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <h4 style="margin:0; font-family:'Sora'; font-size:14px; color:var(--ink-soft); text-transform:uppercase; letter-spacing:0.04em;">Sentiment Polarity Score</h4>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="btn ghost small" style="padding: 4px 10px; font-size: 11px; border-radius: 6px; border: 1px solid var(--stroke-2); display: inline-flex; align-items: center; gap: 4px;" onclick="exportSentimentReport()"><span style="width:12px; height:12px; display:inline-flex; align-items:center;">${I.dl}</span> Export Report</button>
          <div style="background: ${polarityBg}; color: ${polarityColor}; padding: 4px 10px; border-radius: 8px; font-weight: 800; font-size: 13px; border: 1px solid ${polarityColor}33;">
            ${polarityLabel} (${polarity.toFixed(2)})
          </div>
        </div>
      </div>
      
      <div style="position: relative; width: 100%; height: 26px; margin: 10px 0;">
        <div style="position: absolute; top: 11px; left: 0; right: 0; height: 5px; border-radius: 4px; background: linear-gradient(90deg, #f43f5e 0%, #fb7185 25%, #94a3b8 50%, #34d399 75%, #10b981 100%);"></div>
        <div style="position: absolute; top: 0; left: calc(${scalePercent}% - 6px); width: 12px; height: 26px; border-radius: 6px; background: var(--ink); border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: left 0.3s cubic-bezier(0.1, 0.8, 0.3, 1);"></div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 10px; font-family: 'JetBrains Mono'; color: var(--ink-soft); margin-top: -6px;">
        <span>Negative (-1.0)</span>
        <span>Neutral (0.0)</span>
        <span>Positive (+1.0)</span>
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px;">
      <div style="background: var(--bg-card); border: 1px solid var(--stroke); border-radius: 16px; padding: 18px;">
        <h4 style="margin: 0 0 10px 0; font-family: 'Sora'; font-size: 12.5px; text-transform: uppercase; color: var(--ink-soft); letter-spacing: 0.04em;">Emotive Narrative Arc (Timeline)</h4>
        <div style="width: 100%; display: flex; justify-content: center; background: var(--row); border-radius: 12px; padding: 10px 0; border: 1px solid var(--stroke-2);">
          <svg viewBox="0 0 ${w} ${h}" style="width: 100%; max-width: 440px; height: 110px; overflow: visible;">
            <line x1="10" y1="${h/2}" x2="${w-10}" y2="${h/2}" stroke="var(--stroke-2)" stroke-width="1" stroke-dasharray="4,4" />
            <path d="${pathData}" fill="none" stroke="var(--a1)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            ${points.map((p, i) => `
              <circle cx="${p.x}" cy="${p.y}" r="5" fill="${p.val > 0.05 ? '#10b981' : p.val < -0.05 ? '#f43f5e' : 'var(--ink-soft)'}" stroke="var(--bg-card)" stroke-width="1.5" />
              <text x="${p.x}" y="${p.y - 10}" font-size="9" fill="var(--ink)" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">${p.val > 0 ? '+' : ''}${p.val.toFixed(2)}</text>
            `).join('')}
            <text x="20" y="${h - 4}" font-size="9" fill="var(--ink-soft)" font-family="sans-serif">Start</text>
            <text x="${w/2}" y="${h - 4}" font-size="9" fill="var(--ink-soft)" font-family="sans-serif" text-anchor="middle">Middle</text>
            <text x="${w-20}" y="${h - 4}" font-size="9" fill="var(--ink-soft)" font-family="sans-serif" text-anchor="end">End</text>
            <text x="${w-10}" y="12" font-size="9" fill="var(--a1)" font-family="Sora, sans-serif" font-weight="bold" text-anchor="end" opacity="0.65">LinguaX Arc</text>
          </svg>
        </div>
      </div>
      
      <div style="background: var(--bg-card); border: 1px solid var(--stroke); border-radius: 16px; padding: 18px;">
        <h4 style="margin: 0 0 12px 0; font-family: 'Sora'; font-size: 12.5px; text-transform: uppercase; color: var(--ink-soft); letter-spacing: 0.04em;">Linguistic Tone Category Weights</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; margin-bottom: 4px;">
              <span>Optimism, Joy &amp; Appreciation</span>
              <span>${data.emoPercentages.optimism}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--stroke-2); border-radius: 3px; overflow: hidden;">
              <div style="width: ${data.emoPercentages.optimism}%; height: 100%; background: #10b981; border-radius: 3px;"></div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; margin-bottom: 4px;">
              <span>Empirical, Logical &amp; Scientific</span>
              <span>${data.emoPercentages.academic}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--stroke-2); border-radius: 3px; overflow: hidden;">
              <div style="width: ${data.emoPercentages.academic}%; height: 100%; background: #6366f1; border-radius: 3px;"></div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; margin-bottom: 4px;">
              <span>Critical, Concern &amp; Hostility</span>
              <span>${data.emoPercentages.frustration}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--stroke-2); border-radius: 3px; overflow: hidden;">
              <div style="width: ${data.emoPercentages.frustration}%; height: 100%; background: #f43f5e; border-radius: 3px;"></div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; margin-bottom: 4px;">
              <span>Certainty, Strength &amp; Confidence</span>
              <span>${data.emoPercentages.certainty}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--stroke-2); border-radius: 3px; overflow: hidden;">
              <div style="width: ${data.emoPercentages.certainty}%; height: 100%; background: #fbbf24; border-radius: 3px;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div style="background: var(--bg-card); border: 1px solid var(--stroke); border-radius: 16px; padding: 18px; margin-bottom: 16px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
      <div>
        <h5 style="margin: 0 0 8px 0; font-family: 'Sora'; font-size: 12px; color: #10b981; font-weight: 700;">Positive Terms Loaded</h5>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${posTermsHtml}
        </div>
      </div>
      <div>
        <h5 style="margin: 0 0 8px 0; font-family: 'Sora'; font-size: 12px; color: #f43f5e; font-weight: 700;">Negative Terms Loaded</h5>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${negTermsHtml}
        </div>
      </div>
    </div>
    
    <div style="background: var(--bg-card); border: 1px solid var(--stroke); border-radius: 16px; padding: 18px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <h4 style="margin: 0; font-family: 'Sora'; font-size: 12.5px; text-transform: uppercase; color: var(--ink-soft); letter-spacing: 0.04em;">Sentence Sentiment Arc</h4>
        <div style="display: flex; gap: 4px; background: var(--stroke-2); padding: 3px; border-radius: 8px;">
          <button class="btn ghost small ${CURRENT_SENTIMENT_FILTER==='all'?'active':''}" style="padding: 4px 8px; font-size:11px; height:24px; border-radius:6px;" onclick="setSentimentFilter('all')">All</button>
          <button class="btn ghost small ${CURRENT_SENTIMENT_FILTER==='pos'?'active':''}" style="padding: 4px 8px; font-size:11px; height:24px; border-radius:6px; color: #10b981;" onclick="setSentimentFilter('pos')">Pos</button>
          <button class="btn ghost small ${CURRENT_SENTIMENT_FILTER==='neg'?'active':''}" style="padding: 4px 8px; font-size:11px; height:24px; border-radius:6px; color: #f43f5e;" onclick="setSentimentFilter('neg')">Neg</button>
        </div>
      </div>
      
      <div style="border: 1px solid var(--stroke-2); border-radius: 12px; max-height: 280px; overflow-y: auto; background: var(--row);">
        ${sentencesHtml}
      </div>
    </div>
  `;
}

function setSentimentFilter(filter) {
  CURRENT_SENTIMENT_FILTER = filter;
  if (S.sentiment) S.sentiment.filter = filter;
  renderSentimentResults();
}

function analyzeSentimentAdvanced(text) {
  if (!text || !text.trim()) return null;
  
  // Threat and acute violence detection terms
  const THREAT_TERMS = new Set([
    "kill", "killed", "killing", "kills", "killer", "murder", "murdered", "murdering", "murders",
    "suicide", "slaughter", "shoot", "shooting", "shot", "stab", "stabbed", "stabbing", "strangle", "strangled",
    "bomb", "bombing", "bombed", "assault", "assaulted", "torture", "tortured", "destroy", "destroyed",
    "destroying", "execute", "execution", "poison", "choke", "choked", "decapitate", "annihilate", "massacre",
    "slay", "slaying", "die", "death", "bleed", "bleeding", "wound", "injure", "injured", "corpse"
  ]);

  // Enhanced valence lexicon (-4.0 to +4.0)
  const SENTIMENT_LEXICON = {
    // Extreme Negative / Hostile (-3.0 to -4.0)
    "catastrophic": -3.8, "devastating": -3.7, "suicide": -3.8, "murder": -3.7, "slaughter": -3.6,
    "kill": -3.5, "killed": -3.4, "killing": -3.5, "killer": -3.5, "torture": -3.6, "tortured": -3.5,
    "disaster": -3.4, "disastrous": -3.4, "atrocious": -3.3, "abysmal": -3.3, "evil": -3.3, "dreadful": -3.2,
    "appalling": -3.2, "toxic": -3.1, "vile": -3.1, "cruel": -3.1, "cruelty": -3.2, "horrendous": -3.3,
    "destructive": -3.0, "fatal": -3.3, "deadly": -3.2, "terror": -3.2, "terrorist": -3.5, "nightmare": -3.0,
    "massacre": -3.6, "annihilate": -3.5, "execute": -3.1, "execution": -3.2, "stab": -3.2, "stabbed": -3.2,
    "shoot": -3.0, "shot": -2.9, "poison": -3.1, "poisoned": -3.1, "choke": -3.0,

    // Strongly Negative (-2.2 to -2.9)
    "worst": -2.9, "terrible": -2.8, "horrible": -2.7, "awful": -2.6, "hate": -2.8, "hated": -2.7,
    "hateful": -2.8, "hostile": -2.7, "hostility": -2.8, "furious": -2.8, "rage": -2.7, "infuriating": -2.7,
    "crash": -2.6, "crashed": -2.6, "broken": -2.4, "fail": -2.4, "failed": -2.5, "failure": -2.6,
    "useless": -2.6, "worthless": -2.8, "pathetic": -2.7, "garbage": -2.7, "rubbish": -2.6, "sucks": -2.6,
    "suck": -2.5, "sucked": -2.5, "disgusting": -2.9, "disgust": -2.7, "disgusted": -2.6, "loathe": -2.9,
    "despise": -2.8, "fraud": -2.8, "scam": -2.7, "corrupt": -2.8, "corruption": -2.9, "betray": -2.8,
    "betrayal": -2.9, "abuse": -2.9, "abusive": -2.8, "threat": -2.8, "threaten": -2.8, "threatening": -2.9,
    "violence": -3.0, "violent": -2.9, "depressed": -2.7, "depression": -2.8, "miserable": -2.8, "misery": -2.8,
    "grief": -2.7, "despair": -2.8, "hopeless": -2.7, "shame": -2.3, "guilt": -2.2, "guilty": -2.3,
    "stupid": -2.5, "idiot": -2.7, "dumb": -2.4, "foolish": -2.2, "offensive": -2.4, "outrageous": -2.7,
    "unbearable": -2.7, "disappointing": -2.4, "disappointed": -2.3, "disappointment": -2.3, "ruin": -2.6,
    "ruined": -2.6, "ruining": -2.5, "pain": -2.2, "painful": -2.3, "hurt": -2.3, "hurting": -2.3,
    "harm": -2.3, "harmful": -2.4, "danger": -2.3, "dangerous": -2.4, "panic": -2.5, "frightening": -2.4,
    "die": -2.6, "death": -2.7, "dead": -2.4, "bleed": -2.3, "bleeding": -2.4, "wound": -2.3, "injured": -2.3,
    "shitty": -2.7, "damn": -1.8, "hell": -2.0, "fuck": -2.9, "fucking": -2.8, "bitch": -2.8, "bastard": -2.8,

    // Moderately Negative (-1.2 to -2.1)
    "bad": -2.2, "worse": -2.4, "sad": -2.0, "angry": -2.3, "anger": -2.2, "annoying": -1.9, "annoyed": -1.8,
    "annoy": -1.8, "irritating": -1.9, "irritated": -1.8, "frustrated": -2.2, "frustrating": -2.3,
    "frustration": -2.2, "mistake": -2.0, "error": -2.1, "fault": -1.8, "blame": -1.9, "problem": -1.8,
    "problems": -1.8, "problematic": -2.0, "defect": -2.0, "defective": -2.0, "flaw": -1.8, "flawed": -1.9,
    "flaws": -1.8, "poor": -1.9, "weak": -1.7, "unreliable": -2.2, "inefficient": -1.8, "mess": -1.9,
    "messy": -1.8, "dirty": -1.7, "ugly": -2.1, "sick": -1.8, "ill": -1.7, "boring": -1.6, "bored": -1.5,
    "tired": -1.4, "exhausted": -1.8, "stress": -1.9, "stressed": -2.0, "stressful": -2.1, "anxious": -2.0,
    "anxiety": -2.1, "worry": -1.8, "worried": -1.8, "scared": -2.0, "fear": -2.1, "fearful": -2.2,
    "dread": -2.2, "lonely": -2.1, "unhappy": -2.0, "gloom": -1.8, "gloomy": -1.8, "regret": -1.9,
    "cry": -1.9, "crying": -2.0, "tears": -1.7, "lying": -2.2, "liar": -2.5, "lie": -2.0, "lies": -2.0,
    "fake": -2.1, "cheat": -2.4, "cheated": -2.4, "steal": -2.3, "stole": -2.3, "thief": -2.3,

    // Mildly Negative (-0.6 to -1.1)
    "hard": -0.9, "difficult": -1.2, "difficulty": -1.2, "slow": -1.2, "sluggish": -1.3, "lag": -1.3,
    "laggy": -1.4, "complicate": -1.0, "complicated": -1.1, "redundant": -1.0, "confused": -1.1,
    "confusing": -1.2, "stuck": -1.2, "issue": -1.2, "issues": -1.2, "warn": -0.9, "warning": -1.0,
    "concern": -0.9, "concerned": -1.0, "expensive": -1.2, "costly": -1.2, "waste": -1.6, "wasted": -1.6,
    "awkward": -1.1, "clunky": -1.3, "tedious": -1.4, "harsh": -1.4, "strict": -0.8, "odd": -0.7,

    // Highly Positive (+2.8 to +3.5)
    "excellent": 3.2, "outstanding": 3.3, "brilliant": 3.2, "wonderful": 3.1, "perfect": 3.4,
    "superb": 3.2, "amazing": 3.1, "love": 3.2, "loved": 3.0, "genius": 2.9, "breathtaking": 3.3,
    "magnificent": 3.2, "triumph": 2.9, "exceptional": 2.9, "stellar": 3.0, "fantastic": 3.0,
    "glorious": 2.9, "flawless": 3.2, "incredible": 3.2, "incredibly": 2.8, "phenomenal": 3.2,
    "masterpiece": 3.3, "adore": 3.0, "adored": 2.9, "delightful": 2.9, "delight": 2.8,

    // Moderately Positive (+1.7 to +2.7)
    "great": 2.5, "beautiful": 2.4, "happy": 2.3, "joy": 2.4, "joyful": 2.5, "secure": 2.2, "security": 2.1,
    "premium": 2.2, "advanced": 2.0, "elegant": 2.2, "efficient": 2.1, "efficiency": 2.1, "optimal": 2.3,
    "clean": 1.9, "professional": 1.9, "robust": 2.1, "precise": 2.2, "precision": 2.2, "accuracy": 2.1,
    "accurate": 2.0, "succeed": 2.3, "success": 2.4, "successful": 2.3, "correct": 1.9, "truth": 2.0,
    "valid": 1.9, "valuable": 2.2, "friendly": 2.1, "positive": 2.1, "benefit": 1.9, "beneficial": 2.0,
    "inspire": 2.2, "inspiring": 2.3, "support": 1.8, "supportive": 2.0, "trust": 2.2, "trusted": 2.2,
    "reliable": 2.1, "reliability": 2.1, "enjoy": 2.1, "enjoyed": 2.0, "pleased": 2.0, "satisfy": 2.0,
    "satisfied": 2.0, "smart": 1.9, "clever": 1.9, "impressive": 2.4, "creative": 2.0, "praise": 2.3,
    "appreciate": 2.0, "appreciated": 2.0, "glad": 1.9, "celebrate": 2.3, "profound": 1.7, "prestige": 2.0,
    "thrive": 2.0, "thriving": 2.1, "cheerful": 2.2, "sweet": 1.8, "congratulations": 2.4, "optimistic": 2.0,

    // Mildly Positive (+0.8 to +1.6)
    "good": 1.7, "best": 2.2, "nice": 1.6, "fine": 1.2, "helpful": 1.5, "ok": 0.9, "okay": 0.9,
    "cool": 1.4, "safe": 1.7, "private": 1.6, "steady": 1.2, "improve": 1.6, "improved": 1.5,
    "hope": 1.4, "hopeful": 1.5, "agree": 1.3, "agreed": 1.2, "asset": 1.4, "fair": 1.1, "solid": 1.4,
    "lucid": 1.3, "clear": 1.3, "pleasing": 1.5, "worthy": 1.4, "worth": 1.3, "convenient": 1.4
  };

  const EMOTICON_LEXICON = {
    ":)": 1.7, ":-)": 1.7, ";)": 1.5, ";-)": 1.5, "(:": 1.7, ":d": 2.0, ":D": 2.0, "o:)": 1.6,
    ":(": -1.8, ":-(": -1.8, "):": -1.8, ";(": -2.0, ";-(": -2.0, "D:": -2.1, ":o": -0.8,
    "😊": 2.0, "😄": 2.1, "😃": 2.0, "😀": 1.8, "🙂": 1.2, "😉": 1.4, "😍": 2.8, "🥰": 2.8,
    "😘": 2.4, "🥳": 2.5, "🤩": 2.5, "😎": 1.9, "❤️": 2.6, "💖": 2.5, "👍": 2.0, "👏": 1.9,
    "🔥": 2.2, "🎉": 2.4, "🌟": 2.2, "✨": 2.0, "✅": 1.7, "💪": 1.8,
    "😢": -2.2, "😭": -2.5, "😞": -1.9, "😔": -1.7, "😟": -1.6, "😠": -2.4, "😡": -2.8,
    "🤬": -3.2, "😰": -2.0, "😨": -2.1, "😱": -2.2, "🤢": -2.3, "🤮": -2.7, "👿": -2.3,
    "💀": -2.0, "👎": -2.1, "💩": -2.4, "❌": -1.7, "⚠️": -1.1, "🚨": -1.6, "💔": -2.5
  };

  const NEGATIONS = new Set([
    "not", "no", "never", "neither", "nor", "cannot", "cant", "can't", "dont", "don't",
    "doesnt", "doesn't", "didnt", "didn't", "wont", "won't", "wouldnt", "wouldn't",
    "couldnt", "couldn't", "shant", "shan't", "shouldnt", "shouldn't", "isnt", "isn't",
    "arent", "aren't", "wasnt", "wasn't", "werent", "weren't", "havent", "haven't",
    "hasnt", "hasn't", "hadnt", "hadn't", "aint", "ain't", "lack", "lacks", "lacking",
    "without", "rarely", "seldom", "scarcely", "barely"
  ]);

  const BOOSTERS = {
    "very": 0.35, "highly": 0.40, "extremely": 0.55, "incredibly": 0.50, "super": 0.38, "so": 0.30, 
    "absolutely": 0.50, "totally": 0.45, "deeply": 0.40, "particularly": 0.30, "strongly": 0.38, 
    "much": 0.25, "more": 0.25, "really": 0.35, "decidedly": 0.35, "enormously": 0.50, "fully": 0.30, 
    "tremendously": 0.50, "unbelievably": 0.55, "quite": 0.20, "insanely": 0.50, "severely": 0.50
  };

  const DIMINISHERS = {
    "slightly": -0.25, "somewhat": -0.18, "mildly": -0.18, "barely": -0.25, "hardly": -0.28, 
    "partially": -0.18, "little": -0.20, "less": -0.20, "bit": -0.18, "marginally": -0.18
  };

  // Helper to generate word stems and morphological variants
  function getVariants(w) {
    const list = [w];
    if (w.endsWith('ing') && w.length > 5) {
      list.push(w.slice(0, -3));
      list.push(w.slice(0, -3) + 'e');
    }
    if (w.endsWith('ed') && w.length > 4) {
      list.push(w.slice(0, -2));
      list.push(w.slice(0, -1));
    }
    if (w.endsWith('es') && w.length > 4) {
      list.push(w.slice(0, -2));
    }
    if (w.endsWith('s') && w.length > 3 && !w.endsWith('ss')) {
      list.push(w.slice(0, -1));
    }
    if (w.endsWith('ly') && w.length > 4) {
      list.push(w.slice(0, -2));
    }
    return list;
  }

  // Split into sentences
  const sentenceRegex = /[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g;
  let rawSentences = text.match(sentenceRegex) || [];
  rawSentences = rawSentences.map(s => s.trim()).filter(s => s.length > 1);
  if (!rawSentences.length) rawSentences = [text.trim()];

  let totalRawScore = 0;
  let wordCount = 0;
  let matchedPos = [];
  let matchedNeg = [];
  let matchedThreats = [];
  let threatDetected = false;
  const sentenceDetails = [];

  rawSentences.forEach((sentence, sIdx) => {
    const exclamations = (sentence.match(/!/g) || []).length;
    const questions = (sentence.match(/\?/g) || []).length;
    const isEntireSentenceCaps = sentence === sentence.toUpperCase() && /[A-Z]/.test(sentence);
    const rawWords = sentence.split(/\s+/).filter(Boolean);

    let contrastIndex = -1;
    for (let i = 0; i < rawWords.length; i++) {
      const wClean = rawWords[i].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
      if (wClean === "but" || wClean === "however" || wClean === "yet" || wClean === "although") {
        contrastIndex = i;
        break;
      }
    }

    let sentenceValenceSum = 0;
    let sentenceHasThreat = false;

    rawWords.forEach((rawWord, i) => {
      wordCount++;
      const wClean = rawWord.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
      if (!wClean && !rawWord) return;

      let valence = 0;
      let matchedKey = wClean;

      // 1. Direct emoticon lookup
      if (EMOTICON_LEXICON[rawWord]) {
        valence = EMOTICON_LEXICON[rawWord];
        matchedKey = rawWord;
      } else if (EMOTICON_LEXICON[wClean]) {
        valence = EMOTICON_LEXICON[wClean];
        matchedKey = wClean;
      } else {
        // 2. Lexicon lookup with stem variants
        const variants = getVariants(wClean);
        for (const variant of variants) {
          if (SENTIMENT_LEXICON[variant] !== undefined) {
            valence = SENTIMENT_LEXICON[variant];
            matchedKey = variant;
            break;
          }
        }
      }

      // 3. Threat checks
      const varList = getVariants(wClean);
      for (const v of varList) {
        if (THREAT_TERMS.has(v)) {
          sentenceHasThreat = true;
          threatDetected = true;
          if (!matchedThreats.includes(v)) matchedThreats.push(v);
          if (valence === 0) valence = -3.2; // Guarantee strong negative if not already in lexicon
        }
      }

      if (valence !== 0) {
        // Capitalization intensity boost
        if (!isEntireSentenceCaps && rawWord === rawWord.toUpperCase() && /[A-Z]/.test(rawWord)) {
          if (valence > 0) valence += 0.8;
          else valence -= 0.8;
        }

        // Look back up to 3 tokens for negations, boosters, and diminishers
        let modifierMultiplier = 1.0;
        let isNegated = false;

        for (let distance = 1; distance <= 3; distance++) {
          if (i - distance >= 0) {
            const prevWord = rawWords[i - distance].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
            if (NEGATIONS.has(prevWord)) {
              isNegated = true;
            }
            if (BOOSTERS[prevWord]) {
              modifierMultiplier += BOOSTERS[prevWord];
            } else if (DIMINISHERS[prevWord]) {
              modifierMultiplier += DIMINISHERS[prevWord];
            }
          }
        }

        let wordScore = valence * modifierMultiplier;

        // Negation reversal (inverts polarity and applies 0.8 scale)
        if (isNegated) {
          wordScore = wordScore * -0.80;
        }

        // Contrastive conjunction weighting
        if (contrastIndex !== -1) {
          if (i < contrastIndex) wordScore *= 0.5;
          else if (i > contrastIndex) wordScore *= 1.5;
        }

        sentenceValenceSum += wordScore;

        if (wordScore > 0) {
          matchedPos.push({ word: matchedKey || wClean, score: wordScore });
        } else if (wordScore < 0) {
          matchedNeg.push({ word: matchedKey || wClean, score: wordScore });
        }
      }
    });

    // Punctuation amplification
    if (sentenceValenceSum > 0) {
      sentenceValenceSum += exclamations * 0.35;
      if (questions > 1) sentenceValenceSum += 0.2;
    } else if (sentenceValenceSum < 0) {
      sentenceValenceSum -= exclamations * 0.45;
      if (questions > 1) sentenceValenceSum -= 0.25;
    }

    // Dynamic high-sensitivity normalization constant:
    // Uses adaptive alpha (2.5 to 6.5) so that short negative statements like "Police will kill the dangerous murderer." or "It is bad."
    // produce an accurate, strong negative score rather than being suppressed to neutral.
    const alpha = Math.max(2.5, Math.min(6.5, rawWords.length * 0.7));
    let sentenceNormalized = sentenceValenceSum / Math.sqrt(sentenceValenceSum * sentenceValenceSum + alpha);

    if (sentenceHasThreat) {
      // Acute threat clamped strictly to severe negative range
      sentenceNormalized = Math.min(-0.82, sentenceNormalized || -0.82);
    }

    const finalSentenceScore = isNaN(sentenceNormalized) ? 0 : Math.max(-1.0, Math.min(1.0, sentenceNormalized));
    totalRawScore += sentenceValenceSum;
    sentenceDetails.push({ sentence, score: finalSentenceScore, index: sIdx, threat: sentenceHasThreat });
  });

  // Overall text polarity calculation
  let polarity = 0;
  if (sentenceDetails.length > 0) {
    // Weighted combination of average sentence scores and normalized total sum
    const avgSentenceScore = sentenceDetails.reduce((a, b) => a + b.score, 0) / sentenceDetails.length;
    const globalAlpha = Math.max(3.0, Math.min(9.0, wordCount * 0.5));
    const totalNormalized = totalRawScore / Math.sqrt(totalRawScore * totalRawScore + globalAlpha);
    
    polarity = (avgSentenceScore * 0.65) + (totalNormalized * 0.35);
    
    // If threat detected, clamp polarity to negative floor
    if (threatDetected && polarity > -0.65) {
      polarity = -0.78;
    }
    polarity = isNaN(polarity) ? 0 : Math.max(-1.0, Math.min(1.0, polarity));
  }

  // Emotional tone categories breakdown
  const emotions = {
    optimism: 0,
    academic: 0,
    frustration: 0,
    certainty: 0
  };

  const OPT_LIST = new Set([
    "excellent", "brilliant", "great", "amazing", "beautiful", "wonderful", "perfect", "superb",
    "helpful", "happy", "joy", "love", "good", "best", "nice", "enjoy", "pleased", "satisfy",
    "satisfied", "inspiring", "inspire", "genius", "glad", "delight", "delightful", "cheerful",
    "sweet", "positive", "celebrate", "congratulations", "fantastic", "stellar", "outstanding",
    "optimistic", "hope", "hopeful", "lucky", "thrive", "thriving", "adore", "flawless", "incredible"
  ]);

  const ACA_LIST = new Set([
    "scholar", "lecturer", "innovation", "science", "robust", "precise", "accuracy", "accurate",
    "academic", "research", "study", "logical", "analysis", "empirical", "method", "results",
    "statistics", "linguistic", "corpus", "nlp", "computational", "evidence", "theory", "investigate",
    "investigation", "experiment", "experimental", "data", "hypothesis", "proof", "prove", "structure",
    "system", "systematic", "literature", "citation", "verify", "verification", "validate", "validation", "methodology"
  ]);

  const FRU_LIST = new Set([
    "bad", "worst", "terrible", "horrible", "awful", "lag", "slow", "laggy", "crash", "broken",
    "fail", "failed", "failure", "mistake", "error", "annoying", "annoyed", "frustrated", "frustrating",
    "disappointing", "disappointed", "severe", "poor", "stupid", "garbage", "rubbish", "useless",
    "hate", "hated", "angry", "rage", "anger", "sad", "sorrow", "regret", "worry", "worried",
    "anxious", "anxiety", "complain", "complaint", "pain", "hurt", "harm", "toxic", "kill", "killing",
    "killed", "murder", "threat", "violence", "violent", "destroy", "ruin", "bleed", "wound", "abuse",
    "depressed", "depression", "hopeless", "despair", "misery", "miserable", "grief", "gloomy", "lonely"
  ]);

  const CER_LIST = new Set([
    "perfect", "absolutely", "totally", "strongly", "succeed", "success", "successful", "correct",
    "truth", "valid", "valuable", "trust", "reliable", "reliability", "definite", "definitely",
    "proven", "surely", "certain", "certainty", "verify", "verified", "absolute", "dynamic", "core",
    "complete", "completely", "force", "confidence", "confident", "confirm", "confirmed", "secure",
    "guaranteed", "ensure", "assure", "clear", "clearly"
  ]);

  text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).forEach(w => {
    if (OPT_LIST.has(w)) emotions.optimism += 2.0;
    if (ACA_LIST.has(w)) emotions.academic += 2.0;
    if (FRU_LIST.has(w)) emotions.frustration += 2.0;
    if (CER_LIST.has(w)) emotions.certainty += 2.0;
  });

  if (threatDetected) emotions.frustration += 5.0;

  const emoSum = emotions.optimism + emotions.academic + emotions.frustration + emotions.certainty || 1;
  const emoPercentages = {
    optimism: Math.round((emotions.optimism / emoSum) * 100),
    academic: Math.round((emotions.academic / emoSum) * 100),
    frustration: Math.round((emotions.frustration / emoSum) * 100),
    certainty: Math.round((emotions.certainty / emoSum) * 100)
  };

  // Timeline buckets (5 chronological checkpoints)
  const bucketSize = Math.ceil(sentenceDetails.length / 5) || 1;
  const timeline = [];
  for (let i = 0; i < 5; i++) {
    const bucket = sentenceDetails.slice(i * bucketSize, (i + 1) * bucketSize);
    if (bucket.length === 0) {
      timeline.push(0);
    } else {
      const avg = bucket.reduce((acc, curr) => acc + curr.score, 0) / bucket.length;
      timeline.push(Math.max(-1, Math.min(1, avg || 0)));
    }
  }

  return {
    polarity,
    threatDetected,
    matchedThreats,
    sentenceDetails,
    matchedPos,
    matchedNeg,
    emoPercentages,
    timeline,
    wordCount
  };
}

window.onerror = function(msg, url, line, col, error) {
  const errText = "Error: " + msg + " at " + line + ":" + col;
  console.error(errText, error);
  const label = document.getElementById('splashProgressLabel');
  if (label) label.textContent = errText;
  const text = document.getElementById('splashProgressText');
  if (text) text.textContent = "Error";
  const bar = document.getElementById('splashProgressBar');
  if (bar) {
    bar.style.width = "100%";
    bar.style.background = "var(--danger)";
  }
  return false;
};

window.onunhandledrejection = function(event) {
  const errText = "Promise Error: " + event.reason;
  console.error(errText);
  const label = document.getElementById('splashProgressLabel');
  if (label) label.textContent = errText;
  const text = document.getElementById('splashProgressText');
  if (text) text.textContent = "Error";
  const bar = document.getElementById('splashProgressBar');
  if (bar) {
    bar.style.width = "100%";
    bar.style.background = "var(--danger)";
  }
};


/* Website showcase: built-in samples only. No files, storage, exports or network. */
saveSettings = saveSearchHistory = saveWorkspaceHistory = playFeedback = logWorkspaceTask = () => {};
persistFileToStorage = removeFileFromStorage = clearStorageFiles = async () => {};
loadPersistedFiles = async () => [];
checkPendingSharedFiles = () => {};
readPicked = async () => {};
addTexts = () => {};
window.open = () => null;
window.fetch = () => Promise.reject(new Error('Network is disabled in the sample showcase.'));
const PREVIEW_SCENES = new Set(['corpus','kwic','wordlist','cloud','plot']);
const PREVIEW_ALLOWED_PARENTS = new Set(['https://dailwind.com','https://dailwind.com','https://www.dailwind.com']);
let previewParentOrigin = '*';
function removeSampleActions(){
 document.querySelectorAll('[type="file"],input[data-file-blocked],.dropzone,.welcome-banner-card').forEach(el => el.remove());
 document.querySelectorAll('button,a').forEach(el => {
  const action=el.getAttribute('onclick')||'';
  if(/filePick|refPick|export|save[A-Z]|promptClear|promptDel|window\.open|download|openHelp|aboutModal/i.test(action))el.remove();
  else {el.tabIndex=-1;el.setAttribute('aria-hidden','true')}
 });
 document.querySelectorAll('input,textarea').forEach(el=>{el.readOnly=true;el.tabIndex=-1});
 document.querySelectorAll('a').forEach(el=>{el.removeAttribute('href');el.tabIndex=-1});
}
function applySampleScene(scene){
 if(!PREVIEW_SCENES.has(scene))return;
 go(scene);S.q.term='language';S.q.cs=false;S.q.rx=false;S.q.ctx=5;
 const q=document.getElementById('q');if(q)q.value='language';
 if(scene==='kwic')runKwic();
 if(scene==='wordlist')runWordList();
 if(scene==='cloud')runCloud().catch(()=>{});
 if(scene==='plot')runPlot();
 removeSampleActions();
 const dock=document.getElementById('dock');const active=document.querySelector('.dock-btn-'+scene);
 if(dock&&active)dock.scrollLeft=Math.max(0,active.offsetLeft-dock.clientWidth/2+active.clientWidth/2);
 window.scrollTo(0,0);
 setTimeout(()=>{
  removeSampleActions();
  const controls=document.querySelector('#view>.card .controls');
  if(scene!=='corpus'&&controls)controls.style.display='none';
  parent.postMessage({type:'linguax-scene',scene},previewParentOrigin);
 },80);
}
window.addEventListener('message',event=>{
 if(event.source!==parent||!PREVIEW_ALLOWED_PARENTS.has(event.origin))return;
 previewParentOrigin=event.origin;
 if(event.data?.type==='linguax-show-scene'&&PREVIEW_SCENES.has(event.data.scene))applySampleScene(event.data.scene);
});
['drop','dragover','paste','submit'].forEach(type=>document.addEventListener(type,event=>{event.preventDefault();event.stopImmediatePropagation()},true));
try{
 S.history=[];S.workspaceHistory=[];S.settings.recordHistory=false;S.settings.vibrationEnabled=false;S.settings.reduceMotion=true;
 S.files=SAMPLES.map(([name,text])=>{const toks=tokenize(text);return {name,text,toks,types:new Set(toks.map(t=>t.l)).size}});
 S.ref=[SAMPLE_REF].map(([name,text])=>{const toks=tokenize(text);return {name,text,toks,types:new Set(toks.map(t=>t.l)).size}});
 S.q.term='language';setTheme('dark');applyBgVisibility();
 document.getElementById('splashScreen')?.remove();
 document.body.inert=true;
 applySampleScene('corpus');
 parent.postMessage({type:'linguax-ready',sampleFiles:S.files.length,tokens:corpusTotals(S.files).tok},previewParentOrigin);
}catch(error){console.error('Showcase startup:',error);parent.postMessage({type:'linguax-error'},previewParentOrigin)}
