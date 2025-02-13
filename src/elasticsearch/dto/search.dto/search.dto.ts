export class SearchDto {
    query: {
      match: {
        consume_keyword: string;
      };
    };
  }