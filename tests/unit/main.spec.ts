import { mount } from '@vue/test-utils';
import Component from '@/plugin//Component.vue';
import { SECURE_INPUT_TYPE } from '@/plugin/constants';

const DEFAULT_LENGTH = 4;

describe('Component.vue', () => {
  it('correctly creates letters with "length" prop', () => {
    const propsData = {
      length: 5,
      value: '',
    };
    const wrapper = mount(Component, { propsData });
    const lettersCount = wrapper.vm.$data.letters.length;

    expect(lettersCount).toEqual(propsData.length);
  });

  it('correctly creates letters without "length" prop', () => {
    const propsData = { value: '' };
    const wrapper = mount(Component, { propsData });
    const lettersCount = wrapper.vm.$data.letters.length;

    expect(lettersCount).toEqual(DEFAULT_LENGTH);
  });

  it('correctly creates watchers with "length" prop', () => {
    const propsData = {
      length: 5,
      value: '',
    };
    const wrapper = mount(Component, { propsData });
    const watchersCount = Object.keys(wrapper.vm.$data.watchers).length;

    expect(watchersCount).toEqual(propsData.length);
  });

  it('correctly creates watchers without "length" prop', () => {
    const propsData = { value: '' };
    const wrapper = mount(Component, { propsData });
    const watchersCount = Object.keys(wrapper.vm.$data.watchers).length;

    expect(watchersCount).toEqual(DEFAULT_LENGTH);
  });

  it('focus first letter when autofocus enabled', () => {
    const propsData = {
      value: '',
      autofocus: true,
    };
    const wrapper = mount(Component, { propsData });

    wrapper.vm.$nextTick(() => {
      const { focusedLetterIdx } = wrapper.vm.$data;

      expect(focusedLetterIdx).toEqual(0);
    });
  });

  it('do not focus first letter when autofocus disabled', () => {
    const propsData = {
      value: '',
      autofocus: false,
    };
    const wrapper = mount(Component, { propsData });
    const { focusedLetterIdx } = wrapper.vm.$data;

    expect(focusedLetterIdx).toEqual(-1);
  });

  it('correctly sets secure input type', () => {
    const propsData = {
      value: '',
      secure: true,
      characterPreview: false,
    };
    const wrapper = mount(Component, { propsData });

    wrapper.vm.$nextTick(() => {
      const refs = Object.keys(wrapper.vm.$refs);
      refs.forEach((ref: string) => {
        const cellElement = (wrapper.vm.$refs[ref] as HTMLInputElement[])[0];
        expect(cellElement.type).toBe(SECURE_INPUT_TYPE);
      });
    });
  });

  it('correctly sets parent value', () => {
    const propsData = { value: '1234' };
    const wrapper = mount(Component, { propsData });

    expect((wrapper as any).vm.pinCodeComputed).toBe('1234');
  });
});
