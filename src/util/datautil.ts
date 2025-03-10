export class Util {

    static GetUtcDate(): Date{
        let date = new Date();
        const utc_date = date.toISOString() as unknown as Date;
        return utc_date;
    } 

    static filterUndefined<T>(obj: T): Partial<T> {
        if(obj === null || obj === undefined) return {};
        return Object.fromEntries(
          Object.entries(obj).filter(([_, value]) => value !== undefined)
        ) as Partial<T>;
    }
}