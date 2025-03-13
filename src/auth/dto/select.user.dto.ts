export class UserProfileDto {
    // User 엔티티 기본 정보
    readonly user_no: number;
    readonly user_nm: string;
    readonly reg_dt: Date;
  
    // UserAuth 엔티티 정보 
    readonly login_channel?: string;
    readonly token_id?: string;
  
    // UserDetail 엔티티 정보
    readonly addr_type?: string;
    readonly addr?: string;
    readonly lngx?: number;
    readonly laty?: number;
  }