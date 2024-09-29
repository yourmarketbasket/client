import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(phoneNumber: string): string {
    if (!phoneNumber) {
      return '';
    }

    // Remove non-numeric characters
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');

    // Format the number
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    // Return the original number if formatting fails
    return phoneNumber;
  }

}
