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
  selectedFiles: { [key: string]: File } = {};
  selectedEmployeeAttachments: any[] = [];
  attachments:any[]=[]
  documentContent: any;
  temporaryEmployeeId: string | null = null;


  @ViewChild('callCreateDialog') callCreateDialog! :TemplateRef<any>
  @ViewChild('attachmentPreviewDialog') attachmentPreviewDialog!: TemplateRef<any>;


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
    image: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    employeeName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    

  });


  attachmentForm: FormGroup = new FormGroup({
    personalImage: new FormControl('', Validators.required),
    salaryPdf: new FormControl('', Validators.required),
    cv: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required]),
  });
  
  OpenDialogAdd() {
    this.dialog.open(this.callCreateDialog);
  }
  personalImageControl = this.attachmentForm.get('personalImage');
  salaryPdfControl = this.attachmentForm.get('salaryPdf');
  cvControl = this.attachmentForm.get('cv');

  addAttachment(): void {
  if (this.attachmentForm.valid) {
    const personalImageFile: File | null = this.attachmentForm.get('personalImage')?.value;
    const salaryPdfFile: File | null = this.attachmentForm.get('salaryPdf')?.value;
    const cvFile: File | null = this.attachmentForm.get('cv')?.value;

    if (personalImageFile && salaryPdfFile && cvFile) {
      // Extract only the file name without the path
      const personalImageName = personalImageFile.name.split('\\').pop() || '';
      const salaryPdfName = salaryPdfFile.name.split('\\').pop() || '';
      const cvName = cvFile.name.split('\\').pop() || '';

      // Create FormData and append files with new names
      const formData = new FormData();
      formData.append('personalImage', personalImageFile, personalImageName);
      formData.append('salaryPdf', salaryPdfFile, salaryPdfName);
      formData.append('cv', cvFile, cvName);
      formData.append('description', this.attachmentForm.get('description')?.value || '');

      // Send the FormData to the server
      this.employeeService.addAttachment(formData).subscribe(
        (temporaryEmployeeId: string) => {
          this.temporaryEmployeeId = temporaryEmployeeId;
          this.toastr.success('Attachment added successfully.', 'Success');
          console.log('Attachment added successfully. Temporary Employee ID:', temporaryEmployeeId);
          this.getAllEmployees();
          this.dialog.closeAll();
          this.attachmentForm.reset();
        },
        (error) => {
          this.toastr.error('Error while adding attachment.', 'Error');
          console.log('Error while adding attachment:', error);
          console.log(error.error);
          this.getAllEmployees();
          this.dialog.closeAll();
          console.log(this.attachmentForm.value);
        }
      );
    } else {
      console.error('One or more file inputs are null.');
    }
  }
}

  

  
  
  
  prepareEmployeeData(): any {
    const formData = this.form.value;
  
    return {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      salary: formData.salary,
      image: formData.image,
      phone: formData.phone,
      employeeName: formData.employeeName,
      address: formData.address,
      temporaryEmployeeId: this.temporaryEmployeeId,
    };
  }
  
  addEmployee(): void {
    const employeeData = this.prepareEmployeeData();
    this.employeeService.addEmployee(employeeData).subscribe(
      () => {
        this.toastr.success('Employee added successfully.', 'Success');
        console.log('Employee added successfully.');
        this.getAllEmployees();
        this.dialog.closeAll();
        this.form.reset();
      },
      (error) => {
        this.toastr.error('Error while adding employee.', 'Error');
        console.log('Error while adding employee:', error);
        console.log(error.error);
        this.getAllEmployees();
        this.dialog.closeAll();
        console.log(this.form.value);
      }
    );
  }


  
  openAttachmentPreviewDialog() {
    if (this.selectedEmployeeAttachments && this.selectedEmployeeAttachments.length > 0) {
      this.dialog.open(this.attachmentPreviewDialog, {
        data: { attachments: this.selectedEmployeeAttachments },
      });
    }
  }


  onFileSelected(event: any, fileType: string) {
    const file: File = event.target.files[0];
    this.selectedFiles[fileType] = file;
    this.form.get(fileType)?.setValue(file);
  }

  

  openDocumentPreview(employeeId: number) {
    this.getAttachmentsForEmployee(employeeId);
  }

  getAttachmentsForEmployee(employeeId: number) {
    this.employeeService.getAttachments(employeeId).subscribe(
      (attachments) => {
        const documentAttachment = attachments[0];
        this.employeeService.getAttachmentContentById(documentAttachment.id).subscribe(
          (content) => {
            this.documentContent = content;
          },
          (error) => {
            console.error('Error retrieving document content:', error);
          }
        );
      },
      (error) => {
        console.error('Error retrieving attachments:', error);
      }
    );
  }
  
}
