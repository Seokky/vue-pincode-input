<template>
  <div id="app">
    <div>
      <PincodeInput
        v-model="code"
        placeholder="0"
      />

      <div class="monitor">
        <span class="monitor-label">Parent value:</span>
        <span v-text="code" />
      </div>

      <button
        class="reset-button"
        @click="reset"
      >
        Reset
      </button>
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

  methods: {
    reset() {
      this.code = '';
    },
  },
});
</script>

<style lang="scss">
#app {
  margin-top: 100px;
  text-align: center;
}

.monitor {
  margin: 30px auto;
  font-size: 18px;
  font-family: Arial, sans-serif;
  opacity: 0.6;

  &-label {
    margin-right: 4px;
  }
}

.reset-button {
  display: block;
  margin: 0 auto;
  border: none;
  border-radius: 3px;
  padding: 10px 30px;
  font-size: 18px;
  color: rgba(black, 0.8);
  transition: color 0.1s ease-in;

  &:hover,
  &:focus {
    cursor: pointer;
    color: rgba(black, 0.5);
  }
}
</style>
