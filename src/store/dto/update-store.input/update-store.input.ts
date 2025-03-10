import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateStoreInput } from '../create-store.input/create-store.input';

@InputType()
export class UpdateStoreInput extends PartialType(CreateStoreInput) {
  @Field(() => Int)
  seq: number;
}
