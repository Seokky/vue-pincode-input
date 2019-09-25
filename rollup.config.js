import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/components/PincodeInput.vue',
  output: {
    format: 'esm',
    file: 'dist/PincodeInput.js',
  },
  plugins: [
    commonjs(),
    vue(),
  ],
};
