/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ClientesService from "../../../services/ClientesService";
import { ICartera } from "../../../types/response";
import CarterasService from "../../../services/CarterasService";
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import RegisterClienteDialog from "./components/RegisterClienteDialog";
import CreateCarteraDialog from "./components/CreateCarteraDialog";
import { Toolbar } from "primereact/toolbar";
import { Sidebar } from "primereact/sidebar";

const Cartera = () => {
	const [globalFilterValue, setGlobalFilterValue] = useState("");
	const [filteredValue, setFilteredValue] = useState<ICartera[] | null>(null);
	const [sortKey, setSortKey] = useState<string | null>(null);
	const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
	const [sortField, setSortField] = useState<string>("");
	const [selectedCarteraItem, setSelectedCarteraItem] = useState<ICartera | null>(null);
	const [createCarteraDialogVisible, setCreateCarteraDialogVisible] = useState(false);
	const [registrarClienteVisible, setRegistrarClienteVisible] = useState(false);
	const [visibleRight, setVisibleRight] = useState(false);
	const toast = useRef<Toast>(null);

	const queryClient = useQueryClient();

	const sortOptions = [
		{ label: "Nombre A-Z", value: "nombre" },
		{ label: "Nombre Z-A", value: "!nombre" },
	];

	//queries
	const carterasQuery = useQuery({
		queryKey: ["carteras"],
		queryFn: () => CarterasService.listarCarteras(),
	});
	const clientesQuery = useQuery({
		queryKey: ["clientes"],
		queryFn: () =>
			ClientesService.listarClientesPorCarteraId(selectedCarteraItem?.id ?? 0),
		enabled: (selectedCarteraItem?.id ?? 0) > 0,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (selectedCarteraItem) {
			clientesQuery.refetch();
		}
	}, [selectedCarteraItem]);

	const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setGlobalFilterValue(value);
		if (value.length === 0) {
			setFilteredValue(null);
		} else {
			const filtered = carterasQuery.data?.result.filter((item) => {
				const nombreLowercase = item.nombre.toLowerCase();
				const searchValueLowercase = value.toLowerCase();
				return nombreLowercase.includes(searchValueLowercase);
			});
			setFilteredValue(filtered || null);
		}
	};

	const onSortChange = (event: DropdownChangeEvent) => {
		const value = event.value;
		if (value.indexOf("!") === 0) {
			setSortOrder(-1);
			setSortField(value.substring(1));
			setSortKey(value);
		} else {
			setSortOrder(1);
			setSortField(value);
			setSortKey(value);
		}
	};

	const itemTemplate = (item: ICartera) => {
		return (
			<div className="col-12">
				<div className="flex flex-column md:flex-row align-items-center p-3 w-full">
					<div className="flex-1 flex flex-column text-center md:text-left">
						<div className="font-bold">{item.nombre}</div>
						<div className="mt-2">{item.descripcion}</div>
					</div>
					<div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
						<Button
							icon="pi pi-users"
							label="Ver clientes"
							size="small"
							className="mb-2"
							outlined
              onClick={() => {
								queryClient.removeQueries({ queryKey: ["clientes"] });
                setSelectedCarteraItem(item);
								setVisibleRight(true);
							}}
						/>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="grid">
			<div className="col-12">
				<div className="card">
					<h5>Cartera de clientes</h5>
					<Toast ref={toast} />

					<Toolbar
						className="mb-4"
						start={
							<div className="my-2">
								<Button
									label="Agregar cliente"
									icon="pi pi-plus"
									className=" mr-2"
									onClick={() => setRegistrarClienteVisible(true)}
								/>
								<Button
									label="Agregar cartera"
									icon="pi pi-folder-open"
									severity="secondary"
									onClick={() => setCreateCarteraDialogVisible(true)}
								/>
							</div>
						}
					/>

					<DataView
						loading={carterasQuery.isLoading}
						value={filteredValue || carterasQuery.data?.result}
						paginator
						rows={9}
						sortOrder={sortOrder}
						sortField={sortField}
						itemTemplate={itemTemplate}
						emptyMessage="No se encontraron carteras"
						header={
							<div className="flex flex-column md:flex-row md:justify-content-between gap-2">
								<Dropdown
									value={sortKey}
									options={sortOptions}
									optionLabel="label"
									placeholder="Sort By Name"
									onChange={onSortChange}
								/>
								<span className="p-input-icon-left">
									<IconField iconPosition="left">
										<InputIcon className="pi pi-search" />
										<InputText
											value={globalFilterValue}
											type="search"
											placeholder="Buscar..."
											onChange={onFilter}
										/>
									</IconField>
								</span>
							</div>
						}
					/>
				</div>
			</div>

			{/* DIALOG REGISTRAR CLIENTE */}
			<RegisterClienteDialog
				visible={registrarClienteVisible}
				setVisible={setRegistrarClienteVisible}
			/>

			{/* CREAR CARTERA DIALOG */}
			<CreateCarteraDialog
				visible={createCarteraDialogVisible}
				setVisible={setCreateCarteraDialogVisible}
			/>

			<Sidebar
				visible={visibleRight}
				position="right"
				onHide={() => setVisibleRight(false)}
        className="w-full md:w-20rem lg:w-30rem"
			>
				<h2>Clientes de: {selectedCarteraItem?.nombre}</h2>
				<DataTable
					value={clientesQuery.data?.result}
					paginator
					rows={5}
					loading={clientesQuery.isLoading}
				>
					<Column field="razonSocial" header="Razón Social" />
					<Column field="ruc" header="R.U.C." />
					<Column field="direccion" header="Dirección" />
				</DataTable>
			</Sidebar>
		</div>
	);
};

export default Cartera;
