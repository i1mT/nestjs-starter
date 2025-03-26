import { ServeStaticModule } from "@nestjs/serve-static";
import { StaticController } from "./static.controller";
import { Module } from "@nestjs/common";
import { config } from "@/config";
import * as path from "path";

/**
 * 静态资源模块，托管 html web 资源，托管本地上传的文件资源
 */

@Module({
  imports: [
    /**
     * 托管 html web 资源
     * 在 webPath 目录下的文件，可以在 serverRoot 的 /web 路径下访问
     */
    ServeStaticModule.forRoot({
      rootPath: path.join(config.get("webPath")),
      serveRoot: "/web",
      renderPath: "/*",
    }),
    /**
     * 托管本地上传的文件资源
     * 在 localFilePath 目录下的文件，可以在 serverRoot 的 /uploads 路径下访问
     */
    ServeStaticModule.forRoot({
      rootPath: config.get("localFilePath"),
      serveRoot: "/uploads",
    }),
  ],
  controllers: [StaticController],
  providers: [],
})
export class StaticModule {}
