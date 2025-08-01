<template>
  <div class="edit-post">
    <el-form
    :model="formData"
    :rules="rules"
    ref="formDataRef"
    class="post-panel"
    label-width="60px"
    >
    <div class="post-editor">
        <el-card body-style="padding:5px">
            <template #header>
                <div class="post-editor-title">
                <span>正文</span>
                <div class="change-editor-type">
                    <div class="iconfont icon-change" @click="changeEditor">
                        切换为{{editorType==0?"markdown编辑器":"富文本编辑器"}}
                    </div>
                </div>
                </div>
 
            </template>
             <el-form-item prop="content" label-width="0">
             <EditorHtml 
             :height="htmlEditorHeight"
             v-if="editorType==0"
             v-model="formData.content"
             ></EditorHtml>
            <EditorMarkdown 
            :height="markdownHeight"
            v-if="editorType==1"
            v-model="formData.markdownContent"
            ></EditorMarkdown>

             </el-form-item>
        </el-card>
    </div>
    <div class="post-setting">
        <el-card body-style="padding:5px">
            <template #header>
                <span>设置</span>

            </template>
            <div class="setting-inner">
            <el-form-item label="标题" prop="title">
            <el-input 
            clearable
            v-model="formData.title" 
            placeholder="提示信息"
            ></el-input>
        </el-form-item>
        <el-form-item label="板块" prop="boardIds">
            <el-cascader
            placeholder="请选择板块"
            :options="boardList"
            :props="boardProps"
            clearable
            v-model="formData.boardIds"
            :style="{width:'100%'}"
            />
        </el-form-item>
        <el-form-item label="封面" prop="cover">
            <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
            <el-input
            clearable
            type="textarea"
            :rows="5"
            v-model="formData.summary"
            placeholder="请输入摘要"
            resize="none"   
            maxlength="150"
            />
        </el-form-item>
        <el-form-item label="附件" prop="attachments">
            <AttachmentSelector v-model="formData.attachments"></AttachmentSelector>
        </el-form-item>
        <!-- 输出 -->
         <el-form-item label="" prop="">
            <el-button type="primary" :style="{width:'100%'}">保存</el-button>
         </el-form-item>
            </div>
             <!-- input输入 -->

        </el-card>
       
    </div>
    </el-form>  
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus';
import { ref,reactive,getCurrentInstance,watch, nextTick } from 'vue';
import{useRouter,useRoute} from 'vue-router';
const {proxy}=getCurrentInstance();
const router=useRouter();
const route=useRoute(); 
const markdownHeight=window.innerHeight-150;
const htmlEditorHeight=window.innerHeight-230;

const api={
    loadBoard:"/forum/loadBoard4Post",
    postArticle:"/forum/postArticle",
    articleDetail4Update:"/forum/articleDetail4Update",
    updateArticle:"/forum/updateArticle",
}

const articleId=ref(null);
const getArticleDetail=async()=>{
    nextTick(async()=>{
        formDataRef.value.resetFields();
        if(articleId.value){
            let result=await proxy.Request({
                url:api.articleDetail4Update,
                params:{
                    articleId:articleId.value,
                },
                showError:false,
                errorCallback:(response)=>{
                    ElMessageBox.alert(response.info,"错误",{
                        confirmButtonText:"OK",
                        callback:(action)=>{
                            router.go(-1);
                        },
                    });
                },
            });
            if(!result){
                return;
            }
            let articleInfo=result.data.forumArticle;
            //设置编辑器
            editorType.value=articleInfo.editorType;
            formData.value=articleInfo;
        }else{
        formData.value={};
        editorType.value=proxy.VueCookies.get("editorType")||0;
        }
    })
}
watch(
()=>route.params,
()=>(newVal,oldVal)=>{
        articleId.value=newVal.articleId;
        getArticleDetail();
},
{immediate:true,deep:true}
);


const formData=ref({});
const formDataRef=ref({});
const rules={
    title:[{required:true,message:"请输入标题"}],
};
const boardProps={
    multiple:false,
    checkStrictly:true,
    value:"boardId",
    label:"boardName",
}
const boardList=ref([]);
const loadBoardList=async()=>{
    let result=await proxy.Request({
        url:api.loadBoard,
    })
    if(!result){
        return;
    }
    boardList.value=result.data;
};
loadBoardList();
//0:html 1:md
const editorType=ref(null);
const changeEditor=()=>{
    proxy.Confirm("切换编辑器会清空当前编辑内容，是否继续？",()=>{
        editorType.value=editorType.value==0?1:0;
        formData.value.content="";
        formData.value.markdownContent="";
        proxy.VueCookies.set("editorType",editorType.value,-1);
    })
};
</script>

<style lang="scss">
.edit-post{
    .post-panel{
        display: flex;
        .el-card-header{
            padding: 10px;
        }
        .post-editor{
            flex: 1;
            .post-editor-title{
                display: flex;
                justify-content: space-between;
                .change-editor-type{
                    .iconfont{
                    cursor: pointer;
                    color:var(--link);
                    font-size: 13px;
                    }
                }
            }
        }
        .post-setting{
            width: 450px;
            margin-left: 10px;
            .setting-inner{
                max-height: calc(100vh - 120px);
                overflow-y: auto;
            }
        }
    }
}
</style>