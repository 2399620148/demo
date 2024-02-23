/**
 * 上传图片
 * @param {*} ctx 
 * @param {*} body 
 * @returns
 */
import Busboy from 'busboy';
import { customAlphabet } from 'nanoid';
import { uploadAvatarImage } from '~/server/utils/oss';
let { authorization } = useRuntimeConfig();
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

// 获取上传文件
const getUploadFile = async (event) => {
  return new Promise((resolve, reject) => {
    const { req } = event;
    const filelength = req.headers['content-length'];

    // 限制大小为5M
    if(filelength > 5242880) { //5242880 = 5M
      return resolve({
        code: -1,
        message: '文件太大了'
      });
    }

    const files = [];
    const fields = {};
    const busboy = Busboy({
      headers: req.headers
    })
    busboy.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info
      var chunks = []
      file.on('data', (chunk) => {
        chunks.push(chunk)
      })
      file.on('end', () => {
        files.push({
          fieldname: name,
          filename,
          encoding,
          mimetype: mimeType,
          buffer: Buffer.concat(chunks)
        })
      })
    })
    busboy.on('field', (name, value, info) => {
      fields[name] = value
    })
    busboy.on('finish', () => {
      resolve({
        code: 0,
        message: 'finish',
        files,
        fields
      })
    })
    req.pipe(busboy)
  })
}

export default defineEventHandler(async (event) => {
  const ctx = event.context;
  const req = event.node.req;
  const authText = req.headers['authorization'];

  if(!authText || authText !== authorization) {
    return ctx.error('非法请求');
  }

  try {
    const {code, message, files, fields} = await getUploadFile(event);
    if(code === 0) {
      if(!files || files.length < 1) {
        return ctx.error('上传失败')
      }

      const imageId = nanoid();
      const prefix = fields.prefix;

      // 限制前缀
      if(['fujian'].indexOf(prefix) === -1) {
        return ctx.error('非法请求');
      }

      // todo: 限制文件大小
      const file = files[0];
      const fileData = file.buffer;
      const ext = file.filename.split('.').pop();
      const fileKey = `/${prefix}/${imageId}.${ext}`;

      const uploadResult = await uploadAvatarImage(fileKey, fileData);
      if(!uploadResult) {
        return ctx.error('图片上传失败');
      }
      return ctx.success({
        imagePath: uploadResult,
      });
    } else {
      return ctx.error(message);
    }
  } catch (err) {
    return ctx.error('系统错误')
  }
})