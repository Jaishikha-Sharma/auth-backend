import express from 'express';
import multer from 'multer';
import { getProfile, updateProfile,getUserList } from '../controller/profileController.js';
import {authMiddleware} from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, upload.single('avatar'), updateProfile);
router.post('/get-user-list',  getUserList);

export default router;
