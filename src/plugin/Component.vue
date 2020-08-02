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
    letters: [] as Letter[],
    focusedLetterIdx: -1,
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
        this.setParentValue();
      } else {
        this.reset();
      }
    },

    length: {
      handler() {
        this.reset();
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

    this.$nextTick(() => {
      if (this.autofocus) {
        this.focusLetterByIndex(0);
      }
    });
  },

  methods: {
    init() {
      const inputType = this.getRelevantInputType();
      for (let key = 0; key < this.length; key += 1) {
        this.$set(this.letters, key, { key, value: '' });
        this.setupLetterWatcher(key);
        this.setLetterInputType(key, inputType);
      }
    },

    reset() {
      this.unwatchLetters();
      this.init();
      this.focusLetterByIndex(0);
    },

    setParentValue() {
      if (this.value.length > this.length) {
        this.$emit('input', this.pinCodeComputed);
        throw new Error('Pincode: The length of the parent value exceeds the maximum length');
      }

      this.value
        .split('')
        .forEach((letter: string, idx: number) => {
          this.letters[idx].value = letter || '';
        });
    },

    onLetterChanged(index: number, newVal: string, oldVal: string): void {
      if (newVal.length === 0) return;

      if (!this.isTheLetterValid(newVal)) {
        this.letters[index].value = '';
        return;
      }

      this.setFocusedLetterIndex(this.focusedLetterIdx + 1);

      /*
        Setting 'password' input type after delay to make character preview if it's enabled.
        If character preview disabled, secure input type already settled before.
      */
      if (this.secure && this.characterPreview) {
        setTimeout(
          this.setLetterInputType,
          this.previewDuration,
          index,
          SECURE_INPUT_TYPE,
        );
      }
    },

    onLetterErase(index: number, e: Event) {
      const isThisCellFilled = this.letters[index].value.length;

      if (!isThisCellFilled) {
        // move focus to the left
        this.setFocusedLetterIndex(this.focusedLetterIdx - 1);
        // prevent to delete letter in the field after focus changed
        e.preventDefault();
      }
    },

    isTheLetterValid(letter: string): boolean {
      if (!letter) {
        return letter === '';
      }

      return !!letter.match(LETTER_REGEXP);
    },

    getRelevantInputType(): InputType {
      /*
        if character preview disabled, we are setting secure input type immediately,
        else we are setting it to the 'tel' until the letter will be entered
      */
      return this.secure && !this.characterPreview
        ? SECURE_INPUT_TYPE
        : DEFAULT_INPUT_TYPE;
    },

    setLetterInputType(index: number, inputType: InputType) {
      this.$set(this.lettersInputTypes, index, inputType);
    },

    setFocusedLetterIndex(newIndex: number): void {
      if (newIndex >= 0 && newIndex < this.length) {
        this.focusedLetterIdx = newIndex;
      }
    },

    focusLetterByIndex(index: number): void {
      const letterRef = `${this.baseRefName}${index}`;

      (this as any).$refs[letterRef][0].focus();
      (this as any).$refs[letterRef][0].select();
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
      const watchers = Object.keys(this.watchers);
      watchers.forEach(watcherName => this.watchers[watcherName]());
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
