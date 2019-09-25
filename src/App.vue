<template>
  <div id="app">
    <PincodeInput placeholder="123" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PincodeInput from '../dist/PincodeInput';

export default Vue.extend({
  name: 'App',

  components: {
    PincodeInput,
  },
});
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
