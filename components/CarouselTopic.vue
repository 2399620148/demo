<template>
  <div class="w-full relative select-none">

    <div class=" w-32 h-full absolute from-white to-red-200 bg-gradient-to-r right-0"></div>

    <div class="flex w-9 h-full items-center justify-center absolute right-0 z-10">
      <span class="w-5 h-10 bg-white rounded bg-opacity-80 flex items-center justify-center cursor-pointer hover:bg-opacity-100" @click="handleNext">
        <ChevronRightIcon class="w-5 h-5 text-red-700" />
      </span>
    </div>

    <div class="w-full h-32 overflow-hidden mt-6">
      <div class="transition duration-300 whitespace-nowrap ease-in-out" :style="{ transform: 'translateX(-' + translateX +'px)'}">
        <NuxtLink :to=" '/topic/' + item.id " class="w-[200px] h-32 overflow-hidden ml-5 inline-block" v-for="item in dataList" :key="item.id">
          <Image :src="item.banner" class="rounded-sm overflow-hidden" />
        </NuxtLink>
      </div>
    </div>

    <div class="flex items-center justify-center  pointer-events-auto mt-2">
      <div v-for="(item, index) in sectionList" class="w-2 h-1.5 bg-red-700 opacity-30 mr-1.5 cursor-pointer hover:opacity-70" :class="{ '!opacity-100': index === currentIndex }" @click="handleShow(index)" :key="index"></div>
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
  const count = props.dataList.length;
  const currentIndex = ref(0);
  const columnWidth = 228;
  const translateX = ref(0);

  const sectionList = computed(() => {
    let temp = [];
    for(let i = 0; i < props.dataList.length; i += 4) {
      const list = props.dataList.slice(i, i + 4);
      temp.push(list.length)
    }
    const totalLength = props.dataList.length;

    temp = temp.map((len, index) => {
      if(index === temp.length - 1) {
        return totalLength * columnWidth - 1195;
      } else {
        if(index === 0) return 0;
        return len * columnWidth * index + 190
      }
    })
    return temp;
  })

  function handleNext () {
    const length = sectionList.value.length;
    let nextIndex = currentIndex.value + 1;
    if(nextIndex === length) {
      nextIndex = 0;
    }
    translateX.value = sectionList.value[nextIndex];
    currentIndex.value = nextIndex;
  }

  function handlePrev () {
    if(currentIndex.value === 0) {
      currentIndex.value = count - 1;
      return;
    };
    currentIndex.value = currentIndex.value - 1;
  }

  function handleShow (index) {
    translateX.value = sectionList.value[index];
    currentIndex.value = index;
  }
</script>