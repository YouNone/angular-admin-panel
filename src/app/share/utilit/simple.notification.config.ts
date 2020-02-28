import { MatSnackBarConfig } from "@angular/material/snack-bar";

// Настройки для окон уведомлений компонента SimpleNotification

/**
 * Класс настроек компонента уведомлений.
 * defaultOption -- вверху по центру, без ограничений по времени.
 * timeOption -- вверху по центру, пауза 5 секунд. После этого окно исчезает.
 * 
 * @export
 * @class NotifElemetntConfig
 */
export class NotifElemetntConfig {

	/** Настройки по умолчанию. По центру экрана не ограниченное по времени окно. */
	public static defaultOption = {
		position: ['top', 'center'],
		showProgressBar: false,
		pauseOnHover: true,
		lastOnBottom: true,
		clickToClose: true,
		animate: 'fromBottom',
	}

	/** Окно с паузой в 5 секунд с прогресс-баром таймера. Таймер останавливается при наведении мыши. */
	public static timeOption = {
		timeOut: 5000,
		position: ['top', 'center'],
		showProgressBar: true,
		pauseOnHover: true,
		lastOnBottom: true,
		clickToClose: true,
		animate: 'fromBottom'
	}

	/** Окно с паузой в 15 секунд, с прогресс-баром таймера. Таймер останавливается при наведении мыши. */
	public static longTimeOption = {
		timeOut: 15000,
		position: ['top', 'center'],
		showProgressBar: true,
		pauseOnHover: true,
		lastOnBottom: true,
		clickToClose: true,
		animate: 'fromBottom'
	}

	/** Найтройки снекБара для вывода информационных уведомлений	*/
	public static snackInfoConfig: MatSnackBarConfig = {
		duration: 6000,
		verticalPosition: "bottom",
		horizontalPosition: "center",
		panelClass: ['snack-info']
	}

	public static snackErrorConfig: MatSnackBarConfig = {
		duration: 6000,
		verticalPosition: "bottom",
		horizontalPosition: "center",
		panelClass: ['snack-error']
	}

	constructor(){}
}
