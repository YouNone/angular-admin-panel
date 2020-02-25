import { CommonAppModule } from 'src/app/share/common.app.module';
import { RouterModule } from '@angular/router';
import { routesRoot } from 'src/app/app.routes';
import { NgModule } from '@angular/core';
import { GroupEditComponent } from './group.edit/group.edit.component';
import { GroupListComponent } from './group.list/group.list.component';
import { UserListComponent } from './user.list/user.list.component';
import { UserEditComponent } from './user.edit/user.edit.component';
import { ScaleEditComponent } from './scale.edit/scale.edit.component';
import { ScaleListComponent } from './scale.list/scale.list.component';

@NgModule({
	imports: [
		CommonAppModule,
		RouterModule.forChild(routesRoot),
	],
	declarations: [
		GroupEditComponent,
		GroupListComponent,
		UserListComponent,
        UserEditComponent,
        ScaleListComponent,
        ScaleEditComponent
	]
})
export class PersonnelModule { }