<template>
  <div class="flex flex-col pb-14">
    <div class="flex">
      <span class="w-16 h-7 flex items-center justify-center text-blue-500 bg-blue-50 border border-blue-300 text-sm rounded-full mr-2">
        {{term}}
      </span>
      <div class="text-lg font-semibold flex-1">{{index}}、{{item.title}}</div>
    </div>
    <div class="mt-4 w-full">
      <template v-if="!isView">
        <template v-for="(option, index) in options" :key="index">
          <div class="flex bg-gray-100 w-full p-4 text-base mt-2 rounded hover:bg-slate-200 border border-gray-100" @click="handleCheck(option, index)" :class="{ '!bg-blue-100 !border-blue-400 text-blue-500': option.checked, 'cursor-pointer': !props.isView}">{{option.label}}、{{option.value}}</div>
        </template>
      </template>
      <template v-else>
        <template v-for="(option, index) in options" :key="index">
          <div class="flex bg-gray-100 w-full p-4 text-base mt-2 rounded hover:bg-slate-200 border border-gray-100" @click="handleCheck(option, index)" :class="{ '!bg-blue-100 !border-blue-400 text-blue-500': option.checked, '!bg-red-100 !border-red-400 text-red-500': option.checked && !item.is_correct, 'cursor-pointer': !props.isView}">{{option.label}}、{{option.value}}</div>
        </template>
        <div class="mt-5">考生选择：{{ item?.myanswer || '' }}</div>
        <div class="mt-5">正确答案：{{ item?.answer || '' }}</div>
        <div class="mt-5">试题解析：{{ item?.analysis || '' }}</div>
      </template>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    item: {
      type: Object
    },
    index: {
      type: Number
    },
    term: {
      type: String
    },
    isView: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['answer'])
  const temp = props.item.content.map(item => {
    const ret = {...item}
    ret.checked = false;
    if (props.item.myanswer && props.item.myanswer.indexOf(item.label) > -1) {
      ret.checked = true;
    }
    return ret;
  })

  const options = ref(temp);
  function handleCheck (option, index) {
    if (props.isView) {
      return false;
    }
    // 如果是单选题，或者判断题
    if (props.item.type === 1 || props.item.type === 2) {
      if(option.checked) return;
      options.value = options.value.map((item, i) => {
        if (i === index) {
          item.checked = true
        } else {
          item.checked = false
        }
        return item
      })
      emits('answer', {
        id: props.item.id,
        answer: option.label
      })
    }

    if(props.item.type === 3) {
      options.value[index].checked = !options.value[index].checked;

      let answer = '';
      options.value.forEach((item, i) => {
        if(item.checked) {
          answer += item.label
        }
      })

      emits('answer', {
        id: props.item.id,
        answer: answer
      })
    }
  }
</script>