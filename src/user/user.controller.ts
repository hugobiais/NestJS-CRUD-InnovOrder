import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // If I just use @Get(''), it will accepts anything
  // I don't think I'll need that
  @Get('me')
  getMe(@GetUser() user: User) {
    // What the custom decorator does here is get the current user for us and return it back. It avoids using the Express Req (Don't )
    // It's included in the Nest Documentation
    return user;
  }

  // Another way of doing the above but with custom parameters data
  // @Get('me')
  // getMe(@GetUser('login') login: string) {
  //   return { login };
  // }

  // Would also need a way to modify password !
  // I can include it in my pass because it's already authenticated ?
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
