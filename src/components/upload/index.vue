<template>
  <div>
    <el-upload
        class="upload_demo"
        :action="objData.host"
        :before-upload="uploadOss"
        :file-list="fileList"
        :limit="1"
        :data="objData">
      <slot name="iconSlot" class="iconSlot"></slot>
      <slot name="uploadBtn" class="uploadBtn"></slot>
    </el-upload>
  </div>

</template>

<script>

import axios from 'axios'

export default {
  name: 'Upload',
  data() {
    return {
      fileList: [],
      objData: {
        OSSAccessKeyId: '',
        policy: '',
        Signature: '',
        key: '',
        host: '',
        dir: ''
      }
    };
  },
  methods: {
    uploadOss(file) {
      let _this = this;
      return new Promise((resolve, reject) => {
          axios.get('http://localhost:8881/oss/policy')
            .then(response => {
              _this.objData.OSSAccessKeyId = response.data.accessid;
              _this.objData.policy = response.data.policy;
              _this.objData.Signature = response.data.signature;
              _this.objData.dir = response.data.dir;
              _this.objData.host = response.data.host;
              _this.objData.key = response.data.dir + "${filename}";
              this.$emit("getUrl", this.objData.host + '/' + this.objData.dir + file.name);
              // console.log("file:", file)
              // console.log("data:", response.data);
              resolve(true);
            })
            .catch(error => {
              console.log(error)
              reject(false);
            })
      });
    },
  },

}
</script>

<style scoped>
.upload_demo {
  position: relative;
  /*background-color: red;*/
  width: 300px;
}
</style>