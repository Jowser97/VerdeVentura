import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Err404Component } from './err-404.component';

describe('Err404Component', () => {
  let component: Err404Component;
  let fixture: ComponentFixture<Err404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Err404Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Err404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
