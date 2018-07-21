<template>
  <div class="container">
    <div v-if="!isPC" class="mobile">
        <video :src="src" controls></video>
    </div>
    <div v-if="isPC" class="player" ref="player">
        <video  ref="video" @timeupdate="updatVideoTime" @canplaythrough="canPlay">
            <source :src="src" type="video/mp4"/>
        </video>
        <div class="screen" @click="playOrPause">
            <div class="vol-hint" ref="volchangeHint">
                <span class="vol-icon-wrap">
                    <icon class="vol-hint-icon" name="volume-up" scale="1.15"></icon>
                </span>
                <span class="volume">{{`${volumeVal}%`}}</span>
            </div>
        </div>
        <div class="loading" ref="loadingHint">
            <span class="loading-hint">Loading...</span>
        </div>
        <div class="control-bar" ref="controlbar">
        <div class="progress-track" @click="load" @mousemove.stop="preview" @mouseleave="hidePreview">
            <div class="buffer" :style="bufferWidth"></div>
            <div class="progress-now" :style="{width: pgNow + 'px'}">
                <div class="pg-handler"></div>
            </div>
            <div class="preview-video" :style="previewTimeStyle">
                <video ref="prevVideo"  :src="src"></video>
            </div>
            <div class="progress-now-time" :style="previewTimeStyle">{{previewTimeToDisplay()}}</div>
        </div>
        <div class="video-config-wrap">
            <div class="play-wrap" @click="play">
                <icon v-if="isPause && this.currentTime < this.duration" class="player-fun" name="play"></icon>
                <icon v-if="!isPause && this.currentTime < this.duration" class="player-fun" name="pause"></icon>
                <icon v-if="this.currentTime >= this.duration" class="player-fun" name="undo"></icon>
            </div>
            <div class="mute-btn" @click.stop="mute">
                <icon v-if="!isMute" class="player-fun" name="volume-up" scale="1.12"></icon>
                <icon v-if="isMute" class="player-fun" name="volume-off" scale="1.12"></icon>
            </div>
            <div class="volumebar-wrap">
                <input type="range" :class="{mute: isMute}"  @change="handleVolume"  ref="volume" max="100" min="0" v-model="volumeVal">
            </div>
            <div class="video-time-wrap">
                <span class="video-time-now">{{videoCurrTimeText}}</span>
                <span class="video-divider">/</span>
                <span class="video-time-total">{{videoTotalTime}}</span>
            </div>
            <div class="other"></div>
            <div class="fullscreen-wrap" @click="fullScreen">
                <icon class="player-fun" name="expand" scale="1.12"></icon>
            </div>
        </div>
        </div>
    </div>
  </div>
</template>


<script>
import 'vue-awesome/icons/play'
import 'vue-awesome/icons/pause'
import 'vue-awesome/icons/undo'
import 'vue-awesome/icons/volume-up'
import 'vue-awesome/icons/volume-off'
import 'vue-awesome/icons/expand'
import 'vue-awesome/icons/compress'
import Icon from 'vue-awesome/components/Icon'

