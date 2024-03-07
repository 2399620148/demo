<template>
  <div class="w-full h-[346px] relative overflow-hidden">

    <div class="h-11 flex items-center justify-end absolute bottom-0 right-0 z-10 pointer-events-auto">
      <div class="inline-flex px-3 py-2 rounded-full bg-opacity-0 transition">
        <div v-for="(item, index) in dataList" class="w-2 h-2 rounded-full bg-white bg-opacity-70 mr-1.5 cursor-pointer hover:bg-opacity-100" :class="{ '!bg-opacity-100': index === currentIndex }" @click="carouselRef.goTo(index)"></div>
      </div>
    </div>

    <a-carousel :dots="false" :before-change="handleChange" ref="carouselRef" :autoplay="true" :autoplaySpeed="5000">
      <div class="w-full h-[346px] relative" v-for="item in dataList">
        <NuxtLink :to=" '/new/' + item.id " class="flex flex-col h-full relative">
          <Image :src="item.banner" />
          <div class="bg-black bg-opacity-50 text-white text-opacity-90 absolute bottom-0 w-full h-12 px-4 flex items-center z-10">{{item.title}}</div>
        </NuxtLink>
      </div>
    </a-carousel>

    <div class="absolute left-0 top-0 w-12 h-full flex items-center justify-center">
      <div class="flex w-8 h-8 bg-black bg-opacity-40 rounded-full items-center justify-center cursor-pointer" @click="carouselRef.prev()"><ChevronLeftIcon class=" w-5 h-5 text-white " /></div>
    </div>

    <div class="absolute right-0 top-0 w-12 h-full flex items-center justify-center">
      <div class="flex w-8 h-8 bg-black bg-opacity-40 rounded-full items-center justify-center cursor-pointer" @click="carouselRef.next()"><ChevronRightIcon class=" w-5 h-5 text-white " /></div>
    </div>

  </div>
</template>
<script setup>
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
  const props = defineProps({
    size: {
      type: Number
    },
    width: Number,
    class: String,
    dataList: Array,
  })
  const carouselRef = ref(null);
  const currentIndex = ref(0);

  function handleChange (from, to) {
    currentIndex.value = to;
  }

</script>