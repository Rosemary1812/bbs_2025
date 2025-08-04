<template>
  <div class="editor-html">
    <Toolbar
    style="border-bottom:1px solid #ccc"
    :editor="editorRef"
    :defaultConfig="toolbarConfig"
    :mode="mode"
    />
    <Editor
    :style="{'height':height+'px','overflow-y':'hidden'}"
    :model-value="modelValue"
    :defaultConfig="editorConfig"
    :mode="mode"
    @onChange="onChange"
    @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css";
import { ref,shallowRef,onBeforeUnmount } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { getCurrentInstance } from 'vue';
const {proxy}=getCurrentInstance();
import { useStore } from 'vuex';
const store=useStore();

const props=defineProps({
  modelValue:{
    type:String,
    default:""
  },
  height:{
    type:Number,
    default:500
  }
});

const mode=ref("default");
const editorRef=shallowRef();
const toolbarConfig={
  excludeKeys:[
    "uploadVideo",
  ],
};

const editorConfig = {
  placeholder: "请输入内容...",
  excludeKeys: ["uploadVideo"],
  MENU_CONF: {
    uploadImage: {
      maxFileSize: 3 * 1024 * 1024,
      server: "/api/file/uploadImage",
      fieldName: "file",
      customInsert(responseData, insertFn) {
        //正常请求
        if (responseData.code == 200) {
          insertFn(
            proxy.globalInfo.imageUrl + responseData.data.fileName,
            "",
            ""
          );
          return;
        } else if (responseData.code == 901) {
          //登录超时
          store.commit("showLogin", true);
          store.commit("updateLoginUserInfo", null);
          return;
        }
        proxy.Message.error(responseData.info);
      },
    },
  },
};

const emit=defineEmits();
const onChange=(editor)=>{
  emit("update:modelValue",editor.getHtml());
};

onBeforeUnmount(()=>{
  const editor=editorRef.value;
  if(editor==null) return;
  editor.destroy();
});

const handleCreated=(editor)=>{
  editorRef.value=editor;
};

</script>

<style lang="scss">
.editor-html{
  border:1px solid #ddd;
}

</style>