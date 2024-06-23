<template>
  <div id="app">
    <ConfirmDialog />
    <router-view />
  </div>
</template>

<script>
import "@mdi/font/css/materialdesignicons.min.css";
import ConfirmDialog from "./components/dialog/ConfirmDialog.vue";

export default {
  components: {
    ConfirmDialog,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden; /* 가로 스크롤 방지 */
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
