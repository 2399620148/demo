<template>
  <div class=" w-32 h-10 cursor-pointer" :class="class" v-if="svgData" @click="getSvgData">
    <div v-html="svgData" class="w-full h-full flex items-center justify-center svgWrapper"></div>
  </div>
</template>

<script setup>
  const props = defineProps({
    class: String
  })
  const svgData = ref(null);

  onMounted(() => {
    getSvgData();
  })

  async function getSvgData () {
    const result = await $fetch('/api/user/captcha');
    const {data, status} = result;
    if(data.svg) {
      svgData.value = data.svg;
    } else {
      svgData.value = '点击重试';
    }
  }
</script>

<style>
  .svgWrapper svg{
    width: 120px;
    height: 40px;
  }
</style>