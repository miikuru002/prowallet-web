import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import CarterasService from "../../../../services/CarterasService";
import { useFormik } from "formik";
import { ICrearCarteraDto } from "../../../../types/request";
import * as Yup from "yup";
import { classNames } from "primereact/utils";

interface IProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
}

const CreateCarteraDialog: React.FC<IProps> = (props) => {
	const queryClient = useQueryClient();
	const toast = useRef<Toast>(null);

	//mutations
	const crearCarteraMutation = useMutation({
		mutationFn: CarterasService.crearCartera,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["carteras"] });
		},
	});

	const formik = useFormik<ICrearCarteraDto>({
		initialValues: {
			nombre: "",
			descripcion: "",
		},
		validationSchema: Yup.object().shape({
			nombre: Yup.string().required("El nombre es requerido"),
			descripcion: Yup.string().required("La descripción es requerida"),
		}),
		onSubmit: (values, form) => {
			form.setSubmitting(true);
			crearCarteraMutation.mutate(
				{
					nombre: values.nombre,
					descripcion: values.descripcion,
				},
				{
					onSuccess: () => {
						form.setSubmitting(false);
						toast.current?.show({
							severity: "success",
							summary: "Éxito",
							detail: "Cartera creada correctamente",
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
				header="Crear Cartera"
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
								crearCarteraMutation.reset();
							}}
						/>
						<Button
							label={formik.isSubmitting ? "Creando..." : "Crear"}
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
						<label htmlFor="nombre">Nombre</label>
						<InputText
							id="nombre"
              name="nombre"
							type="text"
              required
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
							className={classNames({
								"p-invalid": formik.touched.nombre && Boolean(formik.errors.nombre),
							})}
						/>
            {formik.touched.nombre && Boolean(formik.errors.nombre) && (
							<small className="p-error">
								{formik.touched.nombre && formik.errors.nombre}
							</small>
						)}
					</div>

          <div className="field">
            <label htmlFor="descripcion">Descripción</label>
            <InputText
              id="descripcion"
              name="descripcion"
              type="text"
              required
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={classNames({
                "p-invalid": formik.touched.descripcion && Boolean(formik.errors.descripcion),
              })}
            />
            {formik.touched.descripcion && Boolean(formik.errors.descripcion) && (
              <small className="p-error">
                {formik.touched.descripcion && formik.errors.descripcion}
              </small>
            )}
          </div>
				</form>
			</Dialog>
		</>
	);
};

export default CreateCarteraDialog;
