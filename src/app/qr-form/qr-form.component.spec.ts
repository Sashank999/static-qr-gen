import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrFormComponent } from './qr-form.component';

describe('QrFormComponent', () => {
  let component: QrFormComponent;
  let fixture: ComponentFixture<QrFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QrFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
