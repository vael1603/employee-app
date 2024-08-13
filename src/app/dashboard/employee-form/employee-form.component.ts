import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../models/Employee';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DashboardService } from '../dashboard.service';
import { HttpEmployeeRes, HttpPositionsRes, HttpRes } from '../models/HttpEmployeeRes';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {

  dialogRef = inject(MatDialogRef<EmployeeFormComponent>);
  data = inject<any>(MAT_DIALOG_DATA);
  
  action: string = this.data.action;
  employee:Employee | null = this.data.employee;
  employeeForm: FormGroup;
  positions: string[] = [];
 
  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private utils: UtilsService
  ) {
    this.employeeForm = this.formBuilder.group({
      name: [this.employee?.name, [Validators.required]],
      lastname: [this.employee?.lastname, [Validators.required]],
      birthDay: [this.employee?.birthDay, [Validators.required]],
      jobPosition: [this.employee?.jobPosition, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.dashboardService.getPositions().subscribe({
      next: (res: HttpPositionsRes) => {
        this.positions = res.data
      },
      error: (e) => {
        this.utils.openDialog('error', e.error.message)
      }
    })

    if(this.employee != null) {
      this.employeeForm.controls['name'].setValue(this.employee.name)
      this.employeeForm.controls['lastname'].setValue(this.employee.lastname)
      this.employeeForm.controls['birthDay'].setValue(this.formatDate(this.employee.birthDay))
      this.employeeForm.controls['jobPosition'].setValue(this.employee.jobPosition)

      if(this.action === 'editMyInformation') {
        this.employeeForm.controls['name'].disable()
        this.employeeForm.controls['lastname'].disable()
      }
      if(this.action === 'editEmployee') {
        this.employeeForm.controls['birthDay'].disable()
        this.employeeForm.controls['jobPosition'].disable()
      }
    }
  }

  // Convert date from 'dd/MM/yyyy' to 'yyyy-MM-dd'
  formatDate(dateString: string | null): string | null {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/').map(Number);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

   // Convert date from 'yyyy-MM-dd' format to 'dd/MM/yyyy'
   parseDate(dateString: string | null): string | null {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  close = () => {
    this.dialogRef.close();
  }

  onSubmit() {
    if(this.employeeForm.valid) {

      if(this.action === 'createEmploye') {
        const employee = {
          name: this.employeeForm.controls['name'].value,
          lastname: this.employeeForm.controls['lastname'].value,
          birthDay: this.parseDate(this.employeeForm.controls['birthDay'].value) ?? '',
          jobPosition: this.employeeForm.controls['jobPosition'].value
        }

        this.dashboardService.createEmployee(employee).subscribe({
          next: (res: HttpEmployeeRes) => {
            this.dialogRef.close(res)
          },
          error: (e) => {
            this.dialogRef.close(e.error)
          }
        })
      } else {
        const employee:Employee = {
          _id: this.employee?._id ?? '',
          name: this.employeeForm.controls['name'].value,
          lastname: this.employeeForm.controls['lastname'].value,
          birthDay: this.parseDate(this.employeeForm.controls['birthDay'].value) ?? '',
          jobPosition: this.employeeForm.controls['jobPosition'].value
        }
        this.dashboardService.editEmployee(employee).subscribe({
          next: (res: HttpEmployeeRes) => {
            this.dialogRef.close(res)
          },
          error: (e) => {
            this.dialogRef.close(e.error)
          }
        })
      }
    }
  }

  deleteMyself = () => {
    if(this.employee?._id) this.dashboardService.deleteEmploye(this.employee?._id).subscribe({
      next: (res: HttpRes) => {
        this.dialogRef.close(res)
      },
      error: (e) => {
        this.dialogRef.close(e.error)
      }
    })
  }
}
