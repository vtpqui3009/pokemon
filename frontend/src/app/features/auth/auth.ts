import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AuthPayload } from '../../core/dto/auth.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastMessage } from '../../shared/toast-message/toast-message';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastMessage],
  templateUrl: './auth.html'
})
export class AuthPageComponent {
  private destroyRef = inject(DestroyRef);
  isLoginPage = signal<boolean>(true);
  type = signal<'success' | 'fail' | ''>('');
  message = signal<string>('');
  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleMode(){
    this.isLoginPage.update(value => !value);
  }

  login(username: string, password: string){
    const payload: AuthPayload = {
      username,
      password
    }
    this.authService.login(payload).pipe(takeUntilDestroyed(this.destroyRef), catchError(() => {
      this.type.update(() => 'fail');
      return of(null);
    })).subscribe((value) => {
      if(value && value.token){
        this.authService.setToken(value.token);
        this.router.navigate(['/']);
      }
      this.type.update(() => 'success');
      this.message.update(() => 'Login successfully!');
    })
  }

  register(username: string, password: string){
    const payload: AuthPayload = {
      username,
      password
    }
    this.authService.register(payload).pipe(takeUntilDestroyed(this.destroyRef), catchError(() => {
      this.type.update(() => 'fail');
      return of(null);
    })).subscribe(() => {
      this.toggleMode();
      this.type.update(() => 'success');
      this.message.update(() => 'Register successfully!');
    })
  }

  onSubmit() {
    if (this.form.valid) {
      const {username, password} = this.form.value;
      console.log(this.form.value);
      if(this.isLoginPage()){
        this.login(username, password);
      }else{
        this.register(username, password);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
