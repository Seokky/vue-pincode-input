<template>
  <div class="hello">
    <input
      v-for="letter in letters"
      :key="letter.key"
      v-model="letter.value"
      type="text"
      v-bind="$attrs"
      class="vue-pincode-input"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    length: { type: Number, default: 4 },
  },

  data: () => ({
    letters: [],
  }),

  watch: {
    length: {
      handler(val) {
        for (let i = 0; i < val; i += 1) {
          this.letters.push({});
          this.$set(this.letters[i], 'key', i);
          this.$set(this.letters[i], 'value', '');
        }
      },
      immediate: true,
    },
  },
});
</script>

<style>
.vue-pincode-input {
  padding: 0.35rem 1rem;
}
</style>
