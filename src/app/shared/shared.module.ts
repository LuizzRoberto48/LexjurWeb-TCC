import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BottomSheetCoreList } from './bottom-core-sheet/bottom-core-sheet';
import { MaterialModule } from 'app/core/material.module';

@NgModule({
    declarations:[BottomSheetCoreList],
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
        BottomSheetCoreList
    ]
})
export class SharedModule
{
}
