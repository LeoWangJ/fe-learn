<template>
  <div>
    <input type="file" ref="file" @change="fileHandler"/>
    <template v-if="msg">
      <p class="error">{{msg}}</p>
    </template>
    <template v-else>
      <p>預覽</p>
      <img :src="previewImg" ref="previewImg">
      <div style="margin:5px 0;">
        灰度圖
        <button @click="downloadHandler" v-if="downloadURL">下載灰度圖</button>
      </div>
      <canvas ref="canvas"></canvas>
    </template>
  </div>
</template>

<script>
const FILEERROR = {
  1 : '未找到文件',
  2 : '安全錯誤', 
  3 : '讀取被中斷',
  4 : '編碼錯誤'
} 
export default {
  name: 'PictureToGrayscale',
  data(){
    return {
      previewImg: null,
      msg: null,
      downloadURL: null
    }
  },
  methods:{
    fileHandler(evnet){
      let input = evnet.target
      if(input.files){
        if(!/image/.test(input.files[0].type)){
          this.msg = '僅能上傳圖片'
          return 
        }

        this.msg = null
        let reader = new FileReader();
        
        reader.onload = (e) =>{
          this.previewImg = e.target.result
          this.setCanvas()
        }
        
        reader.onerror = () =>{
          this.msg = `無法讀取檔案, 錯誤原因: ${FILEERROR[reader.error.code]}`
        }

        reader.readAsDataURL(input.files[0])
      }
    },
    setCanvas(){
      let previewImg = this.$refs.previewImg
      let canvas = this.$refs.canvas
      if(canvas.getContext){
        previewImg.onload = () => {
          let ctx = canvas.getContext("2d")
          canvas.width = previewImg.width
          canvas.height = previewImg.height
          ctx.drawImage(previewImg,0,0)
          this.converToGray(ctx)
        }
      }
    },
    converToGray(ctx){
      let canvas = this.$refs.canvas
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // 每個像素都包含紅、綠、藍、透明度, 所以 i 必須加四才能取得下一個像素
      for (let i = 0; i < imageData.data.length; i += 4) {
        let red = imageData.data[i];
        let green = imageData.data[i + 1];
        let blue = imageData.data[i + 2];
        // 取得平均值
        let gray = parseInt((red + green + blue) / 3);
        imageData.data[i] = gray;
        imageData.data[i + 1] = gray;
        imageData.data[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);
      let previewImg = this.$refs.previewImg
      const extension = previewImg.src.substring(previewImg.src.lastIndexOf('.') + 1).toLowerCase();
      this.downloadURL = canvas.toDataURL(`image/${extension}`,1)
    },
    downloadHandler(){
      const aTag = document.createElement('a')
      aTag.setAttribute('download','灰度圖')
      const image = new Image();
      image.src = this.downloadURL
      image.setAttribute('crossOrigin', 'Anonymous');
      image.onload = () => {
          aTag.href = this.downloadURL
          aTag.click();
      };
      }
  }
}
</script>

<style scoped>
.error{
  color: red
}
</style>