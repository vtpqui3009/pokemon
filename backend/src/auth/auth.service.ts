import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const fakeUsers = [
  {
    id: 1,
    username: 'vtpqui',
    password: 'password',
  },
  {
    id: 2,
    username: 'ttvy',
    password: 'password123',
  },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser({ username, password }: AuthPayloadDto) {
    const foundUser = fakeUsers.find((user) => user.username === username);
    if (!foundUser) return null;
    if (password === foundUser.password) {
      const { password, ...user } = foundUser;
      return this.jwtService.sign(user);
    }
  }
}
