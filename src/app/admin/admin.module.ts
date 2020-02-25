import { NgModule } from '@angular/core';
import { CommonAppModule } from '../share/common.app.module';
import { HeaderComponent } from '../share/components/header/header.component';
import { MainMenuComponent } from '../share/components/main.menu/main.menu.component';
import { AdminComponent } from './admin.component';

@NgModule({
	imports: [
		CommonAppModule,
	],
	declarations: [
		AdminComponent,
		HeaderComponent,
		MainMenuComponent		
	],
	providers: [
	]
})
export class AdminModule { }

