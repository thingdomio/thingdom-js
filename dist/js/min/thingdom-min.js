/**
 * Thingdom API JavaScript Wrapper
 *
 * @author     Andrew Welters <andrew.welters@mts.com>
 * @author     F. Stephen Kirschbaum <stephen.kirschbaum@mts.com>
 * @copyright  2014-2015 MTS Systems
 * @license    http://www.opensource.org/licenses/mit-license.html MIT License
 * @version    1.1
 * @link       https://github.com/thingdomio/thingdom-js
 * @website    https://thingdom.io
 */
(function(){"use strict";function Thingdom(){var e=new ThingdomIO;return e}var root=this,previous_thingdom=root.Thingdom;!function($_$){var win=window,xhrs=[function(){return new XMLHttpRequest},function(){return new ActiveXObject("Microsoft.XMLHTTP")},function(){return new ActiveXObject("MSXML2.XMLHTTP.3.0")},function(){return new ActiveXObject("MSXML2.XMLHTTP")}],_xhrf=null,hasOwnProperty=Object.prototype.hasOwnProperty,nativeForEach=Array.prototype.forEach,_each=function(e,t,r){if(null!==e)if(nativeForEach&&e.forEach===nativeForEach)e.forEach(t,r);else if(e.length===+e.length){for(var n=0,o=e.length;o>n;n++)if(n in e&&t.call(r,e[n],n,e)===breaker)return}else for(var a in e)if(hasOwnProperty.call(e,a)&&t.call(r,e[a],a,e)===breaker)return},_extend=function(e){return _each(Array.prototype.slice.call(arguments,1),function(t){for(var r in t)void 0!==t[r]&&(e[r]=t[r])}),e};$_$.xhr=function(){if(null!==_xhrf)return _xhrf();for(var e=0,t=xhrs.length;t>e;e++)try{var r=xhrs[e],n=r();if(null!==n)return _xhrf=r,n}catch(o){continue}return function(){}},$_$._xhrResp=function(xhr){switch(xhr.getResponseHeader("Content-Type").split(";")[0]){case"text/xml":return xhr.responseXML;case"text/json":case"application/json":case"text/javascript":case"application/javascript":case"application/x-javascript":return win.JSON?JSON.parse(xhr.responseText):eval(xhr.responseText);default:return xhr.responseText}},$_$._formData=function(e){var t=[],r=/%20/g;for(var n in e)t.push(encodeURIComponent(n).replace(r,"+")+"="+encodeURIComponent(e[n].toString()).replace(r,"+"));return t.join("&")},$_$.ajax=function(e){var t=$_$.xhr(),r=0,n;e=_extend({userAgent:"XMLHttpRequest",lang:"en",type:"GET",data:null,dataType:"application/x-www-form-urlencoded"},e),e.timeout&&(n=setTimeout(function(){t.abort(),e.timeoutFn&&e.timeoutFn(e.url)},e.timeout)),t.onreadystatechange=function(){4===t.readyState?(n&&clearTimeout(n),t.status<300?e.success&&e.success($_$._xhrResp(t)):e.error&&e.error(t,t.status,t.statusText),e.complete&&e.complete(t,t.statusText)):e.progress&&e.progress(++r)};var o=e.url,a=null,i="POST"===e.type||"PUT"===e.type;if(!i&&e.data&&(o+="?"+$_$._formData(e.data)),t.open(e.type,o),i){var s=e.dataType.indexOf("json")>=0;a=s?JSON.stringify(e.data):$_$._formData(e.data),t.setRequestHeader("Content-Type",s?"application/json":"application/x-www-form-urlencoded")}t.send(a)}}(root);var ThingdomIO=root.Thingdom=function(){var e=this,t="https://api.thingdom.io/1.1/";e.responses=[];var r=function(r,n,o){root.ajax({url:t+r,withCredentials:!0,type:"POST",dataType:"json",data:n,success:function(t){e.responses.push(t),"function"==typeof o&&o(t)},error:function(t){e.responses.push(t),"function"==typeof o&&o(t)}})},n=function(){var e="",t=document.getElementsByTagName("script"),r="",n=null,o=function(e){for(var t=o.options,r=t.parser[t.strictMode?"strict":"loose"].exec(e),n={},a=14;a--;)n[t.key[a]]=r[a]||"";return n[t.q.name]={},n[t.key[12]].replace(t.q.parser,function(e,r,o){r&&(n[t.q.name][r]=o)}),n};o.options={strictMode:!0,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}};for(var a=0;a<t.length;++a)if(r=t[0].getAttribute("src"),n=o(r),"thingdom.js"===n.file||"thingdom.min.js"===n.file){try{e=n.queryKey.api_secret}catch(i){}break}return e},o=function(){var t={},o=function(t){if("success"===t.response)for(var r in t)e[r]=t[r];else console.log(t)};"undefined"==typeof e.apiSecret&&(e.apiSecret=n()),t="undefined"!=typeof e.device_secret?{api_secret:e.apiSecret,device_secret:e.device_secret}:{api_secret:e.apiSecret},r("token",t,o)};o(),e.noConflict=function(){return root.previous_thingdom=previous_thingdom,e}};Thingdom.ThingdomIO=Thingdom,root.Thingdom=Thingdom}).call(this);
//# sourceMappingURL=./thingdom-min.js.map