<template>
  <p class="empty">{{ emptyMessage }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTodoStore } from '../../store/index.ts';

const todoStore = useTodoStore();
const emptyMessage = computed(() => todoStore.emptyMessage);
</script>

<style lang="scss" scoped>
.empty {
  font-size: 14px;
  text-align: center;
}
</style>