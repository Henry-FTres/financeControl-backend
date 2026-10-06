import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDTO } from 'src/dtos/create-account-dto';
import { UpdateAccountDTO } from 'src/dtos/update-account-dto';

@Controller('accounts')
export class AccountsController {

    constructor(private accountsService: AccountsService) { }

    @Post()
    create(@Req() req: any, @Body() dto: CreateAccountDTO) {
        return this.accountsService.create(req.user.sub, dto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.accountsService.findAll(req.user.sub);
    }

    @Get(':id')
    findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
        return this.accountsService.findOne(req.user.sub, id);
    }

    @Patch(':id')
    update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAccountDTO) {
        return this.accountsService.update(req.user.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
        return this.accountsService.remove(req.user.sub, id);
    }
}