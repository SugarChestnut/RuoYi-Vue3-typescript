import router from './router';
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getAccessToken } from '@/utils/auth';
import { isHttp, isPathMatch } from '@/utils/validate';
import useUserStore from '@/store/modules/user';
import useSettingsStore from '@/store/modules/settings';
import useRouteStore from '@/store/modules/route';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/register'];

const isWhiteList = (path: string): boolean => {
    return whiteList.some((pattern: string) => isPathMatch(pattern, path));
};

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (getAccessToken()) {
        to.meta.title && useSettingsStore().setTitle(to.meta.title as string);
        /* has token*/
        if (to.path === '/login') {
            next({ path: '/' });
            NProgress.done();
        } else if (isWhiteList(to.path)) {
            next();
        } else {
            if (useUserStore().roles.length === 0) {
                // 判断当前用户是否已拉取完user_info信息
                useUserStore()
                    .getInfo()
                    .then(() => {
                        if (useUserStore().roles.length === 0) {
                            next('/error?msg=当前用户未分配权限，请联系管理员');
                        } else {
                            useRouteStore()
                                .generateRoutes()
                                .then(() => {
                                    next({ ...to, replace: true });
                                });
                        }
                    })
                    .catch((err: any) => {
                        useUserStore()
                            .logOut()
                            .then(() => {
                                ElMessage.error(err as string);
                                next({ path: '/' });
                            });
                    });
            } else {
                next();
            }
        }
    } else {
        // 没有token
        if (isWhiteList(to.path)) {
            // 在免登录白名单，直接进入
            next();
        } else {
            next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
