<template>
  <div class="page-container">
      <h1 class="page-title">{{getVideoName}}</h1>
      <div class="player-box">
        <Player :src="res[index].url" />
      </div>
      <VideoList :resources="res" />
  </div>
</template>


<script>
import Player from '@/components/Player'
import * as helpers from '@/helpers/helpers.js'

export default {
  name: "savingPage",
  data () {
    return {
      res: undefined,
      index: NaN,
      id: window.location.hash.slice(2,)
    }
  },
  computed: {
    isLoaded () {
      return this.data !== undefined;
    },
    getVideoName () {
      let self = this;
      return (self.res !== undefined) ? self.res[self.index].name : 'No Data';
    },
    getVideoSource () {
      let self = this;
      return (self.res !== undefined) ? self.res[self.index].url : '';
    }
  },
  methods: {
    findResource (self) {
      for (let i=0; i < this.res.length;i++) {
        if (self.res!== undefined && self.res[i].key == self.id) {
          self.index = i;
        }
      }
    }
  },
  mounted () {
    let api = 'http://localhost:8080/resources';
    let self = this;
    let id = window.location.hash.slice(2,);
    helpers.ajax("GET", api, null, self.findResource, this);
  },
  components: {
    Player
  }
}
</script>


<style lang="scss" scoped>

.page-title{
  text-align: center;
}
.player-box {
  width: 800px;
  margin: 0 auto;
}
</style>
