import { Router, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EstadoCocherasComponent } from './pages/estado-cocheras/estado-cocheras.component';
import { HeaderComponent } from './components/header/header.component';
import { Component, inject } from '@angular/core';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { AuthService } from './services/auth.service';
import { PrecioAutoComponent } from './pages/precio-auto/precio-auto.component';
import { PrecioCamionetaComponent } from './pages/precio-camioneta/precio-camioneta.component';
import { PrecioMotoComponent } from './pages/precio-moto/precio-moto.component';

function guardaLogueado(){
  let auth = inject(AuthService);
  let router= inject(Router)

  if (auth.estaLogueado())
    return true;
  else{ 
router.navigate(['/login']);
return false;
}
}
export const routes: Routes = [
    {
        path: "login",
        component:LoginComponent
    },
    {
        path: "estado-cocheras",
        component:EstadoCocherasComponent,
        canActivate:[guardaLogueado]
    },
    {
        path: "header",
        component:HeaderComponent
    },
    {
        path: "reportes",
        component:ReportesComponent
    },
    {
        path:"",
        redirectTo: "login",
        pathMatch:"full"
    },

    {
        path:"precio-auto",
        component:PrecioAutoComponent

    },
    {
        path:"precio-moto",
        component:PrecioMotoComponent

    },
    {
        path:"precio-camioneta",
        component: PrecioCamionetaComponent

    },

];
