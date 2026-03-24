import request from './http/request';
import { ElLoading, ElMessage } from 'element-plus';
import { tansParams, blobValidate } from '@/utils/ruoyi';
import { saveAs } from 'file-saver';
let downloadLoadingInstance: ReturnType<typeof ElLoading.service>;

export function download(url: string, params: any, filename: string, config?: any) {
    downloadLoadingInstance = ElLoading.service({ text: '正在下载数据，请稍候', background: 'rgba(0, 0, 0, 0.7)' });
    return request
        .post(url, params, {
            transformRequest: [
                (params: any) => {
                    return tansParams(params);
                },
            ],
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            responseType: 'blob',
            ...config,
        })
        .then(async (data: any) => {
            const isBlob = blobValidate(data);
            if (isBlob) {
                const blob = new Blob([data]);
                saveAs(blob, filename);
            } else {
                const resText = await data.text();
                const rspObj = JSON.parse(resText);
                const errMsg = rspObj.msg;
                ElMessage.error(errMsg);
            }
            downloadLoadingInstance.close();
        })
        .catch((r: any) => {
            console.error(r);
            ElMessage.error('下载文件出现错误，请联系管理员！');
            downloadLoadingInstance.close();
        });
}
