import { Observable } from 'rxjs';
import { Component } from '@angular/compiler/src/core';
import { CanDeactivate } from '@angular/router';

export enum compRoutes {

	user = 'user',
	userEdit = 'useredit',

	group = 'group',
	groupEdit = 'groupedit',

	div = 'division',
	divEdit = 'divisionedit',

	divgroup = 'divgroup',
    divgroupEdit = 'divgroupedit',
    
    scale = 'scale',
	scaleEdit = 'scaleedit',

	// Other
	auth = 'auth',
	notFound = 'notfound'
}

export interface CanDeactivateComponent extends CanDeactivate<Component> {
	canDeactivate(): Observable<boolean> | Promise<boolean> | boolean
}