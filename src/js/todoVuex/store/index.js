import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    todos: [],
    todoFilter: '',
    targetTodo: {
      id: null,
      title: '',
      detail: '',
      completed: '',
    },
    errorMessage: '',
    emptyMessage: '',
  },
  getters: {
    completedTodos: state => state.todos.filter(todo => todo.completed),
    incompleteTodos: state => state.todos.filter(todo => !todo.completed),
    completedTodosLength: (state, getters) => getters.completedTodos.length,
    incompleteTodosLength: (state, getters) => getters.incompleteTodos.length,
  },
  mutations: {
    setTodoFilter(state, routeName) {
      state.todoFilter = routeName;
    },

    setEmptyMessage(state, routeName) {
      let currentTodos = state.todos;
      if (routeName === 'completedTodos') {
        currentTodos = state.todos.filter(todo => todo.completed);
      } else if (routeName === 'incompleteTodos') {
        currentTodos = state.todos.filter(todo => !todo.completed);
      }

      if (currentTodos.length > 0) {
        state.emptyMessage = '';
        return;
      }
      if (routeName === 'completedTodos') {
        state.emptyMessage = '完了済みのやることリストはありません。';
      } else if (routeName === 'incompleteTodos') {
        state.emptyMessage = '未完了のやることリストはありません。';
      } else {
        state.emptyMessage = 'やることリストには何も登録されていません。';
      }
    },
    initTargetTodo(state) {
      state.targetTodo = {
        id: null,
        title: '',
        detail: '',
        completed: false,
      };
    },
    hideError(state) {
      state.errorMessage = 'エラーが起きました。';
    },
    showError(state, payload) {
      if (payload) {
        state.errorMessage = payload.data;
      } else {
        state.errorMessage = 'ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。';
      }
    },
    updateTargetTodo(state, { name, value }) {
      state.targetTodo[name] = value;
    },
    getTodos(state, payload) {
      state.todos = payload.reverse();
    },
    addTodo(state, payload) {
      state.todos.unshift(payload);
    },
    showEditor(state, payload) {
      state.targetTodo = { ...payload };
    },
    editTodo(state, payload) {
      state.todos = state.todos.map(todoItem => {
        if (todoItem.id === payload.id) return payload;
        return todoItem;
      });
    },
    deleteTodo(state, todoId) {
      state.todos = state.todos.filter(todoItem => todoItem.id !== todoId);
    },
  },
  actions: {
    setTodoFilter({ commit }, routeName) {
      commit('setTodoFilter', routeName);
    },
    setEmptyMessage({ commit }, routeName) {
      commit('setEmptyMessage', routeName);
    },
    updateTargetTodo({ commit }, { name, value }) {
      commit('updateTargetTodo', { name, value });
    },
    getTodos({ commit, state }) {
      // ★引数に state を追加
      axios
        .get('http://localhost:3000/api/todos/')
        .then(({ data }) => {
          commit('getTodos', data.todos);
          commit('setEmptyMessage', state.todoFilter);
        })
        .catch(err => {
          commit('showError', err.response);
        });
    },
    addTodo({ commit, state }) {
      if (!state.targetTodo.title || !state.targetTodo.detail) {
        commit({
          type: 'showError',
          data: 'タイトルと内容はどちらも必須項目です。',
        });
        return;
      }
      const postTodo = {
        title: state.targetTodo.title,
        detail: state.targetTodo.detail,
      };
      axios
        .post('http://localhost:3000/api/todos/', postTodo)
        .then(({ data }) => {
          commit('addTodo', data);
        })
        .catch(err => {
          commit('showError', err.response);
        });
      commit('initTargetTodo');
    },
    changeCompleted({ commit }, todo) {
      const targetTodo = { ...todo };
      axios
        .patch(`http://localhost:3000/api/todos/${targetTodo.id}`, {
          completed: !targetTodo.completed,
        })
        .then(({ data }) => {
          commit('editTodo', data);
        })
        .catch(err => {
          commit('showError', err.response);
        });
      commit('initTargetTodo');
    },
    showEditor({ commit }, todo) {
      commit('showEditor', todo);
    },
    editTodo({ commit, state }) {
      const targetTodo = state.todos.find(todo => todo.id === state.targetTodo.id);
      if (targetTodo.title === state.targetTodo.title
        && targetTodo.detail === state.targetTodo.detail) {
        commit('initTargetTodo');
        return;
      }
      axios
        .patch(`http://localhost:3000/api/todos/${state.targetTodo.id}`, {
          title: state.targetTodo.title,
          detail: state.targetTodo.detail,
        })
        .then(({ data }) => {
          commit('editTodo', data);
        })
        .catch(err => {
          commit('showError', err.response);
        });
      commit('initTargetTodo');
    },
    deleteTodo({ commit }, todoId) {
      axios
        .delete(`http://localhost:3000/api/todos/${todoId}`)
        .then(() => {
          commit('deleteTodo', todoId);
        })
        .catch(err => {
          commit('showError', err.response);
        });
    },
  },
});

export default store;
