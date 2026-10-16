'use strict';
(()=>{const search=document.getElementById('article-search'),format=document.getElementById('article-format'),rows=[...document.querySelectorAll('[data-article-row]')],count=document.getElementById('article-count'),empty=document.getElementById('article-no-results');
 function filter(){const term=search.value.trim().toLocaleLowerCase(),kind=format.value;let shown=0;rows.forEach(row=>{const match=(!term||row.dataset.search.toLocaleLowerCase().includes(term))&&(kind==='all'||row.dataset.format===kind);row.hidden=!match;if(match)shown++;});count.textContent=shown+(shown===1?' article':' articles');empty.hidden=!rows.length||shown>0;}
 search.addEventListener('input',filter);format.addEventListener('change',filter);filter();})();
