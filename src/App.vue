<template>
  <div class="app-layout">
    <MenuLateral />
    <main class="main-viewport">
      <router-view />
    </main>
  </div>
</template>

<script>
import MenuLateral from './components/MenuLateral.vue';

export default {
  name: 'App',
  components: {
    MenuLateral
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f6f7;
  color-scheme: light;
}
.app-layout {
  display: flex;
}
.main-viewport {
  margin-left: 240px;
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
}
</style>