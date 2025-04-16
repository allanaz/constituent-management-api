import { IsNotEmpty, IsArray, ValidateNested, IsOptional, IsEmail, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class NameDto {
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  @IsString()
  first: string;

  @IsOptional()
  @IsString()
  middle?: string;

  @IsOptional()
  @IsString()
  last?: string;

  @IsOptional()
  @IsString()
  suffix?: string;

  @IsOptional()
  @IsBoolean()
  isPreferred?: boolean = false;
}

export class AddressDto {
  @IsOptional()
  @IsString()
  line1?: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsBoolean()
  isPreferred?: boolean = false;
}

export class CreateConstituentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NameDto)
  names: NameDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses: AddressDto[];
}

export class UpdateConstituentDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NameDto)
  names?: NameDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];
}

export class ConstituentResponseDto {
  id: number;
  email: string;
  names: NameDto[];
  addresses: AddressDto[];
}