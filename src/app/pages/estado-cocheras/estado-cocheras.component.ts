import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cocheras';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { EstacionamientosService } from '../../services/estacionamientos.service';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './estado-cocheras.component.html',
  styleUrls: ['./estado-cocheras.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EstadoCocherasComponent {

  titulo = "Estado de Cocheras";
  header = { nro: "N°", disponibilidad: "Disponibilidad", ingreso: "Ingreso", acciones: "" };
  filas: Cochera[] = [];
  indiceCarga: number = 0;

  auth = inject(AuthService);
  estacionamientos= inject(EstacionamientosService)

  



  agregarCochera() {
    const nuevaCochera: Cochera = {
      id: this.filas.length > 0 ? this.filas[this.filas.length - 1].id + 1 : 1,
      deshabilitada: 0,
      descripcion: "regibu ",
      eliminada: 0
    };
    this.filas.push(nuevaCochera);
  }

  eliminarFila(idCochera: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: true
    });

    swalWithBootstrapButtons.fire({
      title: "¿ESTÁS SEGURO?",
      text: "NO VAS A PODER REVERTIRLO",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "SÍ, ¡BORRARLO!",
      cancelButtonText: "NO, ¡NO LO BORRES!",
      cancelButtonColor: "#630c00",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:4000/cocheras/` + idCochera, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization: "Bearer " + localStorage.getItem('token')
          }
        })
        .then(response => {
          if (response.ok) {
            swalWithBootstrapButtons.fire("BORRADO", "LA COCHERA HA SIDO BORRADA", "success");
            this.filas = this.filas.filter(fila => fila.id !== idCochera);
          } else {
            swalWithBootstrapButtons.fire("ERROR", "NO SE PUDO BORRAR LA COCHERA", "error");
          }
        })
        .catch(error => {
          console.error('Error al borrar la cochera:', error);
          swalWithBootstrapButtons.fire("ERROR", "OCURRIÓ UN ERROR AL BORRAR LA COCHERA", "error");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire("CANCELADO", "LA COCHERA NO HA SIDO ELIMINADA", "error");
      }
    });
  }

  cambiarDisponibilidadCochera(numeroFila: number) {
    const cochera = this.filas[numeroFila]; // Se obtiene la cochera en la fila especificada.
    
    // Se determinan los estados actuales y próximos según el valor de 'deshabilitada'.
    const estadoActual = cochera.deshabilitada === 0 ? 'disponible' : 'no disponible';
    const proximoEstado = cochera.deshabilitada === 0 ? 'no disponible' : 'disponible';
  
    // Construcción de la URL de la API, corregida quitando la comilla al final de la línea.
    const url = `http://localhost:4000/cocheras/${cochera.id}/${cochera.deshabilitada === 0 ? 'disable' : 'enable'}`;
    
    // Configuración de la alerta de confirmación con SweetAlert2.
    Swal.fire({
      title: `La cochera está ${estadoActual}. ¿Te gustaría cambiarla a ${proximoEstado}?`, // Agregué las comillas invertidas para interpolación.
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Cambiar",
      denyButtonText: "No cambiar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Realizar la solicitud al backend para cambiar la disponibilidad.
        fetch(url, {
          method: 'POST', // Método POST para cambiar el estado
          headers: {
            'Content-Type': 'application/json',
            authorization: "Bearer " + localStorage.getItem('token')
          }
        })
        .then(response => {
          if (response.ok) {
            // Si el backend responde correctamente, cambiar el estado en el frontend.
            cochera.deshabilitada = cochera.deshabilitada === 0 ? 1 : 0; // Alternar entre 0 y 1.
            Swal.fire("¡Cambios guardados!", `La cochera ahora está ${proximoEstado}.`, "success"); // Usar comillas invertidas para interpolación.
          } else {
            // Manejo de errores del backend.
            Swal.fire("Error", "No se pudo cambiar la disponibilidad de la cochera.", "error");
          }
        })
        .catch(error => {
          console.error('Error al cambiar la disponibilidad de la cochera:', error);
          Swal.fire("Error", "Ocurrió un error al intentar cambiar la disponibilidad.", "error");
        });
      } else if (result.isDenied) {
        Swal.fire("Los cambios no fueron guardados", "", "info");
      }
    });
  }
}
