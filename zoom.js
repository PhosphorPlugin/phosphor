/* Click a screenshot to see it full size, in a little pop-up window. Arrow keys step through the page's pictures; Esc closes. */
(function () {
  var pics = [].slice.call(document.querySelectorAll('img.shot, .thumbs img'));
  if (!pics.length) return;

  function caption(img) {
    var box = img.parentNode, b = box && box.querySelector && box.querySelector('b');
    return img.alt || (b ? b.textContent : '') || 'Screenshot';
  }

  // the pop-up carries its own look, so it works even if an older style.css is still cached
  var st = document.createElement('style');
  st.textContent =
    '.zoomable{cursor:zoom-in}' +
    '.zoomable:hover{border-color:#ef7f12!important}' +
    '.zoomable:focus-visible{outline:2px solid #ef7f12;outline-offset:2px}' +
    'html.zooming{overflow:hidden}' +
    '.zoom{position:fixed;inset:0;z-index:100;background:rgba(6,26,46,.82);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '.zoom[hidden]{display:none}' +
    '.zwin{background:#fff;border:1px solid #061a2e;border-radius:7px 7px 3px 3px;box-shadow:0 0 0 4px rgba(120,170,220,.25),0 10px 40px rgba(0,0,0,.6);' +
    '  max-width:min(1280px,100%);max-height:100%;display:flex;flex-direction:column;overflow:hidden}' +
    '.zbar{display:flex;align-items:center;gap:10px;padding:5px 6px 5px 10px;background:linear-gradient(#2f6aa3,#0b3a6a);color:#fff;font:bold 11px Verdana,sans-serif}' +
    '.zbar span{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.zx{font:bold 15px/1 Verdana,sans-serif;width:22px;height:20px;padding:0;color:#fff;background:linear-gradient(#e8745a,#b83a1e);border:1px solid #7a1f0c;border-radius:3px;cursor:pointer}' +
    '.zpic{padding:8px;background:#eef2f6;min-height:0;display:flex}' +
    '.zpic img{display:block;max-width:100%;max-height:calc(100vh - 120px);margin:auto;border:1px solid #9fb0c2;background:#000}' +
    '.zfoot{display:flex;align-items:center;gap:8px;padding:6px 8px;border-top:1px solid #d3dbe4;background:linear-gradient(#f4f7fa,#dde5ee);font-size:11px;color:#445}' +
    '.zfoot .zcount{flex:1;text-align:center}';
  document.head.appendChild(st);

  var box = document.createElement('div');
  box.className = 'zoom';
  box.hidden = true;
  box.innerHTML =
    '<div class="zwin" role="dialog" aria-modal="true" aria-labelledby="ztitle">' +
      '<div class="zbar"><span id="ztitle"></span><button type="button" class="zx" aria-label="Close">&times;</button></div>' +
      '<div class="zpic"><img alt=""></div>' +
      '<div class="zfoot"><button type="button" class="go zprev">&laquo; Back</button>' +
        '<span class="zcount"></span>' +
        '<button type="button" class="go znext">Next &raquo;</button></div>' +
    '</div>';
  document.body.appendChild(box);

  var big = box.querySelector('.zpic img'), title = box.querySelector('#ztitle'), count = box.querySelector('.zcount');
  var at = 0, lastFocus = null;

  function show(i) {
    at = (i + pics.length) % pics.length;
    var p = pics[at];
    big.src = p.currentSrc || p.src;
    big.alt = p.alt;
    title.textContent = caption(p);
    count.textContent = 'Picture ' + (at + 1) + ' of ' + pics.length;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    document.documentElement.classList.add('zooming');
    box.querySelector('.zx').focus();
  }
  function close() {
    box.hidden = true;
    big.removeAttribute('src');
    document.documentElement.classList.remove('zooming');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  pics.forEach(function (p, i) {
    p.classList.add('zoomable');
    p.title = 'Click to enlarge';
    p.tabIndex = 0;
    p.setAttribute('role', 'button');
    p.addEventListener('click', function () { open(i); });
    p.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  box.querySelector('.zx').onclick = close;
  box.querySelector('.zprev').onclick = function () { show(at - 1); };
  box.querySelector('.znext').onclick = function () { show(at + 1); };
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(at - 1);
    else if (e.key === 'ArrowRight') show(at + 1);
  });
})();
