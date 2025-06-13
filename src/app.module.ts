import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { FileModule } from "./modules/file/file.module";
import { StaticModule } from "./modules/static/static.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtAuthGuard } from "./modules/auth/jwt-auth.guard";
import { ConfigModule } from "@nestjs/config";
import { PROVIDERS } from "./common/constants";
import { DatabaseModule } from "./database/db.module";
import { TodoListModule } from "./modules/todo-list/todo-list.module";
import { MetricsMiddleware } from "./common/middleware/metrics.middleware";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import configuration from "./config/index";
import { AiChatModule } from "./modules/ai-chat/ai-chat.module";
import { ResponseInterceptor } from "./common/interceptor/response.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [...configuration],
      isGlobal: true,
    }), // 全局配置模块
    AuthModule, // 鉴权模块
    FileModule, // 文件模块，包含文件、图片上传等；操作本地文件
    UserModule, // 用户模块
    StaticModule, // 静态资源模块，包含静态资源文件的托管
    DatabaseModule, // 数据库模块，包含数据库的连接、表定义
    TodoListModule, // 待办事项模块
    PrometheusModule.register(), // 注册 prometheus 监控模块
    AiChatModule, // 注册 ai 聊天模块
  ],
  controllers: [],
  providers: [
    {
      provide: PROVIDERS.APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ResponseInterceptor,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes("*"); // 应用到所有路由
  }
}
