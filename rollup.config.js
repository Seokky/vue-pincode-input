import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/plugin/Component.vue',
  output: {
    format: 'esm',
    file: 'src/plugin/dist/PincodeInput.js',
  },
  plugins: [
    commonjs(),
    vue(),
  ],
};
