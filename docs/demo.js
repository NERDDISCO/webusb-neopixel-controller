!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);const r=new class{constructor(e={}){this.device=e.device||void 0,this.filters=e.filters||[{vendorId:9025,productId:32822},{vendorId:9025,productId:54},{vendorId:10755,productId:32822},{vendorId:10755,productId:54},{vendorId:10755,productId:64},{vendorId:10755,productId:32832},{vendorId:10374,productId:32770}],this.universe=e.universe||new Array(512).fill(0)}enable(){return navigator.usb.requestDevice({filters:this.filters}).then(e=>{this.device=e})}getPairedDevice(){return navigator.usb.getDevices().then(e=>e[0])}autoConnect(){return this.getPairedDevice().then(e=>(this.device=e,new Promise((e,t)=>void 0===this.device?t(new Error("Can not find USB device.")):e(this.connect()))))}connect(){return this.device.open().then(()=>{if(null===this.device.configuration)return this.device.selectConfiguration(1)}).then(()=>this.device.claimInterface(2)).then(()=>this.device.controlTransferOut({requestType:"class",recipient:"interface",request:34,value:1,index:2})).catch(e=>console.log(e))}send(e){return new Promise((t,n)=>{if(void 0===this.device)return n(new Error("USB device is not connected to the computer"));{const n=Uint8Array.from(e);return t(this.device.transferOut(4,n))}})}updateUniverse(e,t){return new Promise((n,r)=>{if(e-=1,Number.isInteger(t))this.universe.splice(e,1,t);else{if(!Array.isArray(t))return r(new Error("Could not update Universe because the provided value is not of type number or number[]"));this.universe.splice(e,t.length,...t)}return n(this.send(this.universe))})}disconnect(){return this.device.controlTransferOut({requestType:"class",recipient:"interface",request:34,value:1,index:2}).then(()=>this.device.close())}},i=new class{constructor(e={}){this.output=e.output,this.logUniverseElement=e.logUniverseElement,this.logUniverseEnabled=!1,this.logUniverseElement.addEventListener("change",e=>{const{target:t}=e;this.logUniverseEnabled=t.checked})}log(e,t,n){let r="";switch(n){case"USBDevice":r=`${e}: ${t}`;break;case"array":r=e+JSON.stringify(t);break;case"keyvalue":r=`${e}: ${t}`;break;default:r=e+" "+t}console.log(r),this.output.value+=r+"\n",this.output.scrollTop=this.output.scrollHeight}logUsbDevice(e){this.log("---","","string"),this.log("Selected device",e.productName,"USBDevice"),this.log("---","","string");const{configuration:t,configurations:n,deviceClass:r,deviceProtocol:i,deviceSubclass:o,deviceVersionMajor:s,deviceVersionMinor:c,deviceVersionSubminor:l,manufacturerName:a,opened:u,productId:d,productName:v,serialNumber:g,usbVersionMajor:h,usbVersionMinor:p,usbVersionSubminor:m,vendorId:f}=e,y=f.toString(16),b=d.toString(16);this.log("Opened",u,"keyvalue"),this.log("Vendor ID",`${f} (0x${y})`,"keyvalue"),this.log("Manufacturer Name",a,"keyvalue"),this.log("Product ID",`${d} (0x${b})`,"keyvalue"),this.log("Product Name",v,"keyvalue"),this.log("Serialnumber",g,"keyvalue"),this.log("Device Class",r,"keyvalue"),this.log("Device Protocol",i,"keyvalue"),this.log("Device Subclass",o,"keyvalue"),this.log("Device Version Major",s,"keyvalue"),this.log("Device Version Minor",c,"keyvalue"),this.log("Device Version Subminor",l,"keyvalue"),this.log("USB Version Major",h,"keyvalue"),this.log("USB Version Minor",p,"keyvalue"),this.log("USB Version Subminor",m,"keyvalue")}logUniverse(e){this.logUniverseEnabled&&this.log("",e,"array")}}({output:document.getElementById("console"),logUniverseElement:document.getElementById("logUniverse")}),o=document.getElementById("activateWebUsb"),s=document.getElementById("disconnectWebUsb"),c=document.getElementById("updateAnyChannel"),l=document.getElementById("changeColor"),a=document.getElementById("changeDimmer"),u=document.getElementById("changeUv"),d=document.getElementById("changeStrobe");o.addEventListener("click",e=>{r.enable().then(()=>{r.connect().then(()=>{i.logUsbDevice(r.device)})}).catch(()=>{i.log("No USB device was selected","","string")})}),s.addEventListener("click",e=>{r.disconnect().then(()=>{i.log("Destroyed connection to USB device, but USB device is still paired with the browser","","string")})}),r.autoConnect().then(()=>{i.log("Found an already paired USB device","","string"),i.logUsbDevice(r.device)}).catch(e=>{i.log("autoConnect:",e,"string")}),c.addEventListener("submit",e=>{e.preventDefault();const t=new FormData(c),n=parseInt(t.get("channel"),10),o=parseInt(t.get("value"),10);i.log("---","","string"),i.log(`Set Channel ${n} to ${o}`,"","string"),r.updateUniverse(n,o).then(()=>{i.logUniverse(r.universe)}).catch(e=>{i.logUniverse(r.universe),i.log(e,"","string")})}),l.addEventListener("change",e=>{let t=e.target.value.match(/[A-Za-z0-9]{2}/g).map(e=>parseInt(e,16));i.log("---","","string"),i.log(`Set Color on Channel 1 - 3 to ${t}`,"","string"),r.updateUniverse(1,t).then(()=>{i.logUniverse(r.universe)}).catch(e=>{i.logUniverse(r.universe),i.log(e,"","string")})}),u.addEventListener("change",e=>{let t=parseInt(e.target.value,10);i.log("---","","string"),i.log(`Set UV on Channel 4 to ${t}`,"","string"),r.updateUniverse(4,t).then(()=>{i.logUniverse(r.universe)}).catch(e=>{i.logUniverse(r.universe),i.log(e,"","string")})}),a.addEventListener("change",e=>{let t=parseInt(e.target.value,10);i.log("---","","string"),i.log(`Set Dimmer on Channel 5 to ${t}`,"","string"),r.updateUniverse(5,t).then(()=>{i.logUniverse(r.universe)}).catch(e=>{i.logUniverse(r.universe),i.log(e,"","string")})}),d.addEventListener("change",e=>{let t=parseInt(e.target.value,10);i.log("---","","string"),i.log(`Set Strobe on Channel 6 to ${t}`,"","string"),r.updateUniverse(6,t).then(()=>{i.logUniverse(r.universe)}).catch(e=>{i.logUniverse(r.universe),i.log(e,"","string")})})}])});
//# sourceMappingURL=demo.js.map