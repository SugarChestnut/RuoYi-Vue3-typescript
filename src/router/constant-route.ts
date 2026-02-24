// 公共路由
import Layout from '@/layout/index.vue';
import type { RouteRecordRaw } from 'vue-router';

export const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/redirect',
        component: Layout,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index.vue'),
            },
        ],
        meta: {
            hidden: true,
        },
    },
    {
        path: '/login',
        component: () => import('@/views/login.vue'),
        meta: {
            hidden: true,
        },
    },
    {
        path: '/register',
        component: () => import('@/views/register.vue'),
        meta: {
            hidden: true,
        },
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/error/404.vue'),
        meta: {
            hidden: true,
        },
    },
    {
        path: '/401',
        component: () => import('@/views/error/401.vue'),
        meta: {
            hidden: true,
        },
    },
    {
        path: '',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: '/index',
                component: () => import('@/views/index.vue'),
                name: 'Index',
                meta: { title: '首页', icon: 'dashboard', affix: true },
            },
        ],
    },
    {
        path: '/user',
        component: Layout,
        meta: {
            hidden: true,
        },
        redirect: 'noredirect',
        children: [
            {
                path: 'profile/:activeTab?',
                component: () => import('@/views/system/user/profile/index.vue'),
                name: 'Profile',
                meta: { title: '个人中心', icon: 'user' },
            },
        ],
    },
];
