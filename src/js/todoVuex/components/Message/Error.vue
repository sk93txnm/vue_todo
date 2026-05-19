<template>
  <div class="error">
    <p class="error__text">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTodoStore } from '../../store/index.js'; 

const todoStore = useTodoStore();
const errorMessage = computed(() => todoStore.errorMessage);
</script>

<style lang="scss" scoped>
.error {
  padding: 0 20px;
  text-align: center;
  &__text {
    margin-top: 10px;
    padding: 5px;
    color: #f00;
    font-size: 14px;
    background-color: #efefef;
  }
}
</style>
