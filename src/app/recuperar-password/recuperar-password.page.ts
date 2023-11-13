import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
})
export class RecuperarPasswordPage {
  usuario: string = '';
  usuariosGuardados: any[] = [];
  usuarioEncontrado: boolean = false; // Variable para controlar la visibilidad del GIF

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    // Obtener la lista de usuarios existente o inicializar si no existe
    this.usuariosGuardados = JSON.parse(
      localStorage.getItem('usuarios') || '[]'
    );
  }

  recuperarPassword() {
    const usuarioEncontrado = this.usuariosGuardados.find(
      (user) => user.nombreLogin === this.usuario
    );

    if (usuarioEncontrado) {
      const password = usuarioEncontrado.password;
      this.usuarioEncontrado = true; // Mostrar el GIF
      this.mostrarPassword(password);
    } else {
      this.mostrarAlerta('Usuario no encontrado', 'El usuario no existe.');
    }
  }

  async mostrarPassword(password: string) {
    const alert = await this.alertController.create({
      header: 'Contraseña encontrada',
      message: `La contraseña es: ${password}`,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async mostrarAlerta(header: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: header,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

  volver() {
    this.navCtrl.navigateBack('/'); // Cambia la ruta según tu configuración
  }
}
