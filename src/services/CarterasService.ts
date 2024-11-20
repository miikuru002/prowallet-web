import httpClient from "../config/httpClient";
import { ICrearCarteraDto } from "../types/request";
import { IApiResponse, ICartera } from "../types/response";

const CarterasService = {
  listarCarteras: async () => {
    const res = await httpClient.get<IApiResponse<ICartera[]>>(`/cartera/listar`);
    return res.data;
  },
  crearCartera: async (data: ICrearCarteraDto) => {
    const res = await httpClient.post<IApiResponse<ICartera>>(`/cartera/crear`, data);
    return res.data;
  }
};

export default CarterasService;