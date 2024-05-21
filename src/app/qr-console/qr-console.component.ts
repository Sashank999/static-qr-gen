import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { QrFormComponent } from "../qr-form/qr-form.component.js";

@Component({
    selector: 'app-qr-console',
    standalone: true,
    templateUrl: './qr-console.component.html',
    styleUrl: './qr-console.component.css',
    imports: [CommonModule, MatGridListModule, MatListModule, MatDividerModule, QrFormComponent]
})
export class QrConsoleComponent {
  objkeys = Object.keys;
  qrTypesTitles: { [key: string]: string } = {
    "link": "Link to QR",
    "email": "Email to QR",
    "image": "Image to QR",
  };
  currentType = "link";
}
