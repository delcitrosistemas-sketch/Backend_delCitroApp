import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinaryInstance: typeof cloudinary) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = this.cloudinaryInstance.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      upload.end(file.buffer);
    });
  }

  async uploadStream(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const resourceType = this.getResourceType(file.mimetype);

      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'documentos',
          resource_type: resourceType, // ¡IMPORTANTE!
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  private getResourceType(mimetype: string): 'auto' | 'image' | 'video' | 'raw' {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.includes('pdf') || mimetype.includes('document') || mimetype.includes('text'))
      return 'raw';
    return 'auto';
  }

  async uploadDocument(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'documentos',
          resource_type: 'image',
          format: this.getFileFormat(file.originalname),
          type: 'upload',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  private getFileFormat(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const formatMap: { [key: string]: string } = {
      'pdf': 'pdf',
      'doc': 'doc',
      'docx': 'docx',
      'xls': 'xls',
      'xlsx': 'xlsx',
      'ppt': 'ppt',
      'pptx': 'pptx',
      'txt': 'txt'
    };
    return formatMap[ext] || 'auto';
  }
}
