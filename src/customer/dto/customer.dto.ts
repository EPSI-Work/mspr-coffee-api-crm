import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { AddressDto } from "./address.dto"

export class CustomerDto {
  @IsNotEmpty()
  @IsString()
  firstName: string
  @IsNotEmpty()
  @IsString()
  lastName: string
  @IsEmail()
  @IsNotEmpty()
  email: string
  @IsString()
  @IsNotEmpty()
  phone: string
  @IsNotEmpty()
  address: AddressDto
}