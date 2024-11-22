import { EEstadoFactura, EMoneda, EPeriodo, ETipoTasa } from "./enums";

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
  descuento: IDescuentoFactura | null;
  fechaCreacion: string;
  fechaModificacion: string;
}
export interface IDescuentoFactura {
  id: number;
  fechaDescuento: string;
  tasa: number;
  tipoTasa: ETipoTasa;
  periodoTasa: EPeriodo;
  periodoCapitalizacion: EPeriodo | null;
  valorNeto: number;
  valorRecibido: number;
  valorEntregado: number;
  tcea: number;
  fechaCreacion: string;
  fechaModificacion: string;
  comisionesAplicadas: IComision[];
}

//COMISIONES
export interface IComision {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: "MONTO_FIJO" | "PORCENTAJE_SOBRE_VN";
  momento: "DESCUENTO" | "CANCELACION";
  valor: number;
  fechaCreacion: string;
  fechaModificacion: string;
}