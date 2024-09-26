import multer from "multer";
import {v4 as uuid} from 'uuid';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const id = uuid();
        const extFileName = file.originalname.split('.').pop();
        cb(null, `${id}.${extFileName}`)
    }
})

export const singleUpload = multer({ storage: storage }).single("photo");
