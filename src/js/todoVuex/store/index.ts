import { defineStore } from "pinia";
import axios from "axios";

export const useTodoStore = defineStore("todos", {
  state: () => ({
    todos: [],
    todoFilter: "allTodos",
    targetTodo: {
      id: null,
      title: "",
      detail: "",
      completed: false,
    },
    errorMessage: "",
    emptyMessage: "",
  }),
  getters: {
    completedTodos: (state) => state.todos.filter((todo) => todo.completed),
    incompleteTodos: (state) => state.todos.filter((todo) => !todo.completed),
    completedTodosLength() {
      return this.completedTodos.length;
    },
    incompleteTodosLength() {
      return this.incompleteTodos.length;
    },
  },

  actions: {
    setTodoFilter(routeName) {
      this.todoFilter = routeName;
    },

    setEmptyMessage(routeName) {
      let currentTodos = this.todos;
      if (routeName === "completedTodos") {
        currentTodos = this.todos.filter((todo) => todo.completed);
      } else if (routeName === "incompleteTodos") {
        currentTodos = this.todos.filter((todo) => !todo.completed);
      }

      if (currentTodos.length > 0) {
        this.emptyMessage = "";
        return;
      }

      if (routeName === "completedTodos") {
        this.emptyMessage = "完了済みのやることリストはありません。";
      } else if (routeName === "incompleteTodos") {
        this.emptyMessage = "未完了のやることリストはありません。";
      } else {
        this.emptyMessage = "やることリストには何も登録されていません。";
      }
    },

    initTargetTodo() {
      this.targetTodo = {
        id: null,
        title: "",
        detail: "",
        completed: false,
      };
    },
    hideError() {
      this.errorMessage = "エラーが起きました。";
    },

    showError(payload) {
      if (payload && payload.data) {
        this.errorMessage = payload.data;
      } else {
        this.errorMessage = "ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。";
      }
    },

    updateTargetTodo({ name, value }) {
      this.targetTodo[name] = value;
    },
    async getTodos() {
      try {
        const { data } = await axios.get("http://localhost:3000/api/todos/");
        this.todos = data.todos.reverse();
        this.setEmptyMessage(this.todoFilter);
      } catch (err) {
        this.showError(err.response);
      }
    },

    async addTodo() {
      if (!this.targetTodo.title || !this.targetTodo.detail) {
        this.showError({ data: "タイトルと内容はどちらも必須項目です。" });
        return;
      }

      const postTodo = {
        title: this.targetTodo.title,
        detail: this.targetTodo.detail,
      };

      try {
        const { data } = await axios.post("http://localhost:3000/api/todos/", postTodo);
        this.todos.unshift(data);
      } catch (err) {
        this.showError(err.response);
      } finally {
        this.initTargetTodo();
      }
    },

    async changeCompleted(todo) {
      const targetTodo = { ...todo };
      try {
        const { data } = await axios.patch(`http://localhost:3000/api/todos/${targetTodo.id}`, {
          completed: !targetTodo.completed,
        });

        this.todos = this.todos.map((todoItem) => (todoItem.id === data.id ? data : todoItem));
      } catch (err) {
        this.showError(err.response);
      } finally {
        this.initTargetTodo();
      }
    },

    showEditor(todo) {
      this.targetTodo = { ...todo };
    },

    async editTodo() {
      const currentTodo = this.todos.find((todo) => todo.id === this.targetTodo.id);
      if (currentTodo.title === this.targetTodo.title && currentTodo.detail === this.targetTodo.detail) {
        this.initTargetTodo();
        return;
      }
      try {
        const { data } = await axios.patch(`http://localhost:3000/api/todos/${this.targetTodo.id}`, {
          title: this.targetTodo.title,
          detail: this.targetTodo.detail,
        });
        this.todos = this.todos.map((todoItem) => (todoItem.id === data.id ? data : todoItem));
      } catch (err) {
        this.showError(err.response);
      } finally {
        this.initTargetTodo();
      }
    },

    async deleteTodo(todoId) {
      try {
        await axios.delete(`http://localhost:3000/api/todos/${todoId}`);
        this.todos = this.todos.filter((todoItem) => todoItem.id !== todoId);
      } catch (err) {
        this.showError(err.response);
      }
    },
  },
});
