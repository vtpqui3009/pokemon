import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() authPayloadDto: AuthPayloadDto) {
    return this.authService.register(authPayloadDto);
  }

  @Post('login')
  login(@Body() authPayloadDto: AuthPayloadDto) {
    return this.authService.login(authPayloadDto);
  }
}
