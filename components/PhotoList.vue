<template>
  <div class="grid grid-cols-4 gap-4">
    <template v-for="(item, index) in uploadList">
      <div class="w-full h-36">
        <UploadImageItem :key="item.key" :forbid="item.forbid" :target_id="props.class_id" :image="item"
          @upload="handleUploaded" @remove="handleRemoveed" />
      </div>
    </template>

    <template v-for="item in dataList" v-if="dataList">
      <div class="w-full h-36">
        <Image :src="item.image_path" :verify="item.verify" />
      </div>
    </template>

    <div
      class="border border-dashed border-gray-300 w-full h-36 flex items-center justify-center hover:border-gray-400 cursor-pointer">
      <DragUpload @change="handleImages" :forbid="props.forbid" message="您还未加入培训班！"></DragUpload>
    </div>

    <!-- <UploadImage class="border border-dashed border-gray-300 w-full h-36 flex items-center justify-center hover:border-gray-400 cursor-pointer" @update:value="handleUpload">
      <PlusIcon class="w-12 h-12 text-gray-300" />
    </UploadImage> -->

  </div>
</template>

<script setup>
const { $toast } = useNuxtApp();

const props = defineProps({
  class: {
    type: String,
    default: ''
  },
  forbid: {
    type: Boolean,
    default: false
  },
  class_id: {
    type: String,
    default: ''
  }
})

onMounted(() => {
  getList()
})

const pagination = ref(null);
const dataList = ref(null);
const currentPage = ref(1);

async function getList() {
  const result = await $fetch('/api/photos/list', {
    method: 'POST',
    body: {
      type: 2,
      status: 1,
      page: currentPage.value,
      class_id: props.class_id
    }
  })
  const { status, data } = result;
  if (status.code === 0) {
    dataList.value = data.list;
    pagination.value = data.pagination;
  }
}

// 图片上传后，更新列表
const uploadList = ref([]); //待上传的图片列表
function handleImages(fileList) {
  if (fileList.length > 20) {
    fileList = fileList.slice(0, 20)
  }
  uploadList.value = uploadList.value.concat(fileList);
}

function handleUploaded(item) {
  $toast.success('上传成功！')
  // console.log(item);
}
function handleRemoveed(key) {
  $toast.success('删除成功！')
  uploadList.value = uploadList.value.filter(item => item.key !== key)
}
</script>