import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient,private toastr:ToastrService) { }

  getEmployeesWithAttachments(id:number): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7051/api/Employee/getEmployeeWithAttachments'+id);
  }

  getAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7051/api/Employee/getAllEmployees');
  }

  getAttachments(id:number):Observable<any[]>{
    return this.http.get<any[]>('https://localhost:7051/api/Attachment/getAttachmentsByEmployee/'+id)
  }
  
  getAttachmentByEmployeeIdAndAttachmentId(employeeId:number,id: number): Observable<ArrayBuffer> {
    const url = `https://localhost:7051/api/Attachment/GetAttachmentsByEmployeeIdAndId/${employeeId}/${id}`;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }

  getAttachmentById(id:number): Observable<ArrayBuffer> {
    const url = `https://localhost:7051/api/Attachment/GetAttachmentsByEmployeeIdAndId/${id}`;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }

  
//---------------------------------------------------------------------------------------------------
  downloadAttachment(attachmentId: number): Observable<Blob> {
    return this.http.get(`https://localhost:7051/api/Attachment/downloadAttachment/${attachmentId}`, { responseType: 'blob' });
  }

  uploadAttachment(attachments: File[]): Observable<any> {
    const formData = new FormData();
    for (const attachment of attachments) {
      formData.append('Files', attachment);
    }
    return this.http.post<string>(`https://localhost:7051/api/AttachmentsGroup/uploadAttachments/`, formData);
  }

  addEmployee(employeeData:any):Observable<any>{
    return this.http.post('https://localhost:7051/api/AttachmentsGroup/addEmployeeWithAttachments/', employeeData);
  }
}
