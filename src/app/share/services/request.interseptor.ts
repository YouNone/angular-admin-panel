import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { SettingService } from 'src/app/share/services/settings.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

	// private token: string = 'this.token';
	private apiUrl: string = '';

	constructor(
		private authService: AuthService,
        private $SETTINGS: SettingService, 
        private tokenService: TokenService
	) {
		
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
		let params = {
			headers: req.headers.set('TOKEN', this.tokenService.getToken()),
			// url: `${this.apiUrl}${req.url}`,
			// withCredentials: (this.$SETTINGS.get('authorisationType') === "domain") ? true : false
		}
		const myReq = req.clone(params);
        return next.handle(myReq);
      
    }
  
}
