!function(e,o){"object"==typeof exports&&"object"==typeof module?module.exports=o():"function"==typeof define&&define.amd?define("agilityAppSDK",[],o):"object"==typeof exports?exports.agilityAppSDK=o():e.agilityAppSDK=o()}("undefined"!=typeof self?self:this,(function(){return(()=>{"use strict";var e={d:(o,t)=>{for(var n in t)e.o(t,n)&&!e.o(o,n)&&Object.defineProperty(o,n,{enumerable:!0,get:t[n]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},o={};e.d(o,{default:()=>_});var t={};e.r(t),e.d(t,{APP_LOCATION_APP_CONFIG:()=>i,APP_LOCATION_CUSTOM_FIELD:()=>n,APP_LOCATION_FLYOUT:()=>l,APP_LOCATION_UNKNOWN:()=>a,closeFlyout:()=>u,getAppLocation:()=>g,initializeField:()=>s,openFlyout:()=>m,resolveAppComponent:()=>y,setAppConfig:()=>r,updateFieldHeight:()=>f,updateFieldValue:()=>d});var n="CustomField",a="Unknown",i="AppConfig",l="Flyout",r=function(e){window.parent&&window.parent.postMessage({message:e,type:"setAppConfig_for_".concat(e.name)},"*")},s=function(e){var o=e.location,t=e.containerRef,n=e.onReady,a=w("fieldID"),i=w("fieldName"),l=c({location:o,fieldName:i,fieldID:a});p({containerRef:t,messageID:l}),console.log("".concat(l," => Waiting for message from Agility CMS")),window.addEventListener("message",(function(e){e.data.type==="setInitialProps_for_".concat(l)?(console.log("".concat(l," => auth, fieldValue received from Agility CMS, setting up field...")),n(e.data.message)):console.log("".concat(l," => IGNORING MESSAGE FROM PARENT: "),e.data)}),!1),window.parent?(console.log("".concat(l," => 😀 Notifying Agility CMS this field is ready to receive messages...")),window.parent.postMessage({message:"ready",type:"ready_for_".concat(l)},"*")):console.log("".concat(l," => 😞 Parent window not found. You must load this within Agility CMS as an iFrame."))},c=function(e){return e.location+"_"+e.fieldName+"_"+e.fieldID},d=function(e){var o=e.value,t=e.location,n=e.fieldName,a=e.fieldID,i=c({location:t,fieldName:n,fieldID:a});window.parent?window.parent.postMessage({message:o,type:"setNewValue_for_".concat(i)},"*"):console.log("".concat(i," => 😞 Can't post message to parent."))},f=function(e){var o=e.height,t=e.messageID;window.parent&&window.parent.postMessage({message:o,type:"setHeight_for_".concat(t)},"*")},p=function(e){var o=e.containerRef,t=e.messageID;setInterval((function(){f({height:o.current?o.current.offsetHeight:o.offsetHeight,messageID:t})}),500)},m=function(e){var o=e.title,t=e.size,a=e.appLocationName,i=e.fieldName,r=e.fieldID,s=e.onClose,d=e.params,f=c({location:n,fieldID:r,fieldName:i});window.parent&&(window.parent.postMessage({message:{title:o,size:t,appLocation:l,appLocationName:a,params:d},type:"openFlyout_for_".concat(f)},"*"),window.addEventListener("message",(function e(o){o.data.type==="closeFlyoutCallback_for_".concat(f)&&s(o.data.message),window.removeEventListener("message",e,!1)}),!1))},u=function(e){var o=e.fieldName,t=e.fieldID,a=e.params,i=n,l=c({location:i,fieldID:t,fieldName:o});window.parent&&window.parent.postMessage({message:{location:i,fieldName:o,fieldID:t,params:a},type:"closeFlyout_for_".concat(l)},"*")},g=function(){var e=w("location");return e===n?{location:e,name:w("fieldTypeName")}:e===i||e===l?{location:e}:{location:a,name:null}},y=function(e){var o=g(),t=e.appComponents.find((function(e){return e.location===o.location&&(!o.name||e.name===o.name)}));if(t)return t.componentToRender;console.error("Could not render the '"+e.name+"' component for '"+o.location+"' with the name of '"+o.name+"'")},w=function(e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var o=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(window.location.search);return null===o?"":decodeURIComponent(o[1].replace(/\+/g," "))};const _=t;return o.default})()}));