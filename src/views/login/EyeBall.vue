<template>
    <div ref="eyeBallRef" :style="eyeBallStyle">
        <div ref="eyeRef" v-if="!props.isBlinking" :style="blinkStyle"></div>
    </div>
</template>

<script lang="ts" setup>
const eyeBallRef = ref<HTMLDivElement | null>(null);
interface EyeBallProps {
    size: number;
    pupilSize: number;
    maxDistance: number;
    eyeColor: string;
    pupilColor: string;
    isBlinking: boolean;
    forceLookX?: number;
    forceLookY?: number;
}
const props = withDefaults(defineProps<EyeBallProps>(), {
    size: 48,
    pupilSize: 16,
    maxDistance: 10,
    eyeColor: 'white',
    pupilColor: 'black',
    isBlinking: false,
});

const eyeBallStyle = computed(() => ({
    width: `${props.size}px`,
    height: props.isBlinking ? '2px' : `${props.size}px`,
    backgroundColor: props.eyeColor,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    transition: 'all 0.15s ease',
}));

const blinkStyle = computed(() => ({
    width: `${props.pupilSize}px`,
    height: `${props.pupilSize}px`,
    backgroundColor: props.pupilColor,
    borderRadius: '50%',
    transform: `translate(${pupilPosition.value.x}px, ${pupilPosition.value.y}px)`,
    transition: 'transform 0.1s ease-out',
}));

const eyeRef = ref<HTMLDivElement | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);

const handleMouseMove = (e: MouseEvent) => {
    mouseX.value = e.clientX;
    mouseY.value = e.clientY;
};

onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
});

const pupilPosition = computed(() => {
    if (!eyeRef.value) return { x: 0, y: 0 };

    if (props.forceLookX !== undefined && props.forceLookY !== undefined) {
        return { x: props.forceLookX, y: props.forceLookY };
    }

    const eye = eyeRef.value.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;

    const deltaX = mouseX.value - eyeCenterX;
    const deltaY = mouseY.value - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), props.maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
});
</script>

<style lang="less" scoped></style>
