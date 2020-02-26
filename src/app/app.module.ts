import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonAppModule } from './share/common.app.module';
import { RouterModule } from '@angular/router';
import { routesRoot } from './app.routes';
import { AdminModule } from './admin/admin.module';
import { NotFoundComponent } from './share/components/not.found/not.found.component';
import { ROUTES_TREE } from './share/utilit/utilit';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AdminModule,
    BrowserAnimationsModule,
    CommonAppModule,
    RouterModule.forRoot(routesRoot)
  ],
  providers: [
    {provide: ROUTES_TREE, useValue: routesRoot},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
