import { v2 as cloudinary } from 'cloudinary';

class CloudinaryAPIFileUpload {
  private cloudinaryConfig;

  constructor() {
    this.cloudinaryConfig = cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  public async uploadFile(fileBinaryData: string, public_id: string, folder: string) {
    try {
      return await this.cloudinaryConfig.uploader.upload(fileBinaryData, {
        public_id,
        folder,
      }).url;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new CloudinaryAPIFileUpload();
