import request from '@/utils/http/request';
import type {
    RoleQueryParams,
    AuthUserQueryParams,
    SysRole,
    SysUser,
    SysUserRole,
    AuthUserSelectParams,
    Result,
    SysPage,
} from '@/types';

// 查询角色列表
export function listRole(data: RoleQueryParams): Promise<Result<SysPage<SysRole>>> {
    return request({
        url: '/system/role/search',
        method: 'post',
        data: data,
    });
}
// 查询角色分配的菜单ID列表
export function getRoleMenu(roleId: number): Promise<Result<number[]>> {
    return request({
        url: '/system/role/menu/' + roleId,
        method: 'get',
    });
}
// 查询角色分配的部门ID列表
export function getRoleDept(roleId: number): Promise<Result<number[]>> {
    return request({
        url: '/system/role/dept/' + roleId,
        method: 'get',
    });
}

// 新增角色
export function createRole(data: SysRole): Promise<Result> {
    return request({
        url: '/system/role/create',
        method: 'post',
        data: data,
    });
}

// 修改角色
export function updateRole(data: SysRole): Promise<Result> {
    return request({
        url: '/system/role/update',
        method: 'post',
        data: data,
    });
}

// 角色状态修改
export function changeRoleStatus(roleId: number, status: boolean): Promise<Result> {
    const data = {
        roleId,
        status,
    };
    return request({
        url: '/system/role/changeStatus',
        method: 'post',
        data: data,
    });
}

// 删除角色
export function delRole(roleId: number): Promise<Result> {
    return request({
        url: '/system/role/delete/' + roleId,
        method: 'get',
    });
}

// 批量授权角色
export function authUser(data: AuthUserSelectParams): Promise<Result> {
    return request({
        url: '/system/role/auth',
        method: 'post',
        data: data,
    });
}

// 取消用户授权角色
export function authUserCancel(data: AuthUserSelectParams): Promise<Result> {
    return request({
        url: '/system/role/unauth',
        method: 'post',
        data: data,
    });
}
