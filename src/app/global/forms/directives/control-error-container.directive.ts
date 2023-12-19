import { ViewContainerRef, Directive } from "@angular/core";

@Directive({
    selector: '[controlErrorContainer]'
})
export class ControlErrorContainerDirective {
    constructor(public vcr: ViewContainerRef) { }
}