export default {
  name: 'Player',
  data () {
    return {
        pgLength: 838,
        pgNow: 0,
        video: null,
        duration: 0,
        currentTime: null,
        isPause: null,
        backforwardTime: 5,
        previewTime: null,
        previewPG: null,
        isPreview: false,
        previewScenes: [],
        volumeVal: 100,
        volMax: null,
        volMin: null,
        volRatio: 1,
        isMute: false,
        isFullScreen: false,
        mouseTimer: null,
        cursorVisible: true,
        isPC: true
    }
  },
  props: {
      src: {
          type: String,
          default: 'http://html5doctor.com/demos/video-canvas-magic/video.webm'
      }
  },
  components: {
      Icon
  },
  computed: {
      videoTotalTime () {
          return this.toTimeForm(this.duration);
      },
      seekVideoTime () {
          return Math.round(this.progressRatio * this.duration);
      },
      videoCurrTimeText () {
          return  this.toTimeForm(this.currentTime);
      },
      progressRatio () {
          return this.pgNow / this.pgLength;
      },
      bufferWidth () {
          return this.pgNow >= this.pgLength ? { width: `100%` } : { width: `100%`};
      },
      previewTimeStyle () {
          let self = this;
          return this.isPreview &&  this.previewPG <= (this.pgLength - 88) && this.previewPG > 38 ? {left: `${self.previewPG}px`, display: 'block'} : this.isPreview &&  this.previewPG > (this.pgLength - 88)  ? {left: `${this.pgLength - 88}px`, display: 'block'} : this.isPreview &&   this.previewPG < 38 ? { left: `${38}px`, display: 'block'} : {display: 'none' };
      },
      volumeStyle () {
          let min = this.volMin;
          let max = this.volMax;
          let r = (this.volumeVal - min) / (max - min);
          return this.isMute ? {backgroundImage: `-webkit-gradient(linear, left top, right top, color-stop(${0}, #00a1d6), color-stop(${0}, #ccc))`} : {backgroundImage: `-webkit-gradient(linear, left top, right top, color-stop(${r}, #00a1d6), color-stop(${r}, #ccc))`};
      }
  },
  methods: {
      play () {
         this.playOrPause();
      },
      updatVideoTime () {
          this.currentTime = Math.floor(this.$refs.video.currentTime);
      },
      load (e) {
          this.pgNow = e.offsetX < this.pgLength ? e.offsetX: this.pgLength;
          this.$refs.video.currentTime = this.seekVideoTime;
      },
      preview (e) {
          this.isPreview = e.target.className === 'pg-handler' ? false : true;
          this.previewPG = (e.offsetX < this.pgLength) ? e.offsetX : this.pgLength;
          this.previewTime = this.previewPG / this.pgLength * this.duration;
          this.previewScene();
      },
      to2Bit (num) {
          return (num < 10) ? '0' + num : num + '';
      },
      toTimeForm (t) {
          let min = Math.floor(t / 60);
          let sec = Math.floor(t % 60);
          return min + ':' + this.to2Bit(sec);
      },
      previewTimeToDisplay () {
          return this.toTimeForm(this.previewTime);
      },
      previewScene () {
          let self = this;
          this.$refs.prevVideo.currentTime = this.previewTime;
      },
      hidePreview (e) {
          this.isPreview = false;
      },
      handleVolume () {
          this.isMute = this.volumeVal === 0;
          this.$refs.volchangeHint.style.display = 'block';
          this.disappear(this.$refs.volchangeHint);
          this.volRatio = Number(this.volumeVal) / Number(this.volMax);
          this.$refs.video.volume = Number(this.volumeVal) / Number(this.volMax);
      },
      mute () {   
        this.$refs.video.muted = !this.isMute ? true : false;
        this.isMute = !this.isMute; 
      },
      arrowkeyToProgress (timeToGo) {
        let self = this;
        self.$refs.video.currentTime = self.video.currentTime + timeToGo;
        self.pgNow = self.$refs.video.currentTime / self.duration * self.pgLength;
      },
      shortcutVolume (change) {
          this.volumeVal = (Number(this.volumeVal) + change)
          if (this.volumeVal > 100) {
              this.volumeVal = 100;
          } else if (this.volumeVal < 0) {
              this.volumeVal = 0;
          }
          this.handleVolume();
      },
      playOrPause () {
        this.isPause = this.$refs.video.paused;
        if(this.isPause) {
            if (this.currentTime >= this.duration) {
                this.pgNow = 0;
            }
             this.$refs.video.play();
        } else {
             this.$refs.video.pause();
        }
      },
      fullScreen () {
          let isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

        let docElm = this.$refs.player;
        if (!isInFullScreen) {
            this.pgNow = this.progressRatio * (window.innerWidth - 8);
            this.pgLength = window.innerWidth - 8;
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        } else {
            this.pgNow = this.progressRatio * 838;
            this.pgLength = 838;
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
      },
      exitHandler () {
          //for ESC to exit full screen mode
        if (document.exitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen !== null)
        {
            if (this.isFullScreen) {
                this.pgNow = this.progressRatio * 838;
                this.pgLength = 838;
            }
            this.isFullScreen = !this.isFullScreen;
        }
      },
      disapperCursor () {
          if (this.isFullScreen) {
              this.mouseTimer = null;
              document.body.style.cursor = 'none';
              this.$refs.controlbar.style.display = 'none';
              this.cursorVisible = false;
          }
      },
      disappear (dom) {
          setTimeout(function() {
              dom.style.display = 'none';
          }, 500);
      },
      canPlay () {
          this.disappear(this.$refs.loadingHint);
      }
  },
  mounted() {
      this.video = this.$refs.video;
      let self = this;
      self.volMax = Number(self.$refs.volume.max);
      self.volMin = Number(self.$refs.volume.min);
      window.setInterval(function(t) {
          if(self.video.readyState > 0) {
              self.duration = Math.round(self.video.duration);
              self.currentTime = self.video.currentTime;
              self.isPause = self.video.paused;
              clearInterval(t);
          }
      }, 500);

      window.addEventListener('keydown', function (e) {
        if (e.keyCode === 37) {
            self.arrowkeyToProgress(-self.backforwardTime);
        } else if (e.keyCode === 38) {
            e.preventDefault();
            self.shortcutVolume(5);
        } else if (e.keyCode === 39) {
            self.arrowkeyToProgress(self.backforwardTime);
        } else if (e.keyCode === 40) {
            e.preventDefault();
            self.shortcutVolume(-5);
        } else if (e.keyCode === 32) {
            self.playOrPause();
        } else if (e.keyCode === 75) {
            self.playOrPause();
        }
      });

      document.addEventListener('webkitfullscreenchange', self.exitHandler, false);
      document.addEventListener('mozfullscreenchange', self.exitHandler, false);
      document.addEventListener('fullscreenchange', self.exitHandler, false);
      document.addEventListener('MSFullscreenChange', self.exitHandler, false);

      (function () {
          document.onmousemove = function () {
              if (self.mouseTimer) {
                  window.clearTimeout(self.mouseTimer);
              }
              if (!self.cursorVisible) {
                  document.body.style.cursor = "default";
                  self.cursorVisible = true;
                  self.$refs.controlbar.style.display = 'block';
              }
              self.mouseTimer = window.setTimeout(self.disapperCursor, 1000);
          }
      })();

      (function () {
          let ua = window.navigator.userAgent,
          agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod'];
          self.isPC = true;
          for (let i=0, len=agents.length;i<len;i++) {
              if (ua.indexOf(agents[i]) > 0) {
                  self.isPC = false;
                  break;
              }
          }
      })();
      
      
  }
}
</script>


<style lang="scss" scoped>

$debug: false;
$progress-color: #00a1d6;

@mixin debug-shadow {
    @if $debug == true {
        box-shadow: 0px 0px 1px blue;
    }
}
@mixin debug-red-shadow {
    @if $debug == true {
        box-shadow:  0 0 1px #f00;
    }
}
@mixin center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}


