import httpClient from "../config/httpClient";
import { IRegistrarClienteRequest } from "../types/request";
import { IApiResponse, ICliente } from "../types/response";

const ClientesService = {
  listarClientes: async () => {
    const res = await httpClient.get<IApiResponse<ICliente[]>>(`/cliente/listar`);
    return res.data;
  },
  listarClientesPorCarteraId: async (carteraId: number) => {
    const res = await httpClient.get<IApiResponse<ICliente[]>>(`/cliente/listar/${carteraId}`);
    return res.data;
  },
  registrarCliente: async (request: IRegistrarClienteRequest) => {
    const res = await httpClient.post<IApiResponse>(`/cliente/registrar/${request.carteraId}`, request.data);
    return res.data;
  }
};

export default ClientesService;