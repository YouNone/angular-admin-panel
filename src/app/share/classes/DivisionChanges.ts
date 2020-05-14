import { IDivisionChanges } from 'src/app/share/models/type';

export class DivisionChanges implements IDivisionChanges {
	id?: number;
	name: string;
	code: string;
	parent_id: number;
	closed: boolean;
	date_start: string;
	date_end: string;

	constructor(data: IDivisionChanges = <IDivisionChanges> {}) {
		this.id = data.id || undefined;
		this.name = data.name || '';
		this.code = data.code || '';
		this.parent_id = data.parent_id || undefined;
		this.date_start = data.date_start || '';
		this.date_end = data.date_end || '';
	}
}