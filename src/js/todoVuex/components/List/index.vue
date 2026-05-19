<template>
  <ul class="todos__list">
    <ListItem
      v-for="todo in todos"
      :todo="todo"
      :key="todo.id"
    />
  </ul>
</template>

<script setup>
import ListItem from '../ListItem/index.vue';

defineProps({
  todos: {
    type: Array,
    default: () => [],
  },
});
</script>
