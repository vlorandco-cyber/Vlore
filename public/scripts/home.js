(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $ = function(s, c){ return (c || document).querySelector(s); };
  var $$ = function(s, c){ return [].slice.call((c || document).querySelectorAll(s)); };
  var nav = $('#nav'), hero = $('.hero'), heroInner = $('#heroInner'), heroMedia = $('#heroMedia');
  var bar = $('#progress'), track = $('#bpTrack'), steps = track ? $$('.bp-step', track) : [];
  var pars = $$('[data-par]'), speeds = $$('[data-speed]'), rows = $$('.strip-row'), strip = $('#gallery');
  var nextBg = $('#nextBg'), navZones = $$('[data-nav]');
  var vh = innerHeight;

  requestAnimationFrame(function(){ hero.classList.add('ready'); });

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

  /* services: the image follows the service in view, or the one hovered */
  var prev = $$('#svcPrev img'), svcRows = $$('#svcList a'), svcCount = $('#svcCount'), hoverIdx = -1, curIdx = 0;
  function setSvc(i){
    if (i === curIdx) return; curIdx = i;
    prev.forEach(function(im, j){ im.classList.toggle('on', i === j); });
    svcRows.forEach(function(r, j){ r.classList.toggle('act', i === j); });
    if (svcCount) svcCount.firstChild.nodeValue = '0' + (i + 1) + ' ';
  }
  svcRows.forEach(function(a, i){
    a.addEventListener('mouseenter', function(){ hoverIdx = i; setSvc(i); });
    a.addEventListener('mouseleave', function(){ hoverIdx = -1; });
  });
  if (svcRows[0]) svcRows[0].classList.add('act');
  function syncSvc(){
    if (hoverIdx > -1 || !svcRows.length || innerWidth <= 860) return;
    var best = 0, bd = 1e9;
    svcRows.forEach(function(r, j){ var rc = r.getBoundingClientRect(); var d = Math.abs(rc.top + rc.height / 2 - vh * 0.5); if (d < bd){ bd = d; best = j; } });
    setSvc(best);
  }

  /* project cards: gentle 3D tilt toward the cursor */
  if (fine && !reduce){
    $$('[data-tilt]').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg)';
      });
      card.addEventListener('mouseleave', function(){ card.style.transform = ''; });
    });
  }

  function inView(el){ var r = el.getBoundingClientRect(); return r.bottom > -100 && r.top < vh + 100 ? r : null; }

  var ticking = false;
  function frame(){
    ticking = false;
    var y = scrollY, H = document.documentElement.scrollHeight - vh;
    bar.style.transform = 'scaleX(' + (H > 0 ? y / H : 0).toFixed(4) + ')';

    /* nav colour follows the section under it */
    var probe = 44, theme = 'dark';
    for (var z = 0; z < navZones.length; z++){
      var zr = navZones[z].getBoundingClientRect();
      if (zr.top <= probe && zr.bottom > probe && navZones[z] !== hero){ theme = navZones[z].getAttribute('data-nav'); }
    }
    if (y < vh * 0.5) theme = 'dark';
    nav.classList.toggle('light', theme === 'light');

    if (reduce) return;
    if (y < vh * 1.1){
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
      var p = (r.top + r.height / 2 - vh / 2);
      el.style.transform = 'translate3d(0,' + (p * parseFloat(el.getAttribute('data-speed'))).toFixed(1) + 'px,0)';
    });
    if (strip){
      var sr = inView(strip);
      if (sr){
        var sp = (vh - sr.top) / (vh + sr.height);
        rows.forEach(function(row){
          var dir = +row.getAttribute('data-dir'), max = row.scrollWidth - innerWidth;
          var x = dir < 0 ? -sp * max * 0.9 : -max * 0.9 + sp * max * 0.9;
          row.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
        });
      }
    }
    if (nextBg){
      var nr = inView(nextBg.parentNode);
      if (nr) nextBg.style.transform = 'translate3d(0,' + ((nr.top) * -0.12).toFixed(1) + 'px,0)';
    }
    if (track){
      var r = track.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (vh * 0.55)));
      track.style.setProperty('--p', p.toFixed(3));
      for (var i = 0; i < steps.length; i++) steps[i].classList.toggle('lit', p >= i / (steps.length - 1) - 0.02);
    }
  }
  addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(frame); } }, { passive:true });
  addEventListener('resize', function(){ vh = innerHeight; frame(); });
  addEventListener('load', frame);
  frame();

  /* contact form: FormSubmit -> hello@vlore.ca, with a normal-submit fallback */
  var form = $('#contactForm');
  if (!form) return;
  var btn = $('#contactSubmitBtn'), label = btn.innerHTML;
  var errEl = $('#formError'), okEl = $('#formSuccess');
  function showOk(){ form.style.display = 'none'; okEl.style.display = 'block'; }
  if (/[?&]sent=1/.test(location.search)) showOk();
  form.addEventListener('submit', function(e){
    e.preventDefault();
    errEl.style.display = 'none';
    btn.disabled = true; btn.textContent = 'Sending…';
    var payload = {};
    new FormData(form).forEach(function(v, k){ payload[k] = payload[k] ? payload[k] + ', ' + v : v; });
    fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method:'POST', body:JSON.stringify(payload),
      headers:{ 'Content-Type':'application/json', 'Accept':'application/json' }
    }).then(function(res){
      return res.json().catch(function(){ return {}; }).then(function(d){
        if (res.ok && d && String(d.success) === 'true') return showOk();
        throw new Error('fallback');
      });
    }).catch(function(){
      if (!form.dataset.fellBack){ form.dataset.fellBack = '1'; HTMLFormElement.prototype.submit.call(form); return; }
      errEl.textContent = "We couldn't send that. Please try again, or email hello@vlore.ca.";
      errEl.style.display = 'block'; btn.disabled = false; btn.innerHTML = label;
    });
  });
})();
