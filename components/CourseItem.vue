<template>
  <div class="w-[248px] h-full" :class="class">
    <NuxtLink :to=" '/learn/course/' + item.id " class="w-full cursor-pointer">
      <div class="w-full overflow-hidden h-[148px]">
        <Image :src="item.banner" class="rounded-sm overflow-hidden" />
      </div>
      <div class="mt-2">
        <div class="text-base h-9 leading-9 text-gray-700 hover:text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap px-0.5">{{item.name}}</div>
        <div class="flex text-sm text-gray-400 items-center">
          <ClockIcon class="w-4 h-4 text-red-100" />
          <span class="ml-1">{{item.class_hour || 0}}学时</span>
          <span class="px-2 text-gray-200 text-lg">|</span>
          <UsersIcon class="w-4 h-4 text-red-100" />
          <span class="ml-1">{{item.learn_number}}人参加</span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
<script setup>
  import { ClockIcon, ChevronRightIcon, UsersIcon, MapPinIcon } from '@heroicons/vue/24/solid';
  const props = defineProps({
    item: {
      type: Object
    },
    class: {
      type: String
    }
  })
</script>