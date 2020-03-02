import { Component, OnInit, ViewChild } from '@angular/core';
import { IUser, IGroup, compRoutes, ITabState, ESort, ISearchOptions, ICheckState, IGroupChanges } from 'src/app/share/models/type';
import { NotifElemetntConfig } from 'src/app/share/utilit/simple.notification.config';
import { DialogButtonConfig } from 'src/app/share/utilit/dialog.button.config';
import { Sort, MatTableDataSource, MatSnackBar, MatSort, MatMenuTrigger } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MsgList } from 'src/app/share/services/msg.list';
import { SettingService } from 'src/app/share/services/settings.service';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { DialogService } from 'src/app/share/services/dialog.service';
import { NotificationsService } from 'angular2-notifications';
import { Group } from 'src/app/share/classes/Group';
import { EditComponentsClass } from 'src/app/share/classes/EditComponents';
import { Location } from '@angular/common';
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
	userDisplayedColumns: string[] = ['full_name', 'login', 'position', 'email', 'action'];
	bossDisplayedColumns: string[] = ['full_name', 'login', 'position', 'email', 'type', 'action'];
	/** Список существующих типов руководства. Читаем из БД */
	leadersTypeList: TypeOfLeader[] = [];
	/** Текущий выбраный руководитель. Срабатывает при выборе пункта меню типов руководства */
	currentBoss: IUser;
	/** Хранилище изменений сотрудников и начальства */
	groupChanges = new GroupChanges();
	/** Роут по которому в виджете поиска пользователей производится поиск */
	userSearchVidgetRoute: string = compRoutes.user;

	@ViewChild("sortUser", { static: false }) sortUser: MatSort;
	@ViewChild("sortBoss", { static: false }) sortBoss: MatSort;
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
				orderField: "full_name",
				searchString: "",
				order: "asc",
				form: new FormControl(""),
				users: new MatTableDataSource<IUser>([])
			}, {
				orderField: "full_name",
				searchString: "",
				order: "asc",
				form: new FormControl(""),
				users: new MatTableDataSource<IUser>([])
			}
		];
	}

	getLeadersType(): Observable<TypeOfLeader[]> {
		this.dataService.setServiceUrl(compRoutes.catalogboss);
		const option: ISearchOptions = {
			start: 0,
			limit: 10000,
		};
		return this.dataService.getList<TypeOfLeader>(option);
	}

	getGroup(): Observable<IGroup> {
		this.dataService.setServiceUrl(compRoutes.group);
		return this.dataService.getItem<IGroup>(this.currId)
	}

	readComponentData() {
		forkJoin([
			this.getLeadersType(),
			this.getGroup()
		]).subscribe((res) => {
			this.leadersTypeList = res[0];
			this.componentData = res[1];
			this.componentForm.patchValue({
				code: this.componentData.code,
				name: this.componentData.name,
				date_create: this.componentData.date_create,
				date_modify: this.componentData.date_modify
			});
			this.state[1].users = new MatTableDataSource(this.componentData.user);
			this.state[2].users = new MatTableDataSource(this.componentData.boss);
			this.isReady = true;

		});
	}

	ngOnInit() {
		this.dataService.setServiceUrl(compRoutes.group);
		this.initState();
		this.ctrl = (<FormGroup>this.componentForm).controls;
		this.currTabNum = 0;
		if (this.route.snapshot.params["id"] !== undefined) {
			this.currId = this.route.snapshot.params["id"];
			this.readComponentData();
		} else {
			this.isReady = true;
			this.getLeadersType().subscribe((res: TypeOfLeader[]) => {
				this.leadersTypeList = res;
			});
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
				if (!a.header_type || !b.header_type) {
					a.header_type = {};
					b.header_type = {};
				}
				switch (sort.active) {
					case 'full_name': return compare(a.full_name, b.full_name, isAsc);
					case 'login': return compare(a.login, b.login, isAsc);
					case 'email': return compare(a.email, b.email, isAsc);
					case 'position': return compare(a.position.name, b.position.name, isAsc);
					case 'type': return compare(a.header_type.name, b.header_type.name, isAsc);
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
					this.componentData.user = this.state[this.currTabNum].users.data;
				} else { // bosses
					this.componentData.boss = this.state[this.currTabNum].users.data;
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
		if (this.currTabNum == 2) {
			key = 'boss';
		}
		if (this.groupChanges[key].added.includes(id)) {
			this.groupChanges[key].added = this.groupChanges.items.added.filter((item: string) => item != id);
		} else {
			this.groupChanges[key].deleted.push(id);
		}
	}

	markUserAdded(id: string) {
		// Если номер закладки == 1 изменяем пользователей, == 2  руководителей
		let key = 'items';
		if (this.currTabNum == 2) {
			key = 'boss';
		}
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
			count: item.user && item.user.length ? item.user.length : 0,
			date_create: item.date_create,
			date_modify: item.date_modify
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
	}

	filterInput(e: string) {
		if (this.currState.users.data.length > 0) {
			this.currState.searchString = e.trim().toLowerCase();
			this.currState.users.filter = this.currState.searchString;
		} else false;
	}

	/** Меняет флаг отвечающий за отображение поиска */
	activateSearch() {
		this.userSearchIsOpen = !this.userSearchIsOpen;
	}

	onContextMenu(event: MouseEvent, item: IUser) {
		this.currentBoss = item;
		event.preventDefault();
		this.isChanged = true;
	}

	changeBossType(item: TypeOfLeader) {
		this.selectedBossType = item;

		let bosses = this.groupChanges.boss.changed_header_type;
		// important init !!
		if (!bosses[this.currentBoss.id]) bosses[this.currentBoss.id] = {};
		if (this.currentBoss.header_type && this.currentBoss.header_type.id) {
			bosses[this.currentBoss.id].old = this.currentBoss.header_type.id;
		}
		this.currentBoss.header_type = item;
		bosses[this.currentBoss.id].new = item.id;
		this.isChanged = true;
	}

}
