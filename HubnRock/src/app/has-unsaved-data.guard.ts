import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HasUnsavedData } from './has-unsaved-data';

@Injectable({
  providedIn: 'root'
})
export class HasUnsavedDataGuard implements CanDeactivate<HasUnsavedData> {

  canDeactivate(component: HasUnsavedData): boolean {
    if (component.hasUnsavedData && component.hasUnsavedData()) {
      return confirm('Esta página le está pidiendo confirmar que quiere abandonarla: los datos que haya introducido podrían no guardarse.');
    }
    return true;
  }

}
