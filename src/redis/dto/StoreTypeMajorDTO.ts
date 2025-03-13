
export class StoreTypeMajorDTO { 

    readonly majorType: number;
    readonly typeName: string;

    constructor(majorType: number, typeName: string) {
        this.majorType = majorType;
        this.typeName = typeName;
    }

    static fromJSON(json: any): StoreTypeMajorDTO {
        return new StoreTypeMajorDTO(json.major_type, json.type_name);
    }
} 