import { mount } from '@vue/test-utils';
import { SECURE_INPUT_TYPE } from '@/plugin/constants';
import Component from '@/plugin//Component.vue';

const DEFAULT_LENGTH = 4;

describe('Component.vue', () => {
  it('correctly creates letters with "length" prop', () => {
    const propsData = {
      length: 5,
      value: '',
    };
    const { vm } = mount(Component, { propsData });
    const lettersCount = vm.$data.letters.length;

    expect(lettersCount).toEqual(propsData.length);
  });

  it('correctly creates letters without "length" prop', () => {
    const propsData = { value: '' };
    const { vm } = mount(Component, { propsData });
    const lettersCount = vm.$data.letters.length;

    expect(lettersCount).toEqual(DEFAULT_LENGTH);
  });

  it('correctly creates watchers with "length" prop', () => {
    const propsData = {
      length: 5,
      value: '',
    };
    const { vm } = mount(Component, { propsData });
    const watchersCount = Object.keys(vm.$data.watchers).length;

    expect(watchersCount).toEqual(propsData.length);
  });

  it('correctly creates watchers without "length" prop', () => {
    const propsData = { value: '' };
    const { vm } = mount(Component, { propsData });
    const watchersCount = Object.keys(vm.$data.watchers).length;

    expect(watchersCount).toEqual(DEFAULT_LENGTH);
  });

  it('focus first letter when autofocus enabled', async () => {
    const propsData = {
      value: '',
      autofocus: true,
    };
    const { vm } = mount(Component, { propsData });

    await vm.$nextTick();

    const { focusedLetterIdx } = vm.$data;
    expect(focusedLetterIdx).toEqual(0);
  });

  it('do not focus first letter when autofocus disabled', async () => {
    const propsData = {
      value: '',
      autofocus: false,
    };
    const wrapper = mount(Component, { propsData });

    await wrapper.vm.$nextTick();
    const cell = wrapper.findComponent({ ref: 'vue-pincode-input0' }).element;

    expect(document.activeElement === cell).toBe(false);
  });

  it('correctly sets secure input type', async () => {
    const propsData = {
      value: '',
      secure: true,
      characterPreview: false,
    };
    const wrapper = mount(Component, { propsData });

    await wrapper.vm.$nextTick();

    const refs = Object.keys(wrapper.vm.$refs);
    refs.forEach((ref: string) => {
      const cellElement = wrapper.findComponent({ ref }).element as HTMLInputElement;
      expect(cellElement.type).toBe(SECURE_INPUT_TYPE);
    });
  });

  it('correctly sets parent value', () => {
    const propsData = { value: '1234' };
    const { vm } = mount(Component, { propsData });

    expect((vm as any).pinCodeComputed).toBe('1234');
  });
});
