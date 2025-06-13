import * as bodyParser from "body-parser";
import { NestFactory } from "@nestjs/core";
import { ResponseInterceptor } from "@/common/interceptor/response.interceptor";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as fs from "fs";
import { AppModule } from "./app.module";
import { config } from "./config";

async function bootstrap() {
  process.env.TZ = "Asia/Shanghai";
 
  const enableHttps = config.get("feature.https");
  
  const options = {
    httpsOptions: undefined,
  };
  if (enableHttps) {
     // https
  const sslCa = fs.readFileSync(config.get("https.ca"), "utf8");
  const sslCert = fs.readFileSync(config.get("https.cert"), "utf8");
  const sslKey = fs.readFileSync(config.get("https.key"), "utf8");
  options.httpsOptions = {
    ca: sslCa,
    key: sslKey,
    cert: sslCert,
  };
  }
  const app = await NestFactory.create(AppModule, options);

  // 设置全局前缀
  app.setGlobalPrefix("api");
  // 设置全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 设置跨域
  app.enableCors({
    origin: "*",
  });
  // 设置请求体大小限制
  app.use(bodyParser.json({ limit: "20mb" }));
  app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
  // 设置超时时间
  const server = app.getHttpServer();
  server.setTimeout(1000 * 60 * 3); // timeout 3 minutes

  const isProd = config.get("env") !== "development";

  if (!isProd) {
    // 测试环境，生成 swagger
    const swaggerConfig = new DocumentBuilder()
      .setTitle("My Server")
      .setDescription("my Server API description")
      .setVersion("1.0")
      .addTag("my")
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    // 保存 openapi.json 到本地文件，可以用于导入到postman/apifox等软件
    // 或者前端用于生成 fetch 请求的模板代码
    fs.writeFileSync("src/assets/open-api/my_server.openapi.json", JSON.stringify(document));
    SwaggerModule.setup("swagger", app, () => document);
  }

  await app.listen(3002);
}

bootstrap();
