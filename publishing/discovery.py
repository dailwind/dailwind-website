"""Public page descriptions, structured data and crawlable canonical URLs."""
from pathlib import Path
from html import escape
from urllib.parse import urlsplit
import json,re,subprocess,xml.etree.ElementTree as ET
from datetime import date
from social import page_metadata

PAGES={
 'index.html':('Dailwind Studio | Corpus Tools, PDF Utilities & LinguaX Arc','Explore browser-based corpus analysis, text cleaning, English OCR, PDF utilities and LinguaX Arc, the offline Android corpus toolkit.'),
 'toolkits/index.html':('Dailwind Research Toolkits | Corpus, Text, PDF & Image Tools','Find the right tool for corpus analysis, text cleaning, English OCR, PDF conversion, file merging and metadata reports. Most tools run on your device.'),
 'apps/index.html':('Dailwind App Store | Android Apps by Dailwind Studio','Browse Android apps from Dailwind Studio, including Owl File Saver and LinguaX Arc, plus apps coming soon.'),
 'apps/owl-file-saver/index.html':('Owl File Saver for Android | Dailwind App Store','A private, offline file saver for Android. Save shared files in one tap, organise them and keep them on your device.'),
 'corpus-toolkit/index.html':('Corpus Analysis Online | Dailwind Corpus Toolkit','Explore KWIC concordance, word frequencies, collocations, keyness and charts with your own texts. Analyze corpora locally in your browser.'),
 'corpus-cleaner/index.html':('Corpus Cleaner for Books, Theses & OCR Text | Dailwind','Clean books, theses, articles and damaged OCR text. Remove chosen words or phrases, review an audit and download copies. Files stay on your device.'),
 'stylistic-toolkit/index.html':('Stylistic Analysis Tool | Dailwind Stylistic Toolkit','Explore parallelism and possible deviation across eight linguistic levels. Inspect textual evidence and record your own close-reading interpretation.'),
 'mat-cleaner/index.html':('MAT Tagger Cleaner | Corpus Preparation & Paid Access','Prepare and organize TXT corpora for MAT tagging. Browser-based preparation requires Dailwind approval and an active paid subscription; it does not run MAT.'),
 'file-converter/index.html':('PDF, Word & Text Converter | Dailwind File Converter','Extract selectable PDF and DOCX text in your browser. Save TXT, text-only Word or text-only PDF copies, individually or in a batch. Scanned documents need OCR first.'),
 'corpus-merger/index.html':('Merge Text Files Online | Dailwind Corpus Merger','Arrange documents, choose separators and combine files into one TXT or text-only Word document. Merge corpus files locally on your device.'),
 'english-ocr/index.html':('English OCR for Scanned Books & PDFs | Dailwind','Convert printed English scans and PDF page images into editable text. Enhance pages, review recognition results and download TXT or text-only Word.'),
 'pdf-tools/index.html':('PDF Splitter & Optimizer | Dailwind PDF Tools','Split PDFs into parts, choose page ranges or optimize document structure. Create manageable files for reading and research in your browser.'),
 'image-tools/index.html':('PDF to Images, Images to PDF & Compression | Dailwind','Export PDF pages as image ZIPs, combine images into a PDF, or resize and compress JPEG, PNG and WebP files locally in your browser.'),
 'metadata-studio/index.html':('Corpus Metadata Generator | Excel & CSV Reports | Dailwind','Catalogue corpus documents by genre, title and source. Review word counts, edit metadata, add custom fields and export Excel or CSV reports.'),
 'grammar-checker/index.html':('Grammar Checker & Writing Assistant: Free, Private | Dailwind','Check spelling, grammar, punctuation, clarity, conciseness and tone as you type, with one-click fixes, a document score and readability. Runs on your device.'),
 'ai-text-detector/index.html':('AI Text Detector (Heuristic Estimate) | Dailwind','Estimate how machine-like a text reads using burstiness, vocabulary diversity, repetition and stock-phrase signals, with sentence highlights. An estimate, never proof.'),
 'text-humanizer/index.html':('Text Humanizer: Academic AI-Style Rewriter | Dailwind','Rewrite stiff or AI-sounding academic prose into natural human academic writing with multi-pass linguistic rewriting. Runs in your browser.'),
 'image-converter/index.html':('Image Converter: JPG, PNG, WebP, AVIF, BMP & ICO | Dailwind','Convert images between JPG, PNG, WebP, AVIF, BMP and ICO in your browser, in batches with a quality slider and ZIP download. Nothing is uploaded.'),
 'image-resizer/index.html':('Image Resizer: Pixels, Percent, Target KB & Social Presets | Dailwind','Resize images by pixels, percentage or target file size in KB, with aspect lock, social media presets and batch ZIP download. Runs in your browser.'),
 'passport-photo-maker/index.html':('Passport & Visa Photo Maker: US, UK, Schengen, Pakistan, India | Dailwind','Make passport and visa photos to official sizes (US 2x2, UK, Schengen, China, Canada, India, Pakistan, Saudi, UAE, Australia, Japan) with head and eye guides, 300 DPI and print sheets.'),
 'text-to-speech/index.html':('Text to Speech & Pronunciation with IPA | Dailwind','Read text aloud with your device voices, adjust voice, language, rate and pitch, follow word-by-word highlighting, and look up English pronunciation in IPA.'),
 'citation-generator/index.html':('Citation Generator: APA 7, MLA 9, Chicago & Harvard with DOI Lookup | Dailwind','Create APA 7, MLA 9, Chicago and Harvard citations for books, journal articles, news articles and web pages. Look up a DOI, copy formatted citations and keep a bibliography in your browser.'),
 'synonym-explorer/index.html':('Synonym & Word Explorer: Free Thesaurus with Meanings | Dailwind','Find synonyms, similar words, broader terms and opposites grouped by meaning, from the Princeton WordNet thesaurus. Loads once, then works offline in your browser.'),
 'text-statistics/index.html':('Word Counter, Text Statistics & Keyword Density | Dailwind','Count words, characters, sentences and paragraphs, see reading and speaking time, and find keyword density for words and phrases with a stopword filter and CSV export. Private, in your browser.'),
 'case-converter/index.html':('Case Converter: Title Case (APA, Chicago), camelCase, snake_case | Dailwind','Convert text to upper, lower, title case (APA or Chicago rules), sentence case, camelCase, snake_case and kebab-case, and remove extra spaces or line breaks. Runs in your browser.'),
 'lexical-metrics/index.html':('Lexical Metrics: Diversity, TTR & Frequency | Dailwind Labs','Measure word frequencies, lexical diversity, moving-average TTR and sentence lengths in your browser, with documented calculations you can check.'),
 'morphology-explorer/index.html':('Morphology Explorer: English Word Forms | Dailwind Labs','Inspect English word forms, estimated inflection tags and model base forms. Original forms stay visible beside predictions.'),
 'syntax-explorer/index.html':('Sentence & Syntax Explorer | Dailwind Research Labs','Explore English sentence and tag profiles, or inspect your own annotated CoNLL-U dependencies and morphological features, locally in your browser.'),
 'sentiment-studio/index.html':('Sentiment Studio: VADER Sentiment Analysis | Dailwind Labs','Explore short English texts with local VADER sentiment scores, sentence-level evidence and clear method limits. Text is analysed in your browser.'),
 'register-profile/index.html':('Register Profile: Feature Counts per 1,000 Words | Dailwind','Count auditable surface features per 1,000 words for register exploration and multidimensional-analysis preparation. No Biber dimension scores.'),
 'forensic-compare/index.html':('Forensic Text Compare | Dailwind Research Labs','Compare vocabulary, n-grams, punctuation and function-word rates in two texts. Descriptive similarities without authorship or legal verdicts.'),
 'readability-studio/index.html':("Readability & Lexical Diversity Analyzer | Dailwind","Compare texts on six readability formulas plus MTLD and HD-D lexical diversity, side by side, with the hardest sentences highlighted. Runs in your browser."),
 'stylometry-lab/index.html':("Stylometry Lab: Burrows' Delta Authorship Comparison | Dailwind","Compare the style of three or more texts with Burrows' Delta, Cosine Delta or Eder's Delta on the most frequent words. A private, in-browser stylo alternative."),
 'parallel-aligner/index.html':("Parallel Text Aligner: Sentence Alignment & TMX | Dailwind","Align a text and its translation sentence by sentence with the Gale\u2013Church method, fix rows with merge and split, and export TSV, CSV or TMX. Runs locally."),
 'qualitative-coder/index.html':("Qualitative Coder for Survey & Interview Responses | Dailwind","Code open-ended survey answers or interview excerpts with your own codebook, keyword suggestions, memos, co-occurrence and Cohen's kappa. Saved only in your browser."),
 'linguax-arc/index.html':('LinguaX Arc: Corpus Toolkit | Offline Android Corpus Analysis','Discover LinguaX Arc for Android: offline concordance, collocations, word frequencies and visual text analysis. Explore real app screenshots and features.'),
 'pmc/index.html':('Pakistan Medical Corpus (PMC) | Medical Discourse Research','Explore Pakistan Medical Corpus, a medical-discourse research project. Analyze the PMC preview without signing in. Full access by enquiry.'),
 'articles/index.html':('Reading Room | Poetry, Fiction, Essays & Research | Dailwind','Read poetry, short fiction, essays, research and teaching perspectives from the Dailwind community. Find writing by title, author or topic.'),
 'arslan-tahir/index.html':('Arslan Tahir | Researcher, Educator & Developer | Dailwind','Meet Arslan Tahir, the researcher, educator and software developer behind Dailwind Studio. Explore his work in language, teaching and research software.'),
 'privacy.html':('Privacy Policy | How Dailwind Studio Handles Your Data','How Dailwind Studio handles browsing, local preferences, cookies, browser toolkits, LinguaX Arc files, optional accounts and the Reading Room.'),
 'terms.html':('Terms & Conditions | Dailwind Studio Website and Tools','Terms for using Dailwind Studio: website use, content ownership, software licences, research use, PMC accounts, paid research access and shared articles.'),
 'corpus-toolkit/coverage.html':('Corpus Toolkit Features, Methods & Limits | Dailwind','See what Dailwind Corpus Toolkit supports: concordance, a CQL subset, word lists, n-grams, statistics and exports, with documented methods and current limits.'),
 'toolkit/linguistics/methods.html':('Research Lab Methods: TTR, Entropy & Tagging | Dailwind','How Dailwind Research Labs calculate lexical diversity, entropy, MATTR and sentence boundaries, plus the scope and limits of the English tagging models.'),
 'contact.html':('Contact Dailwind Studio | Collaboration & Research Services','Contact Dailwind Studio about collaboration, writing, research tools, paid OCR services and access to protected research resources.')}
