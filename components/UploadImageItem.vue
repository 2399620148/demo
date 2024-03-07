<template>
  <div class="w-full h-full relative overflow-hidden">
    <a-tag v-if="!props.forbid" class="absolute text-xs rounded-none left-0 top-0" color="#2db7f5">
      待审核</a-tag>
    <img :src="image.src" class="w-full h-full object-cover cursor-pointer" />
    <a v-if="!props.forbid" @click="handleRemove"
      class="text-red-500 absolute left-0 bottom-[0px] h-8 leading-8  w-full cursor-pointer flex-1 text-center "
      :style="{ 'background': 'rgba(0,0,0,0.3)' }">删除</a>
    <div class="w-full h-full bg-black bg-opacity-40 flex items-center justify-center px-2 absolute inset-0 z-[1]"
      v-if="uploading === 'progress'">
      <div class="w-full h-0.5 rounded-full bg-gray-400 overflow-hidden">
        <div class="w-full h-full bg-white relative -left-full duration-300 ease-in-out"
          :style="{ transform: 'translateX(' + percent + '%)' }"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  class: {
    type: String
  },
  size: {
    type: Number,
    default: 80
  },
  padding: {
    type: Number,
    default: 8
  },
  image: {
    type: Object
  },
  active: {
    type: Boolean,
    default: false
  },
  forbid: {
    type: Boolean,
    default: true
  },
  target_id: {
    type: String,
    default: ''
  },
});
const uploading = ref(false);
const percent = ref(0);
const itemId = ref()


const emit = defineEmits(['remove', 'click', 'upload']);

function handleClick() {
  emit('click')
}


function startUpload(callback) {
  var formdata = new FormData();
  // formdata.append("file", props.image.file);
  const fileId = props.image.key;
  const file = window._images[fileId];
  if (!file) {
    // console.log('没有file')
    return false;
  }
  formdata.append("type", "pimg");
  formdata.append("file", file);

  callback({
    state: 'progress',
    percent: 0
  })

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/photos/upload", true);
  xhr.withCredentials = true;

  // 监听上传进度
  xhr.upload.onprogress = function (event) {
    const percentComplete = event.loaded / event.total * 100;
    // percent.value = parseInt(percentComplete.toFixed(2));
    callback({
      state: 'progress',
      percent: percentComplete.toFixed(2)
    })
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        callback({
          state: 'data',
          data,
          percent: 100
        })
      } else if (xhr.statusText === 'error') {
        callback({
          state: 'disconnect',
          percent: 0
        })
      } else {
        callback({
          state: 'error',
          percent: 0
        })
      }
    }
  }
  xhr.send(formdata);
}

async function uploadImage(image_path) {
  const result = await $fetch('/api/photos/new', {
    method: 'POST',
    body: {
      type: 2,
      target_id: props.target_id,
      image_path
    }
  })
  const { status, data } = result;
  if (status.code === 0) {
    itemId.value = data.id
  }
}

async function handleRemove() {
  if (!itemId.value) return;
  const removeResult = await $fetch("/api/photos/remove", {
    method: "POST",
    body: {
      id: itemId.value,
    },
  });
  const { status, data } = removeResult;
  if (status.code === 0) {
    emit('remove', props.image.key)
  }
}


onMounted(() => {
  startUpload((res) => {
    uploading.value = res.state;
    if (res.state === 'progress') {
      percent.value = res.percent
    } else if (res.state === 'data') {

      const { status, data } = res.data;

      emit('upload', {
        key: props.image.key,
        ...data
      })

      uploadImage(data.filePath)
    }
  });

});
</script>