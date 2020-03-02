import { IGroupChanges } from '../models/type';

export class GroupChanges implements IGroupChanges {
	id?: string;
	name: string;
	code: string;
	items: {
		added: string[];
		deleted: string[];
	};
	boss: {
		deleted: string[];
		added: string[];
		changed_header_type: {
			[boss_id: string]: {
				old?: string;
				new?: string;
			}
		}
	};

	constructor(data: IGroupChanges = <IGroupChanges>{}) {
		this.id = data.id || undefined;
		this.name = data.name || '';
		this.code = data.code || '';
		this.items = {
			added: [],
			deleted: []
		};
		this.boss = {
			deleted: [],
			added: [],
			changed_header_type: {}
		};
	}
}
