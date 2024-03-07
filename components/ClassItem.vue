<template>
  <div class="flex w-full mt-6 text-gray-700 py-2">
    <div class="w-[286px] h-[172px] overflow-hidden">
      <NuxtLink :to=" '/class/' + item.id " class="w-full h-full">
        <Image :src="item.banner" animate />
      </NuxtLink>
    </div>
    <div class="ml-4 flex flex-1 flex-col justify-between">
      <div class="flex-1">
        <div class="text-xl h-8 leading-8 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-gray-600 hover:text-gray-800">
          <NuxtLink :to=" '/class/' + item.id ">{{ item.name }}</NuxtLink>
        </div>
        <div class="text-sm leading-6 text-gray-400 font-normal overflow-hidden text-ellipsis mt-1" v-if="item.description">{{ item.description || '' }}</div>

        <div class="mt-2 flex">
          <Tag :text="item.year + '年' " v-if="item.year" class="mr-1" />
          <Tag :text=" item.class_hour + '学时' " v-if="item.class_hour" class="mr-1" />

          <template v-if="item.type === 1">
            <Tag text="线上培训" class=" !bg-transparent !text-orange-500 border border-orange-500" />
          </template>
          <template v-if="item.type === 2">
            <Tag text="线下培训" class=" !bg-transparent !text-blue-500 border border-blue-500" />
          </template>
          <template v-if="item.type === 3">
            <Tag text="混合培训" class=" !bg-transparent !text-green-500 border border-green-500" />
          </template>
        </div>
      </div>

      <div class="flex text-sm text-gray-400 items-center">
        <div class="flex h-6 items-center w-60">
          <template v-if="item.score">
            <ClientOnly>
              <Rate :length="5" :value="item.score" readonly class="viaSlot">
                <img src="/star-yellow.png" class="icon !w-[24px] !h-[22px]" />
              </Rate>
            </ClientOnly>
            <span class="text-gray-400 ml-2 leading-6">{{item.score}}分</span>
          </template>
          <template v-else>
            <span class="text-gray-400 leading-6">暂无评分</span>
          </template>
        </div>

        <div class="flex flex-1 justify-end items-center">
          <MarkIcon :type="2" :target_id="item.id" :status="item.is_marked" />
          
          <NuxtLink :to=" '/class/' + item.id " class="ml-2">
            <Button class="bg-red-600 !h-9 hover:bg-red-500" round>加入培训</Button>
          </NuxtLink>
          
        </div>
      </div>
    </div>
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