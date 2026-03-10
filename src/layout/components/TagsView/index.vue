<template>
    <div id="tags-view-container" class="tags-view-container">
        <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
            <router-link
                v-for="tag in visitedViews"
                :key="tag.path"
                :data-path="tag.path"
                :class="{ active: isActive(tag), 'has-icon': tagsIcon }"
                :to="{ path: tag.path, query: tag.meta.query }"
                class="tags-view-item"
                :style="activeStyle(tag)"
                @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
                @contextmenu.prevent="openMenu(tag, $event)"
                :ref="
                    (el) => {
                        if (el) tagsRefs[tag.name!] = el;
                    }
                "
            >
                <svg-icon
                    v-if="tagsIcon && tag.meta && tag.meta.icon && tag.meta.icon !== '#'"
                    :icon-class="tag.meta.icon"
                />
                {{ tag.name }}
                <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
                    <close class="el-icon-close" style="width: 1em; height: 1em; vertical-align: -2px;" />
                </span>
            </router-link>
        </scroll-pane>

        <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)"><refresh-right style="width: 1em; height: 1em" /> 刷新页面</li>
            <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
                <close style="width: 1em; height: 1em" /> 关闭当前
            </li>
            <li @click="closeOthersTags"><circle-close style="width: 1em; height: 1em" /> 关闭其他</li>
            <li v-if="!isFirstView()" @click="closeLeftTags"><back style="width: 1em; height: 1em" /> 关闭左侧</li>
            <li v-if="!isLastView()" @click="closeRightTags"><right style="width: 1em; height: 1em" /> 关闭右侧</li>
            <li @click="closeAllTags(selectedTag)"><circle-close style="width: 1em; height: 1em" /> 全部关闭</li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import ScrollPane from './ScrollPane.vue';
import useTagsStore from '@/store/modules/tags';
import useSettingsStore from '@/store/modules/settings';
import useRouteStore from '@/store/modules/route';
import type { Tag } from '@/types';
import tab from '@/plugins/tab';
import type { RouteRecordRaw } from 'vue-router';

import type { ScrollPaneInstance } from '@/types';
const scrollPaneRef = useTemplateRef<ScrollPaneInstance>('scrollPaneRef');

const tagsRefs = ref<any>({});
const visible = ref<boolean>(false);
const top = ref<number>(0);
const left = ref<number>(0);
const selectedTag = ref<any>({});
const affixTags = ref<any[]>([]);
const route = useRoute();
const router = useRouter();

const visitedViews = computed(() => useTagsStore().visitedTags);
const routes = computed(() => useRouteStore().routes);
const theme = computed(() => useSettingsStore().theme);
const tagsIcon = computed(() => useSettingsStore().tagsIcon);

watch(route, () => {
    addTags();
    // moveToCurrentTag();
});

watch(visible, (value: boolean) => {
    if (value) {
        document.body.addEventListener('click', closeMenu);
    } else {
        document.body.removeEventListener('click', closeMenu);
    }
});

onMounted(() => {
    initTags();
    addTags();
    moveToCurrentTag();
});

function activeStyle(tag: Tag): Record<string, string> {
    if (!isActive(tag)) return {};
    return {
        'background-color': theme.value,
        'border-color': theme.value,
    };
}

function isActive(t: Tag): boolean {
    return t.name === route.meta.title;
}

function isAffix(tag: any): boolean {
    return tag.meta && tag.meta.affix;
}

function isFirstView(): boolean {
    try {
        return selectedTag.value.path === '/index' || selectedTag.value.path === visitedViews.value[1].path;
    } catch (err) {
        return false;
    }
}

function isLastView(): boolean {
    try {
        return selectedTag.value.path === visitedViews.value[visitedViews.value.length - 1].path;
    } catch (err) {
        return false;
    }
}

/**
 * 初始化标签
 */
function initTags(): void {
    const res = filterAffixTags(routes.value);
    affixTags.value = res;
    for (const tag of res) {
        useTagsStore().addVisitedTag(tag);
    }
}

function filterAffixTags(routes: RouteRecordRaw[]): Tag[] {
    const tags: Tag[] = [];
    routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
            tags.push({
                path: route.meta.fullPath,
                name: route.meta.title,
                meta: { ...route.meta },
            });
        }
        if (route.children) {
            const tempTags = filterAffixTags(route.children);
            if (tempTags.length >= 1) {
                tags.push(...tempTags);
            }
        }
    });
    return tags;
}

