// 公共路由
import Layout from '@/layout/index.vue';
import type { RouteRecordRaw } from 'vue-router';

export const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login.vue'),
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
                component: () => import('@/views/index.vue'),
                meta: { title: '首页', icon: 'dashboard', affix: true, fullPath: '/index' },
            },
        ],
        meta: {
            hidden: true,
        },
    },
    /**
     * 系统管理
     */
    // {
    //     path: '/system',
    //     name: 'System',
    //     component: Layout,
    //     redirect: '/system/user',
    //     meta: {
    //         menuName: '系统管理',
    //         icon: 'system',
    //     },
    //     children: [
    //         {
    //             path: 'user',
    //             name: 'SystemUser',
    //             component: () => import('@/views/system/user/index.vue'),
    //             meta: {
    //                 title: '用户管理',
    //                 fullPath: '/system/user',
    //             },
    //         },
    //         {
    //             path: 'menu',
    //             name: 'SystemMenu',
    //             component: () => import('@/views/system/menu/index.vue'),
    //             meta: {
    //                 title: '菜单管理',
    //                 fullPath: '/system/menu',
    //             },
    //         },
    //         {
    //             path: 'role',
    //             name: 'SystemRole',
    //             component: () => import('@/views/system/role/index.vue'),
    //             meta: {
    //                 title: '角色管理',
    //                 fullPath: '/system/role',
    //             },
    //         },
    //     ],
    // },    
    // {
    //     path: '/redirect',
    //     name: 'Redirect',
    //     component: Layout,
    //     children: [
    //         {
    //             path: '/redirect/:path(.*)',
    //             component: () => import('@/views/redirect/index.vue'),
    //             meta: {
    //                 hidden: true,
    //             },
    //         },
    //     ],
    //     meta: {
    //         hidden: true,
    //     },
    // },
    // {
    //     path: '/user',
    //     component: Layout,
    //     meta: {
    //         hidden: true,
    //     },
    //     redirect: 'noredirect',
    //     children: [
    //         {
    //             path: 'profile/:activeTab?',
    //             component: () => import('@/views/system/user/profile/index.vue'),
    //             name: 'Profile',
    //             meta: {
    //                 menuName: '个人中心',
    //                 icon: 'user',
    //             },
    //         },
    //     ],
    // },
];
