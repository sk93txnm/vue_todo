<template>
  <div class="todo__link">
    <router-link class="todo__link__item" to="/">すべて表示</router-link>
    <router-link class="todo__link__item" to="/incomplete">未完了のみ表示</router-link>
    <router-link class="todo__link__item" to="/completed">完了済のみ表示</router-link>
  </div>
</template>

<script setup>
/* 💡 空の export default {} は不要なので削除しました。
   setup と書くだけで、このコンポーネントの準備は完了です。 */
</script>

<style lang="scss" scoped>
/* 💡 クラス名（シングルクォーテーションを標準的なダブルクォーテーションに統一しました）
   スタイル定義はそのまま完全に流用可能です */
.todo__link {
  display: flex;

  &__item {
    padding: 10px 0;
    width: 100%;
    color: #999;
    font-weight: bold;
    font-size: 12px;
    text-align: center;
    background-color: #c4f3d3;
    &.router-link-exact-active {
      color: #54b363;
      background-color: #fff;
    }
  }
}
</style>
