<template>
  <div class="w-full bg-[#dcdcdc] rounded-full" :style="{height: height + 'px'}">
    <div class="h-full bg-[#df3634] relative rounded-full" :style="{ width: percent + '%' }">
      <div class="w-[26px] h-[26px] absolute -right-[13px] -top-[9px]" v-if="icon">
        <img src="/play-red.png" class="w-full h-full" />
      </div>
    </div>
  </div>
</template>
<script setup>
  const props = defineProps({
    percent: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#1c5ba2'
    },
    icon: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 8
    }
  })
</script>