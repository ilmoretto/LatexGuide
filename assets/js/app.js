(function(){
  // Detecta base path automaticamente. Ex.: /LatexGuide no GitHub Pages; vazio em dev local.
  function detectBasePath(){
    const parts = location.pathname.split('/').filter(Boolean);
    // Se houver um primeiro segmento sem ponto (não é arquivo), use como base. Ex.: "LatexGuide"
    // Mas ignore diretórios de conteúdo como 'modules', 'pages', 'assets', etc.
    const contentDirs = ['modules', 'pages', 'assets', 'data'];
    if (parts.length && !parts[0].includes('.') && !contentDirs.includes(parts[0])) {
      return '/' + parts[0];
    }
    return '';
  }
  const BASE_PATH = detectBasePath();

  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const paths = { data: () => `${BASE_PATH}/data/modules.json` };

  function normalize(p){
    if(!p) return '/';
    if(!p.startsWith('/')) p = '/' + p;
    if(p.endsWith('/')) p += 'index.html';
    return p;
  }
  function samePath(a,b){ return normalize(a) === normalize(b); }
  function currentPath(){
    let p = window.location.pathname;
    if(BASE_PATH && p.startsWith(BASE_PATH)) p = p.slice(BASE_PATH.length) || '/';
    return normalize(p);
  }

  async function loadData(){
    const res = await fetch(paths.data(), { cache: 'no-store' });
    if(!res.ok) throw new Error(`Falha ao carregar ${paths.data()}: ${res.status}`);
    return res.json();
  }

  function buildSidebar(data){
    const sidebar = $('#sidebar');
    if(!sidebar) return;
    sidebar.innerHTML = '';

    if(data.courseTitle){
      $('#courseTitle')?.replaceChildren(document.createTextNode(data.courseTitle));
      if(!document.title.includes('—')) document.title = data.courseTitle + ' — Estrutura';
    }

    const nav = document.createElement('nav');
    nav.className = 'nav';
    nav.setAttribute('aria-label','Navegação de módulos');

    if(Array.isArray(data.extra) && data.extra.length){
      const header = document.createElement('div');
      header.className = 'section-title';
      header.textContent = 'Geral';
      nav.appendChild(header);

      const box = document.createElement('div');
      box.className = 'module';
      const ul = document.createElement('ul');
      ul.className = 'module__list';

      data.extra.forEach(link=>{
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'module__link';
        a.href = BASE_PATH + link.path;
        a.textContent = link.title;
        li.appendChild(a);
        ul.appendChild(li);
      });

      box.appendChild(ul);
      nav.appendChild(box);

      const header2 = document.createElement('div');
      header2.className = 'section-title';
      header2.textContent = 'Módulos';
      nav.appendChild(header2);
    }

    (data.modules || []).forEach((mod, mi)=>{
      const details = document.createElement('details');
      details.className = 'module';

      const summary = document.createElement('summary');
      summary.textContent = mod.title || `Módulo ${mi+1}`;
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
    markActiveAndOpen();
  }

  function flatPages(data){
    const arr = [];
    (data.modules || []).forEach(mod=>{
      (mod.pages || []).forEach(p=> arr.push({ module: mod, page: p }));
    });
    return arr;
  }

  function markActiveAndOpen(){
    const here = currentPath();
    const links = $$('.module__link', $('#sidebar'));
    links.forEach(a=>{
      const url = new URL(a.href, location.origin);
      const candidate = url.pathname.replace(BASE_PATH,'') || '/';
      if(samePath(candidate, here)){
        a.setAttribute('aria-current','page');
        const det = a.closest('details.module');
        if(det) det.open = true;
      }
    });
  }

  function buildBreadcrumbs(data){
    const el = $('#breadcrumbs');
    if(!el) return;
    el.innerHTML = '';

    const here = currentPath();

    const addSep = () => el.appendChild(document.createTextNode(' / '));

    const home = document.createElement('a');
    home.href = BASE_PATH + '/index.html';
    home.textContent = 'Início';
    el.appendChild(home);

    let curMod=null, curPage=null;
    (data.modules || []).some(mod=>{
      return (mod.pages || []).some(p=>{
        if(samePath(p.path, here)){ curMod = mod; curPage = p; return true; }
        return false;
      });
    });

    if(curMod){ addSep(); const span=document.createElement('span'); span.textContent=curMod.title||'Módulo'; el.appendChild(span); }
    if(curPage){ addSep(); const span=document.createElement('span'); span.textContent=curPage.title||'Página'; el.appendChild(span); }
  }

  function buildPager(data){
    const pager = $('#pager');
    if(!pager) return;
    pager.innerHTML = '';

    const list = flatPages(data);
    const here = currentPath();
    const idx = list.findIndex(item => samePath(item.page.path, here));

    const mk = (label, item) => {
      const a = document.createElement('a');
      a.href = BASE_PATH + item.page.path;
      a.innerHTML = `<strong>${label}</strong><br><span style="color:var(--muted)">${item.page.title}</span>`;
      return a;
    };

    if(idx > 0) pager.appendChild(mk('← Anterior', list[idx-1])); else { const d=document.createElement('div'); d.style.flex='1'; pager.appendChild(d); }
    if(idx >= 0 && idx < list.length-1) pager.appendChild(mk('Próximo →', list[idx+1])); else { const d=document.createElement('div'); d.style.flex='1'; pager.appendChild(d); }
  }

  function initToggle(){
    const btn = $('#sidebarToggle');
    const sidebar = $('#sidebar');
    if(!btn || !sidebar) return;

    const wide = window.matchMedia('(min-width: 1536px)');

    function setOpen(open){
      const isOverlay = !wide.matches;
      sidebar.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = (open && isOverlay) ? 'hidden' : '';
    }

    btn.addEventListener('click', ()=>{
      const open = !sidebar.classList.contains('is-open');
      setOpen(open);
    });

    document.addEventListener('click', (e)=>{
      const isOverlay = !wide.matches;
      if(isOverlay && sidebar.classList.contains('is-open')){
        const inside = sidebar.contains(e.target) || btn.contains(e.target);
        if(!inside) setOpen(false);
      }
    });

    wide.addEventListener?.('change', ()=>{
      if(wide.matches){ document.body.style.overflow = ''; }
    });
  }

  function initCopyButtons(){
    const copyButtons = $$('.copy-button');
    copyButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const codeBlock = btn.closest('.code-block');
        const codeContent = codeBlock?.querySelector('pre code');
        if (!codeContent) return;

        const textToCopy = codeContent.textContent || '';
        
        try {
          await navigator.clipboard.writeText(textToCopy);
          
          // Visual feedback
          const originalText = btn.textContent;
          btn.textContent = 'Copiado!';
          btn.style.backgroundColor = '#10b981';
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '#444';
          }, 2000);
        } catch (err) {
          // Fallback para navegadores mais antigos
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          
          // Visual feedback
          const originalText = btn.textContent;
          btn.textContent = 'Copiado!';
          btn.style.backgroundColor = '#10b981';
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '#444';
          }, 2000);
        }
      });
    });
  }

  function initThemeToggle(){
    // Verificar tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Aplicar tema inicial
    if (initialTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    }

    // Criar botão de alternância se não existir
    let themeToggle = $('#themeToggle');
    if (!themeToggle) {
      themeToggle = document.createElement('button');
      themeToggle.id = 'themeToggle';
      themeToggle.className = 'theme-toggle';
      themeToggle.setAttribute('aria-label', 'Alternar tema');
      themeToggle.innerHTML = `
        <span class="theme-icon">🌙</span>
        <span class="theme-text">Escuro</span>
      `;
      
      // Inserir na topbar
      const topbar = $('.topbar');
      if (topbar) {
        topbar.appendChild(themeToggle);
      }
    }

    // Atualizar aparência do botão
    function updateThemeToggle() {
      const isLight = document.documentElement.classList.contains('light-theme');
      const icon = themeToggle.querySelector('.theme-icon');
      const text = themeToggle.querySelector('.theme-text');
      
      if (isLight) {
        icon.textContent = '☀️';
        text.textContent = 'Claro';
      } else {
        icon.textContent = '🌙';
        text.textContent = 'Escuro';
      }
    }

    // Função para alternar tema
    function toggleTheme() {
      const isLight = document.documentElement.classList.contains('light-theme');
      
      if (isLight) {
        document.documentElement.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
      }
      
      updateThemeToggle();
    }

    // Event listener para o botão
    themeToggle.addEventListener('click', toggleTheme);
    
    // Atualizar aparência inicial
    updateThemeToggle();

    // Detectar mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          document.documentElement.classList.remove('light-theme');
        } else {
          document.documentElement.classList.add('light-theme');
        }
        updateThemeToggle();
      }
    });
  }

  async function init(){
    initToggle();
    initCopyButtons();
    initThemeToggle();
    try{
      const data = await loadData();
      buildSidebar(data);
      buildBreadcrumbs(data);
      buildPager(data);
    }catch(err){
      console.error(err);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();