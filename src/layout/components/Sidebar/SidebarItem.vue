<template>
    <div v-if="item.meta?.hidden">
        <div v-if="item.children && item.children.length > 0">
            <sidebar-item v-for="(child, index) in item.children" :key="child.path + index" :item="child"/>
        </div>
    </div>
    <div v-else>
        <template v-if="!(item.children && item.children.length > 0)">
            <app-link :to="item.meta!.fullPath!">
                <el-menu-item :index="item.meta!.title">
                    <svg-icon :icon-class="item.meta!.icon" />
                    <template #title>
                        <span class="menu-title" :title="item.meta!.title">
                            {{ item.meta!.title }}
                        </span>
                    </template>
                </el-menu-item>
            </app-link>
        </template>

        <el-sub-menu v-else ref="subMenu" :index="item.path" teleported>
            <template #title>
                <svg-icon :icon-class="item.meta!.icon" />
                <span class="menu-title" :title="item.meta!.title">
                    {{ item.meta!.title }}
                </span>
            </template>

            <sidebar-item v-for="(child, index) in item.children" :key="child.path + index" :item="child"/>
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

function resolveLinkPath(routePath: string, routeQuery?: any): string | { path: string; query: Record<string, any> } {
    return routeQuery ? { path: routePath, query: JSON.parse(routeQuery) } : routePath;
}
</script>
