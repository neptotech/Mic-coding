/**
 * 多平台烧录方法
 * 当前为PC端烧录方法
 * Groot端烧录在src下的相同目录
 */
import {buildSketch, dataURLtoFile, downLoadHex} from "../../../../util/mcotton";
import {Base64} from "../../../../util/base64";
import {EventBus} from "../../../../util/eventbus";
import {IDEEvent} from "../../../../util/events";

const BOARDS = {
    'core': '328p16m',
    'core+': '644pa16m',
    'core+3v3': '644pa8m'
}

const handleArduinoBurning = async (connectedHardware, code, setProgress) => {
    try{
        await connectedHardware.burn(async type => {
            const base64Data = 'data:text/plain;base64,' + Base64.encode(code);
            const v = dataURLtoFile(base64Data, 'hardwareWebBurning.ino');
            const formData = new FormData();
            formData.append('file', v);
            formData.append('board', BOARDS[type]);
            let res;
            try {
                res = await buildSketch.request({ body: formData });
            } catch(error) {
                console.log(error);
                throw error;
                /*if (error && error.stderr) {
                    // setBurningState(MODAL_STAGE.COMPILING_FAIL, error.stderr)
                } else {
                    // setBurningState(MODAL_STAGE.NETWORK_FAIL, formatMessage(message.text4))
                }*/
            }
            if (res) {
                const hexContentBlob = await downLoadHex(res.url).request();
                EventBus.emit(IDEEvent[IDEEvent.CONSOLE_LOG], '编译成功！');
                return hexContentBlob;
            }
        }, setProgress);
        setProgress(100);
    } catch(error) {
        throw error;
    }
}

export default handleArduinoBurning;
