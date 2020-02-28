import { InjectionToken } from '@angular/core';
import { Routes, Route } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { MsgList } from '../services/msg.list';

export const ROUTES_TREE = new InjectionToken<Routes>('ROUTES_TREE');

export function getErrMsg(control: AbstractControl, msgList: MsgList): string {
	const errors = control.errors;
	let errorMsg = '';
	for (const key in errors) {
		if (errors.hasOwnProperty(key)) {
			switch (key) {
				case 'required':
					errorMsg = msgList.getMsg("eEmptyField"); break;
				case 'whitespace':
					errorMsg = msgList.getMsg("eCanNotBeWhiteSpace"); break;
				case 'minlength':
					errorMsg = msgList.getMsg("eFieldToShort"); break;
				case 'spaceinput':
					errorMsg = msgList.getMsgFormat("eCanNotBeWhiteSpace", errors[key]['requiredLength'], errors[key]['actualLength']); break;
				default:
					errorMsg = msgList.getMsg("eFieldFill"); break;
			}
			return errorMsg;
		}
	}
	return '';
}