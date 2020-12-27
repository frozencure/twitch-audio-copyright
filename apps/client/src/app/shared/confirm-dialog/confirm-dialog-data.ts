export class ConfirmDialogData {
  contentTitle: string;
  contentText: string;
  confirmButtonText: string;
  cancelButtonText?: string;
}

export enum ConfirmAction {
  CONFIRM,
  CANCEL
}
