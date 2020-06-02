// import { Router } from '@angular/router';
// import { compRoutes } from 'src/app/share/models/type';
// import { Observable } from 'rxjs';
// import { SettingService } from 'src/app/share/services/settings.service';
// import { AuthService } from './auth.service';
// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpEvent, HttpErrorResponse } from '@angular/common/http';
// import { tap } from 'rxjs/operators';

// @Injectable()
// export class RequestInterceptor implements HttpInterceptor {

// 	private apiUrl: string = '';
// 	private token: string = '';

// 	constructor(
// 		private authService: AuthService,
// 		public router: Router,
// 	) {
// 		if (this.authService.isLogin()) {
// 			this.token = this.authService.getToken();
// 			console.log(this.token);
			
// 		} else {
// 			this.router.navigate(['./', compRoutes.login])
// 		}

// 	}

// 	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
// 		// console.log(req);
		
// 		let params = {
// 			headers: req.headers.set('TOKEN', this.token),
// 		}
// 		const myReq = req.clone(params);
// 		// console.log(myReq);
		
// 	    return next.handle(myReq);
// 	}
// }