TOOLS={name.split('/')[0] for name in PAGES if name.split('/')[0] in {'grammar-checker','corpus-toolkit','corpus-cleaner','stylistic-toolkit','mat-cleaner','file-converter','corpus-merger','english-ocr','pdf-tools','image-tools','metadata-studio','lexical-metrics','morphology-explorer','syntax-explorer','sentiment-studio','register-profile','forensic-compare','readability-studio','stylometry-lab','parallel-aligner','qualitative-coder'}}
ORIGIN='https://dailwind.com'

def canonical_route(url):
 path=urlsplit(url).path.lstrip('/')
 return path+'index.html' if not path or path.endswith('/') else path

def setmeta(text,name,value):
 pattern=r'<meta\b[^>]*name="'+re.escape(name)+r'"[^>]*>'
 tag='<meta name="'+name+'" content="'+escape(value,quote=True)+'">'
 return re.sub(pattern,lambda _:tag,text,count=1,flags=re.I) if re.search(pattern,text,re.I) else text.replace('</head>',tag+'</head>',1)

def lastmod(root,route,article=None):
 # Last commit that touched the page's source (the site is staged from the repository root).
 repo=Path(root).resolve().parent
 for candidate in (repo,Path(root).resolve()):
  try:
   out=subprocess.run(['git','-C',str(candidate),'log','-1','--format=%cs','--',route],capture_output=True,text=True,timeout=20).stdout.strip()
  except (OSError,subprocess.SubprocessError):out=''
  if re.fullmatch(r'\d{4}-\d{2}-\d{2}',out):return max(out,article['date']) if article and article.get('date') else out
 if article and article.get('date'):return article['date']
 return date.today().isoformat()

