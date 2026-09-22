import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ example: 'Empresa ACME', description: 'Nombre de la cuenta u organización' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'contacto@acme.com', description: 'Email del titular de la cuenta' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
