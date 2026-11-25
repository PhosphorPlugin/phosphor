/* Click a screenshot to see it full size, in a little pop-up window. Arrow keys step through the page's pictures; Esc closes. */
(function () {
  var pics = [].slice.call(document.querySelectorAll('img.shot, .thumbs img'));
  if (!pics.length) return;

  function caption(img) {
    var box = img.parentNode, b = box && box.querySelector && box.querySelector('b');
    return img.alt || (b ? b.textContent : '') || 'Screenshot';
  }

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
