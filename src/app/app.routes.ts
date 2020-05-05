import { AuthComponent } from './auth/auth/auth.component';
import { Routes } from '@angular/router';

import { compRoutes } from './share/models/type';
import { GroupEditComponent } from './admin/components/group.edit/group.edit.component';
import { GroupListComponent } from './admin/components/group.list/group.list.component';
import { UserEditComponent } from './admin/components/user.edit/user.edit.component';
import { UserListComponent } from './admin/components/user.list/user.list.component';
import { LeaveUnsavedComponentGuard } from './share/services/leaveUnsavedGuard';
import { ScaleEditComponent } from './admin/components/scale.edit/scale.edit.component';
import { ScaleListComponent } from './admin/components/scale.list/scale.list.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './share/components/not.found/not.found.component';
import { TaskListComponent } from './admin/components/task.list/task.list.component';
import { TaskEditComponent } from './admin/components/task.edit/task.edit.component';

export const routesRoot: Routes = [
	{
		path: '',
		component: AdminComponent,
		children: [
			{ path: '', redirectTo: compRoutes.user, pathMatch: 'full' },
			{
				path: compRoutes.user, component: UserListComponent, data: { breadcrumb: 'Пользователи' }, children: [
					{ path: compRoutes.userEdit, component: UserEditComponent, canDeactivate: [LeaveUnsavedComponentGuard] },
					{ path: compRoutes.userEdit + '/:id', component: UserEditComponent, canDeactivate: [LeaveUnsavedComponentGuard] },
				]
			},

			{
				path: compRoutes.group, component: GroupListComponent, data: { breadcrumb: 'Группы' }, children: [
					{ path: compRoutes.groupEdit, component: GroupEditComponent, canDeactivate: [LeaveUnsavedComponentGuard] },
					{ path: compRoutes.groupEdit + '/:id', component: GroupEditComponent, canDeactivate: [LeaveUnsavedComponentGuard] },
				]
			},

			{
				path: compRoutes.scale, component: ScaleListComponent, data: { breadcrumb: 'Шкалы' }, children: [
					{ path: compRoutes.scaleEdit, component: ScaleEditComponent, canDeactivate: [LeaveUnsavedComponentGuard] },
					{ path: compRoutes.scaleEdit + '/:id', component: ScaleEditComponent, canDeactivate: [LeaveUnsavedComponentGuard] },
				]
			},

			{
				path: compRoutes.task, component: TaskListComponent, data: { breadcrumb: 'Задачи' }, children: [
					{ path: compRoutes.taskEdit, component: TaskEditComponent, canDeactivate: [LeaveUnsavedComponentGuard] },
					{ path: compRoutes.taskEdit + '/:id', component: TaskEditComponent, canDeactivate: [LeaveUnsavedComponentGuard] },
				]
			}
		]

	},
	{ path: 'auth', component: AuthComponent },
	{ path: compRoutes.notFound, component: NotFoundComponent },
	{ path: '**', redirectTo: compRoutes.notFound }
];