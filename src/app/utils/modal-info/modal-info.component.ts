import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-info',
  standalone: true,
  imports: [],
  templateUrl: './modal-info.component.html',
  styleUrl: './modal-info.component.scss'
})
export class ModalInfoComponent {

  dialogRef = inject(MatDialogRef<ModalInfoComponent>);
  data = inject<any>(MAT_DIALOG_DATA);
  
  message = this.data.message;
  type = this.data.type;

 
  constructor() {
  }
  
  close= () => {
    this.dialogRef.close();
  }
}
