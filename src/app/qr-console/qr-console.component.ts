import { Component, ViewEncapsulation } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

// import QRCode from "qrcode";

@Component({
  selector: 'app-qr-console',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatListModule, MatDividerModule],
  templateUrl: './qr-console.component.html',
  styleUrl: './qr-console.component.css',
  encapsulation: ViewEncapsulation.None
})
export class QrConsoleComponent {
  qrTypes: { [key: string]: { name: string, show: () => void } } = {
    "link": { name: "Link to QR", show: this.showLinkQR },
    "mail": { name: "Mail to QR", show: this.showMailQR },
  }

  showLinkQR(): void {}
  showMailQR(): void {}
}
