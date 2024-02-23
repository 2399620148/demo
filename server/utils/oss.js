import OSS from 'ali-oss';
let { env, aliyunId, aliyunSecret } = useRuntimeConfig();


// oss信息
const ossConfig = {
  bucket: 'cn-shanghai-aliyun-cloudauth-1733775280472808',
  region: 'oss-cn-shanghai',
  accessKeyId: aliyunId,
  accessKeySecret: aliyunSecret
};
if(env === 'production') {
  ossConfig.internal = true
}
let OssClient = new OSS(ossConfig);

/**
 * 上传图片
 * @param {*} fileKey 
 * @param {*} fileData 
 * @returns 
 */
export const uploadAvatarImage = async (fileKey, fileData) => {
  try {
    const uploadResult = await OssClient.put(fileKey, fileData);
    if(!uploadResult) {
      return null;
    }
    const { name, res } = uploadResult;
    if(res.status !== 200) {
      return null;
    }
    return `https://avatar.zhifa315.com/${name}`;
  } catch (err) {
    console.log(err);
    return null
  }
}

// 上传base64
export const uploadAvatarBase64 = async (fileKey, dataUrl) => {
  try {
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
    const uploadResult = await OssClient.put(fileKey, Buffer.from(base64, 'base64'));
    if(!uploadResult) {
      return null;
    }
    const { name, res } = uploadResult;
    if(res.status !== 200) {
      return null;
    }
    return `https://avatar.zhifa315.com/${name}`;
  } catch (err) {
    console.log(err);
    return null
  }
}