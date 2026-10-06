import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDTO } from 'src/dtos/create-transaction-dto';
import { UpdateTransactionDTO } from 'src/dtos/update-transaction-dto';

@Controller('transactions')
export class TransactionsController {

    constructor(private transactionsService: TransactionsService) { }

    @Post()
    create(@Req() req: any, @Body() dto: CreateTransactionDTO) {
        return this.transactionsService.create(req.user.sub, dto);
    }

    @Get()
    findAll(@Req() req: any, @Query('accountId', new ParseIntPipe({ optional: true })) accountId?: number) {
        return this.transactionsService.findAll(req.user.sub, accountId);
    }

    @Get(':id')
    findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
        return this.transactionsService.findOne(req.user.sub, id);
    }

    @Patch(':id')
    update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTransactionDTO) {
        return this.transactionsService.update(req.user.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
        return this.transactionsService.remove(req.user.sub, id);
    }
}