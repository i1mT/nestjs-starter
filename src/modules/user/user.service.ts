import { Inject, Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";
import { Model } from "mongoose";
import { PROVIDERS } from "@/common/constants";

import { CreateUserDto } from "./dto/create.dto";
import { User, UserModel } from "./interface/user.interface";

@Injectable()
export class UserService {
  constructor(@Inject(PROVIDERS.USER_MODEL) private userModel: Model<User>) {}

  private async hashPassword(password: string) {
    const saltOrRounds = 10;

    return await hash(password, saltOrRounds);
  }

  async login(
    username: string,
    password: string
  ): Promise<UserModel | undefined> {
    const user = await this.userModel
      .findOne({
        username: username,
      })
      .exec();
    if (!user) return undefined;
    const res = await compare(password, user.password);
    if (!res) return undefined;
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    // TODO: find duplicated user name
    const hashedPassword = await this.hashPassword(createUserDto.password);
    return (
      await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      })
    ).save();
  }
}
