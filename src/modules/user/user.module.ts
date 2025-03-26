import { Module } from "@nestjs/common";

import { DatabaseModule } from "@/database/db.module";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

/**
 * 用户模块
 */

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
