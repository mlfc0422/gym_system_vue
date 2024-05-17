export default {
    logout(){
        // 模拟登出
        sessionStorage.removeItem('user');
    },
    loggedIn(){
        // 检查用户是否登录
        return sessionStorage.getItem('user') !== null;
    },
    login() {
        // 模拟登录
        sessionStorage.setItem('user', 'user');
    }
}