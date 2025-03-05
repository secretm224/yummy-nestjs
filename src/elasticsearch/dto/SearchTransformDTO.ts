// create-user.dto.ts

export class SearchTransformDTO {

    readonly searchData: string;
    readonly searchDataTrans: string;

    constructor(searchData: string, searchDataTrans: string) {
        this.searchData = searchData;
        this.searchDataTrans = searchDataTrans;
    }
}