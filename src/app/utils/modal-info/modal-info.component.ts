import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-info',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './modal-info.component.html',
  styleUrl: './modal-info.component.scss'
})
export class ModalInfoComponent implements OnInit{

  dialogRef = inject(MatDialogRef<ModalInfoComponent>);
  data = inject<any>(MAT_DIALOG_DATA);
  
  message = this.data.message;
  type:string = this.data.type;
  dialogClass!: string;

 
  constructor() {
  }

  ngOnInit(): void {
    if(this.type === 'error') {
      this.dialogClass = 'dialog-error'
    } else {
      this.dialogClass = 'dialog-info'
    }
  }
  
  close= () => {
    this.dialogRef.close();
  }
}
