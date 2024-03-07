<template>
  <Transition
    appear
    name="fade-in-down"
    >
    <div
      ref="toast"
      v-show="isActive"
      :class="['ui-toast-item', 'toast-' + type]"
    >
    <span class="icon-wrapper" v-if="type==='success'">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" /></svg>
    </span>

    <span class="icon-wrapper" v-if="type==='error'">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon"><path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" /></svg>
    </span>

    <span class="icon-wrapper animate-spin" v-if="type==='loading'">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-white">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    </span>


    {{message}}
  </div>
  </Transition>
</template>

<script setup>
  const props = defineProps({
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'default'
    },
    duration: {
      type: Number,
      default: 3000
    }
  });

  let timer;
  let parentDom;
  const instance = getCurrentInstance()

  const isActive = ref(false);

  function setupContainer() {
    parentDom = document.querySelector('.ui-toast-container');
    if (!parentDom) {
      parentDom = document.createElement('div')
      parentDom.className = 'ui-toast-container';
      document.body.appendChild(parentDom)
    }
  }

  function showNotice () {
    parentDom.insertAdjacentElement('beforeend', instance.refs.toast)

    if(props.type !== 'loading') {
      const domList = parentDom.querySelectorAll('.toast-loading');
      if (domList.length > 0) {
        domList.forEach((item) => {
          removeElement(item)
        })
      }

      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        close()
      }, props.duration)
    }
    isActive.value = true;
  }

  function removeElement (el) {
    if (typeof el.remove !== 'undefined') {
      el.remove()
    } else {
      el.parentNode.removeChild(el)
    }
  }

  function close () {
    isActive.value = false;
    removeElement(instance.refs.toast)
  }

  onBeforeMount(() => {
    setupContainer();
  })

  onMounted(() => {
    showNotice()
  })

</script>
<style>
.ui-toast-container{
  position: fixed;
  display: flex;
  z-index: 9999;
  pointer-events: none;
  flex-direction: column;
  align-items: center;

  left: 50%;
  transform: translateX(-50%);
  top: 8px;
}
.ui-toast-item{
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  border-radius: 10px;
  font-size: 16px;
  margin-top: 10px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-weight: 400;
}
.ui-toast-item.toast-success{
  background-color: #28a745;
}
.ui-toast-item.toast-error{
  background-color: #dc3545;
}

.ui-toast-item.toast-loading{
  background-color: #333;
}

.icon-wrapper{
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
}
.icon-wrapper .icon{
  width: 20px;
  height: 20px;
  color: #fff;
}

.fade-in-down-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.fade-in-down-enter-active {
  transition: all 0.3s ease-out;
}

/* .fade-in-down-leave-to {
  opacity: 0.5;
}
.fade-in-down-leave-active {
  transition: all 0.3s ease-out;
} */
</style>