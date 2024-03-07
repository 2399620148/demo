<template>
  <div class="w-full h-full" @contextmenu="handleForbid">
    <VideoPlayer :src="src" :width="width" :height="height" :loop="loop" :volume="0.6" controls @mounted="handleMounted"
      @loadedmetadata="handleLoad" @seeked="handleSeek" @play="handlePlay" @ended="handleEnd" @pause="handlePause"
      @error="handleError" />
  </div>
</template>

<script setup>

const props = defineProps({
  src: String,
  width: Number,
  height: Number,
  start: {
    type: Number,
    default: 0,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  learnedTime: {
    type: Number,
    default: 0,
  },
});


const emits = defineEmits(["play", "pause", "ready", 'seeking', 'end', 'duration']);

let currentPlayer;
let currentState;

function handleForbid(e) {
  e.preventDefault();
  e.stopPropagation();
}


function handleLoad() {
  emits('duration', currentState.duration)
  if (props.start > 0) {
    currentPlayer.play();
    currentPlayer.currentTime(props.start);
  }
}


function handleMounted({ video, player, state }) {
  currentPlayer = player;
  currentState = state;
  if (props.start > 0) {
    player.currentTime(props.start);
  }
  emits("ready", {
    play: () => {
      currentPlayer.play();
    },
    pause: () => {
      return currentPlayer.pause();
    },
    seek: (time) => {
      // 更新进度条元素，这里假设有一个 id 为 progress-bar 的元素
      const duration = player.duration();
      const percentage = (time / duration) * 100;
      const progressBar = document.getElementsByClassName('vjs-play-progress')[0];
      progressBar.style.width = `${percentage}%`;
      currentPlayer.currentTime(time);
    },
    dispose: () => {
      return currentPlayer.dispose();
    },
    getCurrent: (time) => {
      return state.currentTime;
    },
    getState: () => {
      if (state.playing) {
        return "playing";
      }
      return "paused";
    },
  });
}

function handlePlay() {
  emits("play");
}

function handlePause() {
  emits("pause");
}
function handleSeek() {
  emits("seeking");
}

function handleEnd() {
  emits("end");
}

function handleError(err) {
  // message.error('此课件无法播放，请联系客服！')
  emits("end", 'error');
}
</script>
