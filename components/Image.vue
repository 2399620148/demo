<template>
  <div class="w-full h-full text-[0px] overflow-hidden group" :class="props.class">
    <img :src=" imageServer + src " class="w-full h-full object-cover transition duration-300" :class="{ 'group-hover:scale-105': animate }" />
  </div>
</template>
<script setup>
  const props = defineProps({
    src: String,
    class: String,
    animate: {
      type: Boolean,
      default: false
    }
  })
  const imageServer = '';
</script>