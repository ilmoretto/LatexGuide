(function(){
  const BASE_PATH = (document.querySelector('meta[name="base-path"]')?.content || "").replace(/\/+$/,'');
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const paths = { data: () => `${BASE_PATH}/data/modules.json` };

  function normalize(p){ if(!p) return '/'; if(!p.startsWith('/')) p = '/' + p; if(p.endsWith('/')) p += 'index.html'; return p; }
  function samePath(a,b){ return normalize(a) === normalize(b); }
  function currentPath(){
    let p = window.location.pathname;
    if(BASE_PATH && p.startsWith(BASE_PATH)) p = p.slice(BASE_PATH.length) || '/';
    return normalize(p);
  }

  async function loadData(){
    const res = await fetch(paths.data(), { cache: 'no-cache' });
    if(!res.ok) throw new Error('Não foi possível carregar data/modules.json');
    return res.json();
  }

  function buildSidebar(data){
    const sidebar = $('#sidebar');
    if(!sidebar) return;
    sidebar.innerHTML = '';

    if(data.courseTitle){
      $('#courseTitle')?.replaceChildren(document.createTextNode(data.courseTitle));
      document.title = data.courseTitle + ' — Estrutura';
    }

    const nav = document.createElement('nav');
    nav.className = 'nav';
    nav.setAttribute('aria-label','Navegação de módulos');

    if(Array.isArray(data.extra) && data.extra.length){
      const header = document.createElement('div');
      header.className = 'section-title';
      header.textContent = 'Geral';
      nav.appendChild(header);

      data.extra.forEach(link=>{
        const wrap = document.createElement('div');
        wrap.className = 'module';
        const ul = document.createElement('ul');
        ul.className = 'module__list';
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'module__link';
        a.href = BASE_PATH + link.path;
        a.textContent = link.title;
        li.appendChild(a);
        ul.appendChild(li);
        wrap.appendChild(ul);
        nav.appendChild(wrap);
      });

      const header2 = document.createElement('div');
      header2.className = 'section-title';
      header2.textContent = 'Módulos';
      nav.appendChild(header2);
    }

    (data.modules || []).forEach((mod, idx)=>{
      const details = document.createElement('details');
      details.className = 'module';

      const summary = document.createElement('summary');
      summary.textContent = mod.title || `Módulo ${idx+1}`;
      details.appendChild(summary);

      const ul = document.createElement('ul');
      ul.className = 'module__list';

      (mod.pages || []).forEach(page=>{
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'module__link';
        a.href = BASE_PATH + page.path;
        a.textContent = page.title || 'Página';
        li.appendChild(a);
        ul.appendChild(li);
      });

      details.appendChild(ul);
      nav.appendChild(details);
    });

    sidebar.appendChild(nav);
    highlightActiveLinkAndOpenModule();
  }

  function flatPages(data){
    const all = [];
    (data.modules || []).forEach(mod=>{
      (mod.pages || []).forEach(p=>{
        all.push({ module: mod, page: p });
      });
    });
    return all;
  }

  function highlightActiveLinkAndOpenModule(){
    const here = currentPath();
    const links = $$('.module__link', $('#sidebar'));
    links.forEach(a=>{
      const href = a.getAttribute('href') || '';
      const url = new URL(href, window.location.origin);
      const candidate = url.pathname.replace(BASE_PATH,'') || '/';
      if(samePath(candidate, here)){
        a.setAttribute('aria-current','page');
        const details = a.closest('details.module');
        if(details) details.open = true;
      }
    });
  }

  function buildBreadcrumbs(data){
    const crumbs = $('#breadcrumbs');
    if(!crumbs) return;
    crumbs.innerHTML = '';

    const here = currentPath();

    const home = document.createElement('a');
    home.href = BASE_PATH + '/index.html';
    home.textContent = 'Início';
    crumbs.appendChild(home);

    let currentModule, currentPage;
    (data.modules || []).some(mod=>{
      return (mod.pages || []).some(p=>{
        if(samePath(p.path, here)){ currentModule = mod; currentPage = p; return true; }
        return false;
      });
    });

    if(currentModule){
      const sep = document.createTextNode(' / ');
      crumbs.appendChild(sep);
      const modLink = document.createElement('a');
      const modIndex = (currentModule.pages || []).find(p => /\/index\.html$/i.test(p.path));
      if(modIndex){
        modLink.href = BASE_PATH + modIndex.path;
        modLink.textContent = currentModule.title || 'Módulo';
        crumbs.appendChild(modLink);
      } else {
        const span = document.createElement('span');
        span.textContent = currentModule.title || 'Módulo';
        crumbs.appendChild(span);
      }
    }

    if(currentPage){
      const sep2 = document.createTextNode(' / ');
      crumbs.appendChild(sep2);
      const span = document.createElement('span');
      span.textContent = currentPage.title || 'Página';
      crumbs.appendChild(span);
    }
  }

  function buildPager(data){
    const pager = $('#pager');
    if(!pager) return;
    pager.innerHTML = '';

    const list = flatPages(data);
    const here = currentPath();
    const idx = list.findIndex(item => samePath(item.page.path, here));

    const makeLink = (label, item) => {
      const a = document.createElement('a');
      a.href = BASE_PATH + item.page.path;
      a.innerHTML = `<strong>${label}</strong><br><span style="color:var(--muted)">${item.page.title}</span>`;
      return a;
    };

    if(idx > 0){
      pager.appendChild(makeLink('← Anterior', list[idx-1]));
    } else {
      const div = document.createElement('div'); div.style.flex='1';
      pager.appendChild(div);
    }

    if(idx >= 0 && idx < list.length - 1){
      pager.appendChild(makeLink('Próximo →', list[idx+1]));
    } else {
      const div = document.createElement('div'); div.style.flex='1';
      pager.appendChild(div);
    }
  }

  /* Fallback do botão ☰ (funciona mesmo sem Alpine) */
  function initSidebarToggle(){
    const btn = $('#sidebarToggle');
    const sidebar = $('#sidebar');
    if(!btn || !sidebar) return;

    const wideMql = window.matchMedia('(min-width: 1536px)'); // em telas largas o sidebar é fixo

    const setOpen = (open) => {
      if(window.Alpine) return; // Alpine controla quando estiver presente
      sidebar.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      const isOverlay = !wideMql.matches;
      document.body.style.overflow = (open && isOverlay) ? 'hidden' : '';
    };

    btn.addEventListener('click', ()=>{
      if(window.Alpine) return;
      const open = !sidebar.classList.contains('is-open');
      setOpen(open);
    });

    document.addEventListener('click',(e)=>{
      if(window.Alpine) return;
      const isOverlay = !wideMql.matches;
      if(isOverlay && sidebar.classList.contains('is-open')){
        const clickInside = sidebar.contains(e.target) || btn.contains(e.target);
        if(!clickInside) setOpen(false);
      }
    });

    wideMql.addEventListener?.('change', () => {
      // Ao entrar em modo "fixo", limpa travamento de scroll do body
      if(wideMql.matches){ document.body.style.overflow = ''; }
    });
  }

  // Funcionalidade de mudança de tema
  function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    const themeText = themeToggle?.querySelector('.theme-text');
    
    console.log('InitThemeToggle called:', { themeToggle, themeIcon, themeText });
    
    if (!themeToggle) {
      console.log('Theme toggle button not found');
      return;
    }
    
    // Verificar tema salvo no localStorage ou usar padrão escuro
    const savedTheme = localStorage.getItem('theme') || 'dark';
    console.log('Saved theme:', savedTheme);
    setTheme(savedTheme);
    
    function setTheme(theme) {
      console.log('Setting theme to:', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
        if (themeIcon) themeIcon.textContent = '☀️';
        if (themeText) themeText.textContent = 'Claro';
      } else {
        document.documentElement.classList.remove('light-theme');
        if (themeIcon) themeIcon.textContent = '🌙';
        if (themeText) themeText.textContent = 'Escuro';
      }
      localStorage.setItem('theme', theme);
    }
    
    themeToggle.addEventListener('click', () => {
      console.log('Theme toggle clicked');
      const isLight = document.documentElement.classList.contains('light-theme');
      console.log('Current theme is light:', isLight);
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  async function init(){
    initSidebarToggle();
    initThemeToggle();
    try{
      const data = await loadData();
      buildSidebar(data);
      buildBreadcrumbs(data);
      buildPager(data);

      window.__COURSE_DATA__ = data;
      document.dispatchEvent(new CustomEvent('course:dataLoaded', { detail: data }));
    }catch(err){
      console.error(err);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();