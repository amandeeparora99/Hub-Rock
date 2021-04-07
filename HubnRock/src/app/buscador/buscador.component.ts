import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  public fileStorageUrl = environment.api + '/image/';
  public activeSearch = 'reptes';

  searchKeyword = '';

  futursRadio;
  tancatsRadio;
  obertsRadio;
  selectedRadio;

  empresesCheckbox = false;
  startupsCheckbox = false;
  estudiantsCheckbox = false;
  expertsCheckbox = false;

  selectedItemsList = [];
  checkedIDs = [];
  checkboxesIndustriaList = [
    {
      id: '00',
      label: 'Totes',
      isChecked: false
    },
    {
      id: '1',
      label: 'Big Data',
      isChecked: false
    },
    {
      id: '2',
      label: 'Biotecnologia',
      isChecked: false
    },
    {
      id: '3',
      label: 'Blockchain',
      isChecked: false
    },
    {
      id: '4',
      label: 'Ciberseguretat',
      isChecked: false
    },
    {
      id: '5',
      label: 'Desenvolupament de software',
      isChecked: false
    },
    {
      id: '6',
      label: 'Fabricació de hardware',
      isChecked: false
    },
    {
      id: '7',
      label: 'Impressió 3D',
      isChecked: false
    },
    {
      id: '8',
      label: 'Intel·ligència artificial',
      isChecked: false
    },
    {
      id: '9',
      label: 'Mobilitat',
      isChecked: false
    },
    {
      id: '10',
      label: 'Realitat virtual i augmentada',
      isChecked: false
    },
    {
      id: '11',
      label: 'UX / UI',
      isChecked: false
    },
    {
      id: '12',
      label: 'Xarxes i telecomunicacions',
      isChecked: false
    },
    {
      id: '13',
      label: 'Activitats financeres i assegurances',
      isChecked: false
    },
    {
      id: '14',
      label: 'Administració pública',
      isChecked: false
    },
    {
      id: '15',
      label: 'Agricultura i alimentació',
      isChecked: false
    },
    {
      id: '16',
      label: 'Arquitectura i construcció',
      isChecked: false
    },
    {
      id: '17',
      label: 'Art, cultura i oci',
      isChecked: false
    },
    {
      id: '18',
      label: 'Assessories i gestories',
      isChecked: false
    },
    {
      id: '19',
      label: 'Comerç',
      isChecked: false
    },
    {
      id: '20',
      label: 'Educació',
      isChecked: false
    },
    {
      id: '21',
      label: 'Energia i aigua',
      isChecked: false
    },
    {
      id: '22',
      label: 'Extracció i transformació de minerals',
      isChecked: false
    },
    {
      id: '23',
      label: 'Investigació i desenvolupament',
      isChecked: false
    },
    {
      id: '24',
      label: 'Hosteleria i restauració',
      isChecked: false
    },
    {
      id: '25',
      label: 'Indústries manufactureres',
      isChecked: false
    },
    {
      id: '26',
      label: 'Indústries transformadores dels metalls',
      isChecked: false
    },
    {
      id: '27',
      label: 'Publicitat i marketing',
      isChecked: false
    },
    {
      id: '28',
      label: 'Recursos humans',
      isChecked: false
    },
    {
      id: '29',
      label: 'Salut',
      isChecked: false
    },
    {
      id: '30',
      label: 'Sostenibilitat i medi ambient',
      isChecked: false
    },
    {
      id: '31',
      label: 'Transport i logística',
      isChecked: false
    },
    {
      id: '32',
      label: 'Turisme',
      isChecked: false
    },
    {
      id: '33',
      label: 'Veterinària',
      isChecked: false
    },
    {
      id: '34',
      label: 'Altres',
      isChecked: false
    },

  ]

  reptes = [];
  users = [];

  subscriptionHttp$: Subscription;
  subscriptionHttp1$: Subscription;
  subscriptionHttp2$: Subscription;

  constructor(private route: ActivatedRoute, private httpCommunication: HttpCommunicationService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.searchKeyword = params.id);
    this.searchByName(this.searchKeyword);
  }

  changeSearch(searchType) {
    this.activeSearch = searchType;

    if(searchType == 'directori'){
      this.empresesCheckbox = false;
      this.startupsCheckbox = false;
      this.estudiantsCheckbox = false;
      this.expertsCheckbox = false;
      this.selectedRadio = '';
    }
  }

  changeSelection() {
    this.fetchSelectedItems()
    this.fetchCheckedIDs()
    // console.log("OBJECTS:", this.selectedItemsList)
    // console.log("Array of IDs:", this.checkedIDs)

    this.searchProfileByName(this.searchKeyword);
  }

  fetchSelectedItems() {
    this.selectedItemsList = this.checkboxesIndustriaList.filter((value, index) => {
      return value.isChecked
    });
  }

  fetchCheckedIDs() {
    this.checkedIDs = []
    this.checkboxesIndustriaList.forEach((value, index) => {
      if (value.isChecked) {
        this.checkedIDs.push(value.id);
      }
    });
  }

  clearFilters() {
    this.checkedIDs = []
    this.checkboxesIndustriaList.forEach((value, index) => {
      if (value.isChecked) {
        value.isChecked = false;
      }
    });

    this.searchProfileByName(this.searchKeyword);
  }

  onRepteStatusChange(value){
    // console.log(" Value is : ", value );
    this.selectedRadio = value;

    this.searchRepteByNameAndParams(this.searchKeyword, this.selectedRadio, 
      this.empresesCheckbox, this.startupsCheckbox, this.estudiantsCheckbox, this.expertsCheckbox);
  }

  resetCheckboxes(){
    this.selectedRadio = '';
    this.empresesCheckbox = false;
    this.startupsCheckbox = false;
    this.estudiantsCheckbox = false;
    this.expertsCheckbox = false;
    this.reptes = [];
    this.searchByName(this.searchKeyword);
  }

  // REPTE CARDS

  premiCurt(text){
    var string = text;
    var length = 7;
    var trimmedString = string.substring(0, length);
    if(text.length > 7){
      return trimmedString+"...";
    }
    else{
      return string;
    }
  }

  diesRestants(data_inici, data_final) {
    if (data_final && data_inici) {
      let dateInici = new Date(data_inici);
      let dateFinal = new Date(data_final);
      let currentDate = new Date();

      if (dateInici > currentDate) {
        let days = Math.floor((dateInici.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);

        if (days > 0) {
          return "Inicia en " + days + " dies";
        }
        else {
          return "Comença demà!"
        }

      }
      else if (dateInici < currentDate && dateFinal > currentDate) {
        let days = Math.floor((dateFinal.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
        return "Tanca en " + days + " dies";
      }
      else {
        let days = Math.floor(dateFinal.getTime() / 1000 / 60 / 60 / 24);
        if (days > 30) {
          return "Tancat";
        }
        else if (dateInici < currentDate && dateFinal > currentDate) {
          let days = Math.floor((dateFinal.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
          return "Tanca en " + days + " dies";
        }
        else {
          let days = Math.floor(dateFinal.getTime() / 1000 / 60 / 60 / 24);
          if (days > 30) {
            return "Tancat";
          }
          else {
            return "Tancat fa " + days + " dies";
          }

        }
      }


    }
  }

  // /REPTE CARDS

  onTypeChange(event, type){
    if(type == 'empreses'){
      this.empresesCheckbox = event.target.checked;
    }
    else if(type == 'startups'){
      this.startupsCheckbox = event.target.checked;
    }
    else if(type == 'experts'){
      this.expertsCheckbox = event.target.checked;
    }
    else if(type == 'estudiants'){
      this.estudiantsCheckbox = event.target.checked;
    }

    this.searchRepteByNameAndParams(this.searchKeyword, this.selectedRadio, 
      this.empresesCheckbox, this.startupsCheckbox, this.estudiantsCheckbox, this.expertsCheckbox);
  }
  onTypeChangeUsers(event, type){
    if(type == 'empreses'){
      this.empresesCheckbox = event.target.checked;
    }
    else if(type == 'startups'){
      this.startupsCheckbox = event.target.checked;
    }
    else if(type == 'experts'){
      this.expertsCheckbox = event.target.checked;
    }
    else if(type == 'estudiants'){
      this.estudiantsCheckbox = event.target.checked;
    }

    this.searchProfileByName(this.searchKeyword);
  }

  searchByName(keyword){
    this.subscriptionHttp$ = this.httpCommunication.getReptesByNameSearch(keyword, 1, 9)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data.code == "1") {
            this.reptes = data.rows;
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  searchRepteByNameAndParams(keyword, status, empresesChecked, startupsChecked, expertsChecked, estudiantsChecked){
    // console.log("SEARCHING BY PARAMETERS")
    this.subscriptionHttp1$ = this.httpCommunication.getReptesByNameAndParamsSearch(keyword, status, empresesChecked, 
      startupsChecked, expertsChecked, estudiantsChecked, 1, 9)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data.code == "1") {
            this.reptes = [];
            this.reptes = data.rows;
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  searchProfileByName(keyword){
    // console.log("SEARCHING BY PROFILE NAME")
    // console.log(this.empresesCheckbox, this.startupsCheckbox, this.expertsCheckbox, this.estudiantsCheckbox)
    this.subscriptionHttp2$ = this.httpCommunication.getUsersSearchBar(keyword,
      this.empresesCheckbox,
      this.startupsCheckbox,
      this.expertsCheckbox,
      this.estudiantsCheckbox,
      this.checkedIDs,
      1,
      9
    )
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data.code == "1") {
            this.users = [];
            this.users = data.rows;
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }
}
