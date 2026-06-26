/* ============================================================
   教案页交互：滚动渐入 / 渐出、阅读进度条、名词云依次浮现
   ============================================================ */
(function () {
  /* ---------- 阅读进度条 ---------- */
  const bar = document.querySelector('.lesson-progress');
  function updateProgress() {
    if (!bar) return;
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const total = h.scrollHeight - h.clientHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- 滚动渐入 / 渐出 ---------- */
  const items = Array.from(document.querySelectorAll('.reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          el.classList.remove('is-leaving');
        } else if (el.classList.contains('is-visible')) {
          // 已显示过的元素离开视口顶部时轻微淡出（旧内容渐出）
          const rect = entry.boundingClientRect;
          if (rect.top < 0) {
            el.classList.add('is-leaving');
          }
        }
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );
  items.forEach((el) => io.observe(el));

  /* ---------- 名词云：进入视口后依次浮现 ---------- */
  const cloud = document.querySelector('.term-cloud');
  if (cloud) {
    const terms = Array.from(cloud.querySelectorAll('.term'));
    terms.forEach((t) => (t.style.animationPlayState = 'paused'));
    const cloudIO = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          terms.forEach((t, i) => {
            t.style.animationDelay = (i * 0.07).toFixed(2) + 's';
            t.style.animationPlayState = 'running';
          });
          obs.disconnect();
        });
      },
      { threshold: 0.3 }
    );
    cloudIO.observe(cloud);
  }

  /* ---------- 列表卡片：鼠标位置光晕 ---------- */
  document.querySelectorAll('.lesson-link-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
    });
  });
})();
