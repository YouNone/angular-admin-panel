import { Component, OnInit, ViewChild } from '@angular/core';
import { Sort, MatTableDataSource, MatSnackBar, MatSort, MatMenuTrigger } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';

import { IUser, IGroup, compRoutes, ITabState, ESort, ISearchOptions, ICheckState, IGroupChanges } from 'src/app/share/models/type';
import { NotifElemetntConfig } from 'src/app/share/utilit/simple.notification.config';
import { DialogButtonConfig } from 'src/app/share/utilit/dialog.button.config';
import { MsgList } from 'src/app/share/services/msg.list';
import { SettingService } from 'src/app/share/services/settings.service';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { DialogService } from 'src/app/share/services/dialog.service';
import { Group } from 'src/app/share/classes/Group';
import { EditComponentsClass } from 'src/app/share/classes/EditComponents';
import { TypeOfLeader } from 'src/app/share/classes/TypeOfLeader';
import { GroupChanges } from 'src/app/share/classes/GroupChanges';
import { SelectItemMenuComponent } from 'src/app/share/components/select.item.menu.component/select.item.menu.component';

@Component({
  selector: 'app-group.edit',
  templateUrl: './group.edit.component.html',
  styleUrls: ['./group.edit.component.css']
})
export class GroupEditComponent extends EditComponentsClass<Group> {
	/** ID редактируемой записи, если происходит редактирование существующего элемента undefined если создаем новый*/
	currId: string;
	/** число текущей открытой вкладки */
	currTabNum: number;
	/** Флаг открытого фильтра пользователей */
	userSearchIsOpen: boolean = false;
	/** Объект хранящий состояние текущей открытой вкладки*/
	currState: ITabState;
	/** Объект хранящий форму, состояние строк фильтров, полей сортировки в таблицах */
	state: ITabState[];
	/** Список заголовков в таблице */
	userDisplayedColumns: string[] = ['name', 'login', 'email', 'action'];
	/** Хранилище изменений сотрудников и начальства */
	groupChanges = new GroupChanges();
	/** Роут по которому в виджете поиска пользователей производится поиск */
	userSearchVidgetRoute: string = compRoutes.user;

	@ViewChild("sortUser", { static: false }) sortUser: MatSort;
	@ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
	@ViewChild(SelectItemMenuComponent, { static: true }) SelectItemMenuComponent: SelectItemMenuComponent;
	selectedBossType: TypeOfLeader = undefined;

	leaderState = {
		orderField: "name",
		f: "",
		order: ESort.asc
	}

	constructor(
		public snackBar: MatSnackBar,
		public router: Router,
		public route: ActivatedRoute,
		public $MSG: MsgList,
		public $SETTINGS: SettingService,
		public dataService: UniversalDataService,
		public $NOTE: NotificationsService,
		public buttonConfig: DialogButtonConfig,
		public dialogService: DialogService,
		public location: Location
	) {
		super(snackBar, router, route, $MSG, $SETTINGS, dataService, $NOTE, dialogService, location, Group);
		this.routeList = compRoutes.group;
	}

	tableTrackById(index, item) {
		return item.id;
	}

	initState() {
		const minLength = +this.$SETTINGS.get("minLengthTextInput");
		this.componentForm = new FormGroup({
			name: new FormControl("", [Validators.required, Validators.minLength(minLength)]),
			code: new FormControl("", [Validators.minLength(minLength)]),
			date_create: new FormControl({ value: "", disabled: true }),
			date_modify: new FormControl({ value: "", disabled: true })
		});
		this.state = [
			{
				form: this.componentForm
			}, {
				orderField: "name",
				searchString: "",
				order: "asc",
				form: new FormControl(""),
				users: new MatTableDataSource<IUser>([])
			}
		];
	}

	getGroup(): Observable<IGroup> {
		this.dataService.setServiceUrl(compRoutes.group);
		return this.dataService.getItem<IGroup>(this.currId)
	}

	ngOnInit() {
		this.dataService.setServiceUrl(compRoutes.group);
		this.initState();
		this.ctrl = (<FormGroup>this.componentForm).controls;
		this.currTabNum = 0;
		if (this.route.snapshot.params["id"] !== undefined) {
			this.currId = this.route.snapshot.params["id"];
			// this.readComponentData();
			this.dataService.getItem<Group>(this.currId)
			.subscribe((data: Group) => {
				console.log("data", data);
				
				this.componentData = new Group(data);
				console.log("this.componentData", this.componentData);
				this.componentForm.patchValue({
					code: this.componentData.code,
					name: this.componentData.name,				
					date_create: this.componentData.date_create,
					date_modify: this.componentData.date_modify,
				});
				this.state[1].users = new MatTableDataSource(data.users);
				// console.log('this.componentData', this.componentData);
				this.isReady = true;
			});
		} else {
			this.isReady = true;
		}
		this.$formSubscr = this.componentForm.valueChanges
			.subscribe(formValues => {
				this.applyFormValues(formValues);
			});
	}

	sortData(sort: Sort) {
		const isAsc = sort.direction === 'asc';
		if (this.currState.users.data.length > 0) {
			this.currState.users.data = this.currState.users.data.sort((a, b) => {

				switch (sort.active) {
					case 'name': return compare(a.name, b.name, isAsc);
					case 'login': return compare(a.login, b.login, isAsc);
					case 'email': return compare(a.email, b.email, isAsc);

				}
			});
		}
		function compare(a: number | string, b: number | string, isAsc: boolean): number {
			return (a < b ? -1 : (a > b ? 1 : 0)) * (isAsc ? 1 : -1);
		}
	}

