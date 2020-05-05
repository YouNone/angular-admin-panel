import { CommonAppModule } from "src/app/share/common.app.module";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { CommonModule } from '@angular/common';

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
	]
})
export class AuthModule { }
