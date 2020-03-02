import { ITypeOfLeader } from '../models/type';

export class TypeOfLeader implements ITypeOfLeader {
	id: string;
	code: string;
	name: string;
	/** Дата создания */
	date_create?: string;
	/** Дата последнего изменения */
	date_modify?: string;


	constructor(
		data: ITypeOfLeader = <ITypeOfLeader>{}
	) {
		this.id = data.id || undefined;
		this.name = data.name || '';
		this.code = data.code || '';
		this.date_create = data.date_create || undefined;
		this.date_modify = data.date_modify || undefined;
	}
}
