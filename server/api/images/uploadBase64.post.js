/**
 * 上传图片base64
 * @param {*} ctx 
 * @param {*} body 
 * @returns
 */
import { customAlphabet } from 'nanoid';
import { uploadAvatarBase64 } from '~/server/utils/oss';
let { authorization } = useRuntimeConfig();
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

export default defineEventHandler(async (event) => {
  const ctx = event.context;
  const req = event.node.req;
  const authText = req.headers['authorization'];

  if(!authText || authText !== authorization) {
    return ctx.error('非法请求');
  }

  const body = await readBody(event);
  const {
    prefix,
    image
  } = body;

  // 限制前缀
  if(['fujian'].indexOf(prefix) === -1) {
    return ctx.error('非法请求');
  }

  try {
    if(!image || image.length < 1) {
      return ctx.error('上传失败')
    }

    // 限制大小为5M
    if(image.length > 1024 * 1024 * 5) {
      return ctx.error('图片太大了')
    }

    // 获取base64的后缀
    const base64Arr = image.split(',');
    const base64 = base64Arr[1];
    const mimeType = base64Arr[0].match(/:(.*?);/)[1];
    if(!mimeType || mimeType.indexOf('image/') !== 0) {
      return ctx.error('图片格式不正确');
    }
    const ext = mimeType.split('/')[1];


    const imageId = nanoid();
    const fileKey = `${prefix}/${imageId}.${ext}`;
    const uploadResult = await uploadAvatarBase64(fileKey, image);
    if(!uploadResult) {
      return ctx.error('图片上传失败');
    }
    return ctx.success({
      imagePath: uploadResult,
    });
  } catch (err) {
    console.log(err);
    return ctx.error('系统错误')
  }
})