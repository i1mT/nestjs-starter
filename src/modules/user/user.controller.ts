import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PublicRoute } from "@/common/decorator/setMetadata";
import { GetUser } from "@/common/decorator/getUser";

import { CreateUserDto, UserModel } from "./dto/create.dto";
import { UserService } from "./user.service";
import { User } from "./interface/user.interface";
import { ApiObjResponse } from "@/common/decorator/swagger/api-obj-response.decorator";


@ApiTags("用户")
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 创建用户
   * @param createUserDto 创建用户dto
   * @returns 用户
   */
  @PublicRoute()
  @ApiOperation({ summary: "创建用户" })
  @ApiObjResponse(UserModel, "创建用户")
  @Post("create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  /**
   * 测试鉴权
   * @param user 用户
   * @returns 用户
   */
  @ApiOperation({ summary: "测试鉴权" })
  @ApiObjResponse(UserModel, "测试鉴权")
  @Get("test-auth")
  testAuth(@GetUser() user: User) {
    return user;
  }
}
