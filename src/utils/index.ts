import { EEstadoFactura } from "../types/enums";

export const getFacturaStatusColor = (status: EEstadoFactura) => {
  switch (status) {
    case EEstadoFactura.PENDIENTE:
      return "warning";
    case EEstadoFactura.DESCONTADA:
      return "info";
    case EEstadoFactura.PAGADA:
      return "success";
    default:
      return "secondary";
  }
};

export const getTipoComisionData = (tipo: string) => {
  switch (tipo) {
    case "MONTO_FIJO":
      return {
        color: "success",
        label: "Fijo",
      };
    case "PORCENTAJE_SOBRE_VN ":
      return {
        color: "info",
        label: "Porc."
      };
    default:
      return {
        color: "secondary",
        label: "--"
      };
  }
};
