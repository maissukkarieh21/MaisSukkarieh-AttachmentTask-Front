import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient,private toastr:ToastrService) { }

  getEmployeesWithAttachments(id:number): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7051/api/Employee/getEmployeeWithAttachments'+id);
  }

  addEmployeeWithAttachments(employee: any, attachments: File[]): Observable<any> {
    const formData = new FormData();
    Object.keys(employee).forEach((key) => {
      formData.append(key, employee[key]);
    });
    for (const attachment of attachments) {
      formData.append('Files', attachment);
    }
    //const headers = new HttpHeaders();
    //headers.append('Content-Type', 'multipart/form-data');
  
    return this.http.post(`https://localhost:7051/api/Employee/addEmployeeWithAttachments/`, formData);
  }
  

  getAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7051/api/Employee/getAllEmployees');
  }

  getAttachments(id:number):Observable<any[]>{
    return this.http.get<any[]>('https://localhost:7051/api/Attachment/getAttachmentsByEmployee/'+id)
  }
  
  getAttachmentContentById(id: number): Observable<ArrayBuffer> {
    const url = 'https://localhost:7051/api/Attachment/getAttachmentsById/'+id;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }

  addEmployee(employee:any):Observable<any>{
    return this.http.post('https://localhost:7051/api/Employee/addEmployee',employee)
  }

  addAttachment(formData: FormData): Observable<any> {
    return this.http.post<string>(`https://localhost:7051/api/Attachment/addAttachment/`, formData);
  }

}
