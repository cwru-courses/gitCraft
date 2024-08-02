import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppService } from '../../../app.service';
import { DatePipe } from '@angular/common';
import { forwardRef } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, FlexLayoutModule, DatePipe, forwardRef(() => CharacterPipe), forwardRef(() => CapitalPipe)],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {

  readonly dialog = inject(MatDialog);

  modal(post: any) {
    this.dialog.open(ModalComponent, {
      data: post
    });
  }
  userObject: any = null
  constructor(public appService: AppService, private router: Router) {
    appService.loading = true;
    this.userObject = appService.isAuth()
    if (this.userObject === null) {
      router.navigate(['login'])
      appService.loading = false;
    } else {
      appService.loading = false;
    }
  }
  @Input() posts: any;

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'characters',
  standalone: true,
})
export class CharacterPipe implements PipeTransform {
  transform(value: string, length: number): string {
    return value.slice(0, length) + ((value.length - length > 0) ? '...' : '');
  }
}

@Pipe({
  name: 'capitalise',
  standalone: true,
})
export class CapitalPipe implements PipeTransform {
  transform(value: string): string {
    return value.slice(0, 1).toUpperCase() + value.slice(1, value.length).toLowerCase();
  }
}