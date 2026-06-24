/* ============================================================
   通用页面逻辑：导航栏渲染、滚动效果、登录态联动
   ============================================================ */

/** 渲染导航栏右侧操作区（根据登录态变化） */
function renderNavActions() {
  const box = document.querySelector('[data-nav-actions]');
  if (!box) return;
  const user = AUTH.getUser();

  if (user) {
    // 头像：有则用用户上传的，没有则用邮箱首字母占位
    const profile = typeof PROFILE !== 'undefined' ? PROFILE.getProfile() : null;
    const initial = (user.email || '?').charAt(0).toUpperCase();
    const avatarInner =
      profile && profile.avatar
        ? `<img src="${profile.avatar}" alt="头像" />`
        : `<span>${initial}</span>`;

    box.innerHTML = `
      <a href="videos.html" class="nav-link">视频教程</a>
      <a href="profile.html" class="nav-link nav-home" title="个人主页">
        <span class="nav-avatar">${avatarInner}</span>
        <span class="hide-sm">主页</span>
      </a>
    `;
  } else {
    box.innerHTML = `
      <a href="login.html" class="nav-link">登录</a>
      <a href="login.html?mode=signup" class="btn btn-primary btn-sm" data-cta-signup>开始使用</a>
    `;
  }
}

/** 透明导航栏滚动时变实色 */
function setupNavbarScroll() {
  const nav = document.querySelector('.navbar[data-scroll-aware]');
  if (!nav) return;

  const update = () => {
    if (window.scrollY > 40) nav.classList.add('solid');
    else nav.classList.remove('solid');
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavActions();
  setupNavbarScroll();
});
