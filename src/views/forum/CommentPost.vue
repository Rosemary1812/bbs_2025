<template>
  <div class="post-comment-panel">    
    <Avatar :width="50" :userId="userId"></Avatar>
    <div class="comment-form">
    <el-form   
     :model="formData"
    :rules="rules"
    ref="formDataRef"
    label-width="80px"
    >
    <!-- textarea输入 -->
     <el-form-item prop="content">
             <el-input
       clearable
       :placeholder="placeholderInfo"
       type="textarea"
       :rows="3"
       :maxlength="800"
       resize="none"
       show-word-limit
       v-model="formData.content"
       >
      </el-input>
      <div class="insert-img" v-if="showInsertImg">
        <div class="pre-img" v-if="commentImg">
          <CommentImage src="commentImg"></CommentImage>
          <span class="iconfont icon-remove" @click="removeCommentImg"
          ></span>
        </div >
        <el-upload v-else
        name="file" 
        :show-file-list="false" 
        accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP" 
        :multiple="false"
        :http-request="selectImg"
        >
          <span class="iconfont icon-image"></span>
        </el-upload>
      </div>
     </el-form-item>
    </el-form>
    </div>
    <div class="send-btn" @click="postCommentDo">发表</div></div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import { progressProps } from "element-plus";
import {ref,reactive,getCurrentInstance} from "vue";
import { useRoute,useRouter } from "vue-router";
const {proxy}=getCurrentInstance();

const api={
  postComment:"/comment/postComment",
}

const props=defineProps({
    articleId:{
      type:String,
    },
    pCommentId:{
      type:Number,
    },
    replyUserId:{
      type:String,
    },
    avatarWidth:{
        type:Number,
    },
    userId:{
        type:String,
    },
    showInsertImg:{
        type:Boolean,
    },
    placeholderInfo:{
      type:String,
      default:"文明发言喵~"
    }
})

//form信息
const checkPostComment=(rule,value,callback)=>{
  if(value==null&&formData.value.image==null){
    callback(new Error(rule.message));
  }else{
    callback();
  }
}

const formDataRef=ref({});
const formData=ref({});
const rules={
  content:[{required:true,message:"请输入评论",validator:checkPostComment},{min:5,message:"评论内容不能少于5个字"}],
};

const emit=defineEmits(["postCommentFinish"]);
const postCommentDo=()=>{
formDataRef.value.validate(async(valid)=>{
  if(!valid){
    return;
  }
  let params=Object.assign({},formData.value);
  params.articleId=props.articleId;
  params.pCommentId=props.pCommentId;
  params.replyUserId=props.replyUserId;

  let result=await proxy.Request({
    url:api.postComment,
    params,
  });
  if(!result){
    return;
  }
  proxy.Message.success("评论发表成功");
  formDataRef.value.resetfields();
  removeCommentImg();
  emit("postCommentFinish",result.data);
});
}
//选择图片
const commentImg=ref(null);
const selectImg=(file)=>{
  try {
    file=file.file;
    console.log('选择评论图片:', file);
    
    // 检查文件大小
    if (file.size > 3 * 1024 * 1024) {
      proxy.Message.error('图片大小不能超过3MB');
      return;
    }
    
    let img=new FileReader();
    img.readAsDataURL(file);
    img.onload=({target})=>{
      let imgData=target.result;
      commentImg.value=imgData;
      formData.value.image=file;
      console.log('评论图片预览成功');
    };
    img.onerror = (error) => {
      console.error('图片读取失败:', error);
      proxy.Message.error('图片读取失败');
    };
  } catch (error) {
    console.error('选择图片异常:', error);
    proxy.Message.error('选择图片失败: ' + (error.message || '未知错误'));
  }
};
const removeCommentImg=()=>{
  commentImg.value=null;
  formData.value.image=null;
}
</script>

<style lang="scss">
 .post-comment-panel{
  display: flex;
  align-items: flex-start;
    margin-top: 20px;
  .comment-form{
    flex: 1;
    margin: 0px 10px 0px -70px;
    
    .el-form-item {
      margin-bottom: 0;
    }
    
    .el-form-item__content {
      line-height: normal;
    }
    
    .el-input {
      .el-input__wrapper {
        padding: 0;
        box-shadow: none;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        height: 60px;
      }
      
      .el-textarea__inner {
        height: 60px !important;
        line-height: 1.5;
        padding: 8px 12px;
        border: none;
        resize: none;
        box-sizing: border-box;
      }
    }
  }
  .insert-img{
    line-height: normal;
    .iconfont{
      margin-top: 3px;
      font-size: 20px;
      color:#3f3f3f
    }
    .pre-img{
      position: relative;
      margin-top: 10px;
      .iconfont{
        position: absolute;
        top:-10px;
        right:-10px;
        color:rgb(121,121,121)
      }
    }
  }
  .send-btn{
    width: 60px;
    height: 60px;
    background: var(--link);
    color: #fff;
    text-align: center;
    line-height: 60px;
    border-radius: 5px;
    margin-top: 0;
    cursor: pointer;
    box-sizing: border-box;
  }
}

</style>
