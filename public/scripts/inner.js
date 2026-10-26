(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $ = function(s, c){ return (c || document).querySelector(s); };
  var $$ = function(s, c){ return [].slice.call((c || document).querySelectorAll(s)); };
  var nav = $('#nav'), hero = $('.hero'), heroInner = $('#heroInner'), heroMedia = $('#heroMedia'), bar = $('#progress');
  var pars = $$('[data-par]'), speeds = $$('[data-speed]'), bgs = $$('[data-bg]'), navZones = $$('[data-nav]');
  var tls = $$('[data-line]');
  var vh = innerHeight;

  if (hero) requestAnimationFrame(function(){ hero.classList.add('ready'); });

  /* split headlines into words for the staggered reveal (keeps <em>) */
  $$('.split').forEach(function(h){
    var i = 0;
    (function walk(node){
      [].slice.call(node.childNodes).forEach(function(n){
        if (n.nodeType === 3){
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(part){
            if (!part) return;
            if (/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var s = document.createElement('span'); s.textContent = part; s.style.transitionDelay = (i++ * 0.045) + 's';
            w.appendChild(s); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1){ walk(n); }
      });
    })(h);
  });

  /* menu */
  var menu = $('#menu'), burger = $('#burger');
  function setMenu(open){
    menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', !open);
    burger.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function(){ setMenu(true); });
  $('#menuClose').addEventListener('click', function(){ setMenu(false); });
  menu.addEventListener('click', function(e){ if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });

  /* reveals */
  var els = $$('.rv,.rv-3d,.rv-clip,.rv-soft,.split');
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin:'0px 0px -8% 0px' });
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(function(el){ el.classList.add('in'); }); }

  /* cards: gentle 3D tilt toward the cursor */
  if (fine && !reduce){
    $$('[data-tilt]').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg)';
      });
      card.addEventListener('mouseleave', function(){ card.style.transform = ''; });
    });
  }

  /* growth map (services) */
  var gm = $('#gmPin'), gmTrack = gm && $('.gm-track', gm), gmSt = gm ? $$('.gm-station', gm) : [], gmDots = gm ? $$('.gm-dot', gm) : [], gmBar = gm && $('.gm-bar i', gm), gmMax = 0;
  function gmMeasure(){ if (gm) gmMax = Math.max(0, gmTrack.scrollWidth - innerWidth); }
  function gmProg(){ var r = gm.getBoundingClientRect(), total = gm.offsetHeight - vh; return Math.min(1, Math.max(0, total > 0 ? -r.top / total : 0)); }
  gmDots.forEach(function(d, i){
    d.addEventListener('click', function(){
      var total = gm.offsetHeight - vh, top = gm.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + total * (i / (gmSt.length - 1)) + 2 - (i ? total / (gmSt.length - 1) * 0.0 : 0), behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* plan builder (services) */
  var plans = {
    leads:  [['Marketing Strategy','Plan'],['Landing Pages','Build'],['Google Ads','Accelerate'],['Lead Generation','Accelerate'],['CRM Setup','Retain']],
    repeat: [['CRM Setup','Retain'],['Email Campaigns','Retain'],['Marketing Automation','Retain'],['Reactivation &amp; Referrals','Retain'],['Loyalty Programs','Retain']],
    brand:  [['Brand Positioning','Identity'],['Logo &amp; Visual Identity','Identity'],['Web Design','Build'],['Video &amp; Photography','Identity'],['Social Media','Attract']],
    shop:   [['E-commerce &amp; Shopify','Build'],['SEO','Attract'],['Email Flows','Retain'],['Social Media Ads','Accelerate'],['Conversion Optimization','Accelerate']],
    ai:     [['Marketing Audit','Plan'],['AI Agents','Scale'],['AI Receptionist','Scale'],['Workflow Automation','Scale'],['Integrations &amp; Data','Scale']],
    b2b:    [['Market Research','Plan'],['B2B Marketing','Accelerate'],['Content Marketing','Attract'],['Sales Collateral','Identity'],['CRM Pipeline','Retain']]
  };
  var path = $('.pb-path'), goals = $$('.pb-goal');
  function render(key){
    path.innerHTML = plans[key].map(function(s, i){
      return '<div class="pb-step" style="animation-delay:' + (i * .08) + 's"><div class="pb-ball"><span>' + (i + 1) + '</span></div><h3>' + s[0] + '</h3><small>' + s[1] + '</small></div>';
    }).join('');
  }
  goals.forEach(function(g){
    g.addEventListener('click', function(){
      goals.forEach(function(x){ x.classList.toggle('active', x === g); x.setAttribute('aria-checked', x === g); });
      render(g.getAttribute('data-goal'));
    });
  });
  if (path) render('leads');

  function inView(el){ var r = el.getBoundingClientRect(); return r.bottom > -100 && r.top < vh + 100 ? r : null; }

  var ticking = false;
  function frame(){
    ticking = false;
    var y = scrollY, H = document.documentElement.scrollHeight - vh;
    bar.style.transform = 'scaleX(' + (H > 0 ? y / H : 0).toFixed(4) + ')';

    var probe = 44, theme = 'dark';
    for (var z = 0; z < navZones.length; z++){
      var zr = navZones[z].getBoundingClientRect();
      if (zr.top <= probe && zr.bottom > probe && navZones[z] !== hero){ theme = navZones[z].getAttribute('data-nav'); }
    }
    if (y < vh * 0.5) theme = 'dark';
    nav.classList.toggle('light', theme === 'light');

    /* lines that fill as you scroll: vertical timelines and horizontal steps */
    tls.forEach(function(t){
      var r = t.getBoundingClientRect(), vert = t.getAttribute('data-line') === 'v';
      var p = vert ? (vh * 0.6 - r.top) / Math.max(1, r.height) : (vh * 0.85 - r.top) / (vh * 0.5);
      p = Math.max(0, Math.min(1, p));
      t.style.setProperty('--p', p.toFixed(3));
      var items = $$('.tl-item,.hstep', t);
      items.forEach(function(it, i){
        var lit = vert ? (it.getBoundingClientRect().top + 8 < vh * 0.6) : (p >= (items.length > 1 ? i / (items.length - 1) : 0) - 0.02);
        it.classList.toggle('lit', lit);
      });
    });

    if (gm){
      var gp = gmProg(), n1 = gmSt.length - 1, raw = gp * n1, gi = Math.min(n1 - 1, Math.floor(raw)), gf = raw - gi, hold = .4;
      /* rest on each stage, then glide to the next */
      var gt = gf < hold ? 0 : (gf - hold) / (1 - hold); gt = gt * gt * (3 - 2 * gt);
      var pos = Math.min(n1, gi + gt);
      gmTrack.style.transform = 'translate3d(' + Math.round(-(pos / n1) * gmMax) + 'px,0,0)';
      if (gmBar) gmBar.style.transform = 'scaleX(' + gp.toFixed(4) + ')';
      var best = Math.round(pos);
      gmDots.forEach(function(d, i){ d.classList.toggle('active', i === best); });
      gmSt.forEach(function(s, i){ s.style.opacity = i === best ? 1 : .55; });
    }

    if (reduce) return;
    if (hero && y < vh * 1.1){
      var k = Math.min(1, y / vh);
      heroInner.style.transform = 'translate3d(0,' + (y * 0.32).toFixed(1) + 'px,0)';
      heroInner.style.opacity = (1 - k * 1.25).toFixed(3);
      heroMedia.style.transform = 'scale(' + (1 + k * 0.08).toFixed(4) + ')';
    }
    pars.forEach(function(img){
      var r = inView(img.parentNode); if (!r) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.transform = 'translate3d(0,' + (p * -7).toFixed(2) + '%,0)';
    });
    speeds.forEach(function(el){
      var r = inView(el.parentNode); if (!r) return;
      el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * parseFloat(el.getAttribute('data-speed'))).toFixed(1) + 'px,0)';
    });
    bgs.forEach(function(el){
      var r = inView(el.parentNode); if (!r) return;
      el.style.transform = 'translate3d(0,' + (r.top * -0.12).toFixed(1) + 'px,0)';
    });
  }
  addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(frame); } }, { passive:true });
  addEventListener('resize', function(){ vh = innerHeight; gmMeasure(); frame(); });
  addEventListener('load', function(){ gmMeasure(); frame(); });
  gmMeasure(); frame();

})();
