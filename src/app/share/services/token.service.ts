import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class TokenService {
	private token = "TOKEN!";

	getToken() {
		return this.token;
	}
	constructor() { }

}
