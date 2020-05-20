import { IAuthInfo } from './../models/type';
import { MsgList } from 'src/app/share/services/msg.list';
import { RequestsService } from './requests.service';
import { SettingService } from 'src/app/share/services/settings.service';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { decode } from 'punycode';


@Injectable()
export class AuthService {
    /** Признак авторизованности пользователя */
    private isAuth = false;
    /** Авторизационная и сопутствующая информация пользователя, получаемая с сервера */
    private authInfo: IAuthInfo = undefined;
    /** Тип локального хранилища браузера: localStorage,	sessionStorage */
    private storage: string = "localStorage";

    cachedRequests: Array<HttpRequest<any>> = [];

    constructor(
        private $SETTING: SettingService,
        private request: RequestsService,
        private $MSG: MsgList,
    ) {
        const info = window[this.storage].getItem('AUTH_INFO');
        if (info) {
            // this.authInfo = JSON.parse(info);
            this.isAuth = true;
        }
    }

    login(authData: IAuthInfo) {
        if (authData.token) {
            this.authInfo = authData;
            // console.log("logging in", authData);
            this.isLogin();
            window[this.storage].setItem('AUTH_INFO', JSON.stringify(authData.token));
            let token = window[this.storage].getItem('AUTH_INFO', JSON.stringify(authData.token));
            this.isAuth = true;
        }
    }


    logout() {
        this.clearAuthInfo();
    }


    clearAuthInfo(): void {
        this.isAuth = false;
        this.authInfo = undefined;
        window[this.storage].removeItem("AUTH_INFO");
    }

    // //  Возвращает статус авторизации
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
}
