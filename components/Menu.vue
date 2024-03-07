<template>
  <div class=" w-48 h-full bg-[#1c5ba2] pt-5">
    <template v-for="(item, index) in dataList">
      <div class="w-full">
        <div class="w-full text-white flex items-center hover:bg-blue-600 hover:bg-opacity-30 cursor-pointer relative pl-8" :style="{ 'height': size + 'px' }" :class="{'!bg-blue-600 !hover:bg-opacity-100': route.path.indexOf(item.value) > -1 && !item.children}" @click="handleActive(item, index)">
          <img src="/news.svg" class="text-white w-6 h-6 mr-2" />
          <span class="mr-8">{{item.label}}</span>
          <div class="w-8 h-8 absolute flex items-center justify-center right-2" v-if="item.children">
            <ChevronDownIcon class="w-4 h-4 text-white mt-1 opacity-80" />
          </div>
        </div>

        <div class="w-full overflow-hidden transition-all duration-300" :style="{ 'height': item.open ? item.openHeight + 'px' : '0px' }" v-if="item.children">
          <div class="w-full text-white flex items-center hover:bg-blue-600 hover:bg-opacity-30 cursor-pointer relative pl-12" :style="{ 'height': size + 'px' }" :class="{'!bg-blue-600 !hover:bg-opacity-100': route.path.indexOf(info.value) > -1}" @click="handleActive(info)" v-for="info in item.children">
            <span class="w-1.5 h-1.5 rounded-full bg-white mr-2 ml-1"></span>
            <span>{{info.label}}</span>
          </div>
        </div>

      </div>
    </template>
  </div>
</template>

<script setup>
  import { ChevronDownIcon } from '@heroicons/vue/24/solid';
  const props = defineProps({
    options: Array,
    size: {
      type: Number,
      default: 56
    }
  })

  const route = useRoute();

  const tempList = props.options.map(item => {
    item.openHeight = item.children ? item.children.length * props.size : 0;
    return {
      ...item
    }
  });
  const dataList = ref(tempList);

  function handleActive (item, index) {
    if(item.children) {
      dataList.value[index].open = !dataList.value[index].open;
    } else {
      // console.log(item);

      navigateTo('/admin/' + item.value)
    }
  }
</script>