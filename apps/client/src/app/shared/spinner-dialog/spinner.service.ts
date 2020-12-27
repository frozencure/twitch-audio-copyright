import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerDialogComponent } from './spinner-dialog.component';

@Injectable()
export class SpinnerService {

  constructor(private spinnerDialog: MatDialog) {
  }

  showSpinner() {
    this.spinnerDialog.open(SpinnerDialogComponent, {
      panelClass: 'transparent',
      disableClose: true
    });
  }

  hideSpinner() {
    this.spinnerDialog.closeAll();
  }
}
