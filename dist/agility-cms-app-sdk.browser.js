!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("agilityAppSDK",[],t):"object"==typeof exports?exports.agilityAppSDK=t():e.agilityAppSDK=t()}("undefined"!=typeof self?self:this,(function(){return(()=>{var e={187:(e,t,r)=>{"use strict";r.d(t,{default:()=>A});var n={};r.r(n),r.d(n,{openFlyout:()=>p,subscribeToFieldValueChanges:()=>d,updateFieldValue:()=>h});var o={};r.r(o),r.d(o,{closeFlyout:()=>m});var i={};r.r(i),r.d(i,{initializeField:()=>b,initializeFlyout:()=>L,resolveAppComponent:()=>I,sdkVersion:()=>y.i8,setAppConfig:()=>P,types:()=>a});const a={APP_LOCATION_CUSTOM_FIELD:"CustomField",APP_LOCATION_FLYOUT:"Flyout",APP_LOCATION_UNKNOWN:"Unknown",APP_LOCATION_APP_CONFIG:"AppConfig",APP_FLYOUT_SIZE_SMALL:"Small",APP_FLYOUT_SIZE_LARGE:"Small"};var c=function(e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var t=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(window.location.search);return null===t?"":decodeURIComponent(t[1].replace(/\+/g," "))},u=function(e){return e.location+"_"+e.fieldName+"_"+e.fieldID},s=function(e){var t=e.containerRef,r=e.messageID,n=0;setInterval((function(){var e=t.current?t.current.offsetHeight:t.offsetHeight;e!=n&&(console.log("height changed!"),function(e){var t=e.height,r=e.messageID;window.parent&&window.parent.postMessage({message:t,type:"setHeight_for_".concat(r)},"*")}({height:e,messageID:r})),n=e}),500)},l=function(e){var t=e.message,r=e.messageChannel;window.parent&&window.parent.postMessage({message:t,type:r},"*")},f=function(e){var t=e.messageChannel,r=e.persist,n=void 0!==r&&r;return new Promise((function(e){window.addEventListener("message",(function r(o){if(o.data.type===t)return n||removeEventListener("message",r,!1),void e(o.data.message)}),!1)}))},h=function(e){var t=e.fieldName,r=e.fieldValue,n=u({location:this.location,fieldName:this.fieldName,fieldID:this.fieldID});t||(t=this.fieldName),l({message:{fieldName:t,fieldValue:r},messageChannel:"setNewValue_for_".concat(n)})},p=function(e){var t=e.title,r=e.size,n=e.name,o=e.onClose,i=e.params,c=u({location:a.APP_LOCATION_CUSTOM_FIELD,fieldID:this.fieldID,fieldName:this.fieldName});l({message:{title:t,size:r,name:n,params:i},messageChannel:"openFlyout_for_".concat(c)}),f({messageChannel:"closeFlyoutCallback_for_".concat(c)}).then((function(e){o(e)}))},d=function(e){var t=e.fieldName,r=e.onChange,n=u({fieldID:this.fieldID,fieldName:this.fieldName,location:this.location});f({messageChannel:"otherValueChanged_".concat(t,"_for_").concat(n),persist:!0}).then((function(e){r(e)})),l({message:t,messageChannel:"subscribeToOtherValueChanges_".concat(n)})},m=function(e){var t=e.params,r=a.APP_LOCATION_CUSTOM_FIELD,n=u({location:r,fieldID:this.fieldID,fieldName:this.fieldName});l({message:{location:r,fieldName:this.fieldName,fieldID:this.fieldID,params:t},messageChannel:"closeFlyout_for_".concat(n)})};r(666);const y={i8:"0.2.2"};function g(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function v(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?g(Object(r),!0).forEach((function(t){_(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):g(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function _(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function O(e,t,r,n,o,i,a){try{var c=e[i](a),u=c.value}catch(e){return void r(e)}c.done?t(u):Promise.resolve(u).then(n,o)}function w(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function a(e){O(i,n,o,a,c,"next",e)}function c(e){O(i,n,o,a,c,"throw",e)}a(void 0)}))}}var P=function(e){e.__sdkVersion=y.i8;var t=c("appDefinitionID");l({message:e,messageChannel:"setAppConfig_for_".concat(t)})},b=function(){var e=w(regeneratorRuntime.mark((function e(t){var r,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.containerRef,e.next=3,N({containerRef:r,location:a.APP_LOCATION_CUSTOM_FIELD});case 3:return n=e.sent,e.abrupt("return",n);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),L=function(){var e=w(regeneratorRuntime.mark((function e(t){var r,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.containerRef,e.next=3,N({containerRef:r,location:a.APP_LOCATION_FLYOUT});case 3:return n=e.sent,e.abrupt("return",n);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),N=function(){var e=w(regeneratorRuntime.mark((function e(t){var r,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.containerRef,i=t.location,e.abrupt("return",new Promise((function(e){var t=c("fieldID"),h=c("fieldName"),p=u({location:i,fieldName:h,fieldID:t});s({containerRef:r,messageID:p}),f({messageChannel:"setInitialProps_for_".concat(p)}).then((function(t){t.location=i;var r={};i===a.APP_LOCATION_CUSTOM_FIELD?r=n:i===a.APP_LOCATION_FLYOUT&&(r=o),e(v(v({},t),r))})),l({message:"ready",messageChannel:"ready_for_".concat(p)})})));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),I=function(e){var t=C(),r=e.appComponents.find((function(e){return e.location===t.location&&(!t.name||e.name===t.name)}));return r?r.componentToRender:t.location===a.APP_LOCATION_APP_CONFIG?a.APP_LOCATION_APP_CONFIG:void console.error("Could not render the '"+e.name+"' component for '"+t.location+"' with the name of '"+t.name+"'")},C=function(){var e=c("location");return e===a.APP_LOCATION_CUSTOM_FIELD?{location:e,name:c("fieldTypeName")}:e===a.APP_LOCATION_APP_CONFIG?{location:e}:e===a.APP_LOCATION_FLYOUT?{location:e,name:c("flyoutName")}:{location:a.APP_LOCATION_UNKNOWN,name:null}};const A=i},666:e=>{var t=function(e){"use strict";var t,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{u({},"")}catch(e){u=function(e,t,r){return e[t]=r}}function s(e,t,r,n){var o=t&&t.prototype instanceof y?t:y,i=Object.create(o.prototype),a=new A(n||[]);return i._invoke=function(e,t,r){var n=f;return function(o,i){if(n===p)throw new Error("Generator is already running");if(n===d){if("throw"===o)throw i;return T()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=N(a,r);if(c){if(c===m)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=d,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=p;var u=l(e,t,r);if("normal"===u.type){if(n=r.done?d:h,u.arg===m)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n=d,r.method="throw",r.arg=u.arg)}}}(e,r,a),i}function l(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=s;var f="suspendedStart",h="suspendedYield",p="executing",d="completed",m={};function y(){}function g(){}function v(){}var _={};u(_,i,(function(){return this}));var O=Object.getPrototypeOf,w=O&&O(O(x([])));w&&w!==r&&n.call(w,i)&&(_=w);var P=v.prototype=y.prototype=Object.create(_);function b(e){["next","throw","return"].forEach((function(t){u(e,t,(function(e){return this._invoke(t,e)}))}))}function L(e,t){function r(o,i,a,c){var u=l(e[o],e,i);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==typeof f&&n.call(f,"__await")?t.resolve(f.__await).then((function(e){r("next",e,a,c)}),(function(e){r("throw",e,a,c)})):t.resolve(f).then((function(e){s.value=e,a(s)}),(function(e){return r("throw",e,a,c)}))}c(u.arg)}var o;this._invoke=function(e,n){function i(){return new t((function(t,o){r(e,n,t,o)}))}return o=o?o.then(i,i):i()}}function N(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,N(e,r),"throw"===r.method))return m;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return m}var o=l(n,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,m;var i=o.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function I(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function C(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function A(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(I,this),this.reset(!0)}function x(e){if(e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}return{next:T}}function T(){return{value:t,done:!0}}return g.prototype=v,u(P,"constructor",v),u(v,"constructor",g),g.displayName=u(v,c,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===g||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,v):(e.__proto__=v,u(e,c,"GeneratorFunction")),e.prototype=Object.create(P),e},e.awrap=function(e){return{__await:e}},b(L.prototype),u(L.prototype,a,(function(){return this})),e.AsyncIterator=L,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new L(s(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},b(P),u(P,c,"Generator"),u(P,i,(function(){return this})),u(P,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=x,A.prototype={constructor:A,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(C),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),m},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),C(r),m}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;C(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:x(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}(e.exports);try{regeneratorRuntime=t}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n=r(187);return n.default})()}));