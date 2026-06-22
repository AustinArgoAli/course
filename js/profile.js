/* ============================================================
   个人中心数据层：头像 / 充值 / 收藏
   ------------------------------------------------------------
   当前：本地模拟模式（数据存浏览器 localStorage），无需后端。
   后期上线：把下面标注【后期替换】的函数体改成调用你的
            云服务器 / 数据库 / 支付接口（fetch 请求）即可，
            页面其它代码不用动。
   依赖：auth.js（需要先于本文件加载，用于获取当前用户）。
   ============================================================ */

const PROFILE = (() => {
  /** 个人资料按用户邮箱分别存储，key 形如 afe.profile.<email> */
  function keyFor(email) {
    return 'afe.profile.' + email;
  }

  /** 默认资料结构 */
  function emptyProfile() {
    return {
      avatar: '', // 头像 dataURL 或图片地址，空表示用默认占位
      balance: 0, // 账户余额（元）
      favorites: [], // 收藏的视频 id 数组
    };
  }

  /** 读取当前登录用户的资料，未登录返回 null */
  function getProfile() {
    const user = AUTH.getUser();
    if (!user) return null;
    try {
      const raw = localStorage.getItem(keyFor(user.email));
      if (!raw) return { ...emptyProfile(), email: user.email };
      return { ...emptyProfile(), ...JSON.parse(raw), email: user.email };
    } catch {
      return { ...emptyProfile(), email: user.email };
    }
  }

  /** 内部：保存资料 */
  function save(profile) {
    const user = AUTH.getUser();
    if (!user) return;
    const { email, ...data } = profile; // email 不入库，避免冗余
    localStorage.setItem(keyFor(user.email), JSON.stringify(data));
  }

  /* ---------------- 个人头像接口 ---------------- */

  /**
   * 【后期替换】更新头像。
   * 当前：把本地选择的图片（dataURL）直接存浏览器。
   * 上线：改为上传文件到对象存储，拿到返回的 URL 后保存，例如：
   *   const url = await uploadToCOS(file);
   *   ...保存 url...
   */
  async function setAvatar(dataUrl) {
    const profile = getProfile();
    if (!profile) return { error: '请先登录' };
    profile.avatar = dataUrl;
    save(profile);
    return { error: null, avatar: dataUrl };
  }

  /* ---------------- 个人充值接口 ---------------- */

  /**
   * 【后期替换】充值。
   * 当前：本地直接给余额加钱（仅供体验）。
   * 上线：改为调用支付接口，支付成功回调后再增加余额，例如：
   *   const ok = await createPayOrder(amount);
   *   if (!ok) return { error: '支付失败' };
   */
  async function recharge(amount) {
    const profile = getProfile();
    if (!profile) return { error: '请先登录' };
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      return { error: '请输入有效的充值金额' };
    }
    profile.balance = Math.round((profile.balance + value) * 100) / 100;
    save(profile);
    return { error: null, balance: profile.balance };
  }

  /* ---------------- 收藏接口 ---------------- */

  /** 是否已收藏 */
  function isFavorite(videoId) {
    const profile = getProfile();
    return !!profile && profile.favorites.includes(String(videoId));
  }

  /** 获取收藏的视频 id 列表 */
  function getFavorites() {
    const profile = getProfile();
    return profile ? profile.favorites.slice() : [];
  }

  /**
   * 【后期替换】切换收藏状态，返回切换后的状态。
   * 上线：改为 POST/DELETE /api/favorites/:videoId。
   */
  async function toggleFavorite(videoId) {
    const profile = getProfile();
    if (!profile) return { error: '请先登录' };
    const id = String(videoId);
    const idx = profile.favorites.indexOf(id);
    if (idx >= 0) profile.favorites.splice(idx, 1);
    else profile.favorites.push(id);
    save(profile);
    return { error: null, favorited: idx < 0 };
  }

  return {
    getProfile,
    setAvatar,
    recharge,
    isFavorite,
    getFavorites,
    toggleFavorite,
  };
})();
