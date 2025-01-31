import { Request, Response } from 'express';
import passport from 'passport';
import PropertyRentRouter from './property.rent.api.actions';
import PropertySellRouter from './property.sell.api.actions';
import AgentRouter from './agent.api';
import HttpStatusCodes from '../common/HttpStatusCodes';
import cloudinary from '../common/cloudinary';

import express from 'express';
import multer from 'multer';

const router = express.Router();

// Configure Multer (Store file in memory before uploading)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload route using Multer to handle binary file
router.post('/upload-image', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'File is required' });
    }

    // Convert the buffer to a Base64 string
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadImg = await cloudinary.uploadFile(fileBase64, 'property-images', 'property-images');

    return res.status(HttpStatusCodes.OK).json({
      message: 'Image uploaded successfully',
      url: uploadImg,
    });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
});

// Add sub-routes
router.use('/agent', AgentRouter);

router.use('/properties/rents', PropertyRentRouter);
router.use('/properties/sell', PropertySellRouter);

// Add one more middleware namely `authorize` after passport.authenticate to authorize user for access
// console `req.user` and `req` in authorize middleware
// router.use('/property-rent', passport.authenticate('jwt', {session: false}), PropertyRentRouter);

// Export the base-router
export default router;
