/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import ClientesService from "../../../services/ClientesService";
import FacturasService from "../../../services/FacturasService";
import { useQuery } from "@tanstack/react-query";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import RegisterFacturaDialog from "./components/RegisterFacturaDialog";
import FacturaDetails from "./components/FacturaDetails";
import { ICliente, IFactura } from "../../../types/response";

const TablaFacturas = () => {
  const [isRegistrarFacturaVisible, setIsRegistrarFacturaVisible] =
    useState(false);
  const [isVisibleRight, setIsVisibleRight] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<IFactura | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<ICliente | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any>>(null);

  //queries
  const clientesQuery = useQuery({
    queryKey: ["clientes"],
    queryFn: () => ClientesService.listarClientes(),
  });

  const facturasQuery = useQuery({
    queryKey: ["facturas"],
    queryFn: () => FacturasService.listarFacturas(selectedCliente?.id ?? 0),
    enabled: (selectedCliente?.id ?? 0) > 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  useEffect(() => {
    if (selectedCliente) {
      facturasQuery.refetch();
    }
  }, [selectedCliente]);

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Facturas</h5>
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            start={
              <div className="my-2">
                <Button
                  label="Registrar Factura"
                  icon="pi pi-plus"
                  severity="success"
                  className=" mr-2"
                  onClick={() => setIsRegistrarFacturaVisible(true)}
                />
              </div>
            }
            center={
              <Dropdown
                id="clienteId"
                name="clienteId"
                optionLabel="razonSocial"
                placeholder={
                  clientesQuery.isLoading
                    ? "Cargando..."
                    : "Seleccione un cliente"
                }
                required
                filter
                showClear
                showFilterClear
                value={selectedCliente}
                loading={clientesQuery.isLoading}
                options={clientesQuery.data?.result}
                onChange={(e) => {
                  setSelectedCliente(e.value);
                }}
              />
            }
            end={
              <Button
                label="Exportar"
                icon="pi pi-upload"
                severity="help"
                onClick={exportCSV}
              />
            }
          />

          <DataTable
            ref={dt}
            value={!selectedCliente ? [] : facturasQuery.data?.result}
            loading={facturasQuery.isRefetching}
            dataKey="id"
            header={
              <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 className="m-0">
                  {selectedCliente?.razonSocial
                    ? `Facturas de ${selectedCliente.razonSocial}`
                    : "Seleccione un cliente"}
                </h5>
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                  <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText
                      type="search"
                      placeholder="Buscar..."
                      onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    />
                  </IconField>
                </span>
              </div>
            }
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} facturas"
            globalFilter={globalFilter}
            emptyMessage={
              !selectedCliente
                ? "Seleccione un cliente"
                : "No se encontraron facturas"
            }
          >
            <Column field="id" header="Id" alignFrozen="left" />
            <Column field="numero" header="Número" />
            <Column field="fechaEmision" header="Fecha de Emisión" />
            <Column field="fechaVencimiento" header="Fecha de Vencimiento" />
            <Column
              field="valorNominal"
              header="Valor Nominal"
              body={(rowData: IFactura) => {
                const country = rowData.moneda == "PEN" ? "es-PE" : "en-US";
                return (
                  <span>
                    {rowData.valorNominal.toLocaleString(country, {
                      style: "currency",
                      currency: rowData.moneda == "PEN" ? "PEN" : "USD",
                    })}
                  </span>
                );
              }}
            />
            <Column
              field="estado"
              header="Estado"
              body={(rowData: IFactura) => <Badge value={rowData.estado} />}
            />
            {/* TODO */}
            <Column
              header="Acciones"
              body={(rowData: IFactura) => {
                return (
                  <>
                    <Button
                      icon="pi pi-pencil"
                      rounded
                      severity="success"
                      className="mr-2"
                    />
                    <Button
                      icon="pi pi-eye"
                      rounded
                      severity="success"
                      className="mr-2"
                      onClick={() => {
                        setSelectedFactura(rowData);
                        setIsVisibleRight(true);
                      }}
                    />
                  </>
                );
              }}
              headerStyle={{ minWidth: "10rem" }}
            />
          </DataTable>

          <RegisterFacturaDialog
            isVisible={isRegistrarFacturaVisible}
            setVisible={setIsRegistrarFacturaVisible}
          />
          <FacturaDetails
            isVisibleRight={isVisibleRight}
            setIsVisibleRight={setIsVisibleRight}
            factura={selectedFactura}
          />
        </div>
      </div>
    </div>
  );
};

export default TablaFacturas;
