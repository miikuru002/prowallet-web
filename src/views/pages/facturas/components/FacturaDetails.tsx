import { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { IFactura } from "../../../../types/response";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Timeline } from "primereact/timeline";
import { getFacturaStatusData, getFacturaTimeline } from "../../../../utils";
import DescontarFacturaDialog from "./DescontarFacturaDialog";
import { EEstadoFactura } from "../../../../types/enums";
import { Tag } from "primereact/tag";

interface IProps {
  isVisibleRight: boolean;
  setIsVisibleRight: (isVisibleRight: boolean) => void;
  factura: IFactura | null;
}

const FacturaDetails: React.FC<IProps> = ({
  isVisibleRight,
  setIsVisibleRight,
  factura,
}) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <>
      <Sidebar
        visible={isVisibleRight}
        onHide={() => setIsVisibleRight(false)}
        position="right"
        className="w-full md:w-20rem lg:w-30rem"
      >
        <h2>Detalles de la factura</h2>
        <div className="card">
          <h1 style={{ fontWeight: "normal", textAlign: "center" }}>
            {factura?.numero}
          </h1>
          <Divider />
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Cliente:</span>
            <span>{factura?.cliente.razonSocial}</span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">RUC Cliente:</span>
            <span>{factura?.cliente.ruc}</span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Fecha de Emisión:</span>
            <span>{factura?.fechaEmision}</span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Fecha de Vencimiento:</span>
            <span>{factura?.fechaVencimiento}</span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Moneda:</span>
            <span>{factura?.moneda}</span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Valor Nominal:</span>
            <span>
              {factura?.valorNominal.toLocaleString(
                factura?.moneda == "PEN" ? "es-PE" : "en-US",
                {
                  style: "currency",
                  currency: factura?.moneda == "PEN" ? "PEN" : "USD",
                }
              )}
            </span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Estado:</span>
            <Tag
              value={factura?.estado}
              //@ts-expect-error idk why this is not working
              severity={getFacturaStatusData(factura?.estado).color}
              icon={getFacturaStatusData(factura?.estado).icon}
            />
          </div>
          <Divider />
          <div className="card" style={{ border: "none" }}>
            <Timeline
              value={getFacturaTimeline(factura as IFactura)}
              content={(item) => item.status}
              opposite={(item) => (
                <small className="text-color-secondary">{item.date}</small>
              )}
              marker={(item) => (
                <span className="flex w-2rem h-2rem align-items-center justify-content-center border-circle z-1 text-white shadow-1" style={{ backgroundColor: "var(--primary-color)" }}>
                  <i className={item.icon}></i>
                </span>
              )}
            />
          </div>
        </div>

        <div className="text-center">
          <Button
            label={
              factura?.estado === EEstadoFactura.PENDIENTE
                ? "Descontar"
                : "Descontado"
            }
            icon="pi pi-dollar"
            severity="success"
            disabled={factura?.estado !== EEstadoFactura.PENDIENTE}
            onClick={() => setDialogVisible(true)}
          />
        </div>
      </Sidebar>

      {/* DIALOG DESCONTAR FACTURA */}
      <DescontarFacturaDialog
        isVisible={dialogVisible}
        setVisible={setDialogVisible}
        factura={factura}
      />
    </>
  );
};

export default FacturaDetails;
