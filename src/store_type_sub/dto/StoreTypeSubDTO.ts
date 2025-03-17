
export class StoreTypeSubDTO { 

    readonly subType: number;
    readonly majorType: number;
    readonly typeName: string;

    constructor(subType: number, majorType: number, typeName: string) {
        this.subType = subType;
        this.majorType = majorType;
        this.typeName = typeName;
    }

    static fromJSON(json: any): StoreTypeSubDTO {
        return new StoreTypeSubDTO(json.sub_type, json.major_type, json.type_name);
    }
} 