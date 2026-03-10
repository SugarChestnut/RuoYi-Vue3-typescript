import type { DefineComponent } from 'vue';
import type { BaseEntity, Result, TreeSelect } from './common';

/** 菜单查询参数 */
export interface MenuQueryParams {
    /** 菜单名称 */
    title?: string;
    /** 状态 */
    status?: string;
}

/** 菜单信息 */
export interface SysMenu extends BaseEntity {
    /** 菜单编号 */
    menuId?: number;
    /** 父菜单ID */
    parentId?: number;
    /** 菜单名称 */
    title: string;
    /** 显示顺序 */
    orderNum?: number;
    /** 路由地址 */
    path: string;
    /** 组件路径 */
    component?: any;
    /** 路由参数 */
    query?: string;
    /** 路由名称 */
    routeName: string;
    /** 权限字符串 */
    permission?: string;
    /** 菜单图标 */
    icon?: string;
    /** 是否为外链（0否 1是） */
    isFrame?: boolean;
    /** 是否缓存（0不缓存 1缓存） */
    isCache?: boolean;
    /** 类型（M目录 C菜单 F按钮） */
    menuType?: 'M' | 'C' | 'F';
    /** 显示状态（0显示 1隐藏） */
    hidden?: boolean;
    /** 状态（0正常 1停用） */
    status?: boolean;
    /** 子菜单 */
    children?: SysMenu[];
    /** 完整路由地址 */
    fullPath?: string;
}

export interface RoleMenuTreeselectResult {
    /** 已选中的菜单ID列表 */
    checkedKeys: number[];
}
