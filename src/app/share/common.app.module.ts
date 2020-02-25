import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AngMaterialModule } from './ang.material.module';
import { UserListComponent } from '../admin/components/user.list/user.list.component';
import { UserEditComponent } from '../admin/components/user.edit/user.edit.component';
import { GroupListComponent } from '../admin/components/group.list/group.list.component';
import { GroupEditComponent } from '../admin/components/group.edit/group.edit.component';
import { ScaleListComponent } from '../admin/components/scale.list/scale.list.component';
import { ScaleEditComponent } from '../admin/components/scale.edit/scale.edit.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		HttpClientModule,
		ReactiveFormsModule,
		AngMaterialModule,
	],
	exports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		AngMaterialModule,
	],
	declarations: [
		UserListComponent,
		UserEditComponent,
		GroupListComponent,
		GroupEditComponent,
		ScaleListComponent,
		ScaleEditComponent
	],
	entryComponents: [
	
	],
})
export class CommonAppModule{}