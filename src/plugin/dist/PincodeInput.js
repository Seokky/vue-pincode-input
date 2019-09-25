import Vue from 'vue';

var BASE_REF_NAME = 'vue-pincode-input';
var LETTER_REGEXP = '^\\d{1}$';

var script = Vue.extend({
    props: {
        value: { type: String, required: true },
        length: { type: Number, default: 4 },
        autofocus: { type: Boolean, default: true },
    },
    data: function () { return ({
        baseRefName: BASE_REF_NAME,
        letters: [],
        focusedLetterIdx: 0,
    }); },
    computed: {
        pinCodeComputed: function () {
            return this.letters.reduce(function (pin, letter) { return pin + letter.value; }, '');
        },
    },
    watch: {
        length: {
            handler: function (val) {
                var _this = this;
                var _loop_1 = function (i) {
                    this_1.letters.push({ key: i, value: '' });
                    this_1.$watch("letters." + i + ".value", function (newVal, oldVal) {
                        _this.onLetterChanged(i, newVal, oldVal);
                    });
                };
                var this_1 = this;
                for (var i = 0; i < val; i += 1) {
                    _loop_1(i);
                }
            },
            immediate: true,
        },
        focusedLetterIdx: function (val) {
            this.focusLetterByIndex(val);
        },
        pinCodeComputed: function (val) {
            this.$emit('input', val);
        },
    },
    mounted: function () {
        if (this.autofocus) {
            this.focusLetterByIndex(0);
        }
    },
    methods: {
        letterIsValid: function (letter) {
            var letterIsValid = true;
            if (letter.length === 1 && !letter.match(LETTER_REGEXP)) {
                letterIsValid = false;
            }
            else if (letter.length > 1) {
                letterIsValid = false;
            }
            return letterIsValid;
        },
        onLetterChanged: function (index, newVal, oldVal) {
            var _this = this;
            if (!this.letterIsValid(newVal)) {
                this.$nextTick(function () {
                    _this.letters[index].value = oldVal;
                });
            }
            else if (newVal.length) {
                this.setFocusedLetterIndex(this.focusedLetterIdx + 1);
            }
        },
        setFocusedLetterIndex: function (newIndex) {
            if (newIndex < 0 || newIndex >= this.length) {
                return;
            }
            this.focusedLetterIdx = newIndex;
        },
        focusLetterByIndex: function (index) {
            var refName = "" + this.baseRefName + index;
            this.$refs[refName][0].focus();
            this.$refs[refName][0].select();
        },
    },
});

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD;
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);

      if (HEAD === undefined) {
        HEAD = document.head || document.getElementsByTagName('head')[0];
      }

      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-pincode-input-wrapper"},_vm._l((_vm.letters),function(letter,index){return _c('input',_vm._b({directives:[{name:"model",rawName:"v-model",value:(letter.value),expression:"letter.value"}],key:letter.key,ref:("" + _vm.baseRefName + index),refInFor:true,staticClass:"vue-pincode-input",attrs:{"type":"tel"},domProps:{"value":(letter.value)},on:{"focus":function($event){return _vm.setFocusedLetterIndex(index)},"input":function($event){if($event.target.composing){ return; }_vm.$set(letter, "value", $event.target.value);}}},'input',_vm.$attrs,false))}),0)};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-58735003_0", { source: ".vue-pincode-input-wrapper{display:inline-flex}.vue-pincode-input{outline:0;margin:3px;padding:1rem;max-width:20px;text-align:center;font-size:1.1rem;border:none;border-radius:3px;box-shadow:0 0 3px rgba(0,0,0,.5)}.vue-pincode-input:focus{box-shadow:0 0 6px rgba(0,0,0,.5)}", map: undefined, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */



  var Component = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

export default Component;
