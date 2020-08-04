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
      @focus="focusedLetterIdx = index"
      @keydown.delete="onLetterErase(index, $event)"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import props from './props';
import { Letter } from './types/Letter';
import { InputType } from './types/InputType';
import { LettersInputTypes } from './types/LettersInputTypes';
import {
  BASE_REF_NAME,
  LETTER_REGEXP,
  DEFAULT_INPUT_TYPE,
  SECURE_INPUT_TYPE,
} from './constants';

export default Vue.extend({
  props,

  data: () => ({
    baseRefName: BASE_REF_NAME,
    focusedLetterIdx: 0,
    letters: [] as Letter[],
    watchers: {} as Record<string, Function>,
    lettersInputTypes: {} as LettersInputTypes,
  }),

  computed: {
    pinCodeComputed(): string {
      return this.letters.reduce((pin, letter) => pin + letter.value, '');
    },
  },

  watch: {
    value(value: any) {
      if (value) {
        this.onParentValueUpdated();
      } else {
        this.reset();
      }
    },

    length() {
      this.reset();
    },

    pinCodeComputed(val: string) {
      this.$emit('input', val);
    },
  },

  mounted() {
    this.init();
    this.onParentValueUpdated();

    if (this.autofocus) {
      this.$nextTick(this.focusLetterByIndex.bind(this, 0));
    }
  },

  methods: {
    /* init stuff */

    init() {
      const inputType = this.getRelevantInputType();
      for (let key = 0; key < this.length; key += 1) {
        this.setLetterObject(key);
        this.setLetterInputType(key, inputType);
        this.setLetterWatcher(key);
      }
    },

    setLetterObject(key: number) {
      this.$set(this.letters, key, { key, value: '' });
    },

    setLetterInputType(index: number, inputType: InputType) {
      this.$set(this.lettersInputTypes, index, inputType);
    },

    setLetterWatcher(index: number) {
      const watchingProperty = `letters.${index}.value`;

      this.watchers[watchingProperty] = this.$watch(
        watchingProperty,
        (newVal, oldVal) => this.onLetterChanged(index, newVal, oldVal),
      );
    },

    /* handlers */

    onParentValueUpdated() {
      if (this.value.length !== this.length) {
        this.$emit('input', this.pinCodeComputed);
        return;
      }

      this.value
        .split('')
        .forEach((letter: string, idx: number) => {
          this.letters[idx].value = letter || '';
        });
    },

    onLetterChanged(index: number, newVal: string, oldVal: string): void {
      if (!newVal.length || !this.isTheLetterValid(newVal)) {
        this.letters[index].value = '';
        return;
      }

      this.focusNextLetter();

      /* performing character preview if it's enabled */
      if (this.secure && this.characterPreview) {
        setTimeout(
          this.setLetterInputType,
          this.charPreviewDuration,
          index,
          SECURE_INPUT_TYPE,
        );
      }
    },

    onLetterErase(index: number, e: Event) {
      const isThisCellFilled = this.letters[index].value.length;

      if (!isThisCellFilled) {
        this.focusPreviousLetter();
        e.preventDefault();
      }
    },

    /* reset stuff */

    reset() {
      this.unwatchLetters();
      this.init();
      this.focusLetterByIndex(0);
    },

    unwatchLetters(): void {
      const watchers = Object.keys(this.watchers);
      watchers.forEach(watcherName => this.watchers[watcherName]());
    },

    /* helpers */

    isTheLetterValid(letter: string): boolean {
      if (!letter) {
        return letter === '';
      }

      return !!letter.match(LETTER_REGEXP);
    },

    getRelevantInputType(): InputType {
      return this.secure && !this.characterPreview
        ? SECURE_INPUT_TYPE
        : DEFAULT_INPUT_TYPE;
    },

    focusPreviousLetter() {
      if (!this.focusedLetterIdx) return;

      this.focusLetterByIndex(this.focusedLetterIdx - 1);
    },

    focusNextLetter() {
      if (this.focusedLetterIdx === this.length - 1) return;

      this.focusLetterByIndex(this.focusedLetterIdx + 1);
    },

    focusLetterByIndex(index: number): void {
      const letterRef = `${this.baseRefName}${index}`;

      (this as any).$refs[letterRef][0].focus();
      (this as any).$refs[letterRef][0].select();

      this.focusedLetterIdx = index;
    },
  },
});
</script>

<style>
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
}

.vue-pincode-input:focus {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}
</style>
