<template>
  <div class="vue-pincode-input-wrapper">
    <input
      v-for="(letter, index) in letters"
      :key="letter.key"
      :ref="`${baseRefName}${index}`"
      v-model="letter.value"
      type="tel"
      v-bind="$attrs"
      class="vue-pincode-input"
      @focus="focusedLetterIndex = index"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type TLetter = {
  key: number,
  value: string,
}

const BASE_REF_NAME = 'vue-pincode-input';
const LETTER_REGEXP = '^\\d{1}$';

export default Vue.extend({
  props: {
    length: { type: Number, default: 4 },
    autofocus: { type: Boolean, default: true },
  },

  data: () => ({
    baseRefName: BASE_REF_NAME,
    letters: [] as TLetter[],
    focusedLetterIndex: 0,
  }),

  watch: {
    length: {
      handler(val) {
        for (let i = 0; i < val; i += 1) {
          this.letters.push({ key: i, value: '' });

          this.$watch(`letters.${i}.value`, (newVal, oldVal) => {
            this.validateLetter(i, newVal, oldVal);
          });
        }
      },
      immediate: true,
    },
    focusedLetterIndex(val) {
      this.focusLetterByIndex(val);
    },
  },

  mounted() {
    if (this.autofocus) {
      this.focusLetterByIndex(0);
    }
  },

  methods: {
    validateLetter(index: number, newVal: string, oldVal: string) {
      let letterIsValid = true;

      if (newVal.length === 1) {
        if (!newVal.match(LETTER_REGEXP)) {
          letterIsValid = false;
        }
      } else if (newVal.length > 1) {
        letterIsValid = false;
      }

      if (!letterIsValid) {
        this.$nextTick(() => {
          this.letters[index].value = oldVal;
        });
      } else if (newVal.length) {
        this.increaseFocusedLetterIndex();
      }
    },
    increaseFocusedLetterIndex(): void {
      this.focusedLetterIndex = (this.focusedLetterIndex < (this.length - 1))
        ? this.focusedLetterIndex + 1
        : this.focusedLetterIndex;
    },
    focusLetterByIndex(index: number) {
      const refName = `${this.baseRefName}${index}`;

      (this as any).$refs[refName][0].focus();
      (this as any).$refs[refName][0].select();
    },
  },
});
</script>

<style lang="scss">
.vue-pincode-input-wrapper {
  display: inline-flex;
}

.vue-pincode-input {
  padding: 1rem;
  margin: 3px;
  max-width: 20px;
  text-align: center;
  font-size: 1.1rem;
  border: none;
  border-radius: 3px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  outline: none;

  &:focus {
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  }
}
</style>
