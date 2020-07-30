<template>
  <div class="vue-pincode-input-wrapper">
    <input
      v-for="(letter, index) in letters"
      :key="letter.key"
      :ref="`${baseRefName}${index}`"
      v-model.trim="letter.value"
      v-bind="$attrs"
      class="vue-pincode-input"
      :type="lettersInputTypes[index]"
      @focus="setFocusedLetterIndex(index)"
      @keydown.delete="onDelete(index, $event)"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import props from './props';

import { TLetter } from './types/Letter';
import { TInputType } from './types/InputType';
import { TLettersInputTypes } from './types/LettersInputTypes';

import {
  BASE_REF_NAME, LETTER_REGEXP,
  DEFAULT_INPUT_TYPE,
  SECURE_INPUT_TYPE,
} from './constants';

export default Vue.extend({
  props,

  data: () => ({
    baseRefName: BASE_REF_NAME,
    letters: [] as TLetter[],
    focusedLetterIdx: -1,
    watchers: {} as any,
    lettersInputTypes: {} as TLettersInputTypes,
  }),

  computed: {
    pinCodeComputed(): string {
      return this.letters.reduce(
        (pin, letter) => pin + letter.value, '',
      );
    },
  },

  watch: {
    value(value: any) {
      const valueNormalized = value || '';
      if (!valueNormalized) {
        this.init();
        this.setParentValue();
        this.focusLetterByIndex(0);
      } else {
        this.setParentValue();
      }
    },

    length: {
      immediate: true,
      handler() {
        this.init();
      },
    },

    focusedLetterIdx(val) {
      this.focusLetterByIndex(val);
    },

    pinCodeComputed(val) {
      this.$emit('input', val);
    },
  },

  mounted() {
    this.init();
    this.setParentValue();

    if (this.autofocus) {
      this.focusLetterByIndex(0);
    }
  },

  methods: {
    init() {
      this.unwatchLetters();
      this.resetLetters();

      for (let i = 0; i < this.length; i += 1) {
        this.setupLetterObject(i);
        this.setupLetterWatcher(i);
        this.setLetterInputType(
          i, this.getRelevantInputTypeForLetter(),
        );
      }
    },

    setParentValue() {
      if (!this.value) {
        return;
      }

      if (this.value.length !== this.length) {
        return;
      }

      this.value
        .split('') // getting letters
        .forEach((letter: string, idx: number) => {
          this.letters[idx].value = letter || '';
        });
    },

    isTheLetterValid(letter: string): boolean {
      if (letter === '') {
        return true;
      }

      if (!letter) {
        return false;
      }

      return !!letter.match(LETTER_REGEXP);
    },

    onLetterChanged(index: number, newVal: string, oldVal: string): void {
      if (newVal.length === 0) {
        return;
      }

      if (!this.isTheLetterValid(newVal)) {
        this.$nextTick(() => {
          this.letters[index].value = this.isTheLetterValid(newVal[index])
            ? newVal[index]
            : '';
        });
      } else if (newVal.length) {
        if (this.secure && this.characterPreview) {
          this.setLetterInputTypeWithDelay(
            index,
            SECURE_INPUT_TYPE,
            this.previewDuration,
          );
        }

        this.setFocusedLetterIndex(this.focusedLetterIdx + 1);
      }
    },

    getRelevantInputTypeForLetter(): TInputType {
      return this.secure && !this.characterPreview
        ? SECURE_INPUT_TYPE
        : DEFAULT_INPUT_TYPE;
    },

    setLetterInputType(index: number, inputType: TInputType) {
      if (index in this.lettersInputTypes) {
        this.lettersInputTypes[index] = inputType;
        return;
      }

      this.$set(this.lettersInputTypes, index, inputType);
    },

    setLetterInputTypeWithDelay(index: number, value: TInputType, delay: number) {
      /* "bind" used to not to create arrow function every time */
      setTimeout(
        this.setLetterInputType.bind(this, index, value),
        delay,
      );
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

    onDelete(index: number, e: Event) {
      if (!this.letters[index].value) {
        this.setFocusedLetterIndex(this.focusedLetterIdx - 1);
        e.preventDefault(); // to not delete letter in the field after focus changed
      }
    },

    setupLetterObject(index: number) {
      this.letters.push({ key: index, value: '' });
    },

    setupLetterWatcher(index: number) {
      const watchingProperty = `letters.${index}.value`;

      this.watchers[watchingProperty] = this.$watch(
        watchingProperty,
        (newVal, oldVal) => {
          this.onLetterChanged(index, newVal, oldVal);
        },
      );
    },

    unwatchLetters(): void {
      Object.keys(this.watchers).forEach((watcherName) => {
        this.watchers[watcherName]();
      });
    },

    resetLetters() {
      this.letters = [];
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
  padding: 5px;
  max-width: 40px;
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
