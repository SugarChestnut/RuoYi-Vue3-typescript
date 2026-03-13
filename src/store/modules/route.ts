import auth from '@/plugins/auth';
import router, { constantRoutes, dynamicRoutes } from '@/router';
import type { RouteRecordRaw } from 'vue-router';
import { getRouters } from '@/api/system/menu';
import Layout from '@/layout/index.vue';
import ParentView from '@/components/ParentView/index.vue';
import InnerLink from '@/layout/components/InnerLink/index.vue';
import { SysMenu } from '@/types';
import { isHttp } from '@/utils/validate';

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue');

const useRouteStore = defineStore('route', {
    state: () => ({
        routes: [] as RouteRecordRaw[],
        addRoutes: [] as RouteRecordRaw[],
    }),
    actions: {
        setRoutes(routes: RouteRecordRaw[]) {
            this.addRoutes = routes;
            this.routes = constantRoutes.concat(routes);
        },
        generateRoutes(): Promise<void> {
            return new Promise((resolve, reject) => {
                // 向后端请求路由数据
                getRouters().then((res) => {
                    if (res.flag) {
                        const rewriteRoutes = filterChildren(res.data);
                        this.setRoutes(rewriteRoutes);
                        rewriteRoutes.forEach((route) => {
                            router.addRoute(route); // 动态添加可访问路由表
                        });
                        dynamicRoutes.forEach((route) => {
                            router.addRoute(route); // 动态添加可访问路由表
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
function filterChildren(menus?: SysMenu[], lateMenu: any = false): RouteRecordRaw[] {
    var routes: RouteRecordRaw[] = [];
    if (menus && menus.length) {
        menus.forEach((menu) => {
            menu.fullPath = lateMenu ? concatPath(lateMenu.fullPath, menu.path) : concatPath(menu.path);
            const childrenRoute = filterChildren(menu.children, menu);
            let component;
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
                path: lateMenu ? concatPath(menu.path).slice(1) : concatPath(menu.path),
                component: component,
                children: childrenRoute,
                redirect: childrenRoute.length > 0 ? childrenRoute[0].path : undefined,
                meta: {
                    title: menu.title,
                    fullPath: menu.fullPath,
                    isFrame: menu.isFrame,
                    isCahce: menu.isCache,
                    hiddern: menu.hidden,
                    permission: menu.permission,
                    icon: menu.icon,
                },
            });
        });
    }
    return routes;
}

function concatPath(parentPath: string, childPath?: string): string {
    if (!parentPath.startsWith('/')) {
        parentPath = '/' + parentPath;
    }
    if (!childPath) {
        return parentPath;
    }
    if (parentPath.endsWith('/') && childPath.startsWith('/')) {
        return parentPath + childPath.substring(1);
    } else if (!parentPath.endsWith('/') && !childPath.startsWith('/')) {
        return parentPath + '/' + childPath;
    } else {
        return parentPath + childPath;
    }
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
    for (const path in modules) {
        const dir = path.split('views/')[1];
        if (dir === view) {
            // res = () => modules[path]();
            return modules[path];
        }
    }
};

export default useRouteStore;
