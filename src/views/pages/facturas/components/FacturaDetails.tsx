import { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { IFactura } from "../../../../types/response";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Timeline } from "primereact/timeline";
import { getFacturaStatusData, getFacturaTimeline } from "../../../../utils";
import DescontarFacturaDialog from "./DescontarFacturaDialog";
import { EEstadoFactura } from "../../../../types/enums";
import { Tag } from "primereact/tag";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import FacturasService from "../../../../services/FacturasService";

const FacturaDetails = () => {
  const [open, setOpen] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const { facturaId } = useParams();
  const navigate = useNavigate();

  const handleCloseEditor = (): void => {
    setOpen(false);
    navigate(`/facturas`);
  };

  //queries
  const { data, isLoading } = useQuery({
    queryKey: ["facturaDetalle"],
    queryFn: () => FacturasService.getDetalleById(Number(facturaId)),
  });

  useEffect(() => {
    console.log("aaa")
  }, [])

  return (
    <>
      <Sidebar
        visible={open}
        onHide={handleCloseEditor}
        position="right"
        className="w-full md:w-20rem lg:w-30rem"
      >
        <h2>{isLoading ? "Cargando detalles...": "Detalles de la factura"}</h2>
        <div className="card">
          <h1 style={{ fontWeight: "normal", textAlign: "center" }}>
            {isLoading? "--" : data?.result.numero}
          </h1>
          <Divider />
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Cliente:</span>
            <span>{isLoading ? "--" : data?.result.cliente.razonSocial}</span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">RUC Cliente:</span>
            <span>{isLoading ? "--" : data?.result.cliente.ruc}</span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Fecha de Emisión:</span>
            <span>{isLoading ? "--" : data?.result.fechaEmision}</span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Fecha de Vencimiento:</span>
            <span>{isLoading ? "--" : data?.result.fechaVencimiento}</span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Moneda:</span>
            <span>{isLoading ? "--" : data?.result.moneda}</span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Valor Nominal:</span>
            <span>
              {isLoading? "--" : data?.result.valorNominal.toLocaleString(
                data?.result.moneda == "PEN" ? "es-PE" : "en-US",
                {
                  style: "currency",
                  currency: data?.result.moneda == "PEN" ? "PEN" : "USD",
                }
              )}
            </span>
          </div>
          <div className="flex justify-content-between mb-3">
            <span className="font-bold">Estado:</span>
            <Tag
              value={isLoading ? "--" : data?.result.estado}
              //@ts-expect-error idk why this is not working
              severity={getFacturaStatusData(data?.result.estado).color}
              icon={getFacturaStatusData(data?.result.estado).icon}
            />
          </div>
          <Divider />
          <div className="card" style={{ border: "none" }}>
            <Timeline
              value={getFacturaTimeline(data?.result)}
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
              data?.result.estado === EEstadoFactura.PENDIENTE
                ? "Descontar"
                : "Descontado"
            }
            icon="pi pi-dollar"
            disabled={data?.result.estado !== EEstadoFactura.PENDIENTE}
            onClick={() => setDialogVisible(true)}
          />
        </div>
      </Sidebar>

      {/* DIALOG DESCONTAR FACTURA */}
      <DescontarFacturaDialog
        isVisible={dialogVisible}
        setVisible={setDialogVisible}
        factura={data?.result as IFactura}
      />
    </>
  );
};

export default FacturaDetails;
