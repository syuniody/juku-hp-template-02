/* ===================================
   Main JS — ハンバーガー・スムーススクロール・スライダー
   Template 02: Blue
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
  initHamburgerMenu();
  initSmoothScroll();
  initSlider();
});

/* --- ハンバーガーメニュー --- */
function initHamburgerMenu() {
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    const isOpen = btn.classList.toggle('is-active');
    menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      btn.classList.remove('is-active');
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      btn.classList.remove('is-active');
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* --- スムーススクロール --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = document.querySelector('.header')
        ? document.querySelector('.header').offsetHeight
        : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
}

/* --- スライダー --- */
function initSlider() {
  var track = document.querySelector('.slider__track');
  var slides = document.querySelectorAll('.slider__slide');
  var prev = document.querySelector('.slider__prev');
  var next = document.querySelector('.slider__next');
  var dotsWrap = document.querySelector('.slider__dots');
  if (!track || slides.length === 0) return;

  var current = 0;
  var total = slides.length;
  var autoInterval;

  // ドット生成
  if (dotsWrap) {
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'slider__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', '写真 ' + (i + 1));
      dot.dataset.index = i;
      dotsWrap.appendChild(dot);
    }
    dotsWrap.addEventListener('click', function (e) {
      if (e.target.classList.contains('slider__dot')) {
        goToSlide(parseInt(e.target.dataset.index));
        resetAuto();
      }
    });
  }

  function goToSlide(n) {
    current = ((n % total) + total) % total;
    track.style.transform = 'translateX(-' + current * 100 + '%)';
    var dots = document.querySelectorAll('.slider__dot');
    dots.forEach(function (d, idx) {
      d.classList.toggle('is-active', idx === current);
    });
  }

  if (prev) prev.addEventListener('click', function () { goToSlide(current - 1); resetAuto(); });
  if (next) next.addEventListener('click', function () { goToSlide(current + 1); resetAuto(); });

  // タッチ・ドラッグ
  var startX = 0, isDrag = false;
  track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goToSlide(current + (diff > 0 ? 1 : -1)); resetAuto(); }
  });
  track.addEventListener('mousedown', function (e) { startX = e.clientX; isDrag = true; });
  track.addEventListener('mouseup', function (e) {
    if (!isDrag) return; isDrag = false;
    var diff = startX - e.clientX;
    if (Math.abs(diff) > 40) { goToSlide(current + (diff > 0 ? 1 : -1)); resetAuto(); }
  });
  track.addEventListener('mouseleave', function () { isDrag = false; });

  // 自動再生
  function startAuto() { autoInterval = setInterval(function () { goToSlide(current + 1); }, 4000); }
  function resetAuto() { clearInterval(autoInterval); startAuto(); }
  startAuto();
}
