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
                path: 'user/:roleId(\\d+)',
                component: () => import('@/views/system/role/authUser.vue'),
                name: 'AuthUser',
                meta: {
                    title: '分配用户',
                    activeMenu: '/system/role',
                },
            },
        ],
        meta: {
            hidden: true,
            permissions: ['system:role:edit'],
        },
    },
    {
        path: '/system/dict-data',
        component: Layout,
        children: [
            {
                path: 'index/:dictId(\\d+)',
                component: () => import('@/views/system/dict/data.vue'),
                name: 'Data',
                meta: { title: '字典数据', activeMenu: '/system/dict' },
            },
        ],
        meta: {
            hidden: true,
            permissions: ['system:dict:list'],
        },
    },
    {
        path: '/monitor/job-log',
        component: Layout,
        children: [
            {
                path: 'index/:jobId(\\d+)',
                component: () => import('@/views/monitor/job/log.vue'),
                name: 'JobLog',
                meta: { title: '调度日志', activeMenu: '/monitor/job' },
            },
        ],
        meta: {
            hidden: true,
            permissions: ['monitor:job:list'],
        },
    },
    {
        path: '/tool/gen-edit',
        component: Layout,
        children: [
            {
                path: 'index/:tableId(\\d+)',
                component: () => import('@/views/tool/gen/editTable.vue'),
                name: 'GenEdit',
                meta: { title: '修改生成配置', activeMenu: '/tool/gen' },
            },
        ],
        meta: {
            hidden: true,
            permissions: ['tool:gen:edit'],
        },
    },
];
