export class Util {

    static GetUtcDate(): Date{
        let date = new Date();
        const utc_date = date.toISOString() as unknown as Date;
        return utc_date;
    } 
}