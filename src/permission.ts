import router from './router';
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getAccessToken } from '@/utils/token';
import { isPathMatch } from '@/utils/validate';
import useUserStore from '@/store/modules/user';
import useSettingsStore from '@/store/modules/settings';
import useRouteStore from '@/store/modules/route';
import { tr } from 'element-plus/es/locales.mjs';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/register'];

const isWhiteList = (path: string): boolean => {
    return whiteList.some((pattern: string) => isPathMatch(pattern, path));
};

router.beforeEach(async (to, from) => {
    NProgress.start();
    console.log(from, to);
    if (!getAccessToken()) {
        try {
            console.log('刷新token');
            await useUserStore().refresh();
        } catch (error) {
            console.log(error);
            return { path: `/login?redirect=${to.fullPath}` };
        }
    }
    if (getAccessToken()) {
        to.meta.title && useSettingsStore().setTitle(to.meta.title as string);
        /* has token*/
        if (to.path === '/login') {
            return { path: '/' };
        } else if (isWhiteList(to.path)) {
            return { path: to.path };
        } else {
            if (useUserStore().roles.length === 0) {
                // 判断当前用户是否已拉取完user_info信息
                try {
                    await useUserStore().getInfo();
                    if (useUserStore().roles.length === 0) {
                        return { path: '/error?msg=当前用户未分配权限，请联系管理员' };
                    } else {
                        await useRouteStore().generateRoutes();
                        console.log(to);
                        return { ...to, replace: true };
                    }
                } catch (err: any) {
                    try {
                        await useUserStore().logOut();
                    } catch (error) {}
                    return { path: '/login' };
                }
            } else {
                return { path: to.path };
            }
        }
    } else {
        // 没有token
        if (isWhiteList(to.path)) {
            // 在免登录白名单，直接进入
            return { path: to.path };
        } else {
            return { path: `/login?redirect=${to.fullPath}` }; // 否则全部重定向到登录页
        }
    }
});

router.afterEach(() => {
    console.log('afterEach');
    NProgress.done();
});
