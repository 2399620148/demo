<template>
  <div class="w-full h-full" ref="playerRef"></div>
</template>

<script setup>
  const playerRef = ref(null);
  let playerObj;

  const props = defineProps({
    src: String,
    startTime: Number,
  })

  // import DPlayer from 'dplayer'

  onMounted( async () => {
    const DPlayer = await import('dplayer');
    playerObj = new DPlayer.default({
      container: playerRef.value,
      loop: false,
      video: {
        url: props.src,
      },
    })

    if (playerObj.template.menu) {
      if (playerObj.template.menu.remove) {
        playerObj.template.menu.remove();
      } else {
        playerObj.template.menu.removeNode(true);
      }
    }

    if(props.startTime) {
      playerObj.seek(props.startTime);
    }
  })

  // 监听视频地址改变，切换视频
  watch(() => props.src, (val) => {
    playerObj.switchVideo({
      url: val
    });
  })

  defineExpose({
    play: handlePlay,
    pause: handlePause
  })

  function handlePlay () {
    playerObj.play();
  }

  function handlePause () {
    playerObj.pause();
  }

</script>