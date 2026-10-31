'use strict';
importScripts('language-engine.js?v=8612');
self.onmessage=({data})=>{try{const {kind,text,options={}}=data;if((kind==='morphology-explorer'||kind==='syntax-explorer'&&options.mode!=='conllu')&&!self.DailwindNLP)importScripts('../toolkit/linguistics/compromise-14.14.4.js');if(kind==='sentiment-studio'&&!self.DailwindVader)importScripts('../toolkit/linguistics/vader-1.1.3.js');self.postMessage({result:DailwindLanguage.run(kind,text,options,{nlp:self.DailwindNLP,vader:self.DailwindVader})});}catch(e){self.postMessage({error:e.message||'The local analysis could not finish.'});}};
