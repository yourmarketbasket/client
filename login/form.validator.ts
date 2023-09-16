import { AbstractControl, ValidatorFn } from '@angular/forms';

export function emailOrMobileValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value = control.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobilePattern = /^[0-9]{10}$/;

    if (!value || (value.match(emailPattern) == null && value.match(mobilePattern) == null)) {
      return { 'emailOrMobile': 'Please enter a valid email address or mobile number.' };
    }

    if (value.match(emailPattern) == null) {
      return { 'emailOrMobile': 'Please enter a valid email address.' };
    }

    if (value.match(mobilePattern) == null) {
      return { 'emailOrMobile': 'Please enter a valid mobile number.' };
    }

    return null;
  };
}
