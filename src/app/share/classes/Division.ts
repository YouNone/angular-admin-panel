import { IDivision, IUserWithPosition } from "../models/type";

export class Division implements IDivision {
	id?: string;
	name: string;
	code?: string;
	parent?: IDivision;
	closed?: boolean;
	date_start?: string;
	date_end?: string;
	date_create?: string;
	date_modify?: string;
	constructor(data: Division | IDivision | undefined);
	constructor(data: any, name: string = '') {
		if(typeof data === 'string') { // Если 
			this.id = data || undefined; 
			this.name = name || '';
		}else if(data === undefined || data === null) { // Пустой конструктор. Создаем заготовку предприятия
			this.id = undefined;
			this.code = '';
			this.name = '';
		}else{ // Если передали объект
			this.id = data.id || undefined;
			this.code = data.code || '';
			this.name = data.name || '';
			this.parent = new Division(data.parent) || undefined;
			
			this.closed = data.closed || false;
			this.date_start = data.date_start || undefined;
			this.date_end = data.date_end || undefined;
			this.date_create = data.date_create || undefined;
			this.date_modify = data.date_modify || undefined;
		}
	}
}