import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
})
export class RecuperarPasswordPage {
  usuarios: any[] = [];
  rutInput: string = '';
  nombreUsuarioInput: string = '';
  resultadoContrasena: string = '';


  constructor(private alertController: AlertController) {}

  async ngOnInit() {
    // Obtener la lista de usuarios desde las preferencias
    const usuariosPreferences = await Preferences.get({ key: 'usuarios' });
    if (usuariosPreferences && usuariosPreferences.value) {
      this.usuarios = JSON.parse(usuariosPreferences.value);
    }
  }

  async buscarContrasena() {
    if (this.nombreUsuarioInput.trim() === '') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, complete todos los campos correctamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } else {
      const usuarioEncontrado = this.usuarios.find(nombreLogin => nombreLogin.nombreLogin === this.nombreUsuarioInput);

      if (usuarioEncontrado) {
        this.resultadoContrasena = usuarioEncontrado.password;

        // Muestra una alerta con la contraseña
        const alert = await this.alertController.create({
          header: 'Contraseña Encontrada',
          message: 'La contraseña es: ' + this.resultadoContrasena,
          buttons: ['Aceptar']
        });
        await alert.present();
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Nombre de usuario no encontrado',
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    }
  }
}

