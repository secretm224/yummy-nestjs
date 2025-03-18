
export class TotalSearchDTO {

    readonly searchValue: string;
    readonly selectMajor: number;
    readonly selectSub: number;
    readonly zeroPossible: boolean

    constructor(searchValue: string, selectMajor: number, selectSub: number, zeroPossible:boolean) {
        this.searchValue = searchValue;
        this.selectMajor = selectMajor;
        this.selectSub = selectSub;
        this.zeroPossible = zeroPossible;
    }
}