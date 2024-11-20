import { DateTime } from "luxon";
import { EEstadoFactura } from "../types/enums";
import { IFactura } from "../types/response";

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
        label: "Porc.",
      };
    default:
      return {
        color: "secondary",
        label: "--",
      };
  }
};


interface ITimelineItem {
  status: string;
  date?: string;
  icon: string;
}

export const getFacturaTimeline = (factura?: IFactura) => {
  if (!factura) return [];
  const timeline: Array<ITimelineItem> = [];

  //1) factura emitida
  timeline.push({
    status: "Fecha de emisión",
    date: factura.fechaEmision,
    icon: "pi pi-calendar",
  });

  //2) estado de la factura
  switch (factura.estado) {
    case EEstadoFactura.DESCONTADA:
      timeline.push({
        status: "Factura descontada",
        icon: "pi pi-money-bill",
      });
      break;
    case EEstadoFactura.PAGADA:
      timeline.push({
        status: "Factura pagada",
        icon: "pi pi-check",
      });
      break;
    case EEstadoFactura.VENCIDA:
      timeline.push({
        status: "Factura vencida",
        icon: "pi pi-exclamation-circle",
      });
      break;
    default:
      timeline.push({
        status: "Factura pendiente",
        date: DateTime.now().toFormat("yyyy-MM-dd"),
        icon: "pi pi-clock",
      });
      break;
  }

  //3) fecha de vencimiento
  if (factura.fechaVencimiento) {
    timeline.push({
      status: "Fecha de vencimiento",
      date: factura.fechaVencimiento,
      icon: "pi pi-calendar-times",
    });
  }

  return timeline;
};
