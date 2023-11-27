import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { ActivePipe } from '../global/pipes/active.pipe';

@NgModule({
    declarations:[ActivePipe],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        ActivePipe
    ]
})
export class GlobalModule
{
}
