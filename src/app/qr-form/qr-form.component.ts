import { Component, Input, ViewChild, ElementRef, AfterContentInit, OnDestroy } from '@angular/core';

import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

import QRCode from "qrcode";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-qr-form',
  standalone: true,
  imports: [MatInputModule, CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatSelectModule],
  templateUrl: './qr-form.component.html',
  styleUrl: './qr-form.component.css'
})
export class QrFormComponent implements AfterContentInit, OnDestroy {
  @Input() type = "link";
  @ViewChild("QRCanvas", { static: true }) QRCanvas!: ElementRef<HTMLCanvasElement>;

  objkeys = Object.keys;
  imageTypes: { [key: string]: string } = {
    "png": "image/png",
    "jpeg": "image/jpeg"
  };

  link = new FormControl("https://www.example.com");
  email = new FormControl("", [Validators.email]);
  form = new FormGroup([this.link, this.email]);

  subscription: Subscription;

  constructor() {
    this.subscription = this.form.valueChanges.subscribe(() => {
      if (this.type === "link") this.showLinkQR(this.link.getRawValue());
      else if (this.type === "email") this.showEmailQR(this.email.getRawValue());
    });
  }

  ngAfterContentInit(): void {
      this.showLinkQR(this.link.getRawValue());
  }


  showLinkQR(text: string | null) {
    if (!text) {
      this.clearCanvas();
      return;
    }

    QRCode.toCanvas(this.QRCanvas.nativeElement, text, (error) => {
      if (error) console.error(error);
    });
  }

  showEmailQR(email: string | null) {
    if (!email) {
      this.clearCanvas();
      return;
    }

    QRCode.toCanvas(this.QRCanvas.nativeElement, "mailto:" + email, (error) => {
      if (error) console.error(error);
    });
  }


  clearCanvas() {
    this.QRCanvas.nativeElement.getContext("2d")?.clearRect(0, 0, this.QRCanvas.nativeElement.width, this.QRCanvas.nativeElement.height);
  }


  saveAsPNG() {
    this.QRCanvas.nativeElement.toBlob((blob: Blob | null) => this.saveBlob(blob, ".png"), "image/png", 1);
  }

  saveAsJPEG() {
    this.QRCanvas.nativeElement.toBlob((blob: Blob | null) => this.saveBlob(blob, ".jpg"), "image/jpeg", 1);
  }

  saveBlob(blob: Blob | null, fileExtension: string) {
    if (!blob) {
      alert("QR Code has too much data. Please reduce it.");
      return;
    }

    const el: HTMLAnchorElement = document.createElement("a");
    const blobURL = URL.createObjectURL(blob);
    el.setAttribute("href", blobURL);
    el.setAttribute("download", "qr" + fileExtension);
    el.click();
    URL.revokeObjectURL(blobURL);
  }


  ngOnDestroy() {
      this.subscription?.unsubscribe();
  }
}
