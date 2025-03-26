import * as bodyParser from "body-parser";
import { NestFactory } from "@nestjs/core";
import { ResponseInterceptor } from "@/common/interceptor/response.interceptor";
import * as fs from "fs";
import { AppModule } from "./app.module";
import { config } from "./config";

async function bootstrap() {
  process.env.TZ = "Asia/Shanghai";
  // https
  const sslCa = fs.readFileSync(config.get("https.ca"), "utf8");
  const sslCert = fs.readFileSync(config.get("https.cert"), "utf8");
  const sslKey = fs.readFileSync(config.get("https.key"), "utf8");
  const enableHttps = config.get("enableHttps");
  const httpsOptions = {
    ca: sslCa,
    key: sslKey,
    cert: sslCert,
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions: enableHttps ? httpsOptions : undefined,
  });

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

  await app.listen(isProd ? 6003 : 8002);
}

bootstrap();
