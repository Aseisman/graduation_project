<template>
  <div id="app">
    <!-- 占位符 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html,body,#app{
    height:100vh;
    padding: 0;
    margin: 0;
}
</style>
