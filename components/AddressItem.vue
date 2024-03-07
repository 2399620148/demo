<template>
  <div class="w-[360px]" :class="class">
    <NuxtLink :to=" '/address/' + item.id " class="group">
      <div class="w-[360px] h-[217px] overflow-hidden rounded">
        <Image :src="item.cover" class=" group-hover:scale-105 transition duration-300" />
      </div>
      <div class="pt-3">
        <div class="flex overflow-hidden text-ellipsis items-center">
          <MapPinIcon class="w-6 h-6 text-red-100 mr-1" />
          <span class="text-base text-gray-600 group-hover:text-gray-800">{{item.title}}</span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
<script setup>
  import { MapPinIcon } from '@heroicons/vue/24/solid';
  const props = defineProps({
    item: {
      type: Object
    },
    class: {
      type: String
    }
  })
</script>