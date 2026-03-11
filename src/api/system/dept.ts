import request from '@/utils/request';
import type { DeptQueryParams, SysDept, Result } from '@/types';

// 查询部门列表
export function listDept(data?: DeptQueryParams): Promise<Result<SysDept[]>> {
    return request({
        url: '/system/dept/tree',
        method: 'post',
        data: data,
    });
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId: number): Promise<Result<SysDept[]>> {
    return request({
        url: '/system/dept/list/exclude/' + deptId,
        method: 'get',
    });
}

// 查询部门详细
export function getDept(deptId: number): Promise<Result<SysDept>> {
    return request({
        url: '/system/dept/' + deptId,
        method: 'get',
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
