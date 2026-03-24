import request from '@/utils/http/request';
import type { DeptQueryParams, SysDept, Result } from '@/types';

// 查询部门列表
export function listDept(data?: DeptQueryParams): Promise<Result<SysDept[]>> {
    return request({
        url: '/system/dept/search',
        method: 'post',
        data: data,
    });
}

// 新增部门
export function createDept(data: SysDept): Promise<Result> {
    return request({
        url: '/system/dept/create',
        method: 'post',
        data: data,
    });
}

// 修改部门
export function updateDept(data: SysDept): Promise<Result> {
    return request({
        url: '/system/dept/update',
        method: 'post',
        data: data,
    });
}

// 删除部门
export function delDept(deptId: number): Promise<Result> {
    return request({
        url: '/system/dept/delete/' + deptId,
        method: 'get',
    });
}
