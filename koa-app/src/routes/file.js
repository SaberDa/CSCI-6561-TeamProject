const router = require('koa-router')();
const moment = require('moment');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

router.prefix('/file');

const outData = (data) => {
  return {
    status: '0',
    data,
    msg: 'success'
  }
}
const outError = (msg) => {
  return {
    msg,
    status: '1'
  }
}

/**
 * 获取文件上传目录
 * @param {*} filename
 */
const getUploadDir = async (filename, ctx) => {
  // http://www.xxx.com/uploadFiles/20200526/xxx.jpg
  const origin = ctx.origin;
  const day = moment().format("YYYYMMDD");
  const uploadDirName = 'uploadFiles';
  const dir = path.join(uploadDirName, day);
  await mkdirp(`public/${dir}`); // 不存在就创建目录
  const date = Date.now(); // 毫秒数
  const saveFileName = date + path.extname(filename);
  const commonDir = path.join(dir, saveFileName);
  const uploadDir = path.resolve(__dirname, '../../public', commonDir);
  // const saveDir = `${origin}/${commonDir}`;
  const saveDir = `/${commonDir}`;
  return {
    uploadDir,
    saveDir: saveDir.replace(/\\/g, '/')
  }
}
/**
 * 文件上传
 * @param {*} data
 */
const uploadFile = async (ctx, fileType) => {
  const data = {};
  const fieldname = ctx.request.files['file'];
  if(!fieldname) {
    data.status = '1';
    data.msg = `Can not find file`;
    return data
  }
  if(fieldname.length > 1) {
    data.status = '1';
    data.msg = `Please choose single file to upload`;
    return data
  }

  if (fieldname) {
    const fileName = fieldname['name'];
    const extname = path.extname(fileName);
    const suffix = extname && extname[0] == '.' ? extname.substr(1) : extname;
    if(fileType) {
      if(suffix != fileType) {
        data.status = '1';
        data.msg = `Please upload ${fileType} file`;
        return data
      }
    }
    // 创建可读流
    const reader = fs.createReadStream(fieldname['path']);
    const dir = await getUploadDir(fileName, ctx);
    // console.log(dir);
    // 创建可写流
    const upStream = fs.createWriteStream(dir.uploadDir);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    data.path = dir.saveDir;
    data.name = fileName;
    data.suffix = suffix;
    data.title = path.basename(fileName, extname);
  }
  return data;
}

const fileRouter = async (ctx, fileType, callback) => {
  try {
    const data = await uploadFile(ctx, fileType);
    if(data.status == '1') {
      ctx.body = outError(data.msg);
    }else {
      if (data.path) {
        if(callback) callback(data);
        ctx.body = outData(data);
      }else{
        ctx.body = outError('Update Fail');
      }
    }
  }catch(e) {
    throw e;
  }

}

// networks.json data URL
const dataFile = path.join(__dirname, '../../networks.json');

// Call back after uploading JSON file
// const jsonCallback = async (info) => {
//   const { title: name, path: url } = info;
//   console.log('test:' + url);
//   const fileStr = await fs.readFileSync(dataFile);
//   const data = fileStr ? JSON.parse(fileStr) : [];
//   data.push({ name, url });
//   fs.writeFile(dataFile, JSON.stringify(data, null, 2), function(err) {
//     if(err) {
//       console.log('write networks.json fail');
//     }
//   });
// }
const jsonCallback = async (info) => {
  const {title: name, path: url} = info;
  const fileStr = await fs.readFileSync(dataFile);
  const data = fileStr ? JSON.parse(fileStr) : [];
  const titleImg = "imgs/default.png";
  data.push({ name, url, titleImg });
  fs.writeFile(dataFile, JSON.stringify(data, null, 3), function(err) {
    if(err) {
      console.log('write networks.json fail');
    }
  });
}

// File upload
router.post('/', (ctx) => fileRouter(ctx));

// JSON upload
router.post('/json', (ctx) => fileRouter(ctx, 'json', jsonCallback));

// get networks.json data
router.get('/data', async (ctx) => {
  try {
    const fileStr = await fs.readFileSync(dataFile);
    const data = fileStr ? JSON.parse(fileStr) : [];
    ctx.body = outData(data);
  }catch(e) {
    throw e;
  }

});

module.exports = router;
