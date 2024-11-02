import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { tarifas } from '../../interfaces/tarifas';
import { TarifasService } from '../../services/tarifas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import es from '@angular/common/locales/es';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-precio-auto',
  standalone: true,
  imports: [HeaderComponent,FormsModule,CommonModule],
  templateUrl: './precio-auto.component.html',
  styleUrl: './precio-auto.component.scss'
})
export class PrecioAutoComponent {
  
  tarifaservice=inject(TarifasService)
  tarifas: tarifas[] = [];

  

  ngOnInit(): void {
    this.tarifaservice.GetTarifas()
      .then((data: tarifas[]) => {
        this.tarifas = data;
        console.log('Tarifas cargadas:', this.tarifas);
      })
      .catch((error: any) => {
        console.error('Error al cargar tarifas:', error);
      });
  }
  actualizar(id: string) {
    Swal.fire({
      title: 'Ingrese el nuevo precio',
      input: 'number',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'Debes escribir algo!';
        const numberValue = parseFloat(value);
        if (isNaN(numberValue) || numberValue <= 0) return 'Debes ingresar un número válido!';
        return null;
      }
    }).then(result => {
      if (result.value) {
        const nuevoPrecio = parseFloat(result.value);
        
        this.tarifaservice.actualizarTarifa(id, nuevoPrecio)
         .then(updatedTarifa => {
            // Actualizar el precio en la tarifa local
            const index = this.tarifas.findIndex(tarifa => tarifa.id === id);
            if (index !== -1) this.tarifas[index].valor = `$${nuevoPrecio}`;
            Swal.fire(`El nuevo precio es $${nuevoPrecio}`);
          })
          .catch((error: any) => console.error('Error al actualizar tarifa:', error));
      }
    });
  }}
  
  