// import { RequestInterceptor } from './../share/services/request.interseptor';
import { CommonAppModule } from "src/app/share/common.app.module";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const authRoutes: Routes = [
	{path: 'auth', component: AuthComponent}
]; 

@NgModule({
	imports: [
		CommonModule,
		CommonAppModule,
		RouterModule.forChild(authRoutes),
	],
	declarations: [
		AuthComponent
	],
	providers: [
		// {
		// 	provide: HTTP_INTERCEPTORS,
		// 	useClass: RequestInterceptor,
		// 	multi: true
		//   }
	]
})
export class AuthModule { }
