import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './schemas/account.schema';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cuenta' })
  @ApiResponse({ status: 201, description: 'Cuenta creada con su API Key generada.' })
  create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las cuentas' })
  findAll(): Promise<Account[]> {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cuenta por ID' })
  @ApiParam({ name: 'id', description: 'ID de la cuenta' })
  findOne(@Param('id') id: string): Promise<Account> {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de una cuenta' })
  @ApiParam({ name: 'id', description: 'ID de la cuenta' })
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cuenta' })
  @ApiParam({ name: 'id', description: 'ID de la cuenta' })
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }

  @Post(':id/regenerate-api-key')
  @ApiOperation({ summary: 'Regenerar API Key de una cuenta' })
  @ApiParam({ name: 'id', description: 'ID de la cuenta' })
  regenerateApiKey(@Param('id') id: string): Promise<Account> {
    return this.accountsService.regenerateApiKey(id);
  }
}
