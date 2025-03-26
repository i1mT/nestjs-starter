import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { PublicRoute } from "@/common/decorator/setMetadata";

import { AuthService } from "./auth.service";
import { LoginDto } from "./interface/index";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto.username, signInDto.password);
  }
}
