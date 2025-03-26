import { Body, Controller, Get, Post } from "@nestjs/common";
import { PublicRoute } from "@/common/decorator/setMetadata";
import { GetUser } from "@/common/decorator/getUser";

import { CreateUserDto } from "./dto/create.dto";
import { UserService } from "./user.service";
import { User } from "./interface/user.interface";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 创建用户
   * @param createUserDto 创建用户dto
   * @returns 用户
   */
  @PublicRoute()
  @Post("create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  /**
   * 测试鉴权
   * @param user 用户
   * @returns 用户
   */
  @Get("test-auth")
  testAuth(@GetUser() user: User) {
    return {
      user,
      name: "test",
    };
  }
}
