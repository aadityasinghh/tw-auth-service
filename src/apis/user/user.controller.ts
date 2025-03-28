import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getUserById(): Promise<any> {
    console.log('HMMM');
    return this.userService.getUsers();
  }

  @Post('')
  async createUser(
    @Body() body: { email: string; password: string; phone: string },
  ): Promise<any> {
    return this.userService.createUser(body.email, body.password, body.phone);
  }
}
