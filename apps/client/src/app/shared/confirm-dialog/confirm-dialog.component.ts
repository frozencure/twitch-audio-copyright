import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmAction, ConfirmDialogData } from './confirm-dialog-data';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
              private dialogRef: MatDialogRef<ConfirmDialogComponent>) {
  }

  cancel(): void {
    this.dialogRef.close(ConfirmAction.CANCEL);
  }

  confirm(): void {
    this.dialogRef.close(ConfirmAction.CONFIRM);
  }
}
