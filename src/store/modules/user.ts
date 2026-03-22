import router from '@/router';
import { ElMessageBox } from 'element-plus';
import { login, logout, getInfo } from '@/api/login';
import { setAccessToken, removeToken } from '@/utils/auth';
import { isHttp, isEmpty } from '@/utils/validate';
import defAva from '@/assets/images/profile.jpg';

interface UserState {
    token?: string;
    id: string | number;
    name: string;
    avatar: string;
    roles: number[];
    permissions: string[];
}

const useUserStore = defineStore('user', {
    state: (): UserState => ({
        token: '',
        id: '',
        name: '',
        avatar: '',
        roles: [],
        permissions: [],
    }),
    actions: {
        // 登录
        login(userInfo: { username: string; password: string; code?: string; uuid?: string }) {
            const username = userInfo.username;
            const password = userInfo.password;
            const code = userInfo.code;
            const uuid = userInfo.uuid;
            return new Promise<void>((resolve, reject) => {
                login(username, password, code, uuid)
                    .then((res) => {
                        if (res.flag) {
                            setAccessToken(res.data);
                            this.token = res.data;
                            resolve();
                        } else {
                            reject(res.msg);
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        // 获取用户信息
        getInfo() {
            return new Promise((resolve, reject) => {
                getInfo()
                    .then((res) => {
                        if (res.flag) {
                            const data = res.data;
                            const user = data.user;
                            // let avatar = user.avatarUrl || '';
                            // if (!isHttp(avatar)) {
                            //     avatar = isEmpty(avatar) ? defAva : import.meta.env.VITE_APP_BASE_API + avatar;
                            // }
                            this.roles = data.roles;
                            this.permissions = data.permissions;
                            this.id = user.userId || '';
                            this.name = user.username || '';
                            this.avatar = user.avatarUrl || defAva;
                            /* 初始密码提示 */
                            if (data.isDefaultModifyPwd) {
                                ElMessageBox.confirm('您的密码还是初始密码，请修改密码！', '安全提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning',
                                })
                                    .then(() => {
                                        router.push({ name: 'Profile', params: { activeTab: 'resetPwd' } });
                                    })
                                    .catch(() => {});
                            }
                            /* 过期密码提示 */
                            if (!data.isDefaultModifyPwd && data.isPasswordExpired) {
                                ElMessageBox.confirm('您的密码已过期，请尽快修改密码！', '安全提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning',
                                })
                                    .then(() => {
                                        router.push({ name: 'Profile', params: { activeTab: 'resetPwd' } });
                                    })
                                    .catch(() => {});
                            }
                            resolve(res);
                        } else {
                            reject(res.msg);
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        // 退出系统
        logOut() {
            return new Promise<void>((resolve, reject) => {
                logout()
                    .then(() => {
                        this.token = '';
                        this.roles = [];
                        this.permissions = [];
                        removeToken();
                        resolve();
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
    },
});

export default useUserStore;
