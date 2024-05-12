import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrConsoleComponent } from './qr-console.component';

describe('QrConsoleComponent', () => {
  let component: QrConsoleComponent;
  let fixture: ComponentFixture<QrConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrConsoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QrConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
