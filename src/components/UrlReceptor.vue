<template>
  <div class="receptor-box">
      <div class="input-group">
        <div class="input-hint">資源名稱:</div>
        <input type="text" class="field" v-model="name" placeholder=" 劇名">
      </div>
      <div class="input-group">
        <div class="input-hint">密碼:</div>
        <input type="password" class="field" v-model="password" placeholder=" 刪除資源用密碼">
      </div>
      <div class="input-group">
        <div class="input-hint">影片網址:</div>
        <input type="url" class="field" v-model="url" placeholder=" http(s)://www.yoursource.com/videos/123456.mp4">
        <div class="store-btn" @click="saveUrlAsResource">儲存影片網址</div>
      </div>
      
  </div>
</template>

<script>
import * as helpers from '@/helpers/helpers.js'

export default {
  name: "UrlReceptor",
  data () {
      return {
          name: '',
          url: '',
          password: ''
      }
  },
  watch: {
      url:function (val, oldVal) {
          this.$emit("updateUrl", val);
      }
  },
  methods: {
      clearUrl () {
          this.name = '';
          this.url = '';
          this.password = '';
      },
      saveUrlAsResource () {
          let self = this;
          let data = {
              name: self.name,
              key: 'resources' + String(self.name).hashCode(),
              url: self.url
          };
          let resourcePair = {
              id: 'resources' + String(self.name).hashCode(),
              password: self.password
          };
          let params = [];
          params.push(data);
          params.push(resourcePair);
          
          let api = 'http://localhost:8080/updateResources';
          helpers.ajax("POST", api, JSON.stringify(params));
          this.$emit('updateListByAddRes');
          this.clearUrl();
      }

  }
}
</script>


<style lang="scss" scoped>

@mixin no-select {
    user-select: none;
}

.receptor-box {
    width: 100%;
    padding: 8px 25px;
    text-align: left;
    box-sizing: border-box;
}
.input-hint {
    @include no-select();
    width: 90px;
    display: inline-block;
    color:aqua;
}
.field {
    width: 400px;
    height: 25px;
    outline: none;
    display: inline-block;
}
.store-btn {
    @include no-select();
    padding: 8px 14px;
    font-size: 1em;
    font-weight: 700;
    background-color: bisque;
    display: inline-block;
}
.input-group {
    margin-bottom: 4px;
}
</style>