* {
    box-sizing: border-box;
}
div {
  padding: 0;
  margin: 0;
}

.player {
  position: relative;
  width: 854px;
  height: 458px;
    
  &:-webkit-full-screen , &:fullscreen {
      width: 100vw !important;
      height: 100vh !important;
      display: block;
  }

  &:-webkit-full-screen .other, &:fullscreen .other{
      width: calc(100% - 275px) !important;
  }

  &:-webkit-full-screen .control-bar, &:fullscreen .control-bar {
      width: 100% !important;
      &:hover {
          display: block;
      }
  }
  
  &:-webkit-full-screen video, &:fullscreen video {
      width: 100% !important;
  }
  & > video {
    width: 100%;
    height: 100%;
    object-fit: unset;
  }
  & > .control-bar {
    @include debug-red-shadow();
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    padding: 0 8px 10px;
    height: 35px;
    vertical-align: middle;
    background-color: rgba(0, 0, 0, .1);
  }
}

.screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 33px);
    & > .vol-hint {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100px;
        height: 30px;
        vertical-align: top;
        padding-top: 6px;
        border-radius: 8px;
        transform: translate(-50%, -50%);
        background-color: #aaa;
        color: #111;
        display: none;
        & svg, & span {
            display: inline-block;
            vertical-align: top;
        }
    }
}

.progress-track {
    width: 100%;
    height: 5px;
    position: relative;
    background-color: #ccc;
    border-radius: 8px;
    display: block;
    & .buffer {   
        position: absolute;
        height: 100%;
        width: 20px;
        border-radius: 8px ;
        background-color: #ececec;
    }
    & > .progress-now {
        position: relative;
        height: 100%;
        width: 5px;
        background-color: $progress-color;
        & > .pg-handler {
            position: absolute;
            right: 0;
            top: 0;
            width: 9px;
            height: 9px;
            background-color: $progress-color;
            border-radius: 50%;
            transform: translate(50%, -15%);
        }
    }
}

.progress-now-time {
    position: absolute;
    top: -25px;
    width: 45px;
    height: 20px;
    border-radius: 5px/3px ;
    font-size: 0.9em;
    background-color: rgba(0, 0, 0, .2);
    color: #fff;
    line-height: 22px;
}

.preview-video {
    position: absolute;
    bottom: calc(100% + 5px);
    left: 0;
    width: 120px;
    height: 80px;
    transform: translateX(-30%);
    & > video {
        width: 100%;
        height: 100%;
        transform: translateY(2px);
        
    }
}



.video-config-wrap {
    @include debug-shadow();
    width: 100%;
    height: calc(100% - 5px);
    padding-top: 5px;
    padding-left: 20px;
    & > * {
        float: left;
    }

    &::after {
        content: ' ';
        display: block;
        clear: both;
    }
}

.play-wrap {
    display: inline-block;
    width: 25px;
}

.player-fun {
    color: #fef;
}

.mute-btn {
    border: none;
    background: unset;
    width: 25px;
    display: inline-block;
}

.volumebar-wrap {
    position: relative;
    width: 100px;
    height: 100%;
}

input[type=range] {
    -webkit-appearance: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    outline: none;
    margin-top: 0;
    margin-bottom: 3px;
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        margin-top: -2px;
        width: 10px;
        height: 10px;
        background: $progress-color;
        border-radius: 50%;
        transition: .2s;
    }

    
}
input.mute[type=range]::-webkit-slider-thumb {
    background: #ccc;
}
input[type=range]::-webkit-slider-runnable-track {
    height: 4px;
    -webkit-appearance: none;
    margin-top: -1px;
    
}


.video-time-wrap {
    width: 84px;
    height: 100%;
    font-size: 0.8em;
    margin-left: 5px;
    color: #fef;
}

.other {
    width: calc(100% - 274px) !important;
    height: 100%;
}

.fullscreen-wrap {
    width: 35px;
    height: 100%;
}

.loading {
    position: absolute;
    top: 47%;
    left: 48%;
    transform: translate(-50%,-50%);
    border-radius: 50%;
    width: 100px;
    height: 100px;
    color: white;
    background-color:aquamarine;
    & > .loading-hint {
        @include center;
        font-weight: 700;
    }
}
</style>
