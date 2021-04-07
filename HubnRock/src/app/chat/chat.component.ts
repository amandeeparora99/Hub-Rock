import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebSocketService } from "../web-socket.service";
import { User } from 'src/app/user';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { ChatPreferencesService } from '../chat-preferences.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('scrollBottom') private scrollBottom: ElementRef;
  public fileStorageUrl = environment.api + '/image/';
  public currentUserObject: User;

  loggedAvatarUrl = '';
  recieverAvatarUrl = '';
  currentChatId;
  chatUser: string;
  chatMsg: string = '';
  personId = '';
  popupDisplay = 'none';
  page = 0; //0 = Select user, 1 = Xat interface, 2 = NO USERS

  chatList = [];
  messages = [];

  subscriptionHttp$: Subscription;
  subscriptionHttp1$: Subscription;
  subscriptionHttp2$: Subscription;

  constructor(private WebSocketService: WebSocketService, private _httpService: HttpCommunicationService, private chatPreferencesService: ChatPreferencesService) { }

  ngOnInit() {
    //Scroll to bottom
    this.scrollToBottom();

    //Get current user ID
    this._httpService.currentUser.subscribe(
      data => {
        this.currentUserObject = data;
      }
    );

    this._httpService.getUser(this.currentUserObject.idUser).subscribe(
      data => {
        this.loggedAvatarUrl = this.fileStorageUrl + data.row.url_photo_profile;
      }
    );

    //Detect chat open from profile
    this.chatPreferencesService.getValue().subscribe((value) => {
      this.popupDisplay = value;
    });

    this.chatPreferencesService.getTargetUserId().subscribe((value) => {
      this.personId = value;
      if(value != ''){  //Si accedim desde perfil, si existeix el xat que l'obri sino que en crei un de nou
        this.page = 1;
      }
      else{  //Eliminar aquesta part si volem mantenir el xat obert quan es tenca el xat !!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.page = 0;
      }
    });

    // Check what users are connected
    this.WebSocketService.listen('user_connected').subscribe((data) => {
      console.log("LLISTA DE SALES ACTIVES:", data);
    })
    this.WebSocketService.listen('user_disconnected').subscribe((data) => {
      console.log("LLISTA DE SALES ACTIVES:", data);
    })
    this.WebSocketService.listen('new_message').subscribe((data) => {
      this.messages.push(data);
    })
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onPersonClick(personId, chatId) {
    //Quan clico a una persona, primer em desconecto de l'anterior (en cas que estigui en una abans)
    this.messages = [];
    if (this.personId != '') {
      this.exitSocket();
    }

    this.chatPreferencesService.setTargetUserId(personId);

    var roomId = this.getRoomId(this.currentUserObject.idUser, Number(this.personId));
    this.WebSocketService.emit('user_connected', roomId);

    this.getAllDialog(chatId)
  }

  getRoomId(id1, id2) {
    console.log("GETTING ID 1 + ID 2: " + id1 + '_' + id2)
    var commonId = '';

    if (id1 > id2) {
      commonId = id2 + '_' + id1;
    } else {
      commonId = id1 + '_' + id2;
    }

    return commonId;
  }

  onSubmit() {
    let nowDate = Date.now();

    if (this.chatMsg != '') {

      this.subscriptionHttp2$ = this._httpService.postDialogMsg(this.currentChatId, this.chatMsg).subscribe( data => {
        if (data.code == "1") {
          this.WebSocketService.emit('send_message', {
            roomId: this.getRoomId(this.currentUserObject.idUser, Number(this.personId)),
            who: this.currentUserObject.idUser.toString(),
            message: this.chatMsg,
            time: nowDate
          });
          this.chatMsg = '';
        }
        else{
          console.log("ERROR AL ENVIAR MISSATGE!")
        }
      });
      
      
    }
    
  }

  exitSocket() {
    var roomId = this.getRoomId(this.currentUserObject.idUser, this.personId);
    this.WebSocketService.emit('user_disconnected', roomId);
    this.chatPreferencesService.setTargetUserId('');
  }

  changeDisplay() {
    if (this.popupDisplay == 'block') {
      this.chatPreferencesService.setValue('none');
      this.chatPreferencesService.setTargetUserId('');  //Everytime Chat is closed, set the user id to 0
    }
    else {
      //Load chatlist
      this.getAllUserChats();
      this.chatPreferencesService.setValue('block');
    }
  }

  changePage(pageNo) {
    console.log("WE ARE CURRENTLY TALKING WITH: ")
    console.log(this.personId)
    if(pageNo == 0) {  //Si la pagina es la 0, desconectarse de qualsevol xat
      this.exitSocket()
    }
  }

  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch (err) { }
  }

  setRecieverVariables(avatarUrl, chatId){
    //Guardem el receptor i id del xat per poder enviar missatges a la bdd
    this.recieverAvatarUrl = this.fileStorageUrl + avatarUrl;
    this.currentChatId = chatId;
  }

  getAllUserChats() {
    this.subscriptionHttp$ = this._httpService.getAllUserChats()
      .pipe(first())
      .subscribe(
        data => {
          console.log("RESULTAT DE TOTS ELS XATS: ", data.row);
          if (data.code == "1") {
            this.chatList = data.row;
            if(this.chatList.length) {
              this.page = 0;
            }
            else{
              this.page = 2;
            }
          }
        });
  }

  getAllDialog(idChat) {
    this.subscriptionHttp1$ = this._httpService.getAllDialog(idChat)
    .pipe(first())
    .subscribe(
      data => {
        if (data.code == "1") {
          console.log("AQUESTS SON TOTS ELS MISATGES QUE S'HAN FET: ", data.row.dialog)
          data.row.dialog.forEach(element => {
            this.messages.push(element)
          });
        }
      });
  }

}
