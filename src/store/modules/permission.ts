import auth from '@/plugins/auth';
import router, { constantRoutes, dynamicRoutes } from '@/router';
import type { RouteRecordRaw } from 'vue-router';
import { getRouters } from '@/api/menu';
import Layout from '@/layout/index.vue';
import ParentView from '@/components/ParentView/index.vue';
import InnerLink from '@/layout/components/InnerLink/index.vue';
import { SysMenu } from '@/types';
import { isHttp } from '@/utils/validate';

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue');

const usePermissionStore = defineStore('permission', {
    state: () => ({
        routes: [] as RouteRecordRaw[],
        addRoutes: [] as RouteRecordRaw[],
        defaultRoutes: [] as RouteRecordRaw[],
        topbarRouters: [] as RouteRecordRaw[],
        sidebarRouters: [] as RouteRecordRaw[],
    }),
    actions: {
        setRoutes(routes: RouteRecordRaw[]) {
            this.addRoutes = routes;
            this.routes = constantRoutes.concat(routes);
        },
        setDefaultRoutes(routes: RouteRecordRaw[]) {
            this.defaultRoutes = constantRoutes.concat(routes);
        },
        setTopbarRoutes(routes: RouteRecordRaw[]) {
            this.topbarRouters = routes;
        },
        setSidebarRouters(routes: RouteRecordRaw[]) {
            this.sidebarRouters = constantRoutes.concat(routes);
        },
        generateRoutes(): Promise<void> {
            return new Promise((resolve, reject) => {
                // 向后端请求路由数据
                getRouters().then((res) => {
                    if (res.flag) {
                        this.setSidebarRouters(filterChildren(res.data));
                        this.setDefaultRoutes(filterChildren(res.data));
                        this.setTopbarRoutes(filterChildren(res.data));
                        addDynamicRoute(dynamicRoutes);
                        const rewriteRoutes = filterChildren(res.data, false, true);
                        this.setRoutes(rewriteRoutes);
                        rewriteRoutes.forEach((route: any) => {
                            if (!isHttp(route.path)) {
                                router.addRoute(route); // 动态添加可访问路由表
                            }
                        });
                        resolve();
                    } else {
                        reject(res.msg);
                    }
                });
            });
        },
    },
});

// 将组件为 ParentView 的子组件提级，移除当前组件
function filterChildren(menus?: SysMenu[], lateMenu: any = false, type: boolean = false): RouteRecordRaw[] {
    var routes: RouteRecordRaw[] = [];
    if (menus && menus.length) {
        menus.forEach((menu) => {
            // if (type) {
            //     menu.path = lateMenu ? lateMenu.path + '/' + menu.path : menu.path;
            // }
            const childrenRoute = filterChildren(menu.children, menu, type);
            if (type && menu.component === 'ParentView' && childrenRoute && childrenRoute.length) {
                routes.concat(childrenRoute);
            } else {
                var component;
                if (menu.component) {
                    // Layout ParentView 组件特殊处理
                    if (menu.component === 'Layout') {
                        component = Layout;
                    } else if (menu.component === 'ParentView') {
                        component = ParentView;
                    } else if (menu.component === 'InnerLink') {
                        component = InnerLink;
                    } else {
                        component = loadView(menu.component);
                    }
                }
                routes.push({
                    name: menu.routeName,
                    path: menu.path || '',
                    component: component,
                    redirect: 'noredirect',
                    children: childrenRoute,
                    meta: {
                        menuName: menu.menuName,
                        query: menu.query,
                        isFrame: menu.isFrame,
                        isCahce: menu.isCache,
                        visiable: menu.visible,
                        permission: menu.permission,
                        icon: menu.icon,
                        hidden: false
                    },
                });
            }
        });
    }

    return routes;
}

// 添加动态路由遍历，验证是否具备权限
export function addDynamicRoute(routes: RouteRecordRaw[]) {
    routes.forEach((route) => {
        if (route.meta && route.meta.permissions) {
            if (auth.hasPermiOr(route.meta.permissions)) {
                router.addRoute(route);
            }
        }
    });
}

export const loadView = (view: string): any => {
    let res;
    for (const path in modules) {
        const dir = path.split('views/')[1];
        if (dir === view) {
            res = () => modules[path]();
        }
    }
    return res;
};

export default usePermissionStore;
