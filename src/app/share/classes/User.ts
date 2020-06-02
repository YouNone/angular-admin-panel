import { ESex, IUser, ITypeOfLeader } from "../models/type";

export class User implements IUser {
	id: string;
	login: string;
	email: string;
	name: string;
	sex: ESex;
	password: string;
	date_birth: string;
	date_hire: string;
	date_fire?: string;
	date_create: string;
	date_modify: string;
	// header_type: ITypeOfLeader;
	constructor(
		data: IUser = <IUser>{}
	) {
		this.id = data.id || undefined;
		this.name = data.name || '';
		this.login = data.login || '';
		this.email = data.email || '';
		this.password = data.password || '';
		this.date_birth = data.date_birth || '';
		this.date_hire = data.date_hire || '';
		this.date_fire = data.date_fire || '';
		this.date_create = data.date_create || '';
		this.date_modify = data.date_modify || '';
		this.sex = data.sex || undefined;
		if (this.sex) {
			const s = data.sex.toString().trim();
			this.sex = s == ESex.Male.toString() ? ESex.Male : s == ESex.Female.toString() ? ESex.Female : undefined;
		}

	}
}
