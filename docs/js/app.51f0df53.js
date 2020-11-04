(function(e){function t(t){for(var i,s,u=t[0],r=t[1],c=t[2],f=0,d=[];f<u.length;f++)s=u[f],Object.prototype.hasOwnProperty.call(l,s)&&l[s]&&d.push(l[s][0]),l[s]=0;for(i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i]);a&&a(t);while(d.length)d.shift()();return o.push.apply(o,c||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],i=!0,u=1;u<n.length;u++){var r=n[u];0!==l[r]&&(i=!1)}i&&(o.splice(t--,1),e=s(s.s=n[0]))}return e}var i={},l={app:0},o=[];function s(t){if(i[t])return i[t].exports;var n=i[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=i,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)s.d(n,i,function(t){return e[t]}.bind(null,i));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/vue-pincode-input/";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],r=u.push.bind(u);u.push=t,u=u.slice();for(var c=0;c<u.length;c++)t(u[c]);var a=r;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"55b1":function(e,t,n){"use strict";var i=n("7ab4"),l=n.n(i);l.a},"5c0b":function(e,t,n){"use strict";var i=n("e332"),l=n.n(i);l.a},"7ab4":function(e,t,n){},cd49:function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var i=n("2b0e"),l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",[n("PincodeInput",{attrs:{placeholder:"0"},model:{value:e.code,callback:function(t){e.code=t},expression:"code"}}),n("div",{staticClass:"monitor"},[n("span",{staticClass:"monitor-label"},[e._v("Parent value:")]),n("span",{domProps:{textContent:e._s(e.code)}})]),n("button",{staticClass:"reset-button",on:{click:e.reset}},[e._v("\n      Reset\n    ")])],1)])},o=[],s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"vue-pincode-input-wrapper"},e._l(e.cells,(function(t,i){return n("input",e._b({directives:[{name:"model",rawName:"v-model.trim",value:t.value,expression:"cell.value",modifiers:{trim:!0}}],key:t.key,ref:""+e.baseRefName+i,refInFor:!0,staticClass:"vue-pincode-input",attrs:{type:e.cellsInputTypes[i]},domProps:{value:t.value},on:{focus:function(t){e.focusedCellIdx=i},keydown:[function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"delete",[8,46],t.key,["Backspace","Delete","Del"])?null:e.onCellErase(i,t)},e.onKeyDown],input:function(n){n.target.composing||e.$set(t,"value",n.target.value.trim())},blur:function(t){return e.$forceUpdate()}}},"input",e.$attrs,!1))})),0)},u=[],r=(n("4917"),n("7f7f"),n("456d"),n("28a5"),n("ac6a"),n("c5f6"),{value:{type:String,required:!0},length:{type:Number,default:4},autofocus:{type:Boolean,default:!0},secure:{type:Boolean,default:!1},characterPreview:{type:Boolean,default:!0},charPreviewDuration:{type:Number,default:300}}),c="vue-pincode-input",a="^\\d{1}$",f="tel",d="password",p=i["a"].extend({props:r,data:function(){return{baseRefName:c,focusedCellIdx:0,cells:[],watchers:{},cellsInputTypes:{}}},computed:{pinCodeComputed:function(){return this.cells.reduce((function(e,t){return e+t.value}),"")}},watch:{value:function(e){e?this.onParentValueUpdated():this.reset()},length:function(){this.reset()},pinCodeComputed:function(e){this.$emit("input",e)}},mounted:function(){this.init(),this.onParentValueUpdated(),this.autofocus&&this.$nextTick(this.focusCellByIndex)},methods:{init:function(){for(var e=this.getRelevantInputType(),t=0;t<this.length;t+=1)this.setCellObject(t),this.setCellInputType(t,e),this.setCellWatcher(t)},setCellObject:function(e){this.$set(this.cells,e,{key:e,value:""})},setCellInputType:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:d;this.$set(this.cellsInputTypes,e,t)},setCellWatcher:function(e){var t=this,n="cells.".concat(e,".value");this.watchers[n]=this.$watch(n,(function(n,i){return t.onCellChanged(e,n,i)}))},onParentValueUpdated:function(){var e=this;this.value.length===this.length?this.value.split("").forEach((function(t,n){e.cells[n].value=t||""})):this.$emit("input",this.pinCodeComputed)},onCellChanged:function(e,t,n){this.isTheCellValid(t,!1)?(this.focusNextCell(),this.secure&&this.characterPreview&&setTimeout(this.setCellInputType,this.charPreviewDuration,e)):this.cells[e].value=""},onCellErase:function(e,t){var n=this.cells[e].value.length;n||(this.focusPreviousCell(),t.preventDefault())},onKeyDown:function(e){switch(e.keyCode){case 37:this.focusPreviousCell();break;case 39:this.focusNextCell();break;default:break}},reset:function(){this.unwatchCells(),this.init(),this.focusCellByIndex()},unwatchCells:function(){var e=this,t=Object.keys(this.watchers);t.forEach((function(t){return e.watchers[t]()}))},isTheCellValid:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return e?!!e.match(a):!!t&&""===e},getRelevantInputType:function(){return this.secure&&!this.characterPreview?d:f},focusPreviousCell:function(){this.focusedCellIdx&&this.focusCellByIndex(this.focusedCellIdx-1)},focusNextCell:function(){this.focusedCellIdx!==this.length-1&&this.focusCellByIndex(this.focusedCellIdx+1)},focusCellByIndex:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t="".concat(this.baseRefName).concat(e),n=this.$refs[t][0];n.focus(),n.select(),this.focusedCellIdx=e}}}),h=p,v=(n("55b1"),n("2877")),y=Object(v["a"])(h,s,u,!1,null,null,null),C=y.exports,b=i["a"].extend({name:"App",components:{PincodeInput:C},data:function(){return{code:""}},methods:{reset:function(){this.code=""}}}),m=b,w=(n("5c0b"),Object(v["a"])(m,l,o,!1,null,null,null)),g=w.exports;i["a"].config.productionTip=!1,new i["a"]({render:function(e){return e(g)}}).$mount("#app")},e332:function(e,t,n){}});