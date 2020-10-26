// import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';
// import { User } from './user';

// export class RepteChecks {

//     repte: any;
//     currentUser: User;

//     constructor(repte: any, private httpService?: HttpCommunicationService) {

//         this.repte = repte;

//         this.httpService.currentUser.subscribe(
//             data => {
//                 this.currentUser = data;
//             }
//         );
//     }

//     canEdit(): Boolean {
//         // només abans de la data d'inici, que sigui el creador, tot depenent de l'estat
//         if (!this.isValid()) {
//             if (this.currentUser.idUser == this.repte.user_iduser) {
//                 return true;
//             } else {
//                 return false;
//             }
//         } else {
//             if (this.currentUser.idUser == this.repte.user_iduser && this.beforeDateInici()) {
//                 return true;
//             } else {
//                 return false;
//             }
//         }
//     }
//     canParticipate(): Boolean {
//         // només si està en procès i és vàlid
//         if (this.currentUser && this.repte) {
//             if (!this.isValid()) {
//                 return false;
//             } else {
//                 if (this.repteEnProces()) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             }
//         }

//     }
//     repteEnProces(): Boolean {
//         // comprovar que el repte està en procès
//         let dateIniciRepte = new Date(this.repte.data_inici);
//         let dateFinalRepte = new Date(this.repte.data_final);
//         let currentDate = new Date();

//         if (dateIniciRepte < currentDate && dateFinalRepte > currentDate) {
//             return true;
//         } else {
//             return false;
//         }
//     }
//     canDelete(): Boolean {
//         // depenent de l'estat, que sigui creador, només abans de la data d'inici
//         if (!this.isValid()) {
//             if (this.currentUser.idUser == this.repte.user_iduser) {
//                 return true;
//             } else {
//                 return false;
//             }
//         } else {
//             return false;
//         }
//     }

//     beforeDateInici(): Boolean {
//         // comprovar que el repte encara no esta en proces
//         let dateIniciRepte = new Date(this.repte.data_inici);
//         let currentDate = new Date();

//         if (dateIniciRepte < currentDate) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     isEsborrany(): Boolean {
//         if (this.repte.estat_idestat == 1) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     isValid(): Boolean {
//         if (this.repte.estat_idestat == 3) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     isRebutjat(): Boolean {
//         if (this.repte.estat_idestat == 4) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     isPendent(): Boolean {
//         if (this.repte.estat_idestat == 2) {
//             return true;
//         } else {
//             return false;
//         }
//     }
// }


