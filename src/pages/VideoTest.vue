<template>
  <div>
      <UrlReceptor v-on:updateUrl="updateVideoSrc" v-on:updateListByAddRes="updateResourcesList"/>
      <VideoList :resources="res"  v-on:updateList="updateResourcesList"/>
      <Player v-if="hasVideoSrc" :src="url"/>

  </div>
</template>


<script>
import Player from '@/components/Player'
import UrlReceptor from '@/components/UrlReceptor'
import VideoList from '@/components/VideoList'
import * as helpers from '@/helpers/helpers.js'

export default {
  name: 'VideoTest',
  data () {
      return {
          url: '',
          res: undefined,
          apiGet: 'http://localhost:8080/resources'
      }
  },
  computed: {
    hasVideoSrc () {
      return this.url != '';
    }
  },
  methods: {
    updateVideoSrc (newSrc) {
      this.url = newSrc;
    },
    findResource () {
      for (let i=0; i < this.res.length;i++) {
        if (this.res!== undefined && this.res[i].key == this.id) {
          this.index = i;
        }
      }
    },
    updateResourcesList () {
      helpers.ajax("GET", this.apiGet, null, null, this);
      
    }
  },
  components: {
    Player,
    UrlReceptor,
    VideoList
  },
  mounted () {
    let api = 'http://localhost:8080/resources';
    let self = this;
    let id = window.location.hash.slice(2,);
    helpers.ajax("GET", api, null, self.findResource, this);
  }
}
</script>


<style lang="scss" scoped>

</style>
