import { Directive } from '@angular/core';
import { Validator } from '@angular/forms';


@Directive({
  selector: '[appEqualValidator]'
})
export class EqualValidatorDirective implements Validator{
  
  validate(control: import("@angular/forms").AbstractControl): import("@angular/forms").ValidationErrors {
    throw new Error("Method not implemented.");
  }

  registerOnValidatorChange?(fn: () => void): void {
    throw new Error("Method not implemented.");
  }

  constructor() { }

}
