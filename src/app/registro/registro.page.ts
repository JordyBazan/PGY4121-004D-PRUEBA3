import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Comuna } from 'src/app/models/comuna';
import { Region } from 'src/app/models/region';
import { LocationService } from 'src/app/services/location.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {
  formularioRegistro: FormGroup;

  regiones:Region[]=[];
  comunas:Comuna[]=[];
  regionSeleccionado:number = 0;
  comunaSeleccionada:number = 0;
  passwordMatchValidator: any;


  constructor(private locationService: LocationService, public fb: FormBuilder, public alertController: AlertController) { 
    this.formularioRegistro = this.fb.group({
      'nombre':   new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0]*$/)]),
      'apellido': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0]*$/)]),
      'rut':      new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d{7,8}-[0-9kK]$/)]),
      'carrera':  new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0]*$/)]),
      'nombreLogin':   new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0]*$/)]),
      'password': new FormControl("", [Validators.required, Validators.pattern(/^\d{4}$/), Validators.minLength(4), Validators.maxLength(4)]),
      'confirmacionPassword': new FormControl("",Validators.required)
    },{ validators: this.passwordMatchValidator });;

  }

  ngOnInit() {
    this.cargarRegion();
  }

  async cargarRegion(){
    const req = await this.locationService.getRegion();
    this.regiones = req.data;
    console.log("REGION",this.regiones);
  }

  async cargarComuna(){
    const req = await this.locationService.getComuna(this.regionSeleccionado);
    this.comunas = req.data;
    console.log("COMUNA",this.comunas);
  }

  async guardar() {
    var f = this.formularioRegistro.value;
    const usuariosJSON = await Preferences.get({ key:'usuarios'});
    const usuarios = usuariosJSON && usuariosJSON.value ? JSON.parse(usuariosJSON.value) : [];
  
    // Verificar que ambos campos estén completos
    if (!f.nombre || !f.apellido || !f.rut || !f.carrera || !f.nombreLogin || !f.password || !f.confirmacionPassword) {
      const alert = await this.alertController.create({
        header:   'Campos incompletos',
        message:  'Por favor completa todos los campos antes de guardar.',
        buttons:  ['OK']
      });
      await alert.present();
      return;
    }
  
    // Verificar que las contraseñas coincidan
    if (f.password !== f.confirmacionPassword) {
      const alert = await this.alertController.create({
        header:   'Contraseñas no coinciden',
        message:  'La contraseña y la confirmación de contraseña no coinciden.',
        buttons:  ['OK']
      });
      await alert.present();
      return; // No continuar si las contraseñas no coinciden
    }
  
    var usuario = {
      nombre:        f.nombre,
      apellido:      f.apellido,
      rut:           f.rut,
      carrera:       f.carrera,
      nombreLogin:   f.nombreLogin,
      password:      f.password,
      region: this.regiones.find(region => region.id === this.regionSeleccionado),
      comuna: this.comunas.find(comuna => comuna.id === this.comunaSeleccionada)
    }
  
    // Obtener la lista de usuarios existente o inicializar si no existe
    
    
    // Agregar el nuevo usuario a la lista
    usuarios.push(usuario);
    await Preferences.set({ key:'usuarios', value: JSON.stringify(usuarios) } );
    // Guardar la lista actualizada en el Local Storage

  
    const successAlert = await this.alertController.create({
      header: 'Usuario guardado',
      message: 'El usuario ha sido guardado exitosamente.',
      buttons: ['OK']
    });
    await successAlert.present();
  }

}

