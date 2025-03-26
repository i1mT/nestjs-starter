import { Module } from "@nestjs/common";

import { FileService } from "./file.service";
import { FileController } from "./file.controller";

/**
 * 文件模块，上传到本地，或操作本地文件等
 */

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
