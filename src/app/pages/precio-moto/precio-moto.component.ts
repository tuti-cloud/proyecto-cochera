import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-precio-moto',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './precio-moto.component.html',
  styleUrls: ['./precio-moto.component.scss'],
  
})
export class PrecioMotoComponent {
  precios_moto: any = {
    precio_moto1: "$500",
    precio_moto2: "$800",
    precio_moto3: "$1,500",
    precio_moto4: "$2,500",
    precio_moto5: "$4,000",
    precio_moto6: "$6,000",
  };

  ngOnInit() {
   
    const storedPrecios = localStorage.getItem('precio_moto');
    if (storedPrecios) {
      this.precios_moto = JSON.parse(storedPrecios);
    }
  }

  actualizar(precioKey: string) {
    Swal.fire({
      title: "Ingrese el nuevo precio",
      input: "text",
      inputLabel: "Ingrese el nuevo precio:",
      inputValue: this.precios_moto[precioKey].replace('$', ''),  
      showCancelButton: true,
      preConfirm: (value) => {
      
        if (!value || isNaN(value) || Number(value) <= 0) {
          Swal.showValidationMessage("Debe ingresar un número válido!");
          return false;
        }
        return value;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        
        const nuevoPrecio = result.value;
        this.precios_moto[precioKey] = `$${nuevoPrecio}`;  

        
        Swal.fire(`El nuevo precio es ${this.precios_moto[precioKey]}`);

       
        localStorage.setItem('precio_moto', JSON.stringify(this.precios_moto));
      }
    });
  }
}


