import { Component, OnInit ,ViewChild,ElementRef} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Preferences } from '@capacitor/preferences';
import { Animation } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPassword = false;

  formularioLogin: FormGroup;
  @ViewChild('title', { read: ElementRef }) title!: ElementRef;
  private animation!: Animation;

  constructor(public fb: FormBuilder,
    public alertController: AlertController, private router: Router, public storage : StorageService, private animationCtrl: AnimationController ) { 
    this.formularioLogin = this.fb.group({
      'nombreLogin': new FormControl("", Validators.required), // Cambio de 'nombre' a 'nombreLogin'
      'password': new FormControl("", Validators.required)
    })
  }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngAfterViewInit(): void {
    this.animation = this.animationCtrl
      .create()
      .addElement(this.title.nativeElement)
      .duration(2500)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, transform: 'translateX(0)', opacity: '1' },
        { offset: 0.5, transform: 'translateX(100%)', opacity: '0.2' },
        { offset: 1, transform: 'translateX(0)', opacity: '1' },
      ]);
    this.animation.play();
  }
  async ingresar() {
    if (this.formularioLogin.valid) {
      const f = this.formularioLogin.value;

  
      // Obtén la lista de usuarios registrados desde Preferences
      const usuariosJSON = await Preferences.get({ key: 'usuarios' });
      const usuarios: { nombreLogin: string, password: string }[] = usuariosJSON && usuariosJSON.value ? JSON.parse(usuariosJSON.value) : [];
  
      // Busca al usuario por su nombre de usuario (campo 'usuario')
      const user = usuarios.find((u: any) => u.nombreLogin === f.nombreLogin && u.password === f.password);
  
      if (user) {
        // Guarda los datos del usuario que ha iniciado sesión
        await Preferences.set({ key: 'nombreUsuario', value: user.nombreLogin });
        await Preferences.set({ key: 'usuario', value: JSON.stringify(user)});
  
        console.log("Sesión iniciada");
        this.router.navigate(['/home']);
        this.formularioLogin.reset();

      } else {
        const alert = await this.alertController.create({
          header: 'Datos incorrectos',
          message: 'Los datos que se ingresaron no son correctos.',
          buttons: ['Aceptar']
        });
  
        await alert.present();
      }
   
    }
  }
}
