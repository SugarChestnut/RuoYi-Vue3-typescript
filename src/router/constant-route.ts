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
    /**
     * 嵌套路由，会加载 Layout 组件，然后在 Layout 组件中加载子路由组件
     */
    {
        path: '',
        name: 'Root',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: 'Index',
                component: () => import('@/views/index.vue'),
                meta: { menuName: '首页', icon: 'dashboard', affix: true },
            },
        ],
        meta: {
            hidden: true,
        },
    },
    {
        path: '/redirect',
        name: 'Redirect',
        component: Layout,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index.vue'),
                meta: {
                    hidden: true,
                },
            },
        ],
        meta: {
            hidden: true,
        },
    },
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
