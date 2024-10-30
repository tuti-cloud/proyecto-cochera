import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { estacionamiento } from '../interfaces/estacionamiento';

@Injectable({
  providedIn: 'root'
})
export class EstacionamientosService {
  auth= inject(AuthService);
  estacionamientos():Promise<estacionamiento[]>{
    return fetch('http://localhost:4000/estacionamientos',{
      method: 'GET',
      headers:{
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
      },
    }).then(r => r.json());
  }
  BuscarEstacionamientoActivo(cocheraId: number){
    return this.estacionamientos().then(estacionamientos=> {
      let buscado = null;
      for(let estacionamiento of estacionamientos) {
        if(estacionamiento.iDcochera===cocheraId &&
          estacionamiento.horaEgreso===null){
            buscado=estacionamiento;
          }
        }
        return buscado;
    });
  }
  estacionarAuto(patenteAuto:string, idCochera:number){
    
    return fetch('localhost:4000/estacionamientos/abrir',{
      method: 'POST',
      headers:{
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
        "content-type": "application/json"
      },
      body: JSON.stringify({
          patente: patenteAuto,
          idCochera: idCochera
      })
    }).then(r => r.json());
  }
}
