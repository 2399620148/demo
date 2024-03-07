<template>
  <div class="w-full relative overflow-hidden">

    <a-carousel :dots="false" :before-change="handleChange" ref="carouselRef" :autoplay="autoplayStatus" :autoplaySpeed="5000">
      <div class="w-full relative" v-for="list in sectionList">
        <div class="w-full flex justify-between">
          <template v-for="(item, index) in list">
            <TeacherItem :item="item" />
          </template>

          <template v-for="i in (4 - list.length)" v-if="list.length < 4">
            <div class="w-[280px] "></div>
          </template>
        </div>
      </div>
    </a-carousel>

    <div class="flex items-center justify-center  pointer-events-auto mt-4" v-if="sectionList.length > 1">
      <div v-for="(item, index) in sectionList" class="w-2 h-1.5 bg-white opacity-30 mr-1.5 cursor-pointer hover:opacity-70" :class="{ '!opacity-100': index === currentIndex }" @click="carouselRef.goTo(index)"></div>
    </div>

  </div>
</template>
<script setup>
  const props = defineProps({
    size: {
      type: Number
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    width: Number,
    class: String,
    dataList: Array,
  })
  const carouselRef = ref(null);
  const currentIndex = ref(0);

  const sectionList = ref([]);

  const autoplayStatus = ref(true);
  watch(() => props.autoplay, (val) => {
    if(val) {
      carouselRef.value.autoplay(true);
    } else {
      carouselRef.value.autoplay(false);
    }
  })

  watch(() => props.dataList, (val) => {
    // currentIndex.value = 0;
    // 将val分成3个一组
    const temp = [];
    for(let i = 0; i < val.length; i += 4) {
      temp.push(val.slice(i, i + 4));
    }
    sectionList.value = temp;
  }, {
    immediate: true
  })

  function handleChange (from, to) {
    currentIndex.value = to;
  }
</script>