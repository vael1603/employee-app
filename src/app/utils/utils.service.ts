import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from './modal-info/modal-info.component';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private dialog: MatDialog) { }
  
  openDialog(type: string, message: string): void {
    const dialogRef = this.dialog.open(ModalInfoComponent, {
      data: {message: message, type: type},
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
