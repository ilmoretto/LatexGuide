(function(){
  const BASE_PATH = (document.querySelector('meta[name="base-path"]')?.content || "").replace(/\/+$/,'');
  let fuse, indexItems = [];

  function buildIndex(data){
    indexItems = [];
    // Extra (páginas gerais)
    (data.extra || []).forEach(p=>{
      indexItems.push({
        title: p.title || 'Página',
        path: p.path,
        moduleTitle: 'Geral'
      });
    });
    // Módulos e páginas
    (data.modules || []).forEach(mod=>{
      (mod.pages || []).forEach(p=>{
        indexItems.push({
          title: p.title || 'Página',
          path: p.path,
          moduleTitle: mod.title || 'Módulo'
        });
      });
    });

    fuse = new Fuse(indexItems, {
      includeMatches: false,
      threshold: 0.35,
      distance: 100,
      keys: ['title', 'moduleTitle']
    });
  }

  function setupSearchUI(){
    const input = document.getElementById('searchInput');
    const resultsBox = document.getElementById('searchResultsBox');
    const resultsList = document.getElementById('searchResults');

    if(!input || !resultsList || !resultsBox) return;

    function clearResults(){
      resultsList.innerHTML = '';
      resultsBox.classList.remove('is-open');
    }

    function renderResults(items){
      resultsList.innerHTML = '';
      if(!items.length){ clearResults(); return; }
      resultsBox.classList.add('is-open');
      items.slice(0, 12).forEach(({item})=>{
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = BASE_PATH + item.path;
        a.innerHTML = `<div class="search__item-title">${item.title}</div>
                       <div class="search__item-sub">${item.moduleTitle}</div>`;
        li.appendChild(a);
        resultsList.appendChild(li);
      });
    }

    input.addEventListener('input', ()=>{
      const q = input.value.trim();
      if(q.length < 2){ clearResults(); return; }
      const res = fuse.search(q);
      renderResults(res);
    });

    // Fechar ao perder foco (pequeno timeout para permitir clique)
    input.addEventListener('blur', ()=> setTimeout(clearResults, 150));
  }

  document.addEventListener('course:dataLoaded', (e)=>{
    buildIndex(e.detail);
    setupSearchUI();
  });
})();