/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import ClientesService from "../../../services/ClientesService";
import FacturasService from "../../../services/FacturasService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import RegisterFacturaDialog from "./components/RegisterFacturaDialog";
import { ICliente, IFactura } from "../../../types/response";
import {
	calcularComisiones,
	getFacturaStatusData,
	getTipoComisionData,
} from "../../../utils";
import { Tag } from "primereact/tag";
import FacturaDetails from "./components/FacturaDetails";
import { EEstadoFactura, ETipoTasa } from "../../../types/enums";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import {
	calcularPlazoDescuento,
	calcularTasaDescontada,
	tasaInteresTexto,
} from "../../../utils/index";
import { DateTime } from "luxon";

const TablaFacturas = () => {
	const [isRegistrarFacturaVisible, setIsRegistrarFacturaVisible] = useState(false);
	const [isVisibleRight, setIsVisibleRight] = useState(false);
	const [selectedFactura, setSelectedFactura] = useState<IFactura | null>(null);
	const [selectedCliente, setSelectedCliente] = useState<ICliente | null>(null);
	const [globalFilter, setGlobalFilter] = useState("");
	const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | any[]>({});
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

	//mutations
	const darDeBajaFactura = useMutation({
		mutationFn: FacturasService.darDeBajaFactura,
		onSuccess: () => {
			toast.current?.show({
				severity: "success",
				summary: "Factura dada de baja",
			});
			facturasQuery.refetch();
		},
		onError: () => {
			toast.current?.show({
				severity: "error",
				summary: "Error al dar de baja la factura",
			});
		},
	});

	const confirmDelete = (data: IFactura) => {
		confirmDialog({
			message: `¿Está seguro que desea dar de baja la factura ${data.numero}?`,
			header: "Confirmación",
			icon: "pi pi-exclamation-triangle",
			defaultFocus: "accept",
			acceptLabel: "Sí",
			acceptClassName: "p-button-danger",
			accept: () => darDeBajaFactura.mutate(data.id),
		});
	};

	const exportCSV = () => {
		dt.current?.exportCSV();
	};

	useEffect(() => {
		if (selectedCliente) {
			facturasQuery.refetch();
		}
	}, [selectedCliente]);

	//para refescar la factura seleccionada que se pasa al componente FacturaDetails
	useEffect(() => {
		if (selectedFactura) {
			setSelectedFactura(
				facturasQuery.data?.result.find((factura) => factura.id === selectedFactura.id) ??
					null
			);
		}
	}, [facturasQuery.data]);

	//detalle descuentos
	const rowExpansionTemplate = (rowData: IFactura) => {
		return (
			<div className="p-3">
				<div className="grid">
					<div className="col-6">
						<div className="card">
							<h6>Información del descuento</h6>
							<p>
								<i className="pi pi-calendar mr-2"></i>
								Fecha de descuento:{" "}
								<code>
									{rowData.descuento?.fechaDescuento} -{" "}
									{calcularPlazoDescuento(
										DateTime.fromISO(rowData.descuento?.fechaDescuento ?? "").toJSDate(),
										rowData.fechaEmision
									)}{" "}
									días
								</code>
							</p>
							<p>
								<i className="pi pi-percentage mr-2"></i>
								Tasa:{" "}
								<code>
									{rowData.descuento?.tasa.toFixed(7)}% -{" "}
									{tasaInteresTexto(rowData.descuento)}
								</code>
							</p>
							{rowData.descuento?.tipoTasa === ETipoTasa.EFECTIVA && (
								<p>
									<i className="pi pi-percentage mr-2"></i>
									Tasa descontada:{" "}
									<code>{calcularTasaDescontada(rowData.descuento?.tasa ?? 0)}</code>
								</p>
							)}
							<p>
								<i className="pi pi-money-bill mr-2"></i>
								Valor neto (sin comisiones):{" "}
								<code>{rowData.descuento?.valorNeto.toFixed(2)}</code>
							</p>
							<p>
								<i className="pi pi-angle-double-right mr-2"></i>
								Valor recibido (con comisiones al momento del descuento):{" "}
								<code>{rowData.descuento?.valorRecibido.toFixed(2)}</code>
							</p>
							<p>
								<i className="pi pi-angle-double-left mr-2"></i>
								Valor entregado (con comisiones al momento de cancelar):{" "}
								<code>{rowData.descuento?.valorEntregado.toFixed(2)}</code>
							</p>

							<h6>Cálculo de comisiones al momento del descuento</h6>
							<ul>
								<li>
									Fijas:{" "}
									<code>
										{calcularComisiones(
											rowData.descuento?.comisionesAplicadas ?? [],
											rowData.valorNominal
										).descuento.fijos.toLocaleString("en-US", {
											style: "currency",
											currency: "USD",
										})}
									</code>
								</li>
								<li>
									Porcentuales:{" "}
									<code>
										{calcularComisiones(
											rowData.descuento?.comisionesAplicadas ?? [],
											rowData.valorNominal
										).descuento.porcentajes.toLocaleString("en-US", {
											style: "currency",
											currency: "USD",
										})}
									</code>
								</li>
							</ul>

							<h6>Cálculo de comisiones al momento de cancelar</h6>

							<ul>
								<li>
									Fijas:{" "}
									<code>
										{calcularComisiones(
											rowData.descuento?.comisionesAplicadas ?? [],
											rowData.valorNominal
										).cancelacion.fijos.toLocaleString("en-US", {
											style: "currency",
											currency: "USD",
										})}
									</code>
								</li>
								<li>
									Porcentuales:{" "}
									<code>
										{calcularComisiones(
											rowData.descuento?.comisionesAplicadas ?? [],
											rowData.valorNominal
										).cancelacion.porcentajes.toLocaleString("en-US", {
											style: "currency",
											currency: "USD",
										})}
									</code>
								</li>
							</ul>

							<h6>Tasa de Costo Efectiva Anual (TCEA)</h6>
							<div className="text-center text-xl">
								<p>
									<code>
										<b>{rowData.descuento?.tcea.toFixed(7)}%</b>
									</code>
								</p>
							</div>
						</div>
					</div>

					<div className="col-6">
						<div className="card">
							<h6>Comisiones aplicadas</h6>
							<DataTable
								value={rowData.descuento?.comisionesAplicadas}
								size="small"
								removableSort
								showGridlines
							>
								<Column field="nombre" header="Nombre" sortable />
								<Column field="descripcion" header="Descripción" />
								<Column
									header="Tipo"
									body={(data) => (
										<Tag
											//@ts-ignore idk why this is not working
											severity={getTipoComisionData(data.tipo).color}
											value={getTipoComisionData(data.tipo).label}
										/>
									)}
								/>
								<Column field="momento" header="Momento" sortable />
								<Column
									field="valor"
									header="Valor"
									body={(data) => {
										switch (data.tipo) {
											case "PORCENTAJE_SOBRE_VN":
												return data.valor.toFixed(2) + "%";
											case "MONTO_FIJO":
												return data.valor.toLocaleString("en-US", {
													style: "currency",
													currency: "USD",
												});
											default:
												return data.valor;
										}
									}}
								/>
							</DataTable>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="grid">
			<div className="col-12">
				<div className="card">
					<h5>Facturas</h5>
					<ConfirmDialog />
					<Toast ref={toast} />
					<Toolbar
						className="mb-4"
						start={
							<div className="my-2">
								<Button
									label="Registrar Factura"
									icon="pi pi-plus"
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
									clientesQuery.isLoading ? "Cargando..." : "Seleccione un cliente"
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
						loading={facturasQuery.isRefetching || facturasQuery.isLoading}
						expandedRows={expandedRows}
						onRowToggle={(e) => setExpandedRows(e.data)}
						rowExpansionTemplate={rowExpansionTemplate}
						dataKey="id"
						header={
							<div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
								<h6 className="m-0">
									{selectedCliente?.razonSocial
										? `Facturas de ${selectedCliente.razonSocial}`
										: "Seleccione un cliente"}
								</h6>
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
						removableSort
						className="datatable-responsive"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
						currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} facturas"
						globalFilter={globalFilter}
						emptyMessage={
							!selectedCliente ? "Seleccione un cliente" : "No se encontraron facturas"
						}
					>
						<Column
							header="Descuentos"
							bodyStyle={{ textAlign: "center", overflow: "visible" }}
							expander={(rowData) => rowData.estado !== EEstadoFactura.PENDIENTE}
							style={{ width: "5rem" }}
						/>
						<Column field="numero" header="Número" sortable />
						<Column field="fechaEmision" header="Fecha de Emisión" sortable />
						<Column field="fechaVencimiento" header="Fecha de Vencimiento" sortable />
						<Column
							field="valorNominal"
							header="Valor Nominal"
							sortable
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
							sortable
							body={(rowData: IFactura) => (
								<Tag
									value={rowData.estado}
									//@ts-ignore idk why this is not working
									severity={getFacturaStatusData(rowData.estado).color}
									icon={getFacturaStatusData(rowData.estado).icon}
								/>
							)}
						/>
						<Column
							body={(rowData: IFactura) => {
								return (
									<>
										<Button
											icon="pi pi-eye"
											rounded
											className="mr-2"
											onClick={() => {
												setSelectedFactura(rowData);
												setIsVisibleRight(true);
											}}
										/>
										<Button
											icon="pi pi-trash"
											rounded
											outlined
											severity="danger"
											onClick={() => confirmDelete(rowData)}
										/>
									</>
								);
							}}
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
