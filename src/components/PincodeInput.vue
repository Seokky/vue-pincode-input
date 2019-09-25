<template>
  <div class="hello">
    <input
      v-model="model"
      type="text"
      v-bind="$attrs"
      class="vue-pincode-input"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    model: '',
  }),
});
</script>

<style>
.vue-pincode-input {
  padding: 0.35rem 1rem;
}
</style>
