<template>
    <div v-if="!item.hidden">
        <template
            v-if="
                hasOneShowingChild(item.children, item) &&
                (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
                !item.alwaysShow
            "
        >
            <app-link v-if="onlyOneChild.meta" :to="resolveLinkPath(onlyOneChild.path, onlyOneChild.query)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
                    <svg-icon :icon-class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" />
                    <template #title
                        ><span class="menu-title" :title="hasTitle(onlyOneChild.meta.title)">{{
                            onlyOneChild.meta.title
                        }}</span></template
                    >
                </el-menu-item>
            </app-link>
        </template>

        <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" teleported>
            <template v-if="item.meta" #title>
                <svg-icon :icon-class="item.meta && item.meta.icon" />
                <span class="menu-title" :title="hasTitle(item.meta.title)">{{ item.meta.title }}</span>
            </template>

            <sidebar-item
                v-for="(child, index) in item.children"
                :key="child.path + index"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.path)"
                class="nest-menu"
            />
        </el-sub-menu>
    </div>
</template>

<script setup lang="ts">
import { isExternal } from '@/utils/validate';
import AppLink from './Link.vue';
import { getNormalPath } from '@/utils/ruoyi';
import type { RouteRecordRaw } from 'vue-router';
import path from 'path';

const props = defineProps<{
    item: RouteRecordRaw;
    isNest?: boolean;
    basePath?: string;
}>();

const onlyOneChild = ref({});

function hasOneShowingChild(children: RouteRecordRaw[] = [], parent: RouteRecordRaw) {
    if (!children) {
        children = [];
    }
    const showingChildren = children.filter((item) => {
        if (item.meta?.hidden) {
            return false;
        }
        onlyOneChild.value = item;
        return true;
    });

    // When there is only one child router, the child router is displayed by default
    if (showingChildren.length === 1) {
        return true;
    }

    // Show parent if there are no child router to display
    if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
        return true;
    }

    return false;
}

function resolveLinkPath(routePath: string, routeQuery?: string): string | { path: string; query: Record<string, any> } {
    const path = resolvePath(routePath)
    return routeQuery ? {path: path, query: JSON.parse(routeQuery)} : path;
}

function resolvePath(routePath: string): string {
    if (isExternal(routePath)) {
        return routePath;
    }
    if (props.basePath && isExternal(props.basePath)) {
        return props.basePath;
    }
  
    return getNormalPath((props.basePath || '') + '/' + routePath);
}

function hasTitle(title: string): string {
    if (title.length > 5) {
        return title;
    } else {
        return '';
    }
}
</script>
