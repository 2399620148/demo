<template>
  <div>
    <template v-if="name">
      <div class="text-sm">{{ name }}</div>
      <div class="mt-2">
        <a-select
          ref="select"
          size="large"
          class="w-full"
          allowClear
          showSearch
          v-model:value="modelValue"
          :placeholder="placeholder"
          :mode="props.mode ? props.mode : null"
          :options="options"
          :filterOption="handleFilterOption"
          @change="handleChange"
        ></a-select>
      </div>
    </template>
    <template v-else>
      <a-select
          ref="select"
          size="large"
          class="w-full"
          allowClear
          showSearch
          v-model:value="modelValue"
          :placeholder="placeholder"
          :mode="props.mode ? props.mode : null"
          :options="options"
          :filterOption="handleFilterOption"
          @change="handleChange"
        ></a-select>
    </template>
  </div>
</template>

<script setup>
const headers = useRequestHeaders(["cookie"]);
const props = defineProps({
  type: {
    default: null,
  },
  status: {
    default: null,
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
  mode: {
    type: String,
    default: "",
  },
  page: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  extends: {
    type: Object,
    default: {}
  }
});

const defaultValue = props.mode
  ? (props.defaultValue
    ? props.defaultValue
    : [])
  : props.defaultValue;
  const modelValue = ref(defaultValue);
const options = ref([]);
const placeholder = ref(`请选择${props.name}`);

onMounted(async () => {
  if (!options.value.length) {
    const findResult = await $fetch("/api/admin/" + props.url, {
      method: "POST",
      headers,
      body: {
        action: "getList",
        ...(props.type ? { type: props.type } : {}),
        ...(props.status ? { status: props.status } : {}),
        ...(props.page ? {page: props.page} : {}),
        ...(props.pageSize ? {pageSize: props.pageSize} : {}),
        ...props.extends
      },
    });
    const itemList = findResult.data.list.map((item) => {
      return {
        label: item.name || item.title,
        value: item.id,
      };
    });
    options.value = itemList;
  }
});

const emits = defineEmits(["update:value"]);

function handleChange(value) {
  emits("update:value", value);
}
function handleFilterOption(input, option) {
  return `${option.label}`.toLocaleLowerCase().includes(`${input || ''}`.toLocaleLowerCase())
}
</script>
