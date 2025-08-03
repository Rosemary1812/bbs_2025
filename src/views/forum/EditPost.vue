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
            @htmlContent="setHtmlContent"
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
            maxlength="150"
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
            maxlength="200"
            ></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="cover">
            <AttachmentSelector v-model="formData.attachment"></AttachmentSelector>
        </el-form-item>
            <el-form-item 
                label="积分" 
                prop="integral"     
                v-if="formData.attachment">
            <el-input
            clearable
            v-model="formData.integral"
            placeholder="请输入积分"
            ></el-input>
            <span class="tips">附件下载积分 0表示无需积分</span>
        </el-form-item>
        <!-- 输出 -->
         <el-form-item label="" prop="">
            <el-button 
            type="primary" 
            :style="{width:'100%'}" @click="postHandler"
            >保存</el-button>
         </el-form-item>
            </div>
        </el-card>
    </div>
    </el-form>  
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus';
import { ref,getCurrentInstance,watch, nextTick } from 'vue';
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
            //设置板块信息
            articleInfo.boardIds=[];
            articleInfo.boardIds.push(articleInfo.pBoardId);
            if(articleInfo.boardId!=null&&articleInfo.boardId!=0){
                articleInfo.boardIds.push(articleInfo.boardId);
            }
            //设置封面
            if(articleInfo.cover){
                articleInfo.cover={imageUrl:articleInfo.cover};
            }
            //设置附件
            if(result.data.attachment){
                articleInfo.attachment={
                    name:result.data.attachment.fileName,
                };
                articleInfo.integral=result.data.attachment.integral;
            }
            formData.value=articleInfo;
        }else{
        formData.value={};
        editorType.value=proxy.VueCookies.get("editorType")||0;
        };
    });
};
//设置富文本编辑器内容
const setHtmlContent=(htmlContent)=>{
    formData.value.content=htmlContent;
};

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
    title:[
        {required:true,message:"请输入标题"},
        {max:150,message:"标题太长"}
    ],
    boardIds:[{required:true,message:"请选择板块"}],
    content:[{required:true,message:"请输入正文"}],
};

//提交信息
const postHandler=()=>{    
    formDataRef.value.validate(async(valid)=>{
        if(!valid){
            return;
        }
        let params={};
        Object.assign(params,formData.value);
        //设置板块ID
        if(params.boardIds.length==1){
            params.boardId=params.boardIds[0];
        }else if(params.boardIds.length==2){
            params.boardId=params.boardIds[1];
            params.pBoardId=params.boardIds[0];
        }
        delete params.boardIds;
        //设置编辑器类型
        params.editorType=editorType.value;
        //获取内容
        const contentText=params.content.replace(/<(?!img).*?>/g,"");
        if(contentText==""){
            proxy.message.warning("正文不为空");
            return;
        }
        if(params.attachment!=null){
            params.attachmentType=1;
        }else{
            params.attachmentType=0;
        }
        //封面
        if(!(params.cover instanceof File)){
            delete params.cover;
        }
        //附件不是文件
        if(!(params.attachment instanceof File)){
            delete params.attachment;
        }
        let result=await proxy.Request({
            url:params.articleId?api.updateArticle:api.postArticle,
            params:params,
        });
        if(!result){
            return;
        }
        proxy.Message.success("保存成功");
        router.push(`/post/${result.data}`);
    });

}

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
                .el-form-item{
                    align-items: flex-start;
                }
            }
            .tips{
                    font-size: 12px;
                    color:rgb(121,121,121);
                    margin-top: 5px;
                }
        }
    }
}
</style>