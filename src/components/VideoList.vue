<template>
    <div class="video-list-box">
        <div class="displayList">
            <input type="checkbox" v-model="isChecked">
            <span>顯示</span>
        </div>

            <li v-if="isChecked" class="src-link" v-for="(value, key, index) in resources" >
                <a v-if="jump" class="link-reset" :href="toURLForm(value.key)" >{{value.name}}</a>
                <router-link class="link-reset" v-else  :to="{path: `/${value.key}`}">{{value.name}}</router-link>
                <a class="delete" @click.prevent="deleteResource(value.key)">X</a>
            </li>

    </div>
</template>


<script>
import * as helpers from '@/helpers/helpers.js'

export default {
  name: 'VideoList',
  data () {
      return {
          isChecked: true
      }
  },
  props: {
      resources: {
          type: Array,
          default: []
      },
      jump: {
          type: Boolean,
          default: false
      }
  },
  computed: {
      
  },
  methods: {
      toURLForm (path) {
          return `http://localhost:8080/#/${path}`
      },
      deleteResource (id) {
          var password =  prompt('請輸入該資源刪除密碼:', '12345678');
          var params = [
              {
                  id: id,
                  password: password
              }
          ];
          let updatedList;
          let self = this;
          let api = 'http://localhost:8080/delete';
          helpers.ajax("POST", api, JSON.stringify(params));
          this.$emit('updateList');
      }
  },
  mounted () {
  }
}
</script>



<style lang="scss" scoped>
.video-list-box {
    position: relative;
    width: 100vw;
    padding: 10px 20%;
    display: inline-block;
    float: left;
    width: 100%;
    height: 100%;
}

.list-box {
    list-style: none;
    text-align: left;
    margin-bottom: 10px;
}

.src-link {
    float: left;
    display: inline;
    margin-left: 6px;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 20px 18px;
    background-color: yellowgreen;
    &:hover {
        color: white;
    }
}

.link-reset {
    text-decoration: none;
    &:hover {
        color: white;
    }
}

.delete {
    cursor: pointer;
    color: red;
}
.displayList {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
