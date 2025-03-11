import { InputType, Field, Int, Float,GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class CreateStoreInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  type: string;

  @Field(() => String, { nullable: true })
  use_yn?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  reg_dt?: Date;

  @Field(() => String, { nullable: true })
  reg_id?: string;

  @Field(() => Boolean, { nullable: true })
  is_beefulpay?: boolean;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => Float, { nullable: true })
  lat?: number;

  @Field(() => Float, { nullable: true })
  lng?: number;

  @Field(() => String, { nullable: true })
  location_city?: string;

  @Field(() => String, { nullable: true })
  location_county?: string;

  @Field(() => String, { nullable: true })
  location_district?: string;

  @Field(() => Int, { nullable: true })
  sub_type?: number;
}
