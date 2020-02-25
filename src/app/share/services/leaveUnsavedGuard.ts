import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CanDeactivateComponent } from '../models/type';

@Injectable()
export class LeaveUnsavedComponentGuard {

	constructor() { }

	/** Интерфейс, для защиты
	 * Если все гарды вернут истину, навигация продолжится. 
	 * Если какой-либо гард вернет false, навигация будет отменена. */
	canDeactivate(component: CanDeactivateComponent): Observable<boolean> | Promise<boolean> | boolean {
		return component.canDeactivate ? component.canDeactivate() : true;
	}
}