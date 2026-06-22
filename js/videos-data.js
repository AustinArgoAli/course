/* ============================================================
   视频列表数据与渲染
   ------------------------------------------------------------
   当前：使用下面的本地示例数据。
   后期上线：把 VIDEOS 改为从你的云数据库接口获取，例如：
     const VIDEOS = await fetch('/api/videos').then(r => r.json());
   渲染逻辑保持不变。
   封面/视频文件后期换成你自己的素材或对象存储 + CDN 链接即可。
   ============================================================ */

const VIDEOS = [
  {
    id: '1',
    title: 'AI 入门第一课：认识大模型',
    description: '从零理解什么是大模型，它能做什么、不能做什么。',
    duration: '12:30',
    tag: '入门',
    cover:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    title: '用 AI 提升 10 倍工作效率',
    description: '把日常重复工作交给 AI，手把手演示真实工作流。',
    duration: '18:45',
    tag: '实战',
    cover:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    title: '提示词工程：让 AI 听懂你',
    description: '掌握提问的艺术，输出质量提升一个量级。',
    duration: '15:10',
    tag: '技巧',
    cover:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    title: '搭建你的第一个 AI 应用',
    description: '不写复杂代码，也能做出能用的 AI 小工具。',
    duration: '24:00',
    tag: '进阶',
    cover:
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=900&q=80',
  },
];

const PLAY_ICON =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

const HEART_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.6 8.9 2 5.5 5.2 5.1 7 4.9 8.6 5.9 9.5 7.3 10.4 5.9 12 4.9 13.8 5.1 17 5.5 18.4 8.9 17 11.7 14.5 16.4 12 21 12 21z"/></svg>';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

function renderVideos() {
  // 显示当前用户邮箱
  const user = AUTH.getUser();
  const emailEl = document.querySelector('[data-user-email]');
  if (emailEl && user) emailEl.textContent = user.email;

  const grid = document.querySelector('[data-video-grid]');
  if (!grid) return;

  const canFav = typeof PROFILE !== 'undefined' && AUTH.getUser();

  grid.innerHTML = VIDEOS.map((v) => {
    const faved = canFav && PROFILE.isFavorite(v.id);
    const favBtn = canFav
      ? `<button class="fav-btn ${faved ? 'active' : ''}" data-fav="${escapeHtml(
          v.id,
        )}" title="${faved ? '取消收藏' : '收藏'}">${HEART_ICON}</button>`
      : '';
    return `
    <article class="card video-card">
      <div class="video-thumb">
        <img src="${escapeHtml(v.cover)}" alt="${escapeHtml(v.title)}" />
        <div class="thumb-overlay"></div>
        <div class="play"><span>${PLAY_ICON}</span></div>
        ${favBtn}
        <span class="tag">${escapeHtml(v.tag)}</span>
        <span class="duration">${escapeHtml(v.duration)}</span>
      </div>
      <div class="video-body">
        <h3>${escapeHtml(v.title)}</h3>
        <p>${escapeHtml(v.description)}</p>
      </div>
    </article>
  `;
  }).join('');

  // 收藏按钮：事件委托
  grid.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-fav]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const res = await PROFILE.toggleFavorite(btn.dataset.fav);
    if (res.error) return;
    btn.classList.toggle('active', res.favorited);
    btn.title = res.favorited ? '取消收藏' : '收藏';
  });
}

document.addEventListener('DOMContentLoaded', renderVideos);
