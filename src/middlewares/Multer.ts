import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
const address = './uploads/';
const ensureDirectoryExistence = () => {
  fs.mkdir(address, () => {
    // console.log('Make Folder');
  });
};

const storage = multer.diskStorage({
  destination(req, file, callback) {
    ensureDirectoryExistence();
    callback(null, address);
  },
  filename(req, file, callback) {
    const id = uuid();
    const extName = file.originalname.split('.').pop();
    callback(null, `${id}.${extName}`);
  },
});

export const singleUpload = multer({ storage }).single('photo');
