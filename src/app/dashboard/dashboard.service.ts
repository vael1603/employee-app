import { Injectable } from '@angular/core';
import { last, Observable } from 'rxjs';
import { HttpEmployeeListRes, HttpEmployeeRes, HttpPositionsRes, HttpRes } from './models/HttpEmployeeRes';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Employee, NewEmployee } from './models/Employee';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  apiURL = `${environment.apiURL}/api`

  constructor(private http: HttpClient) { }

  public getEmployees(): Observable<HttpEmployeeListRes> {
    return this.http.get<HttpEmployeeListRes>(`${this.apiURL}/employees`)
  }

  public getPositions(): Observable<HttpPositionsRes> {
    return this.http.get<HttpPositionsRes>(`${this.apiURL}/positions`)
  }

  public editEmployee(employee: Employee): Observable<HttpEmployeeRes> {

    const body = {
      name: employee.name,
      lastname: employee.lastname,
      birthDay: employee.birthDay,
      jobPosition: employee.jobPosition
    }

    return this.http.put<HttpEmployeeRes>(`${this.apiURL}/employees/${employee._id}`, body)
  }

  public deleteEmploye(id:string): Observable<HttpRes> {
    return this.http.delete<HttpRes>(`${this.apiURL}/employees/${id}`)
  }

  public createEmployee(employee: NewEmployee): Observable<HttpEmployeeRes> {

    const body = {
      name: employee.name,
      lastname: employee.lastname,
      birthDay: employee.birthDay,
      jobPosition: employee.jobPosition
    }

    return this.http.post<HttpEmployeeRes>(`${this.apiURL}/employees/create`, body)
  }

}
