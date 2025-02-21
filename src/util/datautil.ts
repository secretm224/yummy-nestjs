
export class Util {

    static GetKstDate():Date{
        let date = new Date();
        
        if(process.env.NODE_ENV === 'production'){
            date = new Date(date.getTime() + 9 * 60 * 60 * 1000);
        }

        return date;
    } 
}