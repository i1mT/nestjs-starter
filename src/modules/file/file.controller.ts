import { config } from "@/config";
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as path from "path";
import { diskStorage } from "multer";
import { getDateString, transformLocalPathToUrl } from "@/common/libs/common";
import { LocalFileBucket } from "@/common/libs/save-image";
import { FileService } from "./file.service";

@Controller("file")
export class FileController {
  constructor(private fileService: FileService) {}

  /**
   * 上传文件
   * @param file 文件
   * @returns 文件路径
   */
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: path.join(
          config.get("localFilePath"),
          LocalFileBucket.upload,
          getDateString()
        ),
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          cb(null, `${randomName}${path.extname(file.originalname)}`);
        },
      }),
    })
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    const res = {
      path: transformLocalPathToUrl(file.path),
      local_path: file.path,
    };
    return res;
  }

  /**
   * 上传图片
   * @param file 图片
   * @returns 图片路径
   */
  @Post("image-upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: path.join(
          config.get("localFilePath"),
          LocalFileBucket.upload,
          getDateString()
        ),
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          cb(null, `${randomName}${path.extname(file.originalname)}`);
        },
      }),
    })
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const res = {
      path: transformLocalPathToUrl(file.path),
    };
    return res;
  }

  /**
   * 上传图片base64
   * @param body 图片base64
   * @returns 图片路径
   */
  @Post("image-upload-base64")
  async uploadImageBase64(@Body() body: { base64: string }) {
    return this.fileService.saveImageBase64(body.base64);
  }
}
