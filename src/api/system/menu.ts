import request from '@/utils/request';
import type { MenuQueryParams, SysMenu, Result } from '@/types';

// 新增菜单
export function createMenu(data: SysMenu): Promise<Result> {
    return request({
        url: '/system/menu/create',
        method: 'post',
        data: data,
    });
}

// 修改菜单
export function editMenu(data: SysMenu): Promise<Result> {
    return request({
        url: '/system/menu/edit',
        method: 'post',
        data: data,
    });
}

// 删除菜单
export function delMenu(menuId: number): Promise<Result> {
    return request({
        url: '/system/menu/delete/' + menuId,
        method: 'post',
    });
}

// 获取菜单树
export const getRouters = (): Promise<Result<SysMenu[]>> => {
    return request({
        url: '/system/menu/route',
        method: 'get',
    });
};

// 获取菜单树
export const getTree = (data: MenuQueryParams): Promise<Result<SysMenu[]>> => {
    return request({
        url: '/system/menu/tree',
        method: 'post',
        data: data,
    });
};
