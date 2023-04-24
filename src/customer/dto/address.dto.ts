import { IsNotEmpty, IsString } from "class-validator"

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  street: string
  @IsNotEmpty()
  @IsString()
  city: string
  @IsNotEmpty()
  @IsString()
  zipCode: string
  @IsNotEmpty()
  @IsString()
  country: string

  toCreateNestedInput() {
    return {
      create: {
        street: this.street,
        city: this.city,
        zipCode: this.zipCode,
        country: this.country,
      }
    }
  }
}