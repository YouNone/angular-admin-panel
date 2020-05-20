import { LoginComponent } from './../auth/login/login.component';
import { DivisionSelectDialogComponent } from './components/division.select.dialog/division.select.dialog.component';
import { DivisionListComponent } from './../admin/components/division.list/division.list.component';
import { AuthComponent } from './../auth/auth/auth.component';
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AngMaterialModule } from './ang.material.module';
import { UserListComponent } from '../admin/components/user.list/user.list.component';
import { UserEditComponent } from '../admin/components/user.edit/user.edit.component';
import { GroupListComponent } from '../admin/components/group.list/group.list.component';
import { GroupEditComponent } from '../admin/components/group.edit/group.edit.component';
import { ScaleListComponent } from '../admin/components/scale.list/scale.list.component';
import { ScaleEditComponent } from '../admin/components/scale.edit/scale.edit.component';
import { DialogConfirmComponent } from './components/dialog.confirm/dialog.confirm.component';
import { SelectItemMenuComponent } from './components/select.item.menu.component/select.item.menu.component';
import { TaskListComponent } from '../admin/components/task.list/task.list.component';
import { TaskEditComponent } from '../admin/components/task.edit/task.edit.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { DivisionEditComponent } from '../admin/components/division.edit/division.edit.component';
import { AuthModule } from '../auth/auth.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		HttpClientModule,
		ReactiveFormsModule,
		AngMaterialModule,
		InfiniteScrollModule,
		MonacoEditorModule.forRoot()
	],
	exports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		AngMaterialModule,
		InfiniteScrollModule,
		SelectItemMenuComponent,
	],
	declarations: [
		DivisionEditComponent,
		DivisionListComponent,
		UserListComponent,
		UserEditComponent,
		GroupListComponent,
		GroupEditComponent,
		ScaleListComponent,
		ScaleEditComponent,
		TaskListComponent,
		TaskEditComponent,
		DialogConfirmComponent,
		SelectItemMenuComponent,
		AuthComponent,
		LoginComponent,
		DivisionSelectDialogComponent
	],
	entryComponents: [
		DialogConfirmComponent,
		DivisionSelectDialogComponent
	],
})
export class CommonAppModule{}