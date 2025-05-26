import { BaseModel } from "@/common/decorator/swagger/content";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ description: "用户名" })
  readonly username: string;
  @ApiProperty({ description: "密码" })
  readonly password: string;
  @ApiProperty({ description: "昵称", required: false })
  readonly nickname?: string;
}

export class UserModel extends BaseModel {
  @ApiProperty({ description: "用户名" })
  readonly username: string;

  @ApiProperty({ description: "昵称" })
  readonly nickname: string;
}
