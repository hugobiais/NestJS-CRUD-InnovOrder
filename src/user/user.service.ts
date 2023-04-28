import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    let user: User;

    if (dto.password) {
      const newHash = await argon.hash(dto.password);
      delete dto.password;

      user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
          hash: newHash,
        },
      });

      delete user.hash;
      return {
        user,
        message: 'Password successfully changed',
      };
    } else {
      user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });
    }

    delete user.hash;
    return user;
  }
}
