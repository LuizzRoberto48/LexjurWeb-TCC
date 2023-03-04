import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { CoreSheedList } from './core-sheet.component';
import { ChangeCoreDirective } from '../directive/change-core.directive';

@NgModule({
    declarations:[CoreSheedList, ChangeCoreDirective],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreSheedList,
        ChangeCoreDirective
    ]
})
export class CoreSheetModule
{
}
