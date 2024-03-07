<template>
  <div style="border: 1px solid #ccc; margin-top: 10px; z-index: 99;">
    <WeToolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <WeEditor style="height: 300px;  overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
      @onCreated="handleCreated" @customPaste="handlePaste" @onMaxLength="handleMaxLen" @onChange="handleChange" />
  </div>
</template>


<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

const props = defineProps({
  defaultValue: String
});
const mode = 'default'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const maxLength = 10000;
// 内容 HTML
const valueHtml = ref(props.defaultValue)
const toolbarConfig = {}
const editorConfig = {
  maxLength,
  MENU_CONF: {
    'uploadImage': {
      server: '/api/admin/file',
      fieldName: 'file',
      meta: {
        prefix: 'static'
      },
    },
  },
  placeholder: '请输入文章内容...'
}

function handleMaxLen() {
  message.warning('已经达到最大长度！')
}
function handlePaste(editor, event) {
  const html = event.clipboardData.getData('text/plain') // 获取粘贴的 html
  if(html.length > maxLength){
    event.preventDefault()
    message.warning('您黏贴的内容超出最大长度！')
    return false
  }
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
};

const emits = defineEmits(["update:value"]);

const handleChange = (editor) => {
  const str = editor.getHtml();
  // console.log(str.length, 'editoreditoreditor')
  if (str == props.defaultValue) return;
  emits("update:value", editor.getHtml());
};
</script>