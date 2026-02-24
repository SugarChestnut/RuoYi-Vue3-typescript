import request from '@/utils/request';
import type { SysMenu, Result } from '@/types';

// 获取路由
export const getRouters = (): Promise<Result<SysMenu[]>> => {
    return request({
        url: '/system/menu/tree',
        method: 'get',
    });
};
