import { IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class RegisterUserDto {

    @IsString()
    @IsNotEmpty()
    readonly user_nm: string;

    @IsString()
    readonly login_channel: string;

    @IsString()
    readonly token_id: string;
    
    @IsString()
    readonly addr_type: string;
    
    @IsString()
    readonly addr: string;
    
    @IsNumber()
    readonly lngx: number;

    @IsNumber()
    readonly laty: number;

}