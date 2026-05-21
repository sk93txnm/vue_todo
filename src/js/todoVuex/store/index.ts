import { defineStore } from "pinia";
import axios, { AxiosResponse } from "axios";

export interface Todo {
  id: number | null;
  title: string;
  detail: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  todoFilter: string;
  targetTodo: Todo;
  errorMessage: string;
  emptyMessage: string;
}

export const useTodoStore = defineStore("todos", {
  state: (): TodoState => ({
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
    completedTodos: (state): Todo[] => state.todos.filter((todo) => todo.completed),
    incompleteTodos: (state): Todo[] => state.todos.filter((todo) => !todo.completed),
    completedTodosLength(): number {
      return this.completedTodos.length;
    },
    incompleteTodosLength(): number {
      return this.incompleteTodos.length;
    },
  },

  actions: {
    setTodoFilter(routeName: string) {
      this.todoFilter = routeName;
    },

    setEmptyMessage(routeName: string) {
      let currentTodos: Todo[] = this.todos;
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
      this.errorMessage = "";
    },

    showError(payload: AxiosResponse) {
      if (payload && payload.data) {
        this.errorMessage = payload.data;
      } else {
        this.errorMessage = "ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。";
      }
    },

    updateTargetTodo({ name, value }: { name: keyof Todo; value: any }) {
      if (name === "id") {
        this.targetTodo.id = value;
      } else if (name === "title") {
        this.targetTodo.title = value;
      } else if (name === "detail") {
        this.targetTodo.detail = value;
      } else if (name === "completed") {
        this.targetTodo.completed = value;
      }
    },

    async getTodos() {
      try {
        const { data } = await axios.get<{ todos: Todo[] }>("http://localhost:3000/api/todos/");
        this.todos = data.todos.reverse();
        this.setEmptyMessage(this.todoFilter);
      } catch (err: unknown) {
        this.showError(err.response);
      }
    },

    async addTodo() {
      if (!this.targetTodo.title || !this.targetTodo.detail) {
        this.showError({ data: "タイトルと内容はどちらも必須項目です。" } as AxiosResponse);
        return;
      }

      const postTodo = {
        title: this.targetTodo.title,
        detail: this.targetTodo.detail,
      };

      try {
        const { data } = await axios.post<Todo>("http://localhost:3000/api/todos/", postTodo);
        this.todos.unshift(data);
      } catch (err: unknown) {
        this.showError(err.response);
      } finally {
        this.initTargetTodo();
      }
    },

    async changeCompleted(todo: Todo) {
      const targetTodo = { ...todo };
      try {
        const { data } = await axios.patch<Todo>(`http://localhost:3000/api/todos/${targetTodo.id}`, {
          completed: !targetTodo.completed,
        });

        this.todos = this.todos.map((todoItem) => (todoItem.id === data.id ? data : todoItem));
      } catch (err: unknown) {
        this.showError(err.response);
      } finally {
        this.initTargetTodo();
      }
    },

    showEditor(todo: Todo) {
      this.targetTodo = { ...todo };
    },

    async editTodo() {
      const currentTodo = this.todos.find((todo) => todo.id === this.targetTodo.id);
      if (!currentTodo) return;

      if (currentTodo.title === this.targetTodo.title && currentTodo.detail === this.targetTodo.detail) {
        this.initTargetTodo();
        return;
      }
      try {
        const { data } = await axios.patch<Todo>(`http://localhost:3000/api/todos/${this.targetTodo.id}`, {
          title: this.targetTodo.title,
          detail: this.targetTodo.detail,
        });
        this.todos = this.todos.map((todoItem) => (todoItem.id === data.id ? data : todoItem));
      } catch (err: unknown) {
        this.showError(err.response);
      } finally {
        this.initTargetTodo();
      }
    },

    async deleteTodo(todoId: number) {
      try {
        await axios.delete(`http://localhost:3000/api/todos/${todoId}`);
        this.todos = this.todos.filter((todoItem) => todoItem.id !== todoId);
      } catch (err: unknown) {
        this.showError(err.response);
      }
    },
  },
});
