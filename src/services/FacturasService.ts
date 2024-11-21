import httpClient from "../config/httpClient";
import { IDescontarFacturaRequest, IRegistrarFacturaRequest } from "../types/request";
import { IApiResponse, IFactura } from "../types/response";

const FacturasService = {
  listarFacturas: async (clienteId: number) => {
    const res = await httpClient.get<IApiResponse<IFactura[]>>(`/factura/listar/${clienteId}`);
    return res.data;
  },

	registrarFactura: async (request: IRegistrarFacturaRequest) => {
		const res = await httpClient.post<IApiResponse>(`/factura/registrar/${request.clienteId}`, request.data);
		return res.data;
  },

  descontarFactura: async (request: IDescontarFacturaRequest) =>{
    const res = await httpClient.post<IApiResponse>(`/factura/descontar/${request.facturaId}`, request.data);
    return res.data;
  },

  darDeAltaFactura: async (facturaId: number) => {
    const res = await httpClient.patch<IApiResponse>(`/factura/alta/${facturaId}`);
    return res.data;
  },
};

export default FacturasService;