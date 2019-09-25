import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import minify from 'rollup-plugin-babel-minify';

export default {
  input: 'src/plugin/Component.vue',
  output: {
    format: 'esm',
    file: 'src/plugin/dist/PincodeInput.js',
  },
  external: ['vue'],
  plugins: [
    commonjs(),
    typescript({
      module: 'es2015',
    }),
    vue(),
    minify(),
  ],
};
