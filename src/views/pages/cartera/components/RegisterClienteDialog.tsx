import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClientesService from "../../../../services/ClientesService";
import { useFormik } from "formik";
import { IRegistrarClienteForm } from "../../../../types/request";
import * as Yup from "yup";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import CarterasService from "../../../../services/CarterasService";

interface IProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
}

const RegisterClienteDialog: React.FC<IProps> = (props) => {
	const queryClient = useQueryClient();
	const toast = useRef<Toast>(null);

	//mutations
	const registrarClienteMutation = useMutation({
		mutationFn: ClientesService.registrarCliente,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["clientes"] });
		},
	});

	//queries
	const carterasQuery = useQuery({
		queryKey: ["carteras"],
		queryFn: () => CarterasService.listarCarteras(),
	});

	const formik = useFormik<IRegistrarClienteForm>({
		initialValues: {
			razonSocial: "",
			ruc: "",
			direccion: "",
			carteraId: null,
		},
		validationSchema: Yup.object().shape({
			razonSocial: Yup.string().required("La razón social es requerida"),
			ruc: Yup.string()
				.required("El RUC es requerido")
				.matches(/^[0-9]+$/, "El RUC solo debe contener dígitos")
				.min(11, "El RUC debe tener 11 dígitos")
				.max(11, "El RUC no debe exceder los 11 dígitos"),
			direccion: Yup.string().required("La dirección es requerida"),
			carteraId: Yup.number().required("La cartera es requerida"),
		}),
		onSubmit: (values, form) => {
			form.setSubmitting(true);
			registrarClienteMutation.mutate(
				{
					data: {
						razonSocial: values.razonSocial,
						ruc: values.ruc,
						direccion: values.direccion,
					},
					carteraId: values.carteraId!,
				},
				{
					onSuccess: () => {
						form.setSubmitting(false);
						toast.current?.show({
							severity: "success",
							summary: "Éxito",
							detail: "Cliente registrado correctamente",
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

	return (
		<>
			<Toast ref={toast} />
			<Dialog
				visible={props.visible}
				style={{ width: "450px" }}
				className="p-fluid"
				header="Registrar nuevo cliente"
				modal
				closable={false}
				onHide={() => props.setVisible(false)}
				footer={
					<>
						<Button
							label="Cancelar"
							icon="pi pi-times"
							text
							onClick={() => {
								props.setVisible(false);
								formik.resetForm();
								registrarClienteMutation.reset();
							}}
						/>
						<Button
							label={formik.isSubmitting ? "Registrando..." : "Registrar"}
							icon={formik.isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
							type="button"
							disabled={formik.isSubmitting}
							onClick={() => formik.handleSubmit()}
						/>
					</>
				}
			>
				<form>
					<div className="field">
						<label htmlFor="razonSocial">Razón social</label>
						<InputText
							id="razonSocial"
              name="razonSocial"
							type="text"
              required
							value={formik.values.razonSocial}
							onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={classNames({
								"p-invalid": formik.touched.razonSocial && Boolean(formik.errors.razonSocial),
							})}
						/>
            {formik.touched.razonSocial && Boolean(formik.errors.razonSocial) && (
							<small className="p-error">
								{formik.touched.razonSocial && formik.errors.razonSocial}
							</small>
						)}
					</div>

					<div className="field">
						<label htmlFor="ruc">RUC</label>
						<InputText
							id="ruc"
              name="ruc"
							type="text"
							value={formik.values.ruc}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={classNames({
                "p-invalid": formik.touched.ruc && Boolean(formik.errors.ruc),
              })}
						/>
            {formik.touched.ruc && Boolean(formik.errors.ruc) && (
							<small className="p-error">
								{formik.touched.ruc && formik.errors.ruc}
							</small>
						)}
					</div>

					<div className="field">
						<label htmlFor="direccion">Dirección</label>
						<InputText
							id="direccion"
              name="direccion"
							type="text"
							value={formik.values.direccion}
							onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={classNames({
                "p-invalid": formik.touched.direccion && Boolean(formik.errors.direccion),
              })}
						/>
            {formik.touched.direccion && Boolean(formik.errors.direccion) && (
							<small className="p-error">
								{formik.touched.direccion && formik.errors.direccion}
							</small>
						)}
					</div>

					<div className="field">
						<label htmlFor="carteraId">Seleccionar Cartera</label>
						<Dropdown
							id="carteraId"
              name="carteraId"
							optionLabel="nombre"
							optionValue="id"
              placeholder="Seleccione una cartera"
              required
							filter
							showFilterClear
							value={formik.values.carteraId}
							onChange={formik.handleChange}
              onBlur={formik.handleBlur}
							loading={carterasQuery.isLoading}
              options={carterasQuery.data?.result}
              className={classNames({
                "p-invalid": formik.touched.carteraId && Boolean(formik.errors.carteraId),
              })}
						/>
            {formik.touched.carteraId && Boolean(formik.errors.carteraId) && (
							<small className="p-error">
								{formik.touched.carteraId && formik.errors.carteraId}
							</small>
						)}
					</div>
				</form>
			</Dialog>
		</>
	);
};

export default RegisterClienteDialog;
