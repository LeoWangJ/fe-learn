(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f384f194"],{2636:function(t,e,a){},"2baa":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("input",{ref:"file",attrs:{type:"file"},on:{change:t.fileHandler}}),t.msg?[a("p",{staticClass:"error"},[t._v(t._s(t.msg))])]:[a("p",[t._v("預覽")]),a("img",{ref:"previewImg",attrs:{src:t.previewImg}}),a("div",{staticStyle:{margin:"5px 0"}},[t._v(" 灰度圖 "),t.downloadURL?a("button",{on:{click:t.downloadHandler}},[t._v("下載灰度圖")]):t._e()]),a("canvas",{ref:"canvas"})]],2)},r=[],i={1:"未找到文件",2:"安全錯誤",3:"讀取被中斷",4:"編碼錯誤"},s={name:"PictureToGrayscale",data:function(){return{previewImg:null,msg:null,downloadURL:null}},methods:{fileHandler:function(t){var e=this,a=t.target;if(a.files){if(!/image/.test(a.files[0].type))return void(this.msg="僅能上傳圖片");this.msg=null;var n=new FileReader;n.onload=function(t){e.previewImg=t.target.result,e.setCanvas()},n.onerror=function(){e.msg="無法讀取檔案, 錯誤原因: ".concat(i[n.error.code])},n.readAsDataURL(a.files[0])}},setCanvas:function(){var t=this,e=this.$refs.previewImg,a=this.$refs.canvas;a.getContext&&(e.onload=function(){var n=a.getContext("2d");a.width=e.width,a.height=e.height,n.drawImage(e,0,0),t.converToGray(n)})},converToGray:function(t){for(var e=this.$refs.canvas,a=t.getImageData(0,0,e.width,e.height),n=0;n<a.data.length;n+=4){var r=a.data[n],i=a.data[n+1],s=a.data[n+2],o=parseInt((r+i+s)/3);a.data[n]=o,a.data[n+1]=o,a.data[n+2]=o}t.putImageData(a,0,0);var d=this.$refs.previewImg,c=d.src.substring(d.src.lastIndexOf(".")+1).toLowerCase();this.downloadURL=e.toDataURL("image/".concat(c),1)},downloadHandler:function(){var t=this,e=document.createElement("a");e.setAttribute("download","灰度圖");var a=new Image;a.src=this.downloadURL,a.setAttribute("crossOrigin","Anonymous"),a.onload=function(){e.href=t.downloadURL,e.click()}}}},o=s,d=(a("d989"),a("2877")),c=Object(d["a"])(o,n,r,!1,null,"2440952f",null);e["default"]=c.exports},d989:function(t,e,a){"use strict";a("2636")}}]);
//# sourceMappingURL=chunk-f384f194.3513c8c3.js.map