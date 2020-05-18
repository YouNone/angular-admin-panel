import { IUserAuthInfo } from '../models/type';

export class UserAuthInfo  implements IUserAuthInfo {
    id: string;    
    name: string;
    login: string;
    img: string;
    email: string;
    token: string;
    isRoot: boolean;
    isAdmin: boolean;

    constructor(data: IUserAuthInfo = <IUserAuthInfo>{}){
        this.id = data.id || undefined;
        this.name = data.name || '';
        this.login = data.login || '';
        this.email = data.email || '';
        this.token = data.token || undefined;
    }
}
