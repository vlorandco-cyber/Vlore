/* VLORE — Stacked panel scroll system (v3)
   ------------------------------------------------------------------------
   Versions 1 and 2 of this relied on native `position: sticky` and tried
   to compensate for its release timing with a transform on the content.
   That was the wrong foundation: sticky's own *box* shrinks its screen
   coverage the instant it starts to release (that's how the browser
   satisfies "stay within my container"), and no amount of compensating
   the CONTENT inside that box fixes the box itself no longer covering
   the full screen. That was the actual white gap.

   This version never relies on sticky's release timing at all. Instead,
   each panel's `.panel-viewport` is switched between `position: fixed`
   (full-screen, exactly while it's the panel currently in play) and
   `position: absolute` (parked off-screen, doing nothing) by JS, based
   purely on scroll position. `.panel` itself is an ordinary block-level
   spacer that only exists to give the page the correct scrollable height
   — it has no visual role.

   Every panel that could plausibly be visible right now (outgoing panel
   still finishing, incoming panel starting to arrive) is fixed
   simultaneously; later panels are later in the DOM, so they paint over
   earlier ones automatically — no z-index needed.

   Content behaviour within a panel is unchanged in spirit:
     entrance  → content is clipped from the top, revealing it bottom-up
                 as the panel arrives (rather than moving the content,
                 which is what created the gap in the sticky version)
     reveal    → for content taller than one screen, translate it upward
                 to bring the rest into view via ordinary scroll
     hold      → once fully revealed, stays character-for-character still
                 while the next panel's entrance covers it

   Still entirely driven by reading scroll position — never intercepted,
   never hijacked, just read and responded to inside requestAnimationFrame.
   ------------------------------------------------------------------------ */
