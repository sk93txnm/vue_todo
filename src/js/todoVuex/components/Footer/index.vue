<template>
  <footer class="footer">
    <p>全項目数: {{ todos.length }}</p>
    <p>未完了: {{ incompleteTodosLength }}</p>
    <p>完了済: {{ completedTodosLength }}</p>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useTodoStore } from '../../store/index.js';

const todoStore = useTodoStore();
const todos = computed(() => todoStore.todos);

const incompleteTodosLength = computed(() => todoStore.incompleteTodosLength);
const completedTodosLength = computed(() => todoStore.completedTodosLength);
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  font-size: 14px;
  line-height: 1.2;
  color: #555;
  border-radius: 0 0 10px 10px;
  background-color: #ddd;
}
</style>
