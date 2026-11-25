import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDTO } from 'src/dtos/create-goal-dto';
import { UpdateGoalDTO } from 'src/dtos/update-goal-dto';

@Controller('goals')
export class GoalsController {
  constructor(private service: GoalsService) {}

  // [LOCAL] Rota GET /api/goals: listar metas (com indicação de atingida)
  @Get()
  async findAll(@Req() req: any) {
    return this.service.findAll(req.user.sub);
  }

  // [LOCAL] Rota POST /api/goals: criar meta
  @Post()
  async create(@Req() req: any, @Body() body: CreateGoalDTO) {
    return this.service.create(req.user.sub, body);
  }

  // [LOCAL] Rota PUT /api/goals/:id: editar meta (inclusive guardar valor)
  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGoalDTO,
  ) {
    return this.service.update(req.user.sub, id, body);
  }

  // [LOCAL] Rota DELETE /api/goals/:id: apagar meta
  @Delete(':id')
  async delete(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.delete(req.user.sub, id);
  }
}
