import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@/modules/user/user.service';

import { User } from '../user/interface/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<any> {
    const user = await this.userService.login(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: Omit<User, 'password'> = {
      _id: user._id,
      id: user.id,
      nickname: user.nickname,
      username: user.username,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: payload,
      expired: 24 * 60 * 60 * 1000, // 1天过期
    };
  }
}
