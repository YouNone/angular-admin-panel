import { RequestInterceptor } from './share/services/request.interseptor';
import { AuthService } from './share/services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonAppModule } from './share/common.app.module';
import { RouterModule } from '@angular/router';
import { routesRoot } from './app.routes';
import { AdminModule } from './admin/admin.module';
import { NotFoundComponent } from './share/components/not.found/not.found.component';
import { ROUTES_TREE } from './share/utilit/utilit';
import { SettingService } from './share/services/settings.service';
import { MsgList } from './share/services/msg.list';
import { UniversalDataService } from './share/services/universal.data.service';
import { RequestsService } from './share/services/requests.service';
import { NotificationsService, SimpleNotificationsModule } from 'angular2-notifications';
import { DialogButtonConfig } from './share/utilit/dialog.button.config';
import { LeaveUnsavedComponentGuard } from './share/services/leaveUnsavedGuard';
import { AuthModule } from './auth/auth.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    CommonAppModule,
    BrowserModule,
    RouterModule.forRoot(routesRoot),
    SimpleNotificationsModule.forRoot(),
    AdminModule,
    BrowserAnimationsModule,
    InfiniteScrollModule
  ],
  providers: [
    MsgList,
    SettingService,
    RequestsService,
    AuthService,
    UniversalDataService,
    NotificationsService,
    DialogButtonConfig,
    LeaveUnsavedComponentGuard,
    { provide: ROUTES_TREE, useValue: routesRoot },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
