import { Employee } from "../../dashboard/models/Employee";

export interface HttpRes {
    status: boolean,
    message: string,
}

export interface HttpEmployeeListRes extends HttpRes {
    data: Employee[]
}

export interface HttpEmployeeRes extends HttpRes {
    data: Employee
}

export interface HttpPositionsRes extends HttpRes {
    data: string[]
}