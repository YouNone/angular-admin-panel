/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserSearchColumnComponent } from './user.search.column.component';

describe('UserSearchColumnComponent', () => {
  let component: UserSearchColumnComponent;
  let fixture: ComponentFixture<UserSearchColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSearchColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSearchColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
