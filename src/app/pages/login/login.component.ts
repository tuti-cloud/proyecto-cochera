import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReportesComponent } from '../reportes/reportes.component';
import { Login } from '../../interfaces/login';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReportesComponent,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {

  datosLogin: Login = {
    username: 'admin',
    password: 'admin'
  };
  
  router = inject(Router);
  auth = inject(AuthService);

  // Función para iniciar sesión
  login() {
    this.auth.Login(this.datosLogin)
      .then(ok => {
        if (ok) {
          this.router.navigate(['/estado-cocheras']);
        } else {
          Swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Usuario o contraseña incorrectos",
          });
        }
      });
  }

  // Función para registrarse
 registrarse() {
  Swal.fire({
    title: " ingrese sus datos ",
    html:
      '<label for="usuario">Usuario</label>' +
      '<input type="text" id="Usuario" class="swal2-input" placeholder="">' +
      '<label for="contraseña">Contraseña</label>' +
      '<input type="password" id="Contraseña" class="swal2-input" placeholder="">',
    showCancelButton: true,
    preConfirm: () => {
      const usuario = (document.getElementById('Usuario') as HTMLInputElement).value;
      const contraseña = (document.getElementById('Contraseña') as HTMLInputElement).value;

      if (!usuario || !contraseña) {
        Swal.showValidationMessage(' Debe completar ambos campos ');
      }
      return { usuario: usuario, contraseña: contraseña };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('Usuario:', result.value?.usuario);
      console.log('Contraseña:', result.value?.contraseña);
      Swal.fire("Te registraste con éxito!");
    }
  });
}
}


