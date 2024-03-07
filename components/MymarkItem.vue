<template>
  <div class="flex w-full text-gray-700 mt-8 cursor-pointer" @click="handleView">
    <div class="w-[288px] h-[175px] shadow-md relative group">
      <Image :src="item.target.banner" />
    </div>
    <div class="ml-6 flex flex-col justify-between flex-1">
      <div class="flex-1">
        <div class="text-xl h-8 leading-8 overflow-hidden text-ellipsis line-clamp-1  font-medium">
          {{ item.target.name }}</div>
        <div class="text-sm w-full leading-8 text-black opacity-40 ml-0.5 mt-1 h-24 line-clamp-3 text-ellipsis overflow-hidden">
          {{ item.target.description}}</div>
      </div>
      <div class="flex text-sm text-gray-400 items-center">

        <div v-if="item.score" class="flex items-center w-60" >
          <ClientOnly>
            <Rate :length="5" :value="item.score" :readonly="true" class="viaSlot">
              <img src="/star-yellow.png" class="icon !w-[24px] !h-[22px]" />
            </Rate>
          </ClientOnly>
          <span class="text-gray-300 ml-2">{{ item.score }}分</span>
        </div>
        <template v-else>
          <span class="flex items-center w-60">暂无评分</span>
        </template>

        <div class="flex flex-1 justify-end items-center">
          <MarkIcon :type="item.type" :target_id="item.target.id" @callback="handleChange" :status="true"
            activeText="取消收藏" />
          <Button class="!bg-red-600 !h-9 hover:!bg-red-500 ml-3" round>继续学习</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
  }
})

const emits = defineEmits(['removeMark']);

function handleChange(status) {
  if (status === 'unmark') {
    emits('removeMark', true)
  }
}

async function handleView() {
  const item = props.item;
  if (item.type === 1) {
    navigateTo('/learn/course/' + item.target_id)
  } else if (item.type === 2) {
    const { pass } = await userClassStatus(null, item.target_id);
    if(pass){
      navigateTo('/class/' + item.target_id)
    }
  }
}
</script>