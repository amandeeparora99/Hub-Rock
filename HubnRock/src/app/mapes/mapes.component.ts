import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-mapes',
  templateUrl: './mapes.component.html',
  styleUrls: ['./mapes.component.css']
})
export class MapesComponent implements OnInit {
  lat: number = 41.7252;
  lng: number = 1.82335;
  display = 'none';

  empresaChecked = false;
  startupsChecked = false;
  fitBoundsVar = true;

  currentEmpresa;
  public fileStorageUrl = environment.api + '/image/';

  selectedItemsList = [];
  checkedIDs = [];
  text;
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

  subscriptionHttp1$: Subscription;

  empreses: any[] = [];
  infoWindowOpened = null
  previous_info_window = null
  current_empresa_name = null

  constructor(private httpCommunication: HttpCommunicationService){};

  ngOnInit(): void {
    this.fetchSelectedItems()
    this.fetchCheckedIDs()
    this.onSearchSubmit()
    // console.log("OBJECTS:", this.selectedItemsList)
    // console.log("Array of IDs:", this.checkedIDs)
  }

  close_window(){
    if (this.previous_info_window != null ) {
      this.previous_info_window.close()
    }
    if(this.display == 'block'){
      this.display = 'none';
    }
  }
  clickedMarker(infowindow) {
    if (this.previous_info_window) {
        this.previous_info_window.close();
    }
    this.previous_info_window = infowindow;
  }
    
  // select_marker(data,infoWindow){
  //   console.log("M CLICKED")
  //   if (this.previous_info_window == null)
  //     this.previous_info_window = infoWindow;
  //   else{
  //     this.infoWindowOpened = infoWindow
  //     this.previous_info_window.close()
  //   }
  //   this.previous_info_window = infoWindow
  // }

  clearSearch(){
    this.text = '';
  }

  getJSONlatlng(latlng){
    // console.log("NORMAL:",latlng)
    // console.log("AMB PARSE:",JSON.parse(latlng))
    return JSON.parse(latlng);
  }

  onSearchChange(searchValue: string): void {
    if (searchValue.length > 2) {
      // console.log(searchValue);
    }
    // console.log('asdf',this.text)
  }

  displayChange(nomEmpresa){
    var sameEmpresa = false;

    sameEmpresa = (this.current_empresa_name == nomEmpresa ? true : false)

    if(this.display == 'none'){
      this.display = 'block';
    }
    else{
      if(sameEmpresa){
        this.display = 'none';
      }
    }
  }

  setEmpresa(empresa){
    this.currentEmpresa = empresa;
  }

  changeTipusEmpresa(tipusEmpresa){
    if(tipusEmpresa == 'startup'){
      this.startupsChecked = !(this.startupsChecked);
    }
    else if(tipusEmpresa == 'empresa'){
      this.empresaChecked = !(this.empresaChecked);
    }

    // console.log("EMPRESA CHECKED: "+this.empresaChecked)
    // console.log("STARTUPS CHECKED: "+this.startupsChecked)
    this.onSearchSubmit()
  }

  changeSelection() {
    this.fetchSelectedItems()
    this.fetchCheckedIDs()
    // console.log("OBJECTS:", this.selectedItemsList)
    // console.log("Array of IDs:", this.checkedIDs)
    this.onSearchSubmit()
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
  }

  onSearchSubmit(){
    
    if(this.text){
      // console.log("Search AMB Nom")
      this.subscriptionHttp1$ = this.httpCommunication.getUsersSearch(this.text,
        this.empresaChecked,
        this.startupsChecked,
        this.checkedIDs,
        1,
        99
      )
        .pipe(first())
        .subscribe(
          data => {
            // console.log(data);
            if (data.code == "1") {
              this.empreses = [];
              data.rows.forEach(element => {
                var latval = JSON.parse(element.ciutat_residencia).lat
                if(element.ciutat_residencia && latval != 0){
                  if(element.empresa_rockstar == 0){
                    this.empreses.push(element)
                  }
                }
              });
              if (data.rows.length){
                this.fitBoundsVar = true;
              }
              else{
                this.fitBoundsVar = false;
              }
            }
          },
          error => {
            //this.error = error;
            //this.loading = false;
          });
    }
    else{
      // console.log("Search sense Nom")
      this.subscriptionHttp1$ = this.httpCommunication.getUsersSearchEmpty(
        this.empresaChecked,
        this.startupsChecked,
        this.checkedIDs,
        1,
        99
      )
        .pipe(first())
        .subscribe(
          data => {
            // console.log(data);
            if (data.code == "1") {
              this.empreses = [];
              data.rows.forEach(element => {
                var latval = JSON.parse(element.ciutat_residencia).lat
                if(element.ciutat_residencia && latval != 0){
                  if(element.empresa_rockstar == 0){
                    this.empreses.push(element)
                  }
                }
              });
              if (data.rows.length){
                this.fitBoundsVar = true;
              }
              else{
                this.fitBoundsVar = false;
              }
            }
          },
          error => {
            //this.error = error;
            //this.loading = false;
          });
    }
    
  }
  

}
