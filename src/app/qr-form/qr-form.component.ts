import { Component, Input, ViewChild, ElementRef, AfterContentInit, OnDestroy } from '@angular/core';

import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import QRCode from "qrcode";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-qr-form',
  standalone: true,
  imports: [MatInputModule, CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  templateUrl: './qr-form.component.html',
  styleUrl: './qr-form.component.css'
})
export class QrFormComponent implements AfterContentInit, OnDestroy {
  @Input() type = "link";
  dialogOpen = false;
  @ViewChild("QRCanvas", { static: true }) QRCanvas!: ElementRef<HTMLCanvasElement>;

  MAX_FILE_SIZE = 2953;

  link = new FormControl("https://www.example.com", Validators.required);
  email = new FormControl("", [Validators.required, Validators.email]);
  image = new FormControl(null, Validators.required);
  mobileNumber = new FormControl(null, [Validators.required, Validators.pattern(/^\+[0-9]+$/)]);
  text = new FormControl(null, Validators.required);

  form = new FormGroup([this.link, this.email, this.image, this.mobileNumber, this.text]);

  subscription: Subscription;

  constructor(public dialog: MatDialog) {
    this.subscription = this.form.valueChanges.subscribe(() => {
      if (this.type === "link") this.showLinkQR(this.link.getRawValue());
      else if (this.type === "email") this.showEmailQR(this.email.getRawValue());
      else if (this.type === "sms") this.showSMSQR(this.mobileNumber.getRawValue(), this.text.getRawValue());
      else if (this.type === "text") this.showTextQR(this.text.getRawValue());

      // File uploads are not usable in Reactive Forms.
      // else if (this.type === "image") this.showImageQR(this.image.getRawValue());
    });
  }

  onFilePicked(event: Event) {
    if (this.type === "image") this.showImageQR((event.target as HTMLInputElement).files ?? null);
  }

  ngAfterContentInit(): void {
      this.showLinkQR(this.link.getRawValue());
  }


  showLinkQR(text: string | null) {
    if (!text) {
      this.showErrorOnCanvas();
      return;
    }

    QRCode.toCanvas(this.QRCanvas.nativeElement, text, (error) => {
      if (error) console.error(error);
    });
  }

  showEmailQR(email: string | null) {
    if (!email) {
      this.showErrorOnCanvas();
      return;
    }

    QRCode.toCanvas(this.QRCanvas.nativeElement, "mailto:" + email, (error) => {
      if (error) console.error(error);
    });
  }

  showImageQR(imageFiles: FileList | null) {
    if (!imageFiles || !imageFiles.length) {
      this.showErrorOnCanvas();
      return;
    }

    const imageFile = imageFiles[0];
    if (imageFile.size > this.MAX_FILE_SIZE) {
      this.dialog.open(FileSizeLimitExceededDialog);
      return;
    }

    imageFiles[0].arrayBuffer().then((buffer) => {
      const imageBuffer = new Uint8ClampedArray(buffer);

      QRCode.toCanvas(
        this.QRCanvas.nativeElement,
        // @ts-ignore
        [{ data: imageBuffer, mode: "byte"}],
        { errorCorrectionLevel: 'L' },
        (error) => {
          if (error) console.error(error);
        }
      );
    });
  }

  showSMSQR(mobileNumber: string | null, text: string | null) {
    if (!mobileNumber || !text) {
      this.showErrorOnCanvas();
      return;
    }

    QRCode.toCanvas(this.QRCanvas.nativeElement, "smsto:" + mobileNumber + ":" + text, (error) => {
      if (error) console.error(error);
    });
  }

  showTextQR(text: string | null) {
    if (!text) {
      this.showErrorOnCanvas();
      return;
    }

    QRCode.toCanvas(this.QRCanvas.nativeElement, text, (error) => {
      if (error) console.error(error);
    });
  }


  showErrorOnCanvas() {
    const CANVAS_MIN_WIDTH = 200;
    const CANVAS_MIN_HEIGHT = 200;

    const ctx = this.QRCanvas.nativeElement.getContext("2d");
    if (!ctx) return;

    // https://stackoverflow.com/a/65124939
    const ratio = window.devicePixelRatio;
    ctx.canvas.width = CANVAS_MIN_WIDTH * ratio;
    ctx.canvas.height = CANVAS_MIN_HEIGHT * ratio;
    ctx.canvas.style.width = CANVAS_MIN_WIDTH + "px";
    ctx.canvas.style.height = CANVAS_MIN_HEIGHT + "px";
    ctx.scale(ratio, ratio);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Invalid Data", ctx.canvas.width / 2, ctx.canvas.height / 2);
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


@Component({
  selector: 'app-file-size-limit-exceeded',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>File Size Limit Exceeded</h2>
    <mat-dialog-content>
      <p>Maximum file size is 2953 bytes (around 2 KB). Please select a smaller file.</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close()">Ok</button>
    </mat-dialog-actions>
  `,
})
export class FileSizeLimitExceededDialog {
  constructor(public dialogRef: MatDialogRef<FileSizeLimitExceededDialog>) {}
}
