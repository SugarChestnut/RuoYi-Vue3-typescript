<template>
    <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.prevent="handleScroll">
        <slot />
    </el-scrollbar>
</template>

<script setup lang="ts">
import useTagsStore from '@/store/modules/tags';
import type { ScrollPaneInstance } from '@/types';
import type { Tag } from '@/types';

import { ScrollbarInstance } from 'element-plus';
const scrollContainer = useTemplateRef<ScrollbarInstance>('scrollContainer');

const scrollWrapper = computed(() => scrollContainer.value!.$refs.wrapRef);

onMounted(() => {
    const e = scrollWrapper.value as HTMLElement;
    e.addEventListener('scroll', emitScroll, true);
});

onBeforeUnmount(() => {
    const e = scrollWrapper.value as HTMLElement;
    e.removeEventListener('scroll', emitScroll);
});

function handleScroll(e: WheelEvent): void {
    const eventDelta = -e.deltaY * 40;
    const $scrollWrapper = scrollWrapper.value as HTMLElement;
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
}

const emits = defineEmits();
const emitScroll = (): void => {
    emits('scroll');
};

const tagsStore = useTagsStore();
const visitedTags = computed(() => tagsStore.visitedTags);

function moveToTarget(name: string): void {
    const $container = scrollContainer.value!.$el as HTMLElement;
    const $containerWidth = $container.offsetWidth;
    const $scrollWrapper = scrollWrapper.value as HTMLElement;

    // find first tag and last tag
    if (visitedTags.value.length > 0) {
        let firstTag = visitedTags.value[0];
        let lastTag = visitedTags.value[visitedTags.value.length - 1];
        if (firstTag.name === name) {
            $scrollWrapper.scrollLeft = 0;
            return;
        }
        if (lastTag.name === name) {
            $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
            return;
        }
    }

    const tagListDom = document.getElementsByClassName('tags-view-item');
    const currentIndex = visitedTags.value.findIndex((item: Tag) => item.name === name);
    let prevTag: HTMLElement | null = null;
    let nextTag: HTMLElement | null = null;
    for (const k in tagListDom) {
        if (k !== 'length' && Object.hasOwnProperty.call(tagListDom, k)) {
            const element = tagListDom[k] as HTMLElement;
            if (element.dataset?.name === visitedTags.value[currentIndex - 1].name) {
                prevTag = tagListDom[k] as HTMLElement;
            }
            if (element.dataset?.name === visitedTags.value[currentIndex + 1].name) {
                nextTag = element;
            }
        }
    }

    if (prevTag && nextTag) {
        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4;
        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4;
        if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
            $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
            $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
        }
    }
}

defineExpose<ScrollPaneInstance>({
    moveToTarget,
});
</script>

<style lang="scss" scoped>
.scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    :deep(.el-scrollbar__bar) {
        bottom: 0px;
    }
    :deep(.el-scrollbar__wrap) {
        height: 39px;
    }
}
</style>
