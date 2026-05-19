<template>
  <Wrapper>
    <Navi />
    <Register v-if="todoFilter !== 'completedTodos'" />
    <ErrorMessage />
    <template v-slot:todos>
      <List v-if="todos.length" :todos="todos" />
      <EmptyMessage />
    </template>
  </Wrapper>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTodoStore } from '../../store/index.js';

import Wrapper from 'TodoVuexDir/components/Wrapper/index.vue';
import { ErrorMessage, EmptyMessage } from 'TodoVuexDir/components/Message';
import Register from 'TodoVuexDir/components/Register/index.vue';
import List from 'TodoVuexDir/components/List/index.vue';
import Navi from 'TodoVuexDir/components/Navi/index.vue';

const route = useRoute();

const todoStore = useTodoStore();
const todoFilter = computed(() => todoStore.todoFilter);

const todos = computed(() => {
  if (todoFilter.value === 'allTodos') {
    return todoStore.todos;
  }
  return todoStore[todoFilter.value] || [];
});

watch(todos, (newTodos) => {
  if (!newTodos.length) {
    todoStore.setEmptyMessage(todoFilter.value);
  }
}, { immediate: true });

watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName) {
      todoStore.setTodoFilter(newRouteName);
      todoStore.setEmptyMessage(newRouteName);
    }
  },
  { immediate: true }
);

onMounted(() => {
  todoStore.getTodos();
});
</script>
