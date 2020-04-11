import { mount, shallowMount } from '@vue/test-utils';
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

  it('use number regex by default', () => {
    const props = {
      value: '',
    };
    const wrapper = shallowMount(Component, {
      ...COMMON_PARAMS,
      propsData: { ...props },
    });
    const isValid = (wrapper.vm as any).isTheLetterValid('6');
    const { usedRegex } = (wrapper.vm as any);
    expect(isValid).toBe(true);
    expect(usedRegex).toBeInstanceOf(RegExp);
    expect(usedRegex.toString()).toBe('/^\\d{1}$/');
  });

  it('use regex letter', () => {
    const props = {
      value: '',
      regex: 'letter',
    };
    const wrapper = shallowMount(Component, {
      ...COMMON_PARAMS,
      propsData: { ...props },
    });
    const isValid = (wrapper.vm as any).isTheLetterValid('s');
    const { usedRegex } = (wrapper.vm as any);
    expect(isValid).toBe(true);
    expect(usedRegex).toBeInstanceOf(RegExp);
    expect(usedRegex.toString()).toBe('/^\\w{1}$/');
  });

  it('use regex special chars', () => {
    const props = {
      value: '',
      regex: 'special_chars',
    };
    const wrapper = shallowMount(Component, {
      ...COMMON_PARAMS,
      propsData: { ...props },
    });
    const isValid = (wrapper.vm as any).isTheLetterValid('*');
    const { usedRegex } = (wrapper.vm as any);
    expect(isValid).toBe(true);
    expect(usedRegex).toBeInstanceOf(RegExp);
    expect(usedRegex.toString()).toBe('/^\\W{1}$/');
  });

  it('use regex defined by user with no slashes at start and end', () => {
    const props = {
      value: '',
      regex: '^[a-c]{1}$',
    };
    const wrapper = shallowMount(Component, {
      ...COMMON_PARAMS,
      propsData: { ...props },
    });
    let isValid = (wrapper.vm as any).isTheLetterValid('b');
    expect(isValid).toBe(true);
    const { usedRegex } = (wrapper.vm as any);
    isValid = (wrapper.vm as any).isTheLetterValid('d');
    expect(isValid).toBe(false);
    expect(usedRegex).toBeInstanceOf(RegExp);
    expect(usedRegex.toString()).toBe('/^[a-c]{1}$/');
  });

  it('use regex defined by user with slashes at start and end', () => {
    const props = {
      value: '',
      regex: '/^[a-c/]{1}$/',
    };
    const wrapper = shallowMount(Component, {
      ...COMMON_PARAMS,
      propsData: { ...props },
    });
    const { usedRegex } = (wrapper.vm as any);
    const { isTheLetterValid } = (wrapper.vm as any);
    expect(isTheLetterValid('b')).toBe(true);
    expect(isTheLetterValid('d')).toBe(false);
    expect(usedRegex).toBeInstanceOf(RegExp);
    expect(usedRegex.toString()).toBe('/^[a-c\\/]{1}$/');
  });
});
