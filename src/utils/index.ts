import { DateTime } from "luxon";
import { EEstadoFactura, EPeriodo, ETipoTasa } from "../types/enums";
import { IComision, IDescuentoFactura, IFactura } from "../types/response";

export const getFacturaStatusData = (status?: EEstadoFactura) => {
  switch (status) {
    case EEstadoFactura.PENDIENTE:
      return {
        color: "warning",
        icon: "pi pi-clock",
      };
    case EEstadoFactura.DESCONTADA:
      return {
        color: "info",
        icon: "pi pi-dollar",
      }
    case EEstadoFactura.PAGADA:
      return {
        color: "success",
        icon: "pi pi-check",
      }
    default:
      return {
        color: "secondary",
      }
  }
};

export const getTipoComisionData = (tipo: string) => {
  switch (tipo) {
    case "MONTO_FIJO":
      return {
        color: "success",
        label: "Fijo",
      };
    case "PORCENTAJE_SOBRE_VN":
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
        icon: "pi pi-dollar",
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

export const calcularPlazoDescuento = (fechaDescuentoValue: Date | null, fechaEmisionValue: string) => {
  if (!fechaDescuentoValue) return 0;
  //se resta la fecha de descuento con la fecha de emisión de la factura
  const fechaEmisionFactura = DateTime.fromISO(fechaEmisionValue);
  const fechaDescuento = DateTime.fromJSDate(fechaDescuentoValue);
  return Math.floor(fechaDescuento.diff(fechaEmisionFactura, "days").days);
}

export const calcularComisiones = (comisiones: IComision[], valorNominal: number) => {
  return comisiones.reduce(
    (resultado, comision) => {
      const monto =
        comision.tipo === "MONTO_FIJO"
          ? comision.valor
          : (comision.valor / 100) * valorNominal; //se convierte porcentaje en monto

      if (comision.momento === "DESCUENTO") {
        if (comision.tipo === "MONTO_FIJO") {
          resultado.descuento.fijos += monto;
        } else {
          resultado.descuento.porcentajes += monto;
        }
      } else if (comision.momento === "CANCELACION") {
        if (comision.tipo === "MONTO_FIJO") {
          resultado.cancelacion.fijos += monto;
        } else {
          resultado.cancelacion.porcentajes += monto;
        }
      }

      return resultado;
    },
    {
      descuento: { fijos: 0, porcentajes: 0 }, //valores iniciales para descuento
      cancelacion: { fijos: 0, porcentajes: 0 }, //valores iniciales para cancelación
    }
  );
}; 

export const calcularTasaDescontada = (tasaInteres: number) => {
  const tasaDecimal = tasaInteres / 100;
  const tasaDescontada = (tasaDecimal / (1 + tasaDecimal)) * 100;
  return `${tasaDescontada.toFixed(7)}%`;
}

export const tasaInteresTexto = (descuento: IDescuentoFactura | null) => {
  if (!descuento) return "";
  let tipoTasa = descuento.tipoTasa === ETipoTasa.EFECTIVA ? "T.E." : "T.N.";
  let periodoCapitalizacion = "";

  switch (descuento.periodoTasa) {
    case EPeriodo.MENSUAL:
      tipoTasa = tipoTasa + "M";
      break;
    case EPeriodo.BIMESTRAL:
      tipoTasa = tipoTasa + "B";
      break;
    case EPeriodo.TRIMESTRAL:
      tipoTasa = tipoTasa + "T";
      break;
    case EPeriodo.SEMESTRAL:
      tipoTasa = tipoTasa + "S";
      break;
    case EPeriodo.ANUAL:
      tipoTasa = tipoTasa + "A";
      break;
    default:
      return "";
  }

  if (descuento.periodoCapitalizacion) {
    switch (descuento.periodoCapitalizacion) {
      case EPeriodo.MENSUAL:
        periodoCapitalizacion = " (capitalizable mensualmente)";
        break;
      case EPeriodo.BIMESTRAL:
        periodoCapitalizacion = " (capitalizable bimestralmente)";
        break;
      case EPeriodo.TRIMESTRAL:
        periodoCapitalizacion = " (capitalizable trimestralmente)";
        break;
      case EPeriodo.SEMESTRAL:
        periodoCapitalizacion = " (capitalizable semestralmente)";
        break;
      case EPeriodo.ANUAL:
        periodoCapitalizacion = " (capitalizable anualmente)";
        break;
      default:
        return "";
    }
  }

  return `${tipoTasa}${periodoCapitalizacion}`;
}