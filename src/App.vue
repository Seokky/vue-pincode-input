<template>
  <div id="app">
    <div class="input-wrapper">
      <PincodeInput
        placeholder="0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import PincodeInput from '@/plugin/dist/PincodeInput';
import PincodeInput from '@/plugin/Component.vue';

export default Vue.extend({
  name: 'App',

  components: {
    PincodeInput,
  },
});
</script>

<style lang="scss">
#app {
  margin-top: 100px;
  text-align: center;
}

.input-wrapper {
  margin: 0 auto;
}
</style>
