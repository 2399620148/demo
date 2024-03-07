<template>
  <div>
    <a-upload v-model:file-list="fileList" name="avatar" :accept="acceptTypes" list-type="picture-card"
      class="avatar-uploader" action="/api/admin/upload" @change="handleChange"
      @remove="handleRemove">
      <slot v-if="$slots.default" />
      <template v-else>
        <template v-if="fileList.length == 0">
          <div>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div>上传</div>
          </div>
        </template>
      </template>
    </a-upload>
  </div>
</template>
<script setup>
const props = defineProps({
  fileList: Array,
  acceptTypes: {
    type: String,
    default: "file"
  }
});
const fileList = ref(props.fileList || []);
const loading = ref(false);
const emits = defineEmits(["update:value", "update:name", "update:path"]);
const handleChange = async (info) => {
  // console.log(info.file.status, "---info.file.status");
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }
  if (info.file.status === "done") {
    const {
      name,
      response: { data },
    } = info.file;

    loading.value = false;
    fileList.value = info.fileList
    emits("update:value", data.filePath);
    emits("update:path", data.filePath);
    emits("update:name", name);
  }
  if (info.file.status === "error") {
    loading.value = false;
    message.error("上传失败！");
  }
};

// 清除图片
function handleRemove() {
  if (!fileList.value.length) return;
  fileList.value = [];
  emits("update:value", "");
  emits("update:path", "");
  emits("update:name", "");
}

const beforeUpload = (file) => {

  const isLt2M = file.size / 1024 / 1024 < 500;
  if (!isLt2M) {
    message.error("文件必须小于 500MB!");
  }
  return isLt2M;
};
</script>
