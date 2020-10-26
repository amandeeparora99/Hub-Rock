import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';
import { User } from './user';

export class SolucioChecks {

    repte: any;
    solucio: any;
    currentUser: User;

    constructor(repte: any, solucio: any, private httpService: HttpCommunicationService) {
        this.solucio = solucio;
        this.repte = repte;

        this.httpService.currentUser.subscribe(
            data => {
                this.currentUser = data;
            }
        );
    }

    canEdit() {
        // només abans de la data d'inici, que sigui el creador, tot depenent de l'estat
    }

    canDelete() {
        // depenent de l'estat, que sigui creador, només abans de la data d'inici
    }

    beforeDateInici() {
        // comprovar que el repte encara no esta en proces
    }

    isEsborrany() {
        //
    }

    isValid() {
        //
    }
}
