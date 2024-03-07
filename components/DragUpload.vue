<template>
  <div class="w-full h-full " :class="class" @click="handleClick">
    <input type="file" class="hidden" @click="handleClick" ref="fileInputElement" accept="image/*" :multiple="multiple" @change="handleImageChange">

    <div class="flex w-full h-full items-center justify-center rounded-lg border border-dashed border-gray-300 hover:border-gray-400 cursor-pointer bg-gray-100" :class="{ '!border-indigo-500': draging }" @click="handleSelectImage" ref="dragElement">
      <div class="text-center pointer-events-none">
        <svg class="mx-auto w-16 h-16 text-gray-300 mb-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" v-if="big">
          <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
        </svg>

        <div class="h-14 pointer-events-none flex items-center justify-center text-indigo-400" v-if="draging">
          <span>松开上传</span>
        </div>

        <div class="h-full pointer-events-none overflow-hidden flex items-center" v-else>
          <slot v-if="$slots.default" />
          <div class="text-sm flex flex-col" v-else>
            <p class="text-gray-500">
              <span class="">将图片拖拽到这里，或者</span>
              <span class="text-indigo-600 font-semibold ml-1">点击上传</span>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  </div>
  
</template>
<script setup>
  const fileInputElement = ref(null);
  const dragElement = ref(null);
  const draging = ref(false);
  const { $toast } = useNuxtApp();

  const props = defineProps({
    class: {
      type: String,
    },
    forbid: {
      type: Boolean,
      default: false,
    },
    big: {
      type: Boolean,
      default: false,
    },
    button: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    wrapper: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
    },
  })

  const emit = defineEmits(['change']);

  function handleSelectImage () {
    if(props.forbid ){
      $toast.error(props.message || '您无法操作上传！')
      return false;
    }
    fileInputElement.value.click()
    // draging.value = !draging.value
  }

  function randomString (length) {
    var str = ''
        , maxLength = parseInt(length) || 6
        , chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    while ( str.length !== maxLength ) {
        var random = Math.floor( Math.random() * chars.length );
        str += chars[random];
    }
    return str;
  };

  // 读取图片做base64
  function readFileAsBase64 (file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = e => {
        const imageData = reader.result;
        resolve({
          key: randomString(8),
          src: imageData,
          // file
        })
      };
      reader.readAsDataURL(file);
    })
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
          const fileId = randomString(8);
          resolve({
            key: fileId,
            width: img.width,
            height: img.height,
            src: data,
            // file
          })
          window._images = window._images || {};
          window._images[fileId] = file;
        };
        img.src = data;
      };
      reader.readAsArrayBuffer(file);
    })
  }

  function handleImageChange (e) {
    handleImageBufffer(e.target.files);
  }

  // 选择图片
  async function handleImageBufffer (files) {
    if(files.length < 1) return;
    let list = [];
    for(var i = 0; i < files.length; i ++) {
      const buf = await readFileAsBuffer(files[i])
      buf.forbid = false;
      list.push(buf)
    }
    emit('change', list)
  }

  onMounted(() => {
    if(dragElement.value) {
      dragElement.value.addEventListener('dragenter', function(e) {
        draging.value = true;
        e.preventDefault();
        e.stopPropagation();
      });
      dragElement.value.addEventListener('dragover', function(e) {
        draging.value = true;
        e.preventDefault();
        e.stopPropagation();
      });
      dragElement.value.addEventListener('dragleave', function(e) {
        draging.value = false;
      });
      dragElement.value.addEventListener('drop', function(e) {
        draging.value = false;
        e.preventDefault();
        e.stopPropagation();
        handleImageBufffer(e.dataTransfer.files);
      });
    }
  })
</script>