import { useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";

type Factura = {
  id: number;
  numero: string;
  fechaEmision: string;
  fechaVencimiento: string;
  valorNominal: number;
};

const TablaFacturas = () => {
  const [facturasCartera, setfacturasCartera] = useState([
    {
      id: 0,
      numero: "34234233",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 1,
      numero: "34234234",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 2,
      numero: "34234235",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 3,
      numero: "34234236",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 4,
      numero: "34234237",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 5,
      numero: "34234238",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 6,
      numero: "34234239",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 7,
      numero: "34234240",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 8,
      numero: "34234241",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 9,
      numero: "34234242",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 10,
      numero: "34234243",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 11,
      numero: "34234244",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 12,
      numero: "34234245",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 13,
      numero: "34234246",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
    {
      id: 14,
      numero: "34234247",
      fechaEmision: "2024-10-23",
      fechaVencimiento: "2025-10-23",
      valorNominal: 75000,
    },
  ]);
  const [loading2, setLoading2] = useState(false);

  const handleRefresh = () => {
    setLoading2(true);
    setTimeout(() => {
      setLoading2(false);
    }, 1000);
  };

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Facturas de la Cartera</span>
      <Button icon="pi pi-refresh" rounded raised onClick={handleRefresh} />
    </div>
  );
  const footer = `Hay en total ${
    facturasCartera ? facturasCartera.length : 0
  } facturas en esta cartera.`;

  const valorNominalBodyTemplate = (rowData: Factura) => {
    return (
      <span className="text-bold">
        {new Intl.NumberFormat("es-PE", {
          style: "currency",
          currency: "PEN",
        }).format(rowData.valorNominal)}
      </span>
    );
  };

  const lastColumnTemplate = (rowData: Factura) => {
    return (
        <Button type="button" icon='pi pi-angle-right' className="p-button-sm p-button-text" />
    );
  }

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
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
