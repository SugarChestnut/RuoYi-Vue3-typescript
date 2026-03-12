import request from '@/utils/request';
import type {
    RoleQueryParams,
    AuthUserQueryParams,
    SysRole,
    SysUser,
    SysUserRole,
    AuthUserSelectParams,
    Result,
    RoleDeptTreeResult,
    SysPage,
} from '@/types';

// 查询角色列表
export function listRole(data: RoleQueryParams): Promise<Result<SysPage<SysRole>>> {
    return request({
        url: '/system/role/list',
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

// 查询角色详细
export function getRole(roleId: number): Promise<Result<SysRole>> {
    return request({
        url: '/system/role/' + roleId,
        method: 'get',
    });
}

// 查询角色已授权用户列表
export function allocatedUserList(query: AuthUserQueryParams): Promise<TableDataInfo<SysUser[]>> {
    return request({
        url: '/system/role/authUser/allocatedList',
        method: 'get',
        params: query,
    });
}

// 查询角色未授权用户列表
export function unallocatedUserList(query: AuthUserQueryParams): Promise<TableDataInfo<SysUser[]>> {
    return request({
        url: '/system/role/authUser/unallocatedList',
        method: 'get',
        params: query,
    });
}

// 取消用户授权角色
export function authUserCancel(data: SysUserRole): Promise<Result> {
    return request({
        url: '/system/role/authUser/cancel',
        method: 'put',
        data: data,
    });
}

// 批量取消用户授权角色
export function authUserCancelAll(data: AuthUserSelectParams): Promise<Result> {
    return request({
        url: '/system/role/authUser/cancelAll',
        method: 'put',
        params: data,
    });
}

// 授权用户选择
export function authUserSelectAll(data: AuthUserSelectParams): Promise<Result> {
    return request({
        url: '/system/role/authUser/selectAll',
        method: 'put',
        params: data,
    });
}

// 根据角色ID查询部门树结构
export function deptTreeSelect(roleId: number): Promise<RoleDeptTreeResult> {
    return request({
        url: '/system/role/deptTree/' + roleId,
        method: 'get',
    });
}
