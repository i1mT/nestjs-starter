import { Module } from "@nestjs/common";

import { databaseProviders } from "@/database/db.providers";
import dbProviders from "./providers";
@Module({
  providers: [
    ...databaseProviders, // 数据库链接
    ...dbProviders, // 数据库表
  ],
  exports: [...databaseProviders, ...dbProviders],
})
export class DatabaseModule {}
