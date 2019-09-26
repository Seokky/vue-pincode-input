import { mount } from '@vue/test-utils';
import Component from '@/plugin//Component.vue';

const DEFAULT_LENGTH = 4;
const COMMON_PARAMS = {
  sync: false,
};

describe('Component.vue', () => {
  it('correctly creates letters with "length" prop', () => {
    const props = {
      length: 5,
      value: '',
    };
    const wrapper = mount(Component, {
      ...COMMON_PARAMS,
      propsData: { ...props },
    });
    const lettersCount = wrapper.vm.$data.letters.length;

    expect(lettersCount).toEqual(props.length);
  });

  it('correctly creates letters without "length" prop', () => {
    const props = {
      length: undefined,
      value: '',
    };
    const wrapper = mount(Component, {
      ...COMMON_PARAMS,
      propsData: { ...props },
    });
    const lettersCount = wrapper.vm.$data.letters.length;

    expect(lettersCount).toEqual(DEFAULT_LENGTH);
  });

  it('correctly creates watchers with "length" prop', () => {
    const props = {
      length: 5,
      value: '',
    };
    const wrapper = mount(Component, {
      ...COMMON_PARAMS,
      propsData: { ...props },
    });
    const watchersCount = Object.keys(wrapper.vm.$data.watchers).length;

    expect(watchersCount).toEqual(props.length);
  });

  it('correctly creates watchers without "length" prop', () => {
    const props = {
      length: undefined,
      value: '',
    };
    const wrapper = mount(Component, {
      ...COMMON_PARAMS,
      propsData: { ...props },
    });
    const watchersCount = Object.keys(wrapper.vm.$data.watchers).length;

    expect(watchersCount).toEqual(DEFAULT_LENGTH);
  });

  it('focus first letter when autofocus enabled', () => {
    const props = {
      length: undefined,
      value: '',
      autofocus: true,
    };
    const wrapper = mount(Component, {
      ...COMMON_PARAMS,
      propsData: { ...props },
    });
    const { focusedLetterIdx } = (wrapper as any).vm;

    expect(focusedLetterIdx).toEqual(0);
  });

  it('do not focus first letter when autofocus disabled', () => {
    const props = {
      length: undefined,
      value: '',
      autofocus: false,
    };
    const wrapper = mount(Component, {
      ...COMMON_PARAMS,
      propsData: { ...props },
    });
    const { focusedLetterIdx } = (wrapper as any).vm;

    expect(focusedLetterIdx).toEqual(-1);
  });
});
