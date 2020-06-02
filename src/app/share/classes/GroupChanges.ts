import { IUser } from './../models/type';
import { IGroupChanges } from '../models/type';

export class GroupChanges implements IGroupChanges {
	id?: string;
	name: string;
	code: string;
	items: {
		added: string[];
		deleted: string[];
	};
	users: IUser

	constructor(data: IGroupChanges = <IGroupChanges>{}) {
		this.id = data.id || undefined;
		this.name = data.name || '';
		this.code = data.code || '';
		this.items = {
			added: [],
			deleted: []
		};
		// this.boss = {
		// 	deleted: [],
		// 	added: [],
		// 	changed_header_type: {}
		// };
	}
}
