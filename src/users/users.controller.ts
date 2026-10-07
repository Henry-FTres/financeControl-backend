import { Body, Controller, Delete, Get, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from 'src/dtos/update-user-dto';
import { ChangePasswordDTO } from 'src/dtos/change-password-dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('me')
  async findMe(@Req() req: any) {
    return await this.service.findById(req.user.sub);
  }

  @Put('me')
  async update(@Req() req: any, @Body() body: UpdateUserDTO) {
    await this.service.updateUser(req.user.sub, body);
  }

  @Put('me/password')
  async changePassword(@Req() req: any, @Body() body: ChangePasswordDTO) {
    await this.service.changePassword(req.user.sub, body);
  }

  @Delete('me')
  async delete(@Req() req: any) {
    await this.service.deleteUser(req.user.sub);
  }
}
