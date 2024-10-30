export interface estacionamiento{
    id:number,
    patente: string,
    horaInegreso: string,
    horaEgreso: string|null,
    costo:number|null
    IdUsuarioIngreso:string;
    iDUsuarioEgreso:string|null
    iDcochera: number;
    eliminado: null;
}