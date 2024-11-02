import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { tarifas } from '../interfaces/tarifas';


@Injectable({
  providedIn: 'root'
})
export class TarifasService {
  auth= inject(AuthService)
  
  GetTarifas(): Promise<tarifas[]> {
    return fetch("http://localhost:4000/tarifas", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? '')
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error al cargar tarifas:', error);
        throw error;
      });
  }
  actualizarTarifa(id: string, nuevoPrecio: number) {
    return fetch(`http://localhost:4000/tarifas/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ valor: nuevoPrecio })
    })
    .then(response => response.json())
    .catch(error => console.error('Error al actualizar tarifa:', error));
  }
}
