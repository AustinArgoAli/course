/* ============================================================
   认证逻辑
   ------------------------------------------------------------
   当前：本地模拟模式（账号存浏览器 localStorage），无需任何后端。
   后期上线：把下面标注【后期替换】的几个函数体改成调用你的
            云服务器 / 数据库接口（fetch 请求）即可，页面其它代码不用动。
   ============================================================ */

const AUTH = (() => {
  const USER_KEY = 'afe.user';        // 当前登录用户
  const ACCOUNTS_KEY = 'afe.accounts'; // 模拟账户库 email -> password

  function readAccounts() {
    try {
      return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}');
    } catch {
      return {};
    }
  }
  function writeAccounts(a) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a));
  }

  /** 获取当前登录用户，未登录返回 null */
  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
      return null;
    }
  }

  /** 【后期替换】注册：改为 POST /api/register */
  async function signUp(email, password) {
    email = email.trim().toLowerCase();
    const accounts = readAccounts();
    if (accounts[email]) return { error: '该邮箱已注册，请直接登录' };
    accounts[email] = password;
    writeAccounts(accounts);
    const user = { id: 'u_' + Date.now(), email };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { error: null, user };
  }

  /** 【后期替换】登录：改为 POST /api/login */
  async function signIn(email, password) {
    email = email.trim().toLowerCase();
    const accounts = readAccounts();
    if (!accounts[email]) return { error: '账号不存在，请先注册' };
    if (accounts[email] !== password) return { error: '密码不正确' };
    const user = { id: 'u_' + email, email };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { error: null, user };
  }

  /** 退出登录 */
  function signOut() {
    localStorage.removeItem(USER_KEY);
  }

  return { getUser, signUp, signIn, signOut };
})();
