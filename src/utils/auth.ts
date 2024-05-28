export default {
    userLogout() {
        // 模拟登出
        sessionStorage.removeItem('user');
    },
    userLoggedIn() {
        // 检查用户是否登录
        return sessionStorage.getItem('user') !== null;
    },
    userLogin() {
        // 模拟登录
        sessionStorage.setItem('user', 'user');
    },
    rootLogout() {
        // 模拟登出
        sessionStorage.removeItem('root');
    },
    rootLoggedIn() {
        // 检查用户是否登录
        return sessionStorage.getItem('root') !== null;
    },
    rootLogin() {
        // 模拟登录
        sessionStorage.setItem('root', 'root');
    }
}