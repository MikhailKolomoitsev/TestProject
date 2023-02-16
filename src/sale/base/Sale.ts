import { Field, ObjectType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsDate,
    IsInt,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import { Customer } from "../../customer/base/Customer";
import { Order } from "../../order/base/Order";

@ObjectType()
class Sale {
  @ApiProperty({
    required: true
  })
  @IsDate()
  @Type(() => Date)
  @Field(() => Date)
  createdAt!: Date;

  @ApiProperty({
    required: false,
    type: () => Customer
  })
  @ValidateNested()
  @Type(() => Customer)
  @IsOptional()
  customer?: Customer | null;

  @ApiProperty({
    required: false,
    type: () => Order
  })
  @ValidateNested()
  @Type(() => Order)
  @IsOptional()
  orders?: Order[] | null;

  @ApiProperty({
    required: true,
    type: String
  })
  @IsString()
  @Field(() => String)
  id!: string;

  @ApiProperty({
    required: false,
    type: Number
  })
  @IsInt()
  @IsOptional()
  @Field(() => Number, {
    nullable: true
  })
  totalPrice!: number | null;

  @ApiProperty({
    required: true
  })
  @IsDate()
  @Type(() => Date)
  @Field(() => Date)
  updatedAt!: Date;
}

export { Sale };
