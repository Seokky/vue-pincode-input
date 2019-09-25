# vue-pincode-input
Great pincode input component for Vue.js applications.

## Features
- configurable length (symbols count)
- override-friendly styles
- auto moving focus when filling
- auto moving focus when deleting
- auto selecting cell content on focusing
- call for native numeric keyboard on mobiles

## Attention!

Styles that component have are written just for demo. But that styles are override-friendly, so you can write any styles you want.

## Usage

```
  npm i -D vue-pincode-input
```
or with yarn
```
  yarn add --dev vue-pincode-input
```

Then in any component:

```
import PincodeInput from 'vue-pincode-input';
// The name can be different depending on your desire
```

```
<div class="input-wrapper">
  <PincodeInput
    v-model="code"
    placeholder="0"
  />
</div>
```

```
<style>
.vue-pincode-input-wrapper {
  // any styles you want
}

.vue-pincode-input {
  // any styles you want
}
<style>
```
