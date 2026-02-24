<template>
    <div class="errPage-container">
        {{ msg }}
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
const msg = ref('');

watch(
    route,
    (newRoute: any) => {
        msg.value = (newRoute.query && newRoute.query.msg) as string;
    },
    { immediate: true },
);
</script>

<style lang="scss" scoped>
.errPage-container {
    width: 100vh;
    height: 100vh;
}
</style>
