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
    precio7: "$8,000",
    precio8: "$10,000"
  };

  // Al cargar el componente, verificar si hay datos en localStorage
  ngOnInit() {
    const storedPrecios = localStorage.getItem('precio');
    if (storedPrecios) {
      this.precios = JSON.parse(storedPrecios);
    }
  }

  async actualizar(precioKey: string) {
    const ipAPI = "//api.ipify.org?format=json";

    try {
      // Obtener la IP del usuario
      const response = await fetch(ipAPI);
      if (!response.ok) {
        throw new Error('Error en la solicitud a la API de IP');
      }
      const data = await response.json();

      // Mostrar el cuadro de diálogo SweetAlert2 para ingresar el nuevo precio
      const { value: nuevoPrecio } = await Swal.fire({
        title: "Ingrese el nuevo precio",
        input: "number",  // Cambiado a 'text' para permitir el símbolo de dólar
        inputLabel: `Ingrese el nuevo precio:`,
        inputValue: this.precios[precioKey].replace('$', ''),  // Mostrar el precio actual en el input sin el símbolo de dólar
        showCancelButton: true,
        inputValidator: (value) => {
          // Validar que el valor no esté vacío
          if (!value) {
            return "Debes escribir algo!";  // Retorna el mensaje si está vacío
          }
          // Validar que el valor sea un número
          const numberValue = parseFloat(value);
          if (isNaN(numberValue) || numberValue <= 0) {
            return "Debes ingresar un número válido!";  // Retorna el mensaje si no es un número
          }
          return null;  // Retorna null si todo está bien
        }
      });

      // Si el usuario ingresa un nuevo precio
      if (nuevoPrecio) {
        // Actualizar el precio en el objeto
        this.precios[precioKey] = `$${nuevoPrecio}`;  // Corregido para usar comillas invertidas y agregar el símbolo de dólar

        // Mostrar un mensaje de confirmación
        Swal.fire(`El nuevo precio es ${this.precios[precioKey]}`);  // Usar comillas invertidas para interpolar correctamente

        // Guardar en localStorage
        localStorage.setItem('precio', JSON.stringify(this.precios));
      }
    } catch (error) {
      // Manejar errores en caso de que falle la obtención de la IP o el SweetAlert
      console.error("Error al obtener la IP o mostrar la alerta", error);
      Swal.fire('Error', 'No se pudo obtener la IP o procesar la solicitud', 'error');
    }
  }
}

