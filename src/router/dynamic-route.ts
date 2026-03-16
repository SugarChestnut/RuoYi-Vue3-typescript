// 动态路由，基于用户权限动态去加载
import Layout from '@/layout/index.vue';
import { tr } from 'element-plus/es/locales.mjs';
import type { RouteRecordRaw } from 'vue-router';

export const dynamicRoutes: RouteRecordRaw[] = [
    {
        path: '/system/user-auth',
        component: Layout,
        children: [
            {
                path: 'role/:userId(\\d+)',
                component: () => import('@/views/system/user/authRole.vue'),
                name: 'AuthRole',
                meta: {
                    title: '分配角色',
                    activeMenu: '/system/user',
                    hidden: true,
                },
            },
        ],
        meta: {
            hidden: true,
            permissions: ['system:role:edit'],
        },
    },
    {
        name: 'role-auth',
        path: '/system/role-auth',
        component: Layout,
        children: [
            {
                path: 'user/:roleId(\\d+)/:roleName',
                component: () => import('@/views/system/role/AuthUser.vue'),
                name: 'AuthUser',
                meta: {
                    title: '分配用户',
                    activeMenu: '/system/role',
                    hidden: true,
                },
            },
        ],
        meta: {
            hidden: true,
            permissions: ['system:role:edit'],
        },
    },
    /**
     * 动态路由，匹配所有路径，并将匹配的内容放在 route.params.pathMatch 中
     */
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/error/404.vue'),
        meta: {
            hidden: true,
        },
    },
];
