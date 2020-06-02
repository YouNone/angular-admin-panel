import { IGroup, IUserWithPosition } from '../models/type';

export class Group implements IGroup {
	name: string;
	code: string;
	date_create?: string;
	date_modify?: string;
	id?: string;
	count?: number;
	users?: IUserWithPosition[];
	// boss?: IUserWithPosition[];
	constructor(
		data: IGroup = <IGroup>{}
	) {
		this.id = data.id || undefined;
		this.name = data.name || '';
		this.code = data.code || '';
		this.date_create = data.date_create || '';
		this.date_modify = data.date_modify || '';
		this.users = data.users || [];
	}
}
