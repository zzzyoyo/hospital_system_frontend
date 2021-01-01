<script>
import Navigation from './components/Navigation'
export default {
  name: 'App',
  components:{
    Navigation
  }
}
</script>

<template>
  <div id="app">
    <Navigation></Navigation>
    <router-view/>
  </div>
</template>




<style>
  @import "assets/css/bootstrap.css";
  @import "assets/css/font-awesome.css";
  @import "assets/css/style.css";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
  }
  body{
    margin: 0px;
    padding: 0px;
  }
</style>
