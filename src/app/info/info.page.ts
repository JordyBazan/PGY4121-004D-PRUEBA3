import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {DomSanitizer} from '@angular/platform-browser';
import { Preferences } from '@capacitor/preferences';
import { GeolocationPosition } from '@capacitor/geolocation';
@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  parameterString: string = '';
  claseActual: string = '';
  imageSource: any;
  usuarios: any[] = [];
  latitude: number | undefined;
  longitude: number | undefined;
  mensajeDesdePreferences: string | null = '';

  constructor(private route: ActivatedRoute, private storageService : StorageService, private domSanitizer:DomSanitizer) { }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      saveToGallery: false
    });
    //this.imageSource= 'data:image/jpeg;base64,' + image.base64String;
    //console.log(this.imageSource)

    this.imageSource = this.domSanitizer.bypassSecurityTrustUrl(image.webPath ? image.webPath : "")
  }

  getPhoto(){
    return this.imageSource
  }

  ngOnInit() {
   this.parameterString = this.route.snapshot.paramMap.get('parameterString')!;
   this.imprimirUsuario();
   this.usuarioPreference();
   this.getCurrentPosition();
  }
  async getCurrentPosition() {
    try {
      const coordinates: GeolocationPosition = await Geolocation.getCurrentPosition();
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
    } catch (error) {
      console.error('Error al obtener la posición actual:', error);
    }
  }

  
  async usuarioPreference() {
    try {
      const usuariosJSON = await Preferences.get({ key: 'usuarios' });
      if (usuariosJSON && usuariosJSON.value) {
        this.usuarios = JSON.parse(usuariosJSON.value);
      }
    } catch (error) {
      console.error('Error al recuperar usuarios desde Preferences:', error);
    }
  }

  async imprimirUsuario() {
    let usuario = await this.storageService.obtenerUsuario();
    let usuarios =  await this.storageService.obtenerUsuarios('usuarios');
    // buscamos el usuario que coincida con el campo nombrelogin
    if (usuarios) {
      let usuariosObj = await JSON.parse(usuarios);
      let usuarioActual = usuario[0].usuarioActual;
      

      usuariosObj.forEach((usuario: any) => {

        console.log(usuario.nombreLogin);
        console.log('----------------------');
        console.log(usuarioActual);
        console.log(usuario.nombreLogin == usuarioActual);
        if(usuario.nombreLogin == usuarioActual){
          let datosUsuario = 'Nombre: ' + usuario.nombre + ' ' + usuario.apellido  + ' Rut: ' + usuario.rut  + ' Carrera: ' + usuario.carrera + ' Nombre usuario: ' + usuario.nombreLogin;
          const elemento = document.getElementById('datosAlumno');
          if (elemento) {
            elemento.innerHTML = datosUsuario;
          } else {
            console.log('No se ha encontrado el alumno');
          }
        }
      });
      
    } else {
      console.log('AHHHHHHHHHHHHHHHH');
    }
    this.storageService.getClase('claseActual')
    .then((claseActual) => {
        const clase = document.getElementById('clase');

        const claseActualObj = JSON.parse(claseActual);

        if (clase) {
          clase.innerHTML = claseActualObj;
        }
        
    })
    .catch((error) => {
        console.error(error);
    });
  }
  async retrieveMessageFromPreferences() {
    try {
      const mensaje = await Preferences.get({ key: 'mensaje' });
      if (mensaje && mensaje.value) {
        this.mensajeDesdePreferences = this.agregarSaltosDeLinea(mensaje.value);
        console.log("sebapene",mensaje)
      }
    } catch (error) {
      console.error('Error al recuperar el mensaje desde Preferences:', error);
    }
  }

  agregarSaltosDeLinea(mensaje: string) {
    return mensaje.replace(/,/g, '<br>');
  }
  
}