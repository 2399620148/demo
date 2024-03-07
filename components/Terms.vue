<template>
  <div class="w-full bg-white border-red-800 border-2 inline-block">
    <div class="h-14 bg-red-800 text-white flex pl-4 items-center">
      <Squares2X2Icon class="w-5 h-5 mr-1" />
      <span class="text-base">课程分类</span>
    </div>
    <div class="w-full text-sm">
      <div class="flex h-12 px-5 items-center justify-between cursor-pointer text-gray-700 hover:bg-red-100 hover:bg-opacity-50 hover:text-red-700" v-for="item in dataList" @click="handleActive(item)">
        <div class="flex-1 flex items-center">
          <FolderIcon class="w-4 h-4 text-yellow-400 mr-1" />
          <span>{{item.name}}</span>
        </div>
        <ChevronRightIcon class="w-4 h-4 text-gray-400" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Squares2X2Icon, FolderIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
  const props = defineProps({
    dataList: Array
  })
  const emits = defineEmits(['active']);

  function handleActive (item) {
    emits('active', item)
  }
</script>