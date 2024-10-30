import { useState } from "react";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import AgregarFactura from "../../../components/Facturas/AgregarFactura";

type Factura = {
  id: number;
  numero: string;
  fechaEmision: string;
  fechaVencimiento: string;
  valorNominal: number;
  moneda: string;
  estado: string;
  cliente: {
    id: number;
    razonSocial: string;
    ruc: string;
    direccion: string;
    fechaCreacion: string;
    fechaModificacion: string;
  };
  fechaCreacion: string;
  fechaModificacion: string;
};

const TablaFacturas = () => {
  const [facturasCartera, setfacturasCartera] = useState([
    {
      id: 1,
      numero: "F001-000001",
      fechaEmision: "2024-10-01",
      fechaVencimiento: "2024-10-15",
      valorNominal: 1500.0,
      moneda: "USD",
      estado: "PENDIENTE",
      cliente: {
        id: 1,
        razonSocial: "Empresa ABC",
        ruc: "12345678901",
        direccion: "Av. Principal 123",
        fechaCreacion: "2024-10-01T00:00:00.000Z",
        fechaModificacion: "2024-10-01T00:00:00.000Z",
      },
      fechaCreacion: "2024-10-01T00:00:00.000Z",
      fechaModificacion: "2024-10-01T00:00:00.000Z",
    },
    {
      id: 2,
      numero: "F001-000002",
      fechaEmision: "2024-10-05",
      fechaVencimiento: "2024-10-20",
      valorNominal: 2500.0,
      moneda: "USD",
      estado: "PENDIENTE",
      cliente: {
        id: 2,
        razonSocial: "Empresa XYZ",
        ruc: "98765432109",
        direccion: "Calle Secundaria 456",
        fechaCreacion: "2024-10-05T00:00:00.000Z",
        fechaModificacion: "2024-10-05T00:00:00.000Z",
      },
      fechaCreacion: "2024-10-05T00:00:00.000Z",
      fechaModificacion: "2024-10-05T00:00:00.000Z",
    },
    {
      id: 3,
      numero: "F001-000003",
      fechaEmision: "2024-10-10",
      fechaVencimiento: "2024-10-25",
      valorNominal: 3500.0,
      moneda: "USD",
      estado: "PENDIENTE",
      cliente: {
        id: 3,
        razonSocial: "Empresa 123",
        ruc: "45678901234",
        direccion: "Jr. Terciaria 789",
        fechaCreacion: "2024-10-10T00:00:00.000Z",
        fechaModificacion: "2024-10-10T00:00:00.000Z",
      },
      fechaCreacion: "2024-10-10T00:00:00.000Z",
      fechaModificacion: "2024-10-10T00:00:00.000Z",
    },
    {
      id: 4,
      numero: "F001-000004",
      fechaEmision: "2024-10-15",
      fechaVencimiento: "2024-10-30",
      valorNominal: 4500.0,
      moneda: "USD",
      estado: "PENDIENTE",
      cliente: {
        id: 4,
        razonSocial: "Empresa 456",
        ruc: "78901234567",
        direccion: "Av. Principal 123",
        fechaCreacion: "2024-10-15T00:00:00.000Z",
        fechaModificacion: "2024-10-15T00:00:00.000Z",
      },
      fechaCreacion: "2024-10-15T00:00:00.000Z",
      fechaModificacion: "2024-10-15T00:00:00.000Z",
    },
    {
      id: 5,
      numero: "F001-000005",
      fechaEmision: "2024-10-20",
      fechaVencimiento: "2024-11-05",
      valorNominal: 5500.0,
      moneda: "PEN",
      estado: "PENDIENTE",
      cliente: {
        id: 5,
        razonSocial: "Empresa 789",
        ruc: "01234567890",
        direccion: "Calle Secundaria 456",
        fechaCreacion: "2024-10-20T00:00:00.000Z",
        fechaModificacion: "2024-10-20T00:00:00.000Z",
      },
      fechaCreacion: "2024-10-20T00:00:00.000Z",
      fechaModificacion: "2024-10-20T00:00:00.000Z",
    },
    {
      id: 6,
      numero: "F001-000006",
      fechaEmision: "2024-10-25",
      fechaVencimiento: "2024-11-10",
      valorNominal: 6500.0,
      moneda: "PEN",
      estado: "PENDIENTE",
      cliente: {
        id: 6,
        razonSocial: "Empresa 000",
        ruc: "12345678901",
        direccion: "Jr. Terciaria 789",
        fechaCreacion: "2024-10-25T00:00:00.000Z",
        fechaModificacion: "2024-10-25T00:00:00.000Z",
      },
      fechaCreacion: "2024-10-25T00:00:00.000Z",
      fechaModificacion: "2024-10-25T00:00:00.000Z",
    }
  ]);
  const [loading2, setLoading2] = useState(false);
  const [displayFacturaDialog, setDisplayFacturaDialog] = useState(false);

  const handleRefresh = () => {
    setLoading2(true);
    setTimeout(() => {
      setLoading2(false);
    }, 1000);
  };

  const header = (
    // <div className="flex flex-wrap align-items-center justify-content-between gap-2">
    //   <span className="text-xl text-900 font-bold">Facturas de la Cartera</span>
    //   <Button icon="pi pi-refresh" rounded raised onClick={handleRefresh} />
    // </div>
    <div className="flex justify-content-between">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          placeholder="Keyword Search"
        />
      </span>
      <Button
        type="button"
        icon="pi pi-plus"
        label="Factura"
        onClick={() => setDisplayFacturaDialog(true)}
      />
    </div>
  );

  const footer = `Hay en total ${
    facturasCartera ? facturasCartera.length : 0
  } facturas en esta cartera.`;

  const valorNominalBodyTemplate = (rowData: Factura) => {
    const country = rowData.moneda == "PEN" ? "es-PE" : "en-US";
    return (
      <span className="font-bold">
        {rowData.valorNominal.toLocaleString(country, {
          style: "currency",
          currency: rowData.moneda == "PEN" ? "PEN" : "USD",
        })}
      </span>
    );
  };

  const lastColumnTemplate = (rowData: Factura) => {
    return (
      <Button
        type="button"
        icon="pi pi-angle-right"
        className="p-button-sm p-button-text"
      />
    );
  };

  const statusOrderBodyTemplate = (rowData: Factura) => {
    const state = rowData.estado;

    return <Badge value={state} />;
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Dialog
            header="Registrar Factura"
            visible={displayFacturaDialog}
            style={{ width: "60vw" }}
            modal
            onHide={() => setDisplayFacturaDialog(false)}
          >
            <AgregarFactura />
          </Dialog>
          <DataTable
            paginator
            rows={10}
            header={header}
            footer={footer}
            value={facturasCartera}
            loading={loading2}
            className="mt-3"
          >
            <Column
              field="id"
              header="Id"
              style={{ flexGrow: 1, flexBasis: "100px" }}
              alignFrozen="left"
            ></Column>
            <Column
              field="numero"
              header="Número"
              style={{ flexGrow: 1, flexBasis: "160px" }}
              className="font-bold"
            ></Column>
            <Column
              field="fechaEmision"
              header="Fecha de Emisión"
              style={{ flexGrow: 1, flexBasis: "200px" }}
            ></Column>
            <Column
              field="fechaVencimiento"
              header="Fecha de Vencimiento"
              style={{ flexGrow: 1, flexBasis: "200px" }}
            ></Column>
            <Column
              field="valorNominal"
              header="Valor Nominal"
              style={{ flexGrow: 1, flexBasis: "200px" }}
              body={valorNominalBodyTemplate}
            ></Column>
            <Column
              field="estado"
              header="Estado"
              body={statusOrderBodyTemplate}
            ></Column>
            <Column
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
              body={lastColumnTemplate}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default TablaFacturas;
