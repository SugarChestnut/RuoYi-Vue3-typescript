// 公共路由
import Layout from '@/layout/index.vue';
import type { RouteRecordRaw } from 'vue-router';

export const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            hidden: true,
        },
    },
    {
        path: '/401',
        name: '401',
        component: () => import('@/views/error/401.vue'),
        meta: {
            hidden: true,
        },
    },
    /**
     * 嵌套路由，会加载 Layout 组件，然后在 Layout 组件中加载子路由组件
     */
    {
        path: '/',
        name: 'Root',
        component: Layout,
        redirect: 'index',
        children: [
            {
                path: 'index',
                name: 'Index',
                component: () => import('@/views/home/index.vue'),
                meta: { title: '首页', icon: 'dashboard', affix: true, fullPath: '/index' },
            },
        ],
        meta: {
            hidden: true,
        },
    },
];
