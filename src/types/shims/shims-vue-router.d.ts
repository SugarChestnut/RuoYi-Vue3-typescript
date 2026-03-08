import 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        title?: string; // 必填：页面标题
        icon?: string; // 菜单图标
        hidden?: boolean; // 是否隐藏菜单
        
        // 权限控制
        roles?: string[]; // 允许访问的角色
        permissions?: string[]; // 允许访问的权限标识
        
        // 布局相关
        affix?: boolean; // 是否固定在tags-view
        isCahce?: boolean; // 是否不缓存
        breadcrumb?: boolean; // 是否显示面包屑
        breadcrumbHidden?: boolean; // 是否隐藏面包屑中的当前项
        
        // 菜单相关
        sort?: number; // 菜单排序
        alwaysShow?: boolean; // 是否总是显示根菜单
        activeMenu?: string; // 高亮菜单
        
        // 功能相关
        link?: string; // 外部链接
        iframe?: string; // iframe链接
        transition?: string; // 页面过渡动画
    
        fullPath?: string; // 完整路径  
    }
}