(function(){

  function showAllReveals(){
    document.querySelectorAll('.rv, .rv-l, .rv-r, .rv-scale, .rv-btn').forEach(function(el){
      el.classList.add('in');
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){ showAllReveals(); return; }

  var panelEls = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  if (!panelEls.length){ showAllReveals(); return; }

  var data = panelEls.map(function(panel, i){
    return {
      panel: panel,
      viewport: panel.querySelector('.panel-viewport'),
      content: panel.querySelector('.panel-content'),
      isFirst: i === 0,
      isLast: i === panelEls.length - 1,
      contentExtra: 0,
      entranceV: 0,
      docTop: 0,
      totalH: 0,
      active: null, // tri-state cache so we only touch style props when they actually change
      revealed: false,
      revealEls: Array.prototype.slice.call(panel.querySelectorAll('.rv, .rv-l, .rv-r, .rv-scale, .rv-btn'))
    };
  });

  function vh(){
    return window.visualViewport ? window.visualViewport.height : window.innerHeight;
  }

  function measure(){
    var V = vh();
    data.forEach(function(d){
      var contentH = d.content.offsetHeight;
      d.contentExtra = Math.max(0, contentH - V);
      d.entranceV = d.isFirst ? 0 : V;
      var holdV = d.isLast ? 0 : V;
      var newH = d.entranceV + d.contentExtra + holdV;
      if (Math.abs(newH - d.totalH) > 1){
        d.totalH = newH;
        d.panel.style.height = d.totalH + 'px';
      }
    });
    // Second pass: only now that every panel's height has been applied
    // and layout has settled do we read back each panel's real position
    // in the document. This was missing entirely — docTop silently stayed
    // at its initial value of 0 for every panel, forever, which made the
    // active/inactive check meaningless (every panel compared scroll
    // position against the wrong reference point and could all end up
    // "active" simultaneously — the actual cause of the white flash).
    data.forEach(function(d){
      d.docTop = d.panel.offsetTop;
    });

    // No panel should ever be able to get stuck "active" forever because
    // the page simply doesn't have enough scroll room left for it to
    // reach its natural deactivation point (this can cascade — a short
    // footer affects the last panel, which then affects the second-to-
    // last panel's expectation of extra room too). Cap every panel's
    // effective window to whatever is actually reachable.
    var maxScrollY = Math.max(0, document.body.scrollHeight - V);
    data.forEach(function(d, i){
      var nextIsLastOrNone = d.isLast || (i + 1 >= data.length) || data[i + 1].isLast;
      var desired = nextIsLastOrNone ? d.totalH : d.totalH + V + 1;
      var reachable = maxScrollY - d.docTop;
      d.effectiveUpperBound = Math.max(0, Math.min(desired, reachable));
    });
  }

  var banners = Array.prototype.slice.call(document.querySelectorAll('.page-banner picture')).filter(function(pic){
    return !pic.querySelector('.swipe-away');
  }).map(function(pic){
    return { pic: pic, panel: pic.closest('.panel') };
  }).filter(function(b){ return b.panel; });

  var swipers = Array.prototype.slice.call(document.querySelectorAll('.swipe-away')).map(function(el){
    return { el: el, panel: el.closest('.panel') };
  }).filter(function(s){ return s.panel; });

  function clamp(n, lo, hi){ return n < lo ? lo : (n > hi ? hi : n); }

  // Content only ever moves for two reasons: revealing content taller
  // than one screen, and staying frozen (once fully revealed) through
  // the hold phase while the next panel's entrance covers it. It never
  // moves during its own entrance — see clipFor().
  function contentOffsetFor(d, p){
    var K = d.entranceV + d.contentExtra;
    if (p <= d.entranceV){
      return 0;
    } else if (p <= K){
      return -(p - d.entranceV);
    } else {
      return -d.contentExtra; // hold: stay put — position:fixed already keeps this pinned exactly, no drift to compensate for
    }
  }

  // Reveal bottom-up during entrance by clipping the content, not moving
  // it — so whatever's genuinely behind (the still-fixed previous panel)
  // shows through the clipped region instead of empty space. Clip insets
  // are relative to the content's own full box, so tall content also
  // needs its bottom clipped to the same one-screen window.
  function clipFor(d, p, V){
    if (d.entranceV <= 0 || p >= d.entranceV) return '';
    var hiddenTop = V - p;
    return 'inset(' + hiddenTop.toFixed(1) + 'px 0 ' + d.contentExtra.toFixed(1) + 'px 0)';
  }

  function setActive(d, isActive, V){
    if (d.active === isActive) return;
    d.active = isActive;
    if (isActive){
      d.viewport.style.position = 'fixed';
      d.viewport.style.top = '0';
      d.viewport.style.left = '0';
      d.viewport.style.right = '0';
      d.viewport.style.height = V + 'px';
    } else {
      d.viewport.style.position = 'absolute';
      d.viewport.style.top = '-99999px';
      d.viewport.style.left = '0';
      d.viewport.style.right = '0';
    }
  }

  function onScroll(){
    var scrollY = window.scrollY || window.pageYOffset;
    var V = vh();

    data.forEach(function(d, i){
      // A panel needs to be fixed (in play) any time scroll is close
      // enough that it could be visible: from one screen before its own
      // range starts (so it's ready the instant its entrance begins)
      // through the end of its own range.
      var rawP = scrollY - d.docTop;
      var upperBound = d.effectiveUpperBound !== undefined ? d.effectiveUpperBound : d.totalH;
      if (d.isLast){
        // Plain static content now (see CSS) — just reveal it once it's
        // genuinely on screen, using its real (unmanipulated) position.
        if (!d.revealed && d.revealEls.length){
          var rect = d.panel.getBoundingClientRect();
          if (rect.top < V * 0.85){
            d.revealed = true;
            d.revealEls.forEach(function(el){ el.classList.add('in'); });
          }
        }
        return;
      }

      var isActive = rawP > -V - 1 && rawP < upperBound;
      setActive(d, isActive, V);
      if (!isActive){
        // Safety net: if we've scrolled completely past this panel
        // without it ever having been revealed (which should be rare,
        // but timing edge cases around deferred re-measures shouldn't
        // ever leave real content permanently invisible), reveal it now.
        if (!d.revealed && rawP >= upperBound && d.revealEls.length){
          d.revealed = true;
          d.revealEls.forEach(function(el){ el.classList.add('in'); });
        }
        return;
      }

      var p = clamp(rawP, 0, d.totalH);
      d.content.style.transform = 'translateY(' + contentOffsetFor(d, p).toFixed(1) + 'px)';
      d.content.style.clipPath = clipFor(d, p, V);

      var next = data[i + 1];
      if (next && !next.isLast){
        var pNext = clamp(scrollY - next.docTop, 0, next.totalH);
        var coverAmount = next.entranceV > 0 ? clamp(pNext / next.entranceV, 0, 1) : 0;
        if (coverAmount > 0.005){
          d.content.style.filter = 'brightness(' + (1 - coverAmount * 0.88).toFixed(3) + ')';
        } else if (d.content.style.filter !== ''){
          d.content.style.filter = '';
        }
      }

      if (!d.revealed && d.revealEls.length){
        var revealAt = d.entranceV > 0 ? Math.min(d.entranceV * 0.4, d.totalH * 0.5) : 0;
        if (p >= revealAt){
          d.revealed = true;
          d.revealEls.forEach(function(el){ el.classList.add('in'); });
        }
      }
    });

    banners.forEach(function(b){
      var d = data[panelEls.indexOf(b.panel)];
      if (!d || d.active !== true) return;
      var p = clamp(scrollY - d.docTop, 0, d.totalH);
      var progress = d.totalH > 0 ? p / d.totalH : 0;
      var shift = (progress - 0.5) * 36;
      var scale = 1.0 + progress * 0.08;
      b.pic.style.transform = 'translateY(' + shift.toFixed(1) + 'px) scale(' + scale.toFixed(4) + ')';
    });

    swipers.forEach(function(s){
      var idx = panelEls.indexOf(s.panel);
      var d = data[idx];
      var next = data[idx + 1];
      var coverAmount = 0;
      if (d && next){
        var pNext = clamp(scrollY - next.docTop, 0, next.totalH);
        coverAmount = next.entranceV > 0 ? clamp(pNext / next.entranceV, 0, 1) : 0;
      }
      s.el.style.transform = 'translateX(-' + (coverAmount * 80).toFixed(1) + '%)';
    });
  }

  var ticking = false;
  function requestTick(){
    if (!ticking){
      requestAnimationFrame(function(){ onScroll(); ticking = false; });
      ticking = true;
    }
  }

  var lastScrollAt = 0;
  window.addEventListener('scroll', function(){ lastScrollAt = Date.now(); requestTick(); }, {passive:true});

  var pendingRemeasure = null;
  function safeMeasure(){
    var sinceScroll = Date.now() - lastScrollAt;
    if (sinceScroll < 250){
      clearTimeout(pendingRemeasure);
      pendingRemeasure = setTimeout(safeMeasure, 250 - sinceScroll + 20);
      return;
    }
    measure();
    requestTick();
  }

  var resizeTimer;
  function onResize(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(safeMeasure, 150);
  }

  document.querySelectorAll('.panel img').forEach(function(img){
    if (!img.complete){
      img.addEventListener('load', function(){ safeMeasure(); }, {once:true});
    }
  });

  var roTimer;
  if ('ResizeObserver' in window){
    var ro = new ResizeObserver(function(){
      clearTimeout(roTimer);
      roTimer = setTimeout(safeMeasure, 150);
    });
    data.forEach(function(d){ ro.observe(d.content); });
  }

  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  if (document.fonts && document.fonts.ready){
    document.fonts.ready.then(safeMeasure);
  }
  window.addEventListener('load', safeMeasure);

  [500, 1500].forEach(function(delay){
    setTimeout(safeMeasure, delay);
  });

  measure();
  document.documentElement.classList.add('panels-ready');
  onScroll();

})();
