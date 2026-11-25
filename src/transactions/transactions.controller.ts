import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDTO } from 'src/dtos/create-transaction-dto';
import { UpdateTransactionDTO } from 'src/dtos/update-transaction-dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  // [LOCAL] Rota POST /api/transactions: criar movimentação (atualiza o saldo da conta)
  @Post()
  create(@Req() req: any, @Body() dto: CreateTransactionDTO) {
    return this.transactionsService.create(req.user.sub, dto);
  }

  // [LOCAL] Rota GET /api/transactions?accountId=: listar movimentações (filtro por conta opcional)
  @Get()
  findAll(
    @Req() req: any,
    @Query('accountId', new ParseIntPipe({ optional: true }))
    accountId?: number,
  ) {
    return this.transactionsService.findAll(req.user.sub, accountId);
  }

  // [LOCAL] Rota GET /api/transactions/:id: buscar uma movimentação
  @Get(':id')
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findOne(req.user.sub, id);
  }

  // [LOCAL] Rota PATCH /api/transactions/:id: editar movimentação (corrige o saldo)
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDTO,
  ) {
    return this.transactionsService.update(req.user.sub, id, dto);
  }

  // [LOCAL] Rota DELETE /api/transactions/:id: apagar movimentação (desfaz o efeito no saldo)
  @Delete(':id')
  @HttpCode(204)
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.remove(req.user.sub, id);
  }
}
