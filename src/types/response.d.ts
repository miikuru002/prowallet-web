import { EEstadoFactura, EMoneda } from "./enums";

//API
export interface IApiResponse<T = null> {
	message: string;
	result: T;
}

export interface IProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: string[];
}

//CLIENTES
export interface ICliente {
  id: number;
  razonSocial: string;
  ruc: string;
  direccion: string;
  fechaCreacion: string;
  fechaModificacion: string;
}

//CARTERAS
export interface ICartera {
  id: number;
  nombre: string;
  descripcion: string;
  fechaCreacion: string;
  fechaModificacion: string;
}

//FACTURAS
export interface IFactura {
  id: number;
  numero: string;
  fechaEmision: string;
  fechaVencimiento: string;
  valorNominal: number;
  moneda: EMoneda;
  estado: EEstadoFactura;
  cliente: ICliente;
  fechaCreacion: string;
  fechaModificacion: string;
}