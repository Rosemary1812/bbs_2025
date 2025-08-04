import { ElMessageBox } from 'element-plus'

const Confirm = (message, okfun) => {
    console.log('Confirm dialog called with message:', message);
    ElMessageBox.confirm(message, '提示', {
        "confirm-button-text": "确定",
        "cancel-button-text": "取消",
        "type": "info"
    }).then(async () => {
        console.log('User clicked confirm');
        okfun();
    }).catch(() => {
        console.log('User clicked cancel or closed dialog');
    });
}

export default Confirm;