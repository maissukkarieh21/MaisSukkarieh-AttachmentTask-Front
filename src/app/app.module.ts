import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './employee/employee.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { HttpClientModule } from '@angular/common/http';
//import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import * as fileType from 'file-type';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    SharedModule,
    ToastrModule.forRoot(),
    NgxDocViewerModule,
    HttpClientModule,
    PdfViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

