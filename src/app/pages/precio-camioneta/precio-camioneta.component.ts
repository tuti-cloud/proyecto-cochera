import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-precio-camioneta',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './precio-camioneta.component.html',
  styleUrls: ['./precio-camioneta.component.scss']
})
export class PrecioCamionetaComponent {
  precios: any = {
    precio1: "$500",
    precio2: "$800",
    precio3: "$1,500",
    precio4: "$2,500",
    precio5: "$4,000",
    precio6: "$6,000",
  };

  ngOnInit() {
   
    const storedPrecios = localStorage.getItem('precio');
    if (storedPrecios) {
      this.precios = JSON.parse(storedPrecios);
    }
  }

  actualizar(precioKey: string) {
    
    Swal.fire({
      title: "Ingrese el nuevo precio",
      input: "text", 
      inputLabel: "Ingrese el nuevo precio:",
      inputValue: this.precios[precioKey].replace('$', ''),
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
        this.precios[precioKey] = `$${nuevoPrecio}`; 
        Swal.fire(`El nuevo precio es ${this.precios[precioKey]}`); 
        localStorage.setItem('precio', JSON.stringify(this.precios)); 
      }
    });
  }
}


