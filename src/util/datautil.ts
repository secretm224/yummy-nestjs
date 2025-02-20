
export class Util {
    static GetKstDate():Date{
        const nowUtc = new Date();
        return new Date(nowUtc.getTime() + 9 * 60 * 60 * 1000);
    } 
}