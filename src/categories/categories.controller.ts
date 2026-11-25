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
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from 'src/dtos/create-category-dto';
import { UpdateCategoryDTO } from 'src/dtos/update-category-dto';

@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  // [LOCAL] Rota GET /api/categories: listar categorias padrão e as minhas
  @Get()
  async findAll(@Req() req: any) {
    return this.service.findAll(req.user.sub);
  }

  // [LOCAL] Rota POST /api/categories: criar categoria própria
  @Post()
  async create(@Req() req: any, @Body() body: CreateCategoryDTO) {
    return this.service.create(req.user.sub, body);
  }

  // [LOCAL] Rota PUT /api/categories/:id: renomear categoria própria
  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDTO,
  ) {
    return this.service.update(req.user.sub, id, body);
  }

  // [LOCAL] Rota DELETE /api/categories/:id: apagar categoria própria
  @Delete(':id')
  async delete(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.delete(req.user.sub, id);
  }
}
