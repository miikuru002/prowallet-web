import { EMoneda, EPeriodo, ETipoTasa } from "./enums";

//CLIENTES
export interface IRegistrarClienteDto {
  razonSocial: string;
  ruc: string;
  direccion: string;
}

//CARTERAS
export interface ICrearCarteraDto {
  nombre: string;
  descripcion: string;
}

//FACTURAS
export interface IRegistrarFacturaForm {
  numero: string;
  fechaEmision: Date | null;
  fechaVencimiento: Date | null;
  valorNominal: number;
  moneda: EMoneda | null;
  clienteId: number | null;
}
export interface IRegistrarFacturaDto {
  numero: string;
  fechaEmision: string;
  fechaVencimiento: string;
  valorNominal: number;
  moneda: keyof typeof EMoneda | string;
}
export interface IRegistrarFacturaRequest {
  data: IRegistrarFacturaDto;
  clienteId: number;
}

export interface IDescontarFacturaDto {
  fechaDescuento: string;
  tasa: number;
  tipoTasa: ETipoTasa;
  periodoTasa: EPeriodo;
  periodoCapitalizacion: EPeriodo;
  facturaId: number;
}
export interface IDescontarFacturaRequest {
  data: IDescontarFacturaDto;
  facturaId: number;
}