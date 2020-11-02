<template>
  <div class="vue-pincode-input-wrapper">
    <input
      v-for="(cell, index) in cells"
      :key="cell.key"
      :ref="`${baseRefName}${index}`"
      v-model.trim="cell.value"
      v-bind="$attrs"
      class="vue-pincode-input"
      :type="cellsInputTypes[index]"
      @focus="focusedCellIdx = index"
      @keydown.delete="onCellErase(index, $event)"
      @keydown="onKeyDown($event)"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import props from './props';
import { State, CellInputType } from './types';
import {
  BASE_REF_NAME, CELL_REGEXP, DEFAULT_INPUT_TYPE, SECURE_INPUT_TYPE,
} from './constants';

export default Vue.extend({
  props,

  data: (): State => ({
    baseRefName: BASE_REF_NAME,
    focusedCellIdx: 0,
    cells: [],
    watchers: {},
    cellsInputTypes: {},
  }),

  computed: {
    pinCodeComputed(): string {
      return this.cells.reduce((pin, cell) => pin + cell.value, '');
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
      this.$nextTick(this.focusCellByIndex);
    }
  },

  methods: {
    /* init stuff */

    init(): void {
      const inputType = this.getRelevantInputType();
      for (let key = 0; key < this.length; key += 1) {
        this.setCellObject(key);
        this.setCellInputType(key, inputType);
        this.setCellWatcher(key);
      }
    },

    setCellObject(key: number): void {
      this.$set(this.cells, key, { key, value: '' });
    },

    setCellInputType(index: number, inputType: CellInputType = SECURE_INPUT_TYPE): void {
      this.$set(this.cellsInputTypes, index, inputType);
    },

    setCellWatcher(index: number): void {
      const watchingProperty = `cells.${index}.value`;

      this.watchers[watchingProperty] = this.$watch(
        watchingProperty,
        (newVal, oldVal) => this.onCellChanged(index, newVal, oldVal),
      );
    },

    /* handlers */

    onParentValueUpdated(): void {
      if (this.value.length !== this.length) {
        this.$emit('input', this.pinCodeComputed);
        return;
      }

      this.value
        .split('')
        .forEach((cell: string, idx: number) => {
          this.cells[idx].value = cell || '';
        });
    },

    onCellChanged(index: number, newVal: string, oldVal: string): void {
      if (!this.isTheCellValid(newVal, false)) {
        this.cells[index].value = '';
        return;
      }

      this.focusNextCell();

      /* performing character preview if it's enabled */
      if (this.secure && this.characterPreview) {
        setTimeout(this.setCellInputType, this.charPreviewDuration, index);
      }
    },

    onCellErase(index: number, e: Event): void {
      const isThisCellFilled = this.cells[index].value.length;

      if (!isThisCellFilled) {
        this.focusPreviousCell();
        e.preventDefault();
      }
    },

    onKeyDown(e: KeyboardEvent): void {
      switch (e.keyCode) {
        /* left arrow key */
        case 37:
          if (this.focusedCellIdx > 0) {
            this.focusCellByIndex(this.focusedCellIdx - 1);
          }
          break;

        /* right arrow key */
        case 39:
          if (this.focusedCellIdx < this.cells.length - 1) {
            this.focusCellByIndex(this.focusedCellIdx + 1);
          }
          break;

        default:
          break;
      }
    },

    /* reset stuff */

    reset(): void {
      this.unwatchCells();
      this.init();
      this.focusCellByIndex();
    },

    unwatchCells(): void {
      const watchers = Object.keys(this.watchers);
      watchers.forEach(name => this.watchers[name]());
    },

    /* helpers */

    isTheCellValid(cell: string, allowEmpty = true): boolean {
      if (!cell) {
        return allowEmpty ? cell === '' : false;
      }

      return !!cell.match(CELL_REGEXP);
    },

    getRelevantInputType(): CellInputType {
      return this.secure && !this.characterPreview
        ? SECURE_INPUT_TYPE
        : DEFAULT_INPUT_TYPE;
    },

    focusPreviousCell(): void {
      if (!this.focusedCellIdx) return;

      this.focusCellByIndex(this.focusedCellIdx - 1);
    },

    focusNextCell(): void {
      if (this.focusedCellIdx === this.length - 1) return;

      this.focusCellByIndex(this.focusedCellIdx + 1);
    },

    focusCellByIndex(index: number = 0): void {
      const ref = `${this.baseRefName}${index}`;
      const el = (this.$refs[ref] as HTMLInputElement[])[0];

      el.focus();
      el.select();

      this.focusedCellIdx = index;
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
