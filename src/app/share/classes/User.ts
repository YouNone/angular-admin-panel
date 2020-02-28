import { ESex, IUser } from "../models/type";

export class User implements IUser {
	id: string;
	login: string;
	email: string;
	full_name: string;
	sex: ESex;
	password: string;
	date_birth: string;
	date_hire: string;
	date_fire?: string;
	date_create: string;
	date_modify: string;
	constructor(
		data: IUser = <IUser>{}
	) {
		this.id = data.id || undefined;
		this.full_name = data.full_name || '';
		this.login = data.login || '';
		this.email = data.email || '';
		this.password = data.password || '';
		this.sex = data.sex || undefined;
		if (this.sex) {
			const s = data.sex.toString().trim();
			this.sex = s == ESex.Male.toString() ? ESex.Male : s == ESex.Female.toString() ? ESex.Female : undefined;
		}

	}
}
