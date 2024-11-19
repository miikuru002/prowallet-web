import React, { useState, useRef, useEffect } from "react";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { OverlayPanel } from "primereact/overlaypanel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ClientesService from "../../../services/ClientesService";
import { ICartera } from "../../../types/response";
import CarterasService from "../../../services/CarterasService";
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";

const Cartera = () => {
	const [globalFilterValue, setGlobalFilterValue] = useState("");
	const [filteredValue, setFilteredValue] = useState<ICartera[] | null>(null);
	const [sortKey, setSortKey] = useState<string | null>(null);
	const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
	const [sortField, setSortField] = useState<string>("");
	const [displayAddCarteraDialog, setDisplayAddCarteraDialog] = useState(false);
	const [selectedCartera, setSelectedCartera] = useState<number | null>(null);
	const [razonSocial, setRazonSocial] = useState("");
	const [ruc, setRuc] = useState("");
	const [direccion, setDireccion] = useState("");
	const [carteraName, setCarteraName] = useState("");
	const [carteraDescription, setCarteraDescription] = useState("");
	const [selectedCarteraItem, setSelectedCarteraItem] = useState<ICartera | null>(null);
	const toast = useRef<Toast>(null);
	const op = useRef<OverlayPanel>(null);

	const queryClient = useQueryClient();

	const showWarn = (message: string) => {
		toast.current?.show({
			severity: "warn",
			summary: "Warn Message",
			detail: message,
			life: 3000,
		});
	};

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

	const handleRegisterClient = () => {
		if (!selectedCartera || !razonSocial || !ruc || !direccion) {
			showWarn("Por favor, completa todos los campos.");
			return;
		}

		if (!selectedCartera) {
			showWarn("Por favor, selecciona una cartera.");
			return;
		}
		if (!ruc) {
			showWarn("El campo RUC no puede estar vacío");
			return;
		}

		if (ruc.length != 11) {
			showWarn("El RUC debe tener 11 dígitos");
			return;
		}

		const requestData = {
			razonSocial,
			ruc,
			direccion,
		};

		fetch(`https://prowallet.onrender.com/api/cliente/registrar/${selectedCartera}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestData),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error en la respuesta de la API");
				}
				return response.json();
			})
			.then((data) => {
				console.log("Registro exitoso:", data);
				setDisplayBasic(false);
				setRazonSocial("");
				setRuc("");
				setDireccion("");
				setSelectedCartera(null);
				setDisplayBasic(false);
			})
			.catch((error) => {
				console.error("Error al registrar cliente:", error);
			});
	};

	const handleAddCartera = () => {
		if (!carteraName || !carteraDescription) {
			console.error("Por favor, completa el nombre y la descripción de la cartera.");
			return;
		}

		const requestData = {
			nombre: carteraName,
			descripcion: carteraDescription,
		};

		fetch("https://prowallet.onrender.com/api/cartera/crear", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestData),
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Error al crear la cartera: " + response.statusText);
				}
			})
			.then((data) => {
				console.log("Cartera creada exitosamente:", data);
				setDisplayAddCarteraDialog(false);
				setCarteraName("");
				setCarteraDescription("");
			})
			.catch((error) => {
				console.error(error);
			});
	};


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

	const itemTemplate = (data: ICartera) => {
		return (
			<div className="col-12">
				<div className="flex flex-column md:flex-row align-items-center p-3 w-full">
					<div className="flex-1 flex flex-column text-center md:text-left">
						<div className="font-bold text-2xl">{data.nombre}</div>
						<div className="mt-2">{data.descripcion}</div>
					</div>
					<div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
						<Button
							icon="pi pi-users"
							label="Ver clientes"
							size="small"
							className="mb-2"
							outlined
							onClick={(e) => {
								setSelectedCarteraItem(data);
								op.current?.toggle(e);
							}}
						/>
						<OverlayPanel
							ref={op}
							closeOnEscape
							onHide={() => queryClient.removeQueries({ queryKey: ["clientes"] })}
						>
							<DataTable
								value={clientesQuery.data?.result}
								paginator
								rows={5}
								loading={clientesQuery.isLoading}
							>
								<Column field="razonSocial" header="Razón Social" />
								<Column field="ruc" header="R.U.C." />
							</DataTable>
						</OverlayPanel>
					</div>
				</div>
			</div>
		);
	};

	const carteraDialogFooter = (
		<Button label="Agregar nueva cartera" icon="pi pi-check" onClick={handleAddCartera} />
	);

	return (
		<div className="grid">
			<Toast ref={toast} />
			<div className="col-12">
				<div className="card">
					<div className="card-header flex justify-content-between align-items-center mb-3">
						<h5 className="m-0">Cartera de clientes</h5>
						<div className="flex gap-2">
							<Button
								label="Agregar cliente"
								icon="pi pi-plus"
								onClick={() => setDisplayBasic(true)}
							/>
							<Button
								label="Agregar cartera"
								icon="pi pi-folder-open"
								severity="secondary"
								onClick={() => setDisplayAddCarteraDialog(true)}
							/>
						</div>
					</div>
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

			<Dialog
				header="Agregar Cartera"
				visible={displayAddCarteraDialog}
				style={{ width: "30vw" }}
				modal
				footer={carteraDialogFooter}
				onHide={() => setDisplayAddCarteraDialog(false)}
			>
				<div className="card p-fluid">
					<div className="field">
						<label htmlFor="carteraName">Nombre</label>
						<InputText
							id="carteraName"
							type="text"
							value={carteraName}
							onChange={(e) => setCarteraName(e.target.value)}
						/>
					</div>
					<div className="field">
						<label htmlFor="carteraDescription">Descripción</label>
						<InputText
							id="carteraDescription"
							type="text"
							value={carteraDescription}
							onChange={(e) => setCarteraDescription(e.target.value)}
						/>
					</div>
				</div>
			</Dialog>
		</div>
	);
};

export default Cartera;
