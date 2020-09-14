/**
 * 多平台烧录方法
 * 当前为Groot烧录方法
 * PC端烧录在@mDesktop下的相同目录
 */
const handleMicropythonBurning = async (connectedHardware, code, setProgress) => {
    try {
        await connectedHardware.burn(async type => {
            return Buffer.from(code);
        }, setProgress);
        setProgress(100);
    } catch (error) {
        throw error;
    }
}

export default handleMicropythonBurning;
