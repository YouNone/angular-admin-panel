import { IAuthInfo, EStorageType } from './../models/type';
import { UserAuthInfo } from './../classes/UserAuthInfo';
import { User } from 'src/app/share/classes/User';
import { compRoutes, ShortHttpResponse, IUserAuthInfo } from 'src/app/share/models/type';
import { MsgList } from 'src/app/share/services/msg.list';
import { RequestsService } from './requests.service';
import { SettingService } from 'src/app/share/services/settings.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthService {
    /** Признак авторизованности пользователя */
    private isAuth = false;
    /** Авторизационная и сопутствующая информация пользователя, получаемая с сервера */
    private authInfo: IUserAuthInfo = undefined;
    /** Тип локального хранилища браузера: localStorage,	sessionStorage */
    private storage: string = "localStorage";

    constructor(
        private $SETTING: SettingService,
        private request: RequestsService,
        private $MSG: MsgList,
    ) {
        const info = window[this.storage].getItem('authInfo');
        if (info) {
            this.authInfo = JSON.parse(info);
            this.isAuth = true;
        }
    }

    // login(authData: IAuthInfo): Observable<ShortHttpResponse> {
    login(authData: IAuthInfo) {
        console.log("logging in", authData);
        window[this.storage].setItem('AUTH_INFO', JSON.stringify(authData));

        // return this.request.post<IUserAuthInfo>(compRoutes.auth, authData)
        //     .pipe(
        //         map((currUserAuthInfo: IUserAuthInfo) => {
        //             if (currUserAuthInfo) {
        //                 let authInfo = new UserAuthInfo(currUserAuthInfo);
        //                 this.isAuth = true;
        //                 window[this.storage].setItem('authInfo', JSON.stringify(this.authInfo));
        //                 return new ShortHttpResponse(true, authInfo);
        //             } else {
        //                 return new ShortHttpResponse(false, currUserAuthInfo, this.$MSG.getMsg('credentialNotFoung'));
        //             }
        //         })
        //     );
    }


    logout() {
        this.clearAuthInfo();
    }


    clearAuthInfo(): void {
        this.isAuth = false;
        this.authInfo = undefined;
        window[this.storage].clear();
        this.storage = undefined;
    }



    //  Возвращает статус авторизации
    isLogin(): boolean {
        return this.isAuth;
    }

    // токен текущей сессии
    getToken(): string {
        if (this.isLogin() && this.authInfo) {
            return this.authInfo.token;
        } else {
            return undefined;
        }
    }

    setStorage(){
		this.storage = this.$SETTING.get('storage') === EStorageType.local ? EStorageType.local : EStorageType.session;
	}

}
