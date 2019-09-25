<template>
  <div class="vue-pincode-input-wrapper">
    <input
      v-for="(letter, index) in letters"
      :key="letter.key"
      :ref="`${baseRefName}${index}`"
      v-model="letter.value"
      v-bind="$attrs"
      type="tel"
      class="vue-pincode-input"
      @focus="setFocusedLetterIndex(index)"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TLetter } from './types/Letter';
import { BASE_REF_NAME, LETTER_REGEXP } from './constants';

export default Vue.extend({
  props: {
    value: { type: String, required: true },
    length: { type: Number, default: 4 },
    autofocus: { type: Boolean, default: true },
  },

  data: () => ({
    baseRefName: BASE_REF_NAME,
    letters: [] as TLetter[],
    focusedLetterIdx: 0,
  }),

  computed: {
    pinCodeComputed(): string {
      return this.letters.reduce((pin, letter) => pin + letter.value, '');
    },
  },

  watch: {
    length: {
      handler(val) {
        for (let i = 0; i < val; i += 1) {
          this.letters.push({ key: i, value: '' });

          this.$watch(`letters.${i}.value`, (newVal, oldVal) => {
            this.onLetterChanged(i, newVal, oldVal);
          });
        }
      },
      immediate: true,
    },
    focusedLetterIdx(val) {
      this.focusLetterByIndex(val);
    },
    pinCodeComputed(val) {
      this.$emit('input', val);
    },
  },

  mounted() {
    if (this.autofocus) {
      this.focusLetterByIndex(0);
    }
  },

  methods: {
    letterIsValid(letter: string): boolean {
      let letterIsValid = true;

      if (letter.length === 1 && !letter.match(LETTER_REGEXP)) {
        letterIsValid = false;
      } else if (letter.length > 1) {
        letterIsValid = false;
      }

      return letterIsValid;
    },
    onLetterChanged(index: number, newVal: string, oldVal: string): void {
      if (!this.letterIsValid(newVal)) {
        this.$nextTick(() => {
          this.letters[index].value = oldVal;
        });
      } else if (newVal.length) {
        this.setFocusedLetterIndex(this.focusedLetterIdx + 1);
      }
    },
    setFocusedLetterIndex(newIndex: number): void {
      if (newIndex < 0 || newIndex >= this.length) {
        return;
      }

      this.focusedLetterIdx = newIndex;
    },
    focusLetterByIndex(index: number): void {
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
  outline: none;
  margin: 3px;
  padding: 1rem;
  max-width: 20px;
  text-align: center;
  font-size: 1.1rem;
  border: none;
  border-radius: 3px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);

  &:focus {
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  }
}
</style>