function addTags(): void {
    const { name } = route;
    if (name) {
        useTagsStore().addTag({
            path: route.meta.fullPath,
            name: route.meta.title,
            meta: { ...route.meta },
        });
    }
}

function moveToCurrentTag(): void {
    nextTick(() => {
        for (const r of visitedViews.value) {
            if (r.meta.title === route.meta.title) {
                scrollPaneRef.value!.moveToTarget(r.meta.title!);
            }
        }
    });
}

function refreshSelectedTag(view: any): void {
    tab.refreshPage(view);
    if (route.meta.link) {
        useTagsStore().delIframeTag(route);
    }
}

function closeSelectedTag(view: any): void {
    tab.closePage(view).then(({ visitedViews }: any) => {
        if (isActive(view)) {
            toLastView(visitedViews, view);
        }
    });
}

function closeRightTags(): void {
    tab.closeRightPage(selectedTag.value).then((visitedViews: any) => {
        if (!visitedViews.find((i: any) => i.fullPath === route.fullPath)) {
            toLastView(visitedViews);
        }
    });
}

function closeLeftTags(): void {
    tab.closeLeftPage(selectedTag.value).then((visitedViews: any) => {
        if (!visitedViews.find((i: any) => i.fullPath === route.fullPath)) {
            toLastView(visitedViews);
        }
    });
}

function closeOthersTags(): void {
    router.push(selectedTag.value).catch(() => {});
    tab.closeOtherPage(selectedTag.value).then(() => {
        moveToCurrentTag();
    });
}

function closeAllTags(view: any): void {
    tab.closeAllPage().then(({ visitedViews }: any) => {
        if (affixTags.value.some((tag: any) => tag.path === route.path)) {
            return;
        }
        toLastView(visitedViews, view);
    });
}

function toLastView(visitedViews: any[], view?: any): void {
    const latestView = visitedViews.slice(-1)[0];
    if (latestView) {
        router.push(latestView.fullPath);
    } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view && view.name === 'Dashboard') {
            // to reload home page
            router.replace({ path: '/redirect' + view.fullPath });
        } else {
            router.push('/');
        }
    }
}

function openMenu(tag: any, e: MouseEvent): void {
    const el = tagsRefs.value[tag.path].$el as HTMLElement;
    
    const offsetLeft = el.getBoundingClientRect().left; // container margin left
    const l = offsetLeft + 15; // 15: margin right

    const menuMinWidth = 0;
    const maxLeft = el.offsetWidth - menuMinWidth; // left boundary

    console.log(l, maxLeft);
    left.value = Math.min(l, maxLeft);
    top.value = e.clientY + 3;
    visible.value = true;
    selectedTag.value = tag;
}

function closeMenu(): void {
    visible.value = false;
}

function handleScroll(): void {
    closeMenu();
}
</script>

<style lang="scss" scoped>
.tags-view-container {
    height: 34px;
    width: 100%;
    background: var(--tags-bg, #fff);
    border-bottom: 1px solid var(--tags-item-border, #d8dce5);
    box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.12),
        0 0 3px 0 rgba(0, 0, 0, 0.04);

    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 26px;
            line-height: 26px;
            border: 1px solid var(--tags-item-border, #d8dce5);
            color: var(--tags-item-text, #495060);
            background: var(--tags-item-bg, #fff);
            padding: 0 8px;
            font-size: 12px;
            margin-left: 5px;
            margin-top: 4px;

            &:first-of-type {
                margin-left: 15px;
            }

            &:last-of-type {
                margin-right: 15px;
            }

            &.active {
                background-color: #42b983;
                color: #fff;
                border-color: #42b983;

                &::before {
                    content: '';
                    background: #fff;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    position: relative;
                    margin-right: 5px;
                }
            }
        }
    }

    .tags-view-item.active.has-icon::before {
        content: none !important;
    }

    .contextmenu {
        margin: 0;
        background: var(--el-bg-color-overlay, #fff);
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: var(--tags-item-text, #333);
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        border: 1px solid var(--el-border-color-light, #e4e7ed);

        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;

            &:hover {
                background: var(--tags-item-hover, #eee);
            }
        }
    }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
    .tags-view-item {
        .el-icon-close {
            width: 16px;
            height: 16px;
            vertical-align: 2px;
            border-radius: 50%;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            transform-origin: 100% 50%;

            &:before {
                transform: scale(0.6);
                display: inline-block;
                vertical-align: -3px;
            }

            &:hover {
                background-color: var(--tags-close-hover, #b4bccc);
                color: #fff;
                width: 12px !important;
                height: 12px !important;
            }
        }
    }
}
</style>
