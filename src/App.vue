<template>
  <div id="app">
    <div class="input-wrapper">
      <PincodeInput
        v-model="code"
        placeholder="0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import PincodeInput from '@/plugin/dist/PincodeInput.min';
import PincodeInput from '@/plugin/Component.vue';

export default Vue.extend({
  name: 'App',

  components: {
    PincodeInput,
  },

  data: () => ({
    code: '',
  }),
});
</script>

<style lang="scss">
#app {
  margin-top: 100px;
  text-align: center;
}
</style>
