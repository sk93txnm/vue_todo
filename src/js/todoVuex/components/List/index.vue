<template>
  <ul class="todos__list">
    <ListItem v-for="todo in todos" :todo="todo" :key="todo.id" />
  </ul>
</template>

<script setup lang="ts">
import ListItem from '../ListItem/index.vue';
import type { Todo } from '../../store/index';

interface Props {
  todos?: Todo[];
}

withDefaults(defineProps<Props>(), {
  todos: () => []
});
</script>
