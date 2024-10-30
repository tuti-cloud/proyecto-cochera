import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getToken(): string{
    return localStorage.getItem('token')??'';
  }

  estaLogueado(): boolean{
    if(this.getToken())
      return true;
    else
    return false;
  }
Login(datosLogin: Login){
  return fetch("http://localhost:4000/login",{
    method: "POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify(datosLogin)
})
.then(res =>{ return res.json().then(resJson =>{
    if(resJson.status=="ok"){
resJson.token= localStorage.setItem('token', resJson.token);
return true;
      //login correcto
    }else{//login incorrecto
      return false;
    }

  })
  
})
}
}


