import { RestfulApiServer, METHOD } from '@s524797336/react-client-restful'

export const mCottonApiServer = new RestfulApiServer({
    root: 'https://p-mproxy.microduino.cn'
}, [(error) => {
    console.log(error)
}])
export const API_SERVER_ERROR = {
    INPUT_ERROR: 422
}

export const buildSketch = mCottonApiServer.model(['/microduino/buildSketch'], METHOD.POST);
export const downLoadHex = (hexUrl) => mCottonApiServer.model([hexUrl], METHOD.get);

export const dataURLtoFile = (dataUrl, filename) => { // 将base64转换为文件
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];

    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
};
