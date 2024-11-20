import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import * as Yup from "yup";
import { IRegistrarFacturaDto, IRegistrarFacturaForm } from "../../../../types/request";
import { EMoneda } from "../../../../types/enums";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DateTime } from "luxon";
import FacturasService from "../../../../services/FacturasService";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClientesService from "../../../../services/ClientesService";

interface IProps {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
}

const RegisterFacturaDialog: React.FC<IProps> = (props) => {
	const toast = useRef<Toast>(null);
	const queryClient = useQueryClient();

	//mutations
	const registrarFacturaMutation = useMutation({
		mutationFn: FacturasService.registrarFactura,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["facturas"] });
		},
	});

	//queries
	const clientesQuery = useQuery({
		queryKey: ["clientes"],
		queryFn: () => ClientesService.listarClientes(),
	});

	const formik = useFormik<IRegistrarFacturaForm>({
		initialValues: {
			fechaEmision: null,
			fechaVencimiento: null,
			moneda: null,
			numero: "",
			valorNominal: 0,
      clienteId: null,
		},
		validationSchema: Yup.object().shape({
			numero: Yup.string()
				.required("El número de la factura es requerido")
				.matches(/^[0-9]+$/, "El número de factura solo debe contener dígitos")
				.min(6, "El número de factura debe tener al menos 6 dígitos")
				.max(10, "El número de factura no debe exceder los 10 dígitos"),
			fechaEmision: Yup.date()
				.nullable()
				.required("La fecha de emisión es requerida")
				.max(new Date(), "La fecha de emisión no puede ser en el futuro"),
			fechaVencimiento: Yup.date()
				.nullable()
				.required("La fecha de vencimiento es requerida")
				.min(
					Yup.ref("fechaEmision"),
					"La fecha de vencimiento debe ser posterior a la fecha de emisión"
				),
			moneda: Yup.mixed()
				.oneOf(Object.values(EMoneda), "Debe seleccionar una moneda válida")
				.required("La moneda es requerida"),
			valorNominal: Yup.number()
				.required("El valor n. es requerido")
				.positive("El valor n. debe ser un número positivo")
				.min(1, "El valor n. debe ser al menos 1")
				.max(1000000, "El valor n. no puede exceder los 1,000,000"),
      clienteId: Yup.number()
        .required("El cliente es requerido")
		}),
		onSubmit: (values, form) => {
			form.setSubmitting(true);
			const formattedValues: IRegistrarFacturaDto = {
				numero: values.numero,
				fechaEmision: DateTime.fromJSDate(values.fechaEmision!).toFormat("yyyy-MM-dd"),
				fechaVencimiento: DateTime.fromJSDate(values.fechaVencimiento!).toFormat("yyyy-MM-dd"),
        valorNominal: values.valorNominal!,
				moneda: values.moneda!,
			};

			registrarFacturaMutation.mutate(
				{
					data: formattedValues,
					clienteId: values.clienteId!,
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

	return (
		<>
			<Toast ref={toast} />
			<Dialog
				visible={props.isVisible}
				style={{ width: "450px" }}
				header="Registrar Factura"
				modal
				closable={false}
				className="p-fluid"
				footer={
					<>
						<Button
							label="Cancelar"
							icon="pi pi-times"
							text
							onClick={() => {
								props.setVisible(false);
								formik.resetForm();
								registrarFacturaMutation.reset();
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
				onHide={() => props.setVisible(false)}
			>
				<form>
					<div className="field">
						<label htmlFor="clienteId">Cliente</label>
						<Dropdown
							id="clienteId"
							name="clienteId"
							optionLabel="razonSocial"
							optionValue="id"
							placeholder="Seleccione un cliente"
							required
							filter
							showFilterClear
							value={formik.values.clienteId}
							onChange={formik.handleChange}
              onBlur={formik.handleBlur}
							loading={clientesQuery.isLoading}
							options={clientesQuery.data?.result}
              className={classNames({
								"p-invalid": formik.touched.clienteId && Boolean(formik.errors.clienteId),
							})}
						/>
						{formik.touched.clienteId && Boolean(formik.errors.clienteId) && (
							<small className="p-invalid">
								{formik.touched.clienteId && formik.errors.clienteId}
							</small>
						)}
					</div>

					<div className="field">
						<label htmlFor="numero">Número</label>
						<InputText
							id="numero"
							name="numero"
							required
							value={formik.values.numero}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className={classNames({
								"p-invalid": formik.touched.numero && Boolean(formik.errors.numero),
							})}
						/>
						{formik.touched.numero && Boolean(formik.errors.numero) && (
							<small className="p-invalid">
								{formik.touched.numero && formik.errors.numero}
							</small>
						)}
					</div>

					<div className="formgrid grid">
						<div className="field col">
							<label htmlFor="fechaEmision">Fecha de emisión</label>
							<Calendar
								id="fechaEmision"
								name="fechaEmision"
								showIcon
								showButtonBar
								required
								maxDate={new Date()}
								value={formik.values.fechaEmision}
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								className={classNames({
									"p-invalid": formik.touched.fechaEmision && Boolean(formik.errors.fechaEmision),
								})}
							/>
							{formik.touched.fechaEmision && Boolean(formik.errors.fechaEmision) && (
								<small className="p-invalid">
									{formik.touched.fechaEmision && formik.errors.fechaEmision}
								</small>
							)}
						</div>
						<div className="field col">
							<label htmlFor="fechaVencimiento">Fecha de vencimiento</label>
							<Calendar
								id="fechaVencimiento"
								name="fechaVencimiento"
								showIcon
								showButtonBar
								required
								minDate={formik.values.fechaEmision || new Date()}
								value={formik.values.fechaVencimiento}
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								className={classNames({
									"p-invalid": formik.touched.fechaVencimiento && Boolean(formik.errors.fechaVencimiento),
								})}
							/>
							{formik.touched.fechaVencimiento && Boolean(formik.errors.fechaVencimiento) && (
								<small className="p-invalid">
									{formik.touched.fechaVencimiento && formik.errors.fechaVencimiento}
								</small>
							)}
						</div>
					</div>

					<div className="formgrid grid">
						<div className="field col">
							<label htmlFor="valorNominal">Valor nominal</label>
							<InputNumber
								id="valorNominal"
								name="valorNominal"
								mode="currency"
								required
								value={formik.values.valorNominal}
								onValueChange={formik.handleChange}
								onBlur={formik.handleBlur}
								currency={formik.values.moneda === EMoneda.PEN ? "PEN" : "USD"}
								locale={formik.values.moneda === EMoneda.PEN ? "es-PE" : "en-US"}
								className={classNames({
									"p-invalid": formik.touched.valorNominal && Boolean(formik.errors.valorNominal),
								})}
							/>
							{formik.touched.valorNominal && Boolean(formik.errors.valorNominal) && (
								<small className="p-invalid">
									{formik.touched.valorNominal && formik.errors.valorNominal}
								</small>
							)}
						</div>
						<div className="field col">
							<label htmlFor="moneda">Moneda</label>
							<Dropdown
								id="moneda"
								name="moneda"
								optionLabel="name"
								optionValue="code"
								placeholder="Moneda"
								required
								value={formik.values.moneda}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								options={[
									{ name: "Soles peruanos", code: EMoneda.PEN },
									{ name: "Dólar americano", code: EMoneda.USD },
								]}
								className={classNames({
									"p-invalid": formik.touched.moneda && Boolean(formik.errors.moneda),
								})}
							/>
							{formik.touched.moneda && Boolean(formik.errors.moneda) && (
								<small className="p-invalid">
									{formik.touched.moneda && formik.errors.moneda}
								</small>
							)}
						</div>
					</div>
				</form>
			</Dialog>
		</>
	);
};

export default RegisterFacturaDialog;