def apply_discovery(root):
 root=Path(root);catalog={}
 if (root/'articles/catalog.json').exists():catalog={item['slug']:item for item in json.loads((root/'articles/catalog.json').read_text())}
 urls=set()
 for path in sorted(root.rglob('*.html')):
  route=path.relative_to(root).as_posix();text=path.read_text()
  if route=='arctoolkit/coverage.html':
   text=re.sub(r'(<link[^>]*rel="canonical"[^>]*href=")[^"]*',r'\1https://dailwind.com/corpus-toolkit/coverage.html',text,count=1)
   # The legacy copy has no canonical link; point it at the maintained page so it is not indexed twice.
   if not re.search(r'<link[^>]*rel="canonical"',text):text=text.replace('</head>','<link rel="canonical" href="https://dailwind.com/corpus-toolkit/coverage.html"></head>',1)
  text=re.sub(r'(<a\b[^>]*href="[^"]*(?:articles/|articles\.html)"[^>]*>)Articles(</a>)',r'\1Reading Room\2',text)
  m=page_metadata(text,route);primary=canonical_route(m['url'])
  if primary in PAGES:
   title,description=PAGES[primary];text=re.sub(r'<title>.*?</title>','<title>'+escape(title)+'</title>',text,count=1,flags=re.S|re.I);text=setmeta(text,'description',description)
  m=page_metadata(text,route)
  if route.endswith('/coverage.html') and primary not in PAGES:m['description']='Read the documented feature coverage, methods and practical limits of the Dailwind browser corpus analysis toolkit.'
  text=setmeta(text,'description',m['description'])
  # Each page's own robots meta tag is the single source of truth; the build never rewrites it.
  robots=re.search(r'<meta\b[^>]*name="robots"[^>]*content="([^"]*)"',text,re.I)
  if not robots:raise ValueError('Missing <meta name="robots"> in '+route)
  private='noindex' in robots[1].lower();alias=primary!=route
  if alias and not private:raise ValueError('Alias/redirect page must be noindex: '+route)
  if not private and not alias:urls.add((m['url'],lastmod(root,route,catalog.get(path.stem) if route.startswith('articles/read/') else None)))
  if primary=='articles/index.html':name='Reading Room'
  elif primary=='pmc/index.html':name='Pakistan Medical Corpus (PMC)'
  elif primary=='index.html':name='Dailwind Studio'
  else:name=m['title'].split(' | ')[0]
  org={'@type':'Organization','@id':ORIGIN+'/#organization','name':'Dailwind Studio','url':ORIGIN+'/','logo':ORIGIN+'/assets/dailwind-logo-v866.webp'}
  website={'@type':'WebSite','@id':ORIGIN+'/#website','name':'Dailwind Studio','url':ORIGIN+'/','publisher':{'@id':org['@id']}}
  page={'@type':'CollectionPage' if primary in {'articles/index.html','toolkits/index.html','apps/index.html'} else 'WebPage','@id':m['url']+'#page','url':m['url'],'name':name,'description':m['description'],'isPartOf':{'@id':website['@id']},'inLanguage':'en'}
  graph=[org,website,page]
  if route.split('/')[0] in TOOLS and route.endswith('/index.html'):
   page['mainEntity']={'@type':'SoftwareApplication','name':name,'applicationCategory':'EducationalApplication','operatingSystem':'Web browser','url':m['url'],'description':m['description'],'isAccessibleForFree':route!='mat-cleaner/index.html'}
  if route.startswith('articles/read/'):
   item=catalog.get(path.stem)
   if item:
    work={'@type':'Article' if item['format']=='pdf' else 'CreativeWork','name':item['title'],'headline':item['title'],'description':item['summary'],'url':m['url'],'genre':item['category'],'publisher':{'@id':org['@id']},'inLanguage':'en'}
    if item.get('author'):work['author']={'@type':'Person','name':item['author']}
    if item.get('date'):work['datePublished']=item['date']
    page['mainEntity']=work
  if not private and primary!='index.html':
   crumbs=[{'@type':'ListItem','position':1,'name':'Home','item':ORIGIN+'/'}]
   parent='Reading Room' if route.startswith('articles/read/') else 'Toolkits' if route.split('/')[0] in TOOLS else None
   if parent:crumbs.append({'@type':'ListItem','position':2,'name':parent,'item':ORIGIN+('/articles/' if parent=='Reading Room' else '/toolkits/')})
   crumbs.append({'@type':'ListItem','position':len(crumbs)+1,'name':name,'item':m['url']})
   graph.append({'@type':'BreadcrumbList','itemListElement':crumbs})
  text=re.sub(r'<script\b[^>]*data-dailwind-discovery[^>]*>.*?</script>','',text,flags=re.S)
  if not private and not alias:
   payload=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
   text=text.replace('</head>','<script type="application/ld+json" data-dailwind-discovery>'+payload+'</script></head>',1)
  path.write_text(text)
 ns='http://www.sitemaps.org/schemas/sitemap/0.9';ET.register_namespace('',ns);sitemap=ET.Element('{'+ns+'}urlset')
 for url,modified in sorted(urls):
  node=ET.SubElement(sitemap,'{'+ns+'}url');ET.SubElement(node,'{'+ns+'}loc').text=url
  if modified:ET.SubElement(node,'{'+ns+'}lastmod').text=modified
 (root/'sitemap.xml').write_text(ET.tostring(sitemap,encoding='unicode',xml_declaration=True))
 lines=['# Dailwind Studio','','> Language research software, practical document tools and community writing.','','## Research tools']
 for route,(title,description) in PAGES.items():
  if route=='index.html':continue
  url=ORIGIN+'/'+(route[:-10] if route.endswith('index.html') else route)
  lines.append('- ['+title.split(' | ')[0]+']('+url+'): '+description)
 lines+=['','## Access and scope','Most toolkits process files on the visitor’s device. MAT Tagger Cleaner needs paid approval; it prepares text and does not perform MAT tagging or multidimensional analysis. PMC has a separate illustrative public sample and an approved private collection. Private corpus files are not public downloads.','Do not treat corpus-preparation output as independently validated linguistic analysis.','']
 (root/'llms.txt').write_text('\n'.join(lines))
