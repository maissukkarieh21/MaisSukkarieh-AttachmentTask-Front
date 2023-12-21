import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit{

  employees :any[]=[];
  employeeId:any;
  selectedEmployeeAttachments: any[] = [];
  attachments:any[]=[]
  documentContent: any;
  attachmentsGroupId:any
  selectedFiles : File[] = []
  attachment:any;
  attachmentIds: any;
  pdfSrc: any;
  selectedImage: File | null = null;
  imageUrl: any;
  
  @ViewChild('callCreateDialog') callCreateDialog! :TemplateRef<any>
  @ViewChild('attachmentPreviewDialog') attachmentPreviewDialog!: TemplateRef<any>;
  @ViewChild('preview') preview!: TemplateRef<any>;


  constructor(private toastr: ToastrService,private dialog:MatDialog , private employeeService : EmployeeService) {}

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe((employees) => {
      this.employees = employees;
    });
  }

  form: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    salary: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    phone: new FormControl('', [Validators.required]),
    employeeName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
  });
  
  OpenDialogAdd() {
    this.dialog.open(this.callCreateDialog);
  }


  

  addAttachment(): void {
    this.employeeService.uploadAttachment(this.selectedFiles).subscribe(
      (attachmentsGroupId) => {
        this.attachmentsGroupId = attachmentsGroupId;
        this.prepareEmployeeData(attachmentsGroupId);
        this.toastr.success('Attachment added successfully.', 'Success');
        console.log('Attachment added successfully. attachment Group Id:', attachmentsGroupId);
        this.getAllEmployees();
      },
      (error) => {
        this.toastr.error('Error while adding attachment.', 'Error');
        console.log('Error while adding attachment:', error);
        this.getAllEmployees();
        this.dialog.closeAll();
      }
    );
  }
  
  

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }
  

  addEmployee(): void {
    const employeeData = this.prepareEmployeeData(this.attachmentsGroupId);
    this.employeeService.addEmployee(employeeData).subscribe(
      (response) => {
        console.log(employeeData);
        console.log('Employee added successfully. Employee ID:', response.EmployeeId);
        this.toastr.success('Employee added successfully.', 'Success');
        this.getAllEmployees();
      },
      (error) => {
        console.log(employeeData);
        console.error('Error while adding employee:', error);
        console.log('Employee added successfully. Employee ID:', error.EmployeeId);
        this.toastr.error('Error while adding employee.', 'Error');
        this.getAllEmployees();
      }
    );
  }
  
  prepareEmployeeData(attachmentGroupId: number): any {
    const formData = this.form.value;
    console.log('formData:', formData);

    return {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      salary: formData.salary,
      phone: formData.phone,
      employeeName: formData.employeeName,
      address: formData.address,
      attachmentsGroupId:this.attachmentsGroupId
    };

  }

  downloadAttachment(attachmentId: number): void {
    this.employeeService.downloadAttachment(attachmentId).subscribe(
      (data: Blob) => {
        const contentDispositionHeader = data.type;
        const blob = new Blob([data], { type: contentDispositionHeader });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.attachment.name;
        link.click();
      },
      (error) => {
        console.error('Error downloading attachment:', error);
      }
    );
  }

 getAttachmentById(attachmentId:number):void{
  //this.dialog.open(this.preview);
  this.employeeService.downloadAttachment(attachmentId).subscribe(
    (attachment)=>{
      this.attachment = attachment;
      console.log(attachment);
    }
  )
 }

 
  
  
  getAttachmentsByGroupId(groupId:number):void{
    this.dialog.open(this.attachmentPreviewDialog);
    this.employeeService.getAttachmentsByGroupId(groupId).subscribe(
      (attachments)=>{
        this.attachments = attachments;
        console.log(attachments);
      }
    )
  }

  openAttachmentPreviewDialog() {
    if (this.selectedEmployeeAttachments && this.selectedEmployeeAttachments.length > 0) {
      this.dialog.open(this.attachmentPreviewDialog, {
        data: { attachments: this.selectedEmployeeAttachments },
      });
    }
  }

  previewFile(attachment: any): void {
    const decodedData = atob(attachment.fileData);
    this.pdfSrc = { data: decodedData, format: 'png', };
    this.dialog.open(this.preview);
  }
  private base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    console.log('Decoded Uint8Array:', binaryString);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
  
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  previewImage(file: File): void {
    this.dialog.open(this.attachmentPreviewDialog);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    console.log()
  }

  
  

}