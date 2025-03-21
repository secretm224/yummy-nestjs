import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      buildSchemaOptions: {
        dateScalarMode: 'isoDate', // ISO 포맷 사용
      },
    }),
  ],
})
export class GraphQlModule {} // <-- 반드시 export 되어야 함
