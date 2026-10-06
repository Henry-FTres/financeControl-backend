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

  @Get()
  async findAll(@Req() req: any) {
    return this.service.findAll(req.user.sub);
  }

  @Post()
  async create(@Req() req: any, @Body() body: CreateGoalDTO) {
    return this.service.create(req.user.sub, body);
  }

  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGoalDTO,
  ) {
    return this.service.update(req.user.sub, id, body);
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.delete(req.user.sub, id);
  }
}