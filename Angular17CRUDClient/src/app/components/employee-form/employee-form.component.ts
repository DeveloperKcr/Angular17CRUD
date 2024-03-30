import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { IEmployee } from '../../interfaces/employee';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {
  formBuilder=inject(FormBuilder);
  httpService=inject(HttpService);
  router=inject(Router);
  route=inject(ActivatedRoute);
  toaster=inject(ToastrService);
  employeeForm = this.formBuilder.group({
    name:['',Validators.required],
    email:['',Validators.required],
    age:[0,Validators.required],
    phone:['',[]],
    salary:[0,Validators.required],
  });
  employeeId!:number;
  isEdit=false;
  ngOnInit(){
    this.employeeId = this.route.snapshot.params['id'];
    if(this.employeeId){
      this.isEdit = true;
      this.httpService.getEmployee(this.employeeId).subscribe(result=>{
        console.log(result);
        this.employeeForm.patchValue(result);
        //this.employeeForm.controls.email.disable();
        //this.employeeForm.controls.email.value(result.e);
      });
    }
  }
  save(){
    console.log(this.employeeForm.value);
    const employee: IEmployee={
      name:this.employeeForm.value.name!,
      age:this.employeeForm.value.age!,
      phone:this.employeeForm.value.phone!,
      email:this.employeeForm.value.email!,
      salary:this.employeeForm.value.salary!
    };
    if(this.isEdit){
      this.httpService.updateEmployee(this.employeeId, employee).subscribe((res) => {
        console.log("Success");
        this.toaster.success("Record updated sucessfully.");
        this.router.navigateByUrl("/employee-list");
      });
    }else{
      this.httpService.createEmployee(employee).subscribe((res) => {
        console.log("Success");
        this.toaster.success("Record added sucessfully.");
        this.router.navigateByUrl("/employee-list");
      });
    }
  }
}