<template>
  <div class="w-full flex text-lg font-semibold border-b-4 border-gray-100 h-14">
    <template v-for="(item, index) in options">
      <div class="flex items-center text-gray-800 mr-6 relative h-full cursor-pointer tracking-wider" :class="{ 'text-red-600': currentIndex === index }" @click="handleView(item, index)">
        {{ item.name }}
        <span :class="{ 'absolute h-1 bg-red-600 -bottom-1 w-full': currentIndex === index }"></span>
      </div>
    </template>
  </div>
</template>

<script setup>
  const props = defineProps({
    options: Array,
    current: String,
    activeIndex: {
      type: Number,
      default: 0
    }
  })
  const emits = defineEmits(['change']);
  const currentIndex = ref(props.activeIndex);

  // watch(() => props.current, (val) => {
  //   props.options.map((item, index) => {
  //     if(!val) {
  //       currentIndex.value = 0;
  //     } else if(val === item.id) {
  //       currentIndex.value = index;
  //     }
  //   })
  // }, {
  //   immediate: true
  // })

  function handleView (item, index) {
    currentIndex.value = index;
    emits('change', item);
    // navigateTo(`/news/${item.id}`)
  }
</script>