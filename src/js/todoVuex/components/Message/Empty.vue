<template>
  <p class="empty">{{ emptyMessage }}</p>
</template>

<script setup>
import { computed } from 'vue';
import { useTodoStore } from '../../store/index.js';

const todoStore = useTodoStore();
const emptyMessage = computed(() => todoStore.emptyMessage);
</script>

<style lang="scss" scoped>
.empty {
  font-size: 14px;
  text-align: center;
}
</style>
