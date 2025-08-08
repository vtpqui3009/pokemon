import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'toast-message.html',
})
export class ToastMessage {
  type = input<'success' | 'fail' | ''>('');
  successMessage = input<string>('');
}
