// 动态路由，基于用户权限动态去加载
import Layout from '@/layout/index.vue';
import { tr } from 'element-plus/es/locales.mjs';
import type { RouteRecordRaw } from 'vue-router';

export const dynamicRoutes: RouteRecordRaw[] = [
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
