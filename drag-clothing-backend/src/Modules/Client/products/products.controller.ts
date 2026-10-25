import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Patch,
  Body,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtGuard } from 'src/Modules/Auth/guards/jwt.guard';
import { RolesGuard } from 'src/Modules/Auth/guards/roles.guard';
import { Roles } from 'src/Modules/Auth/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CreateProductDto } from '../Dto/create-product.dto';

@Controller('client/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('types')
  async getProductTypes(@Req() req) {
    return this.productsService.getProductTypes(req?.user);
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.CLIENT)
  async createProduct(@Req() req, @Body() dto: CreateProductDto) {
    return this.productsService.createProduct(req.user, dto);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.CLIENT)
  async getProducts(@Req() req) {
    return this.productsService.getProducts(req.user);
  }

  @Get(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.CLIENT)
  async getProduct(@Req() req, @Param('id') id: string) {
    return this.productsService.getProduct(req.user, id);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.CLIENT)
  async updateProduct(@Req() req, @Param('id') id: string, @Body() dto: any) {
    return this.productsService.updateProduct(req.user, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.CLIENT)
  async deleteProduct(@Req() req, @Param('id') id: string) {
    return this.productsService.deleteProduct(req.user, id);
  }

  @Patch(':id/live')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.CLIENT)
  async setLive(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: { isActive: boolean },
  ) {
    return this.productsService.setProductLiveByClient(
      req.user,
      id,
      dto.isActive,
    );
  }
}
