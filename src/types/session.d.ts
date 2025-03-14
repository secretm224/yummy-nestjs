import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      name: string;
      picture: string;
      is_admin: boolean;
      login_channel: string;
      token_id:string;
      detail:Detail[];
    };
  }

  interface Detail {
    addr_type:string,
    addr:string,
    lngx:number,
    laty:number
  }

}