	/** Перехватывает событие переключения табов */
	tabsSwitch(num: number) {
		this.currTabNum = num;
		this.currState = this.state[num];
	} 

	/** Удаляет пользователя или начальника исходя из открытой вкладки */
	removeUser(id: string) {
		this.dialogService.openConfirm(
			this.$MSG.getMsg('mConfirmRecordDelete'),
			"",
			DialogButtonConfig.YesNo
		).subscribe((res) => {
			if (res == true) {
				this.isChanged = true;
				this.currState.users.data = this.currState.users.data.filter(item => id !== item.id);
				this.markUserRemoved(id);
				if (this.currTabNum == 1) { // users
					this.componentData.users = this.state[this.currTabNum].users.data;
				}
			}
		});
	}

	/** Добавляет/удаляет пользователей в группе*/
	toggleUser(checkedUser: ICheckState<IUser>) {
		if (checkedUser.state) {
			this.currState.users.data = [checkedUser.item, ...this.currState.users.data];
			this.markUserAdded(checkedUser.item.id);
		} else {
			this.currState.users.data = this.currState.users.data.filter(
				(item: IUser) => checkedUser.item.id !== item.id
			);
			this.markUserRemoved(checkedUser.item.id);
		}
		this.isChanged = true;
	}

	markUserRemoved(id: string) {
		// Если номер закладки == 1 изменяем пользователей, == 2  руководителей
		let key = 'items';

		if (this.groupChanges[key].added.includes(id)) {
			this.groupChanges[key].added = this.groupChanges.items.added.filter((item: string) => item != id);
		} else {
			this.groupChanges[key].deleted.push(id);
		}
	}

	markUserAdded(id: string) {
		let key = 'items';
		if (this.groupChanges[key].deleted.includes(id)) {
			this.groupChanges[key].deleted = this.groupChanges.items.deleted.filter((item: string) => item != id);
		} else {
			this.groupChanges[key].added.push(id);
		}
	}

	createStateItem(item: IGroup) {
		this.savedState = {
			id: item.id,
			name: item.name,
			code: item.code,
			date_create: item.date_create,
			date_modify: item.date_modify,
			users: item.users 
		}
	}

	/**
	 * Клонируем объект изменений и готовим данные для отправки. 
	 * Дополняем изменения из формы к изменениям в списках пользователей  и руководителей. 
	 *
	 * @returns {IGroupChanges}
	 * @memberof GroupEditComponent
	 */
	prepareSendData(): IGroupChanges {
		let sendData = JSON.parse(JSON.stringify(this.groupChanges));
		sendData.name = this.componentData.name;
		sendData.code = this.componentData.code;
		if (this.componentData.id) {
			sendData.id = this.componentData.id;
		}
		console.log(sendData);
		
		return sendData;
	}


	/**
	 * Очищает объект изменения состояния группы после отправки данных
	 *
	 * @memberof GroupEditComponent
	 */
	clearGroupChanges() {
		this.groupChanges = new GroupChanges();
	}

	/**
	 * Отправка данных на сервер. Если ID задан -- выполняем апдейт компонента, если ID не задан -- создаем его
	 *
	 * @returns
	 * @memberof GroupEditComponent
	 */
	formSubmit() {
		this.dataService.setServiceUrl(compRoutes.group);
		if (this.componentForm.valid) {
			if (this.componentData.id) {
				// Апдейт бъекта
				if (this.isChanged || !this.componentForm.pristine) {
					this.disableButton = true;
					const sendData = this.prepareSendData();
					this.dataService.updateItem(sendData)
						.subscribe((group: IGroup) => {
							if (group.id) {
								this.createStateItem(group);
								this.snackBar.open(
									this.$MSG.getMsg("mRecordSuccessEdit"),
									this.$MSG.getMsg("btnOk"),
									NotifElemetntConfig.snackInfoConfig
								);
								this.disableButton = false;
							}
						});
				} else {
					// Форма не обновлялась
					this.$NOTE.warn(
						this.$MSG.getMsg('warning'),
						this.$MSG.getMsg("eFieldNotChanged"),
						NotifElemetntConfig.timeOption
					);
					return false;
				}
			} else {
				// Создаем объект
				this.disableButton = true;
				const sendData = this.prepareSendData();
				this.dataService.createItem<IGroup>(<any>sendData)
					.subscribe((group: IGroup) => {
						this.componentData = group;
						this.createStateItem(group);
						this.snackBar.open(
							this.$MSG.getMsg("mRecordSuccessAdd"),
							this.$MSG.getMsg("btnOk"),
							NotifElemetntConfig.snackInfoConfig
						);
						this.disableButton = false;
					});
			}
		} else {
			// Ошибка валидации формы
			this.$NOTE.warn(
				this.$MSG.getMsg('warning'),
				this.$MSG.getMsg("eEmptyField"),
				NotifElemetntConfig.timeOption
			);
			return false;
		}
		this.isChanged = false;
		this.clearGroupChanges();
		this.componentForm.markAsPristine();
		
		// console.log(this.componentData);
	}

	/** Меняет флаг отвечающий за отображение поиска */
	activateSearch() {
		this.userSearchIsOpen = !this.userSearchIsOpen;
	}

	onContextMenu(event: MouseEvent, item: IUser) {
		// this.currentBoss = item;
		event.preventDefault();
		this.isChanged = true;
	} 
}
