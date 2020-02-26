import { ButtonsSet } from '../models/type';

export class DialogButtonConfig {
	[x: string]: any;
	private static add = {
		title: "Добавить",
		value: true,
		color: 'primary',
		active: true
	};
	private static cancel = {
		title: "Отмена",
		value: "",
		color: "",
		active: false
	};
	private static save = {
		title: "Сохранить",
		value: true,
		color: 'primary',
		active: true
	};
	private static register = {
		title: "Зарегистрироватся",
		value: true,
		color: 'primary',
		active: true
	};
	private static no = {
		title: "Нет",
		value: '',
		color: '',
		active: false
	};
	private static yes = {
		title: "Да",
		value: true,
		color: 'primary',
		active: true
	};

	private static goTo = {
		title: "Уйти",
		value: true,
		color: 'primary',
		active: true
	};
	private static logIn = {
		title: "Войти",
		value: true,
		color: 'primary',
		active: true
	};
	private static logOut = {
		title: "Выйти",
		value: true,
		color: 'primary',
		active: true
	}
	private static Ok = {
		title: "OK",
		value: true,
		color: 'primary',
		active: true
	};

	public static YesNo: ButtonsSet = [
		DialogButtonConfig.no,
		DialogButtonConfig.yes
	];

	public static GoCancel: ButtonsSet = [
		DialogButtonConfig.cancel,
		DialogButtonConfig.goTo
	];

	public static SaveCancel: ButtonsSet = [
		DialogButtonConfig.cancel,
		DialogButtonConfig.save
	];

	public static Login: ButtonsSet = [
		DialogButtonConfig.cancel,
		DialogButtonConfig.logIn
	];

	public static Logout: ButtonsSet = [
		DialogButtonConfig.cancel,
		DialogButtonConfig.logOut
	];

	public static Register: ButtonsSet = [
		DialogButtonConfig.cancel,
		DialogButtonConfig.register
	];

	public static AddCancel: ButtonsSet = [
		DialogButtonConfig.cancel,
		DialogButtonConfig.add
	];

	public static OK: ButtonsSet = [
		DialogButtonConfig.Ok
	];

}
