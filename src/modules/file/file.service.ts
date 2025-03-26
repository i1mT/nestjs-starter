import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { getDateString } from "@/common/libs/common";
import { config } from "@/config";
import { LocalFileBucket } from "@/common/libs/save-image";
@Injectable()
export class FileService {
  async saveImageBase64(base64: string) {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join("");
    const fileName = `${randomName}.png`;
    const savePath = path.join(
      path.join(
        config.get("localFilePath"),
        LocalFileBucket.upload,
        getDateString()
      ),
      fileName
    );
    fs.writeFileSync(
      savePath,
      base64.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    return {
      path: savePath.replace(
        config.get("localFilePath"),
        `${config.get("serverUrl")}`
      ),
    };
  }
}
