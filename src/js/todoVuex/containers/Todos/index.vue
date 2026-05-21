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

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTodoStore } from '../../store/index.ts';

import Wrapper from 'TodoVuexDir/components/Wrapper/index.vue';
import { ErrorMessage, EmptyMessage } from 'TodoVuexDir/components/Message';
import Register from 'TodoVuexDir/components/Register/index.vue';
import List from 'TodoVuexDir/components/List/index.vue';
import Navi from 'TodoVuexDir/components/Navi/index.vue';

const route = useRoute();

const todoStore = useTodoStore();
const todoFilter = computed(() => todoStore.todoFilter);

const todos = computed(() => {
  if (todoFilter.value === 'completedTodos') {
    return todoStore.completedTodos;
  }
  if (todoFilter.value === 'incompleteTodos') {
    return todoStore.incompleteTodos;
  }
  return todoStore.todos;
});

watch(todos, (newTodos) => {
  if (!newTodos.length) {
    todoStore.setEmptyMessage(todoFilter.value);
  }
}, { immediate: true });

watch(
  () => route.name,
  (newRouteName) => {
    if (typeof newRouteName === 'string') {
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
