import { Component } from "@angular/core";
import { AuthService } from "app/modules/auth/auth.service";
import { LawyerService } from "app/modules/lawyer/lawyer.service";

@Component({
    selector:'users',
    templateUrl:'./users.component.html',
    styleUrls: ['./users.component.scss']
})

export class UsersComponent {
    constructor(
        public lawyerService: LawyerService
    ){}

    userName = 'Luiz Roberto de Albuquerque Finizio Junior'
    userCore = 'Lexjur'

}