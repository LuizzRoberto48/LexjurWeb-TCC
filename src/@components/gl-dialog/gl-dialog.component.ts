import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogFields } from './model/dialog.model';

@Component({
  selector: 'gl-dialog',
  templateUrl: './gl-dialog.component.html',
  styleUrls: ['./gl-dialog.component.scss'],
})
export class GlDialogComponent implements OnInit {
  @Input() title!: string;
  @Input() confirmText: string = "Confirmar";
  @Input() cancelText: string = "Cancelar"
  @Input() isDisableClose:boolean = false;
  @Input() hasBtn = true

  @Output() emitClick:EventEmitter<any> = new EventEmitter()

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogFields,
  
  private mdDialogRef: MatDialogRef<GlDialogComponent>) {}

  ngOnInit(): void {
    this.checkIfDataExists();
    this.disableClose();
  }

  disableClose() {
    this.mdDialogRef.disableClose = this.isDisableClose;
  }

  public cancel() {
    this.isDisableClose = false;
    this.emitClick.emit(false)
    this.close(true);
  }

  public confirm() {
    this.emitClick.emit(true)
  }

  public close(value) {
    this.mdDialogRef.close(value);
  }

  @HostListener("keydown.esc") 
  public onEsc() {
    this.close(false);
  }

  checkIfDataExists() {
    this.confirmText = this.data?.confirmText ?? this.confirmText;
    this.cancelText = this.data?.cancelText ?? this.cancelText;
  }
}
