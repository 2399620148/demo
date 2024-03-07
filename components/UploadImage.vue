<template>
  <div class="relative group/upload" :class="class" @click="handleSelectImage">
    <div class="w-full h-full text-[0px]"  v-if="imageSrc">
      <img :src="imageSrc" class="w-full h-full object-cover " />
    </div>
    <slot v-else />

    <input type="file" class="hidden" ref="fileInputElement" accept="image/*" :multiple="false" @change="handleImageChange" />

    <div class="w-full h-full bg-black bg-opacity-40 flex items-center justify-center px-2 absolute inset-0 z-[1]" v-if="uploading === 'progress'">
      <div class="w-full h-0.5 rounded-full bg-gray-400 overflow-hidden">
        <div class="w-full h-full bg-white relative -left-full duration-300 ease-in-out" :style="{ transform: 'translateX('+percent+'%)' }"></div>
      </div>
    </div>

    <div class="w-full h-full absolute inset-0 items-center justify-center bg-black bg-opacity-40 hidden group-hover/upload:flex" v-if="imageSrc">
      <span @click.stop="handleNewImage">
        <CloudArrowUpIcon class="w-5 h-5 text-white opacity-80 hover:opacity-100" />
      </span>
      <span @click.stop="handleRemove" class="ml-3">
        <TrashIcon class="w-5 h-5 text-white opacity-80 hover:opacity-100" />
      </span>
    </div>

  </div>
</template>
<script setup>
  import { BoltIcon, TrashIcon, CloudArrowUpIcon } from '@heroicons/vue/24/outline';
  const fileInputElement = ref(null);
  const { $toast } = useNuxtApp();

  function handleSelectImage () {
    if(imageSrc.value) return;
    fileInputElement.value.click()
  }

  function handleNewImage () {
    fileInputElement.value.click()
  }

  const props = defineProps({
    class: String,
    value: String,
    defaultValue: String,
    prefix: {
      type: String,
      default: 'public'
    }
  });

  const imageSrc = ref(props.defaultValue || props.value);
  const uploading = ref(false);
  const percent = ref(0);

  const emits = defineEmits(['update:value'])

  // 清除图片
  function handleRemove () {
    if(!imageSrc.value) return;
    imageSrc.value = null;
    emits('update:value', '')
  }

  // 读取buffer
  function readFileAsBuffer (file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = e => {
        // let data = window.URL.createObjectURL(new Blob([e.target.result]));
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        var img = new Image();
        img.onload = function() {
          resolve({
            width: img.width,
            height: img.height,
            src: data,
            // file
          })
        };
        img.src = data;
      };
      reader.readAsArrayBuffer(file);
    })
  }

  // 读取图片做base64
  async function handleImageChange (e) {
    const files = e.target.files;
    if(files.length < 1) return;
    const file = files[0];

    // 判断图片不能超过2M
    if(file.size > 1024 * 1024 * 10) {
      fileInputElement.value.value = '';
      return $toast.error('图片大小不能超过10M')
    }

    const buf = await readFileAsBuffer(file)

    // 判断图片不能超过2048*2048
    if(buf.width > 2048 || buf.height > 2048) {
      fileInputElement.value.value = '';
      return $toast.error('图片尺寸不能超过2048*2048')
    }

    imageSrc.value = buf.src;

    startUpload(file, (res) => {
      uploading.value = res.state;
      if(res.state === 'progress') {
        percent.value = res.percent
      } else if(res.state === 'data') {
        const {status, data} = res.data;
        imageSrc.value = data.filePath;
        emits('update:value', data.filePath)
      }
    });
  }

  function startUpload(file, callback) {
    var formdata = new FormData();
    if(!file) {
      return false;
    }
    formdata.append("prefix", props.prefix);
    formdata.append("file", file);

    callback({
      state: 'progress',
      percent: 0
    })

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload", true);

    // 监听上传进度
    xhr.upload.onprogress = function(event) {
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
</script>