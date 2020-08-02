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
      const valueNormalized = value || '';
      if (!valueNormalized) {
        this.init();
        this.focusLetterByIndex(0);
      } else {
        this.setParentValue();
      }
    },

    length: {
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

    this.$nextTick(() => {
      if (this.autofocus) {
        this.focusLetterByIndex(0);
      }
    });
  },

  methods: {
    onLetterChanged(index: number, newVal: string, oldVal: string): void {
      if (newVal.length === 0) {
        return;
      }

      if (!this.isTheLetterValid(newVal)) {
        this.letters[index].value = '';
      } else if (newVal.length) {
        if (this.secure && this.characterPreview) {
          /*
            Setting 'password' input type after delay to make character preview if it's enabled.
            If character preview disabled, secure input type already settled before.
          */
          setTimeout(
            this.setLetterInputType,
            this.previewDuration,
            index,
            SECURE_INPUT_TYPE,
          );
        }

        this.setFocusedLetterIndex(this.focusedLetterIdx + 1);
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

    init() {
      this.unwatchLetters();
      this.resetLetters();

      for (let i = 0; i < this.length; i += 1) {
        this.letters.push({ key: i, value: '' });
        this.setupLetterWatcher(i);
        this.setLetterInputType(
          i, this.getRelevantInputType(),
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
        .split('')
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
