import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
  ): Promise<{ access_token: string; username: string }> {
    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
      username: user.username,
    };
  }

  async register(username: string): Promise<User> {
    return this.userService.createUser({
      username,
    });
  }
}
