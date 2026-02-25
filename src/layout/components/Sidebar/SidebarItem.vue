<template>
    <div v-if="!item.meta?.hidden">
        <template
            v-if="
                hasOneShowingChild(item.children, item) &&
                (!onlyOneChild!.children || onlyOneChild!.meta?.noShowingChildren) &&
                !item.meta?.alwaysShow
            "
        >
            <app-link v-if="onlyOneChild!.meta" :to="resolveLinkPath(onlyOneChild!.path, onlyOneChild!.meta?.query)">
                <el-menu-item :index="onlyOneChild!.path" :class="{ 'submenu-title-noDropdown': !isNest }">
                    <svg-icon :icon-class="onlyOneChild!.meta.icon || (item.meta && item.meta.icon)" />
                    <template #title>
                        <span class="menu-title" :title="getTitle(onlyOneChild!.meta.menuName)">
                            {{ onlyOneChild!.meta.menuName }}
                        </span>
                    </template>
                </el-menu-item>
            </app-link>
        </template>

        <el-sub-menu v-else ref="subMenu" :index="item.path" teleported>
            <template v-if="item.meta" #title>
                <svg-icon :icon-class="item.meta && item.meta.icon" />
                <span class="menu-title" :title="getTitle(item.meta.menuName)">
                    {{ getTitle(item.meta.menuName) }}
                </span>
            </template>

            <sidebar-item
                v-for="(child, index) in item.children"
                :key="child.path + index"
                :is-nest="true"
                :item="child"
                class="nest-menu"
            />
        </el-sub-menu>
    </div>
</template>

<script setup lang="ts">
import AppLink from './Link.vue';
import type { RouteRecordRaw } from 'vue-router';

const props = defineProps<{
    item: RouteRecordRaw;
    isNest?: boolean;
}>();

const onlyOneChild = ref<RouteRecordRaw>();

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
        onlyOneChild.value = { ...parent, meta: { ...parent.meta, noShowingChildren: true } };
        return true;
    }

    return false;
}

function resolveLinkPath(routePath: string, routeQuery?: any): string | { path: string; query: Record<string, any> } {
    return routeQuery ? { path: routePath, query: JSON.parse(routeQuery) } : routePath;
}

function getTitle(title: any): string {
    if (title) {
        return title as string;
    } else {
        return '11';
    }
}
</script>
