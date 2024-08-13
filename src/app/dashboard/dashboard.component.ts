import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UtilsService } from '../utils/utils.service';
import { DashboardService } from './dashboard.service';
import { Employee } from './models/Employee';
import { HttpEmployeeListRes, HttpEmployeeRes, HttpRes } from './models/HttpEmployeeRes';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../login/login.service';
import { User } from '../login/models/User';
import { CommonModule } from '@angular/common';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, CommonModule, FormsModule, MatInputModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  user!: User;
  employee!: Employee;
  isEmployee = false;

  seachBar!: string;
  employeesList = new MatTableDataSource<Employee>();
  originalEmployeesList: Employee[] = [];
  columns = ['name', 'lastname', 'birthday', 'jobPosition','delete', 'edit'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private dashboardService: DashboardService,
    private utils: UtilsService,
    private loginService: LoginService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getInitialData();
  }

  ngAfterViewInit() {
    if(this.paginator) this.employeesList.paginator = this.paginator;
  }

  getInitialData = () => {
    
    if(this.loginService.user) this.user = this.loginService.user;
    this.isEmployee = (this.user.group === 'employee');

    this.dashboardService.getEmployees().subscribe({
      next: (res: HttpEmployeeListRes) => {
        this.employeesList = new MatTableDataSource<Employee>(res.data);
        this.originalEmployeesList = res.data;
        this.employeesList.paginator = this.paginator;
        if(this.isEmployee) {
          this.employee = this.originalEmployeesList.filter((employee: any) => {
            //If the user is an employee gets their information
            if((employee.name === this.user.name) && (employee.lastname === this.user.lastname)) {
              return employee;
            }})[0]
        }
      },
      error: (e) => {
        this.utils.openDialog('error', e.error.message)
      }
    })
  }

  onSearchChange = (event: string) => {
    const filteredList = this.originalEmployeesList.filter((item:any) => {
      if(item.name.toLocaleLowerCase().includes(event.toLocaleLowerCase()) || 
          item.lastname.toLocaleLowerCase().includes(event.toLocaleLowerCase())) {
        return item
      }
    })
    this.employeesList = new MatTableDataSource<Employee>(filteredList);
    this.employeesList.paginator = this.paginator;
  }

  deleteEmployee = (employee: Employee) => {
    console.log(employee)

    if(this.isEmployee) {
      this.utils.openDialog('error', 'Employees are not allowed to delete another employees')
    } else {
      this.dashboardService.deleteEmploye(employee._id).subscribe({
        next: (res: HttpRes) => {
          this.utils.openDialog('info', res.message)
          this.getInitialData();
        },
        error: (e) => {
          this.utils.openDialog('error', e.message)
        }
      })
    }
  }

  editEmployee = (employee: Employee) => {
    this.openDialog('editEmployee', employee);
  }

  addEmployee() {
    this.openDialog('createEmploye', null);    
  }

  editMyInformation() {
    console.log(this.employee)
    this.openDialog('editMyInformation', this.employee);
  }

  openDialog(action: string, employee: Employee | null): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      height: '400px',
      minWidth: '45vw',
      data: {action: action, employee: employee},
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if(res){
        const type = res.status ? 'info' : 'error';
        this.utils.openDialog(type, res.message)
        this.getInitialData();
      }
    });
  }
}
