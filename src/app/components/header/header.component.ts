import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Importar Router
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router) {} 
  auth = inject(AuthService);
  seleccionar_vehiculo() {
    Swal.fire({
      title: "Seleccione el vehiculo",
      input: "select",
      inputOptions: {
        auto: "Auto",
        moto: "Moto",
        camioneta: "Camioneta"
      },
      inputPlaceholder: "Seleccione el vehiculo",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Tenes que seleccionar un vehiculo!";
        }
        return null; 
      },

    }).then((result) => {
      if (result.isConfirmed) {
        let url = "";
        switch (result.value) {
          case "auto":
            url = "/precio-auto";
            break;
          case "moto":
            url = "/precio-moto";
            break;
          case "camioneta":
            url = "/precio-camioneta";
            break;
        }
  
        this.router.navigate([url]); 
      }
    });
  }
  Logout() {
    // Elimina el token de autenticación almacenado en la localStorage
    this.auth.Logout()

    
    this.router.navigate(['/login']);
  }


}



  
  
  
