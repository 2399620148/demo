<template>
  <!-- <NuxtLink class="flex w-full " :to=" '/course/' + item.course_id ">
    
  </NuxtLink> -->
  <div class="flex w-full cursor-pointer pt-8 text-gray-700" @click="handleDetail">
    <div class="w-[288px] h-[175px] shadow-md relative group">
      <Image :src="item.course_banner" />
      <div
        class="absolute inset-0 flex items-center justify-center z-[2] opacity-0 group-hover:opacity-100 transition duration-500">
        <img src="/play-gray.png" class="w-[58px] h-[58px]" />
      </div>
      <div class="absolute bg-black bg-opacity-30 inset-0 z-[1] opacity-0 group-hover:opacity-30 transition duration-300">
      </div>
    </div>
    <div class="ml-6 flex flex-col justify-between flex-1">
      <div class="flex-1">
        <div class="text-xl h-8 leading-8 line-clamp-1 font-medium">
          {{ item.course_name }}</div>
        <div class="text-sm leading-8 text-black opacity-40 ml-0.5 mt-1" v-if="item.last_document_name">学习至：{{
          item.last_document_name }}</div>
        <div class="flex items-center mt-2">
          <span class="text-sm text-black opacity-40">已学</span>
          <span class="text-sm mx-2 text-black opacity-40">|</span>
          <span class="text-sm mr-2 text-red-500 mr-5">{{ item.learn_progress }}%</span>
          <div class="w-60">
            <Progress :percent="item.learn_progress" />
          </div>
        </div>
      </div>
      <div class="flex text-sm text-gray-400 items-center">
        <!-- <div class="flex items-center text-gray-400">
            <img src="/ksjl.png" class=" w-[17px] h-[19px]" />
            <span class="ml-1">考试记录</span>
          </div>
          <div class="h-4 w-[1px] bg-gray-300 mx-4"></div>
          <div class="flex items-center text-red-600 mr-4">
            <img src="/cjks.png" class="w-[19px] h-[19px]" />
            <span class="ml-1">参加考试</span>
          </div> -->

        <div class="flex flex-1 justify-end items-center">
          <Button class="!bg-red-600 !h-9 hover:!bg-red-500" round>继续学习</Button>
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
async function handleDetail() {
  const { class_id, course_id, id } = props.item;
  if (class_id && class_id !== '0') {
    // 是培训班 需要查询培训班状态
    const { pass } = await userClassStatus(null, class_id);
    if (!pass) return
    navigateTo('/learn/class/' + id);
  }else{
    navigateTo('/learn/course/' + course_id);
  }
}
</script>