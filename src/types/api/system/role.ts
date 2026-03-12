import type { PageDomain, BaseEntity } from '../common';
import { SysDept } from './dept';

/** 角色分页查询参数 */
export interface RoleQueryParams extends PageDomain {
    /** 角色名称 */
    roleName?: string;
    /** 角色权限 */
    roleKey?: string;
    /** 状态 */
    status?: boolean;
}

/** 批量授权用户参数 */
export interface AuthUserSelectParams {
    roleId: number;
    userIds: number[];
}

/** 用户和角色关联信息 */
export interface SysUserRole {
    /** 用户编号 */
    userId?: number;
    /** 角色编号 */
    roleId: number;
}

/** 用户和多角色关联信息 */
export interface SysUserRoles {
    /** 用户编号 */
    userId?: number;
    /** 角色编号组 */
    roleIds?: number[];
}

/** 角色信息 */
export interface SysRole extends BaseEntity {
    /** 角色编号 */
    roleId?: number;
    /** 角色名称 */
    roleName?: string;
    /** 角色权限 */
    roleKey?: string;
    /** 数据范围（1：所有数据权限；2：自定义数据权限；3：本部门数据权限；4：本部门及以下数据权限；5：仅本人数据权限） */
    dataScope?: string;
    /** 菜单ID列表 */
    menuIds?: number[];
    /** 部门ID列表 */
    deptIds?: number[];
    /** 状态（0正常 1停用） */
    status?: boolean;
}

/** 角色部门树响应 */
export interface RoleDept {
    /** 选中部门ID */
    checkedKeys: number[];
    /** 部门树列表 */
    deptTree: SysDept[];
}
