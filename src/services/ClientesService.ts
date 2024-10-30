import httpClient from "../config/httpClient";
import { IApiResponse, ICliente } from "../types/response";

const ClientesService = {
  listarClientes: async () => {
    const res = await httpClient.get<IApiResponse<ICliente[]>>(`/cliente/listar`);
    return res.data;
  },
};

export default ClientesService;