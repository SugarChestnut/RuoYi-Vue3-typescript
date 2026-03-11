import type { BaseEntity } from '../common';

/** 部门查询参数 */
export interface DeptQueryParams {
    /** 部门名称 */
    deptName?: string;
    /** 状态 */
    status?: string;
}

/** 部门信息 */
export interface SysDept extends BaseEntity {
    /** 部门编号 */
    deptId?: number;
    /** 父部门ID */
    parentId?: number;
    /** 祖级列表 */
    ancestors?: string;
    /** 部门名称 */
    deptName?: string;
    /** 显示顺序 */
    orderNum?: number;
    /** 负责人 */
    leaderId?: number;
    /** 联系电话 */
    phone?: string;
    /** 邮箱 */
    email?: string;
    /** 状态（false正常 true停用） */
    status?: boolean;

    children?: SysDept[];
    leader?: string;
}
