import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ClientesService from "../../../../services/ClientesService";
import { useFormik } from "formik";
import { IRegistrarClienteForm } from "../../../../types/request";
import * as Yup from "yup";
import { Toast } from "primereact/toast";

interface AddClienteDialogProps {
	visible: boolean;
	onHide: () => void;
}

const AddClienteDialog: React.FC<AddClienteDialogProps> = ({ visible, onHide }) => {
	const queryClient = useQueryClient();
	const toast = useRef<Toast>(null);

	//mutations
	const registrarClienteMutation = useMutation({
		mutationFn: ClientesService.registrarCliente,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["clientes"] });
			onHide();
		},
	});

	//queries
	const clientesQuery = useQuery({
		queryKey: ["clientes"],
		queryFn: () => ClientesService.listarClientes(),
	});

	const formik = useFormik<IRegistrarClienteForm>({
		initialValues: {
			razonSocial: "",
			ruc: null,
			direccion: null,
			carteraId: null,
		},
		validationSchema: Yup.object().shape({
			razonSocial: Yup.string().required("La razón social es requerida"),
			ruc: Yup.string()
				.required("El RUC es requerido")
				.matches(/^[0-9]+$/, "El RUC solo debe contener dígitos")
				.min(10, "El RUC debe tener 10 dígitos")
				.max(11, "El RUC no debe exceder los 11 dígitos"),
			direccion: Yup.string().required("La dirección es requerida"),
			carteraId: Yup.number().required("La cartera es requerida"),
		}),
		onSubmit: (values, form) => {
			form.setSubmitting(true);
			registrarClienteMutation.mutate(
				{
					data: {
						razonSocial: values.razonSocial!,
						ruc: values.ruc!,
						direccion: values.direccion!,
					},
					carteraId: values.carteraId!,
				},
				{
					onSuccess: (res) => {
						form.setSubmitting(false);
						toast.current?.show({
							severity: "success",
							summary: "Éxito",
							detail: res.message,
							life: 3000,
						});
						props.setVisible(false);
						form.resetForm();
					},
					onError: (err) => {
						form.setSubmitting(false);
						toast.current?.show({
							severity: "error",
							summary: "Error",
							detail: err.message,
							life: 3000,
						});
					},
				}
			);
		},
	});

	const footer = <Button label="Registrar" icon="pi pi-check" onClick={onRegister} />;

	return (
		<>
			<Toast ref={toast} />
			<Dialog
				header="Registrar nuevo cliente"
				visible={visible}
				style={{ width: "30vw" }}
				modal
				footer={footer}
				onHide={onHide}
			>
				<div className="card p-fluid">
					<div className="field">
						<label htmlFor="name1">Razón social</label>
						<InputText
							id="name1"
							type="text"
							value={razonSocial}
							onChange={(e) => setRazonSocial(e.target.value)}
						/>
					</div>
					<div className="field">
						<label htmlFor="ruc">RUC</label>
						<InputText
							id="ruc"
							type="text"
							value={ruc}
							onChange={(e) => setRuc(e.target.value)}
						/>
					</div>
					<div className="field">
						<label htmlFor="direccion">Dirección</label>
						<InputText
							id="direccion"
							type="text"
							value={direccion}
							onChange={(e) => setDireccion(e.target.value)}
						/>
					</div>
					<div className="field">
						<label htmlFor="carteraSelect">Seleccionar Cartera</label>
						<Dropdown
							id="carteraSelect"
							value={selectedCartera}
							options={carteras}
							loading={carterasLoading}
							optionValue="id"
							optionLabel="nombre"
							onChange={(e) => setSelectedCartera(e.value)}
							placeholder="Seleccione una cartera"
						/>
					</div>
				</div>
			</Dialog>
		</>
	);
};

export default AddClienteDialog;
