import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(authPayloadDto: AuthPayloadDto) {
    const { username, password } = authPayloadDto;
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await this.prisma.user.create({
      data: { username, password: hashedPassword },
    });
    const { password: _, ...rest } = createdUser;
    return rest;
  }

  async login(authPayloadDto: AuthPayloadDto) {
    const { username, password } = authPayloadDto;
    const foundUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!foundUser) {
      throw new UnauthorizedException('User does not exits!');
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const token = this.jwtService.sign({ userId: foundUser.id });

    const { password: _, ...result } = foundUser;

    return { ...result, token };
  }
}
