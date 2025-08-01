import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//引入cookies
import VueCookies from 'vue-cookies'
//引入element plus
import ElementPlus, { imageEmits } from 'element-plus'
import 'element-plus/dist/index.css'
//图标 图标在附件中
import '@/assets/icon/iconfont.css'
import './assets/base.scss'
import store from './store'
//全局方法
import Verify from './utils/Verify'
import Message from './utils/Message'
import Request from './utils/Request'
import Utils from './utils/Utils'
import Confirm from './utils/Confirm'

//全局组件
import Dialog from "@/components/Dialog.vue"
import Avatar from "@/components/Avatar.vue"
import Cover from '@/components/Cover.vue'
import DataList from '@/components/DataList.vue'
import NoData from '@/components/NoData.vue'
import ImageViewer from '@/components/ImageViewer.vue'
import EditorMarkdown from '@/components/EditorMarkdown.vue'
import EditorHtml from '@/components/EditorHtml.vue'
import CoverUpload from '@/components/CoverUpload.vue'
import AttachmentSelector from '@/components/AttachmentSelector.vue'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(ElementPlus);
app.config.globalProperties.VueCookies = VueCookies;
app.component("Dialog", Dialog); // 只注册一次
app.component("Avatar", Avatar);
app.component("Cover", Cover);
app.component("DataList", DataList);
app.component("NoData", NoData);
app.component("ImageViewer", ImageViewer);
app.component("EditorMarkdown", EditorMarkdown);
app.component("EditorHtml", EditorHtml);
app.component("CoverUpload", CoverUpload);
app.component("AttachmentSelector", AttachmentSelector);
app.config.globalProperties.globalInfo = {
    bodywidth: 1300,
    avatarURL: "/api/file/getAvatar/",
    imageUrl: "/api/file/getImage/",
}

app.config.globalProperties.Verify = Verify;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Request = Request;
app.config.globalProperties.Utils = Utils;
app.config.globalProperties.Confirm = Confirm;

app.mount('#app')
