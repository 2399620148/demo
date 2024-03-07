<template>
  <div class="w-[280px] h-[420px] shadow-md" :class="class">
    <NuxtLink :to="'/teacher/' + item.id"
      class="flex w-full h-full flex-col cursor-pointer bg-white items-center pb-6 bg-no-repeat rounded-md"
      style="background-image: url('/bg-teacher.jpg');background-size: 100% auto;">
      <div class="w-40 h-40 overflow-hidden rounded-full mt-8">
        <Image :src="item.avatar ? item.avatar : '/public/avatar.png'" animate />
      </div>
      <div class="flex justify-center">
        <div class="text-2xl font-semibold text-gray-700 mt-5 flex flex-col items-center">
          <span>{{ item.name }}</span>
          <span class="w-8 h-1.5 bg-red-700 mt-2"></span>
        </div>
      </div>
      <div class="flex w-full px-4 text-gray-600 text-center mt-4">
        <span v-if="item.work" class="flex-1 h-5 leading-5 overflow-hidden">{{ item.work }}</span>
        <span v-if="item.work && item.job" class="text-gray-200 px-1">|</span>
        <span v-if="item.job" class="flex-1 h-5 leading-5 overflow-hidden ">{{ item.job }}</span>
      </div>
      <div class="flex mt-2 text-center mx-6">
        <span v-if="item.tags" v-for="tag in item.tags"
          class="flex-1 px-2 h-6 leading-6 bg-red-100 text-red-500 text-xs overflow-hidden text-ellipsis rounded mr-1">{{ tag }}</span>
        <!-- <span class="px-2 h-6 leading-6 bg-red-100 text-red-500 text-xs rounded">通俗易懂</span> -->
      </div>
      <div class="flex text-sm h-12 overflow-hidden px-6 leading-6 text-ellipsis line-clamp-1 text-gray-400 mt-4">
        {{ item.description }}
      </div>
    </NuxtLink>
  </div>
</template>
<script setup>
const props = defineProps({
  item: {
    type: Object
  },
  class: {
    type: String
  }
})
</script>