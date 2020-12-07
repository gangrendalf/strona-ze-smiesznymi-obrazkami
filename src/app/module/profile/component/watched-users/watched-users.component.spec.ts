import { Directive, HostListener, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { UserDetail } from 'src/app/module/shared/model/user.interface';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

import { WatchedUsersComponent } from './watched-users.component';

@Directive({selector: '[routerLink]'})
class RouterLinkStub {
  @Input('routerLink') linkParams: any;

  navigatedTo: any = null;

  @HostListener('click') onClick(){
    this.navigatedTo = this.linkParams;
  }
}

describe('WatchedUsersComponent', () => {
  let component: WatchedUsersComponent;
  let fixture: ComponentFixture<WatchedUsersComponent>;

  const dbsStub = {
    user: {
      getSingle: function(uid: string) {return of<UserDetail>()}
    }
  };
  const routeStub = {
    pathFromRoot: [
      { paramMap: of({get: function (name: string) {return 'nothing'}})},
      { paramMap: of({get: function (name: string) {return 'testUID'}})}
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        WatchedUsersComponent,
        RouterLinkStub
       ],
      providers: [
        { provide: DatabaseService, useValue: dbsStub },
        { provide: ActivatedRoute, useValue: routeStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
