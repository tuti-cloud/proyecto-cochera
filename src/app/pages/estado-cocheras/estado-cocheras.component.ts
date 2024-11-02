import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cocheras';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import { CocherasService } from '../../services/cocheras.service';
import { Estacionamiento } from '../../interfaces/estacionamiento';
import { TarifasService } from '../../services/tarifas.service';

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
  header = {
    nro: "NUMERO",
    disponibilidad: "DISPONIBILIDAD",
    ingreso: "INGRESO",
    acciones: "ACCIONES"
  };

  filas: (Cochera & { activo: Estacionamiento | null })[] = [];
  
  auth = inject(AuthService);
  estacionamientos = inject(EstacionamientosService);
  cocheras = inject(CocherasService);
  tarifas = inject(TarifasService);

  ngOnInit() {
    this.getCocheras();
  }

  getCocheras() {
    return this.cocheras.cocheras().then(cocheras => {
      this.filas = [];
      for (let cochera of cocheras) {
        this.estacionamientos.buscarEstacionamientoActivo(cochera.id).then(estacionamiento => {
          this.filas.push({
            ...cochera,
            activo: estacionamiento,
          });
        });
      }
    });
  }

  actualizarCochera(idCochera: number) {
    this.estacionamientos.buscarEstacionamientoActivo(idCochera).then(estacionamiento => {
      const index = this.filas.findIndex(f => f.id === idCochera);
      if (index !== -1) {
        this.filas[index].activo = estacionamiento;
        this.filas = [...this.filas]; 
      }
    });
  }

  abrirModalEliminarCochera(idCochera: number) {
    Swal.fire({
      title: "¿Estás seguro de eliminar esta cochera?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cocheras.eliminarCochera(idCochera).then(() => {
          Swal.fire("¡Eliminada!", "La cochera ha sido eliminada.", "success");
          this.filas = this.filas.filter(f => f.id !== idCochera);
        }).catch(error => {
          console.error("Error al eliminar la cochera:", error);
          Swal.fire("Error", "No se pudo eliminar la cochera.", "error");
        });
      }
    });
  }

  abrirModalHabilitarCochera(idCochera: number) {
    const cochera = this.filas.find(c => c.id === idCochera);
    if (!cochera) return;

    Swal.fire({
      title: "¿Deseas habilitar esta cochera?",
      text: "Esto cambiará su disponibilidad a disponible",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, habilitar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cocheras.habilitarCochera(cochera).then(() => {
          Swal.fire("¡Habilitada!", "La cochera ahora está disponible.", "success");
          cochera.deshabilitada = 0;
          this.actualizarCochera(idCochera); 
        }).catch(error => {
          console.error("Error al habilitar la cochera:", error);
          Swal.fire("Error", "No se pudo habilitar la cochera.", "error");
        });
      }
    });
  }

  abrirModalDeshabilitarCochera(idCochera: number) {
    const cochera = this.filas.find(c => c.id === idCochera);
    if (!cochera) return;

    Swal.fire({
      title: "¿Deseas deshabilitar esta cochera?",
      text: "Esto cambiará su disponibilidad a no disponible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, deshabilitar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cocheras.deshabilitarCochera(cochera).then(() => {
          Swal.fire("¡Deshabilitada!", "La cochera ahora está no disponible.", "success");
          cochera.deshabilitada = 1;
          this.actualizarCochera(idCochera); 
        }).catch(error => {
          console.error("Error al deshabilitar la cochera:", error);
          Swal.fire("Error", "No se pudo deshabilitar la cochera.", "error");
        });
      }
    });
  }

  abrirModalCalculoTarifa(idCochera: number) {
    const cochera = this.filas.find(c => c.id === idCochera);
    if (!cochera || !cochera.activo) return;

    Swal.fire({
      title: "¿Deseas calcular la tarifa y cerrar esta cochera?",
      text: "Esto calculará la tarifa y liberará la cochera",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sí, calcular y cerrar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed && cochera.activo) {
        this.estacionamientos.cerrarEstacionamiento(cochera.activo.patente, cochera.id)
          .then(response => {
            if (response && response.costo != null) {
              Swal.fire({
                title: "Estacionamiento cerrado",
                text: `La tarifa total es: $${response.costo}`,
                icon: "success"
              });
              cochera.activo = null;
              this.actualizarCochera(idCochera); 
            } else {
              throw new Error("Respuesta del servidor incompleta o incorrecta");
            }
          })
          .catch(error => {
            console.error("Error al cerrar el estacionamiento:", error);
            Swal.fire("Error", "No se pudo cerrar el estacionamiento.", "error");
          });
      }
    });
  }

  abrirModalNuevoEstacionamiento(idCochera: number) {
    Swal.fire({
      title: "Ingrese su patente",
      input: "text",
      inputPlaceholder: "Ej: ABC123",
      showCancelButton: true,
      confirmButtonText: "Estacionar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => { 
        if (!value) {
          return "Necesitás escribir algo!";
        }
        return null;
      }
    }).then(res => {
      if (res.isConfirmed && res.value) {
        this.estacionamientos.estacionarAuto(res.value, idCochera).then(() => {
          Swal.fire("¡Estacionado!", "El auto ha sido estacionado exitosamente.", "success");
          this.actualizarCochera(idCochera);
        }).catch(error => {
          console.error("Error al estacionar el auto:", error);
          Swal.fire("Error", "No se pudo estacionar el auto.", "error");
        });
      }
    });
  }

  datosEstadoCocheras = {
    descripcion: " "
  }

  agregarFila(): void {
    this.cocheras.agregarCochera(this.datosEstadoCocheras)
      .then(data => {
        data.disponible = true; 
        this.getCocheras(); 
      })
      .catch(error => {
        console.error('Hubo un problema con la operación fetch:', error);
      });
  }
}
