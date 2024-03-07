<template>
  <div>
    <div v-show="name" class="text-sm">{{ name }}</div>
    <a-tree-select
      v-model:value="modelValue"
      show-search
      allowClear
      size="large"
      style="width: 100%"
      :height="300"
      tree-default-expand-all
      @change="handleChange"
      :placeholder="placeholder"
      :treeCheckStrictly = "props.treeCheckStrictly"
      :field-names="{
        label: 'name',
        value: 'key',
      }"
      allow-clear
      :tree-data="options"
      tree-node-filter-prop="title"
    >
    </a-tree-select>
  </div>
</template>

<script setup>
const props = defineProps({
  includeAll: {
    type: Boolean,
    default: false,
  },
  treeCheckStrictly: {
    type: Boolean,
    default: false,
  },
  disableId: {
    type: String,
    default: "",
  },
  defaultValue: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "terms",
  },
});
const headers = useRequestHeaders(["cookie"]);
const _defaultValue = props.defaultValue || (props.treeCheckStrictly ? [] : null);
const modelValue = ref(_defaultValue);
// const checkable = ref(props.defaultValue);
const options = ref([]);
const placeholder = ref(`请选择${props.name}`);
onMounted(async () => {
  if (!options.value.length) {
    const findResult = await $fetch("/api/admin/" + props.url, {
      method: "POST",
      headers,
      body: {
        page: 1,
        pageSize: 1000,
        action: "getList",
        ...(props.url === 'departments' ? {disableFilterDepartment: true} : {} )
      },
    });
    const { status, data } = findResult;
    const { list, pagenation } = data;

    const newList = [];
    list.map((item) => {
      if (item.children) delete item.children;
      const element = { ...item, key: `${item.id}`, title: item.name };
      newList.push(Object.assign({}, element)); // 不要互相影响
      return element;
    });
    const dataList = formatList2Tree(
      newList,
      props.includeAll,
      props.disableId
    );
    options.value = dataList;
  }
});

const emits = defineEmits(["update:value"]);

function handleChange(value) {
  // console.log(value)
  if(props.treeCheckStrictly){
    value = value.map(item=> item.value)
  }
  emits("update:value", value);
}
</script>
