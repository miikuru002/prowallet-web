/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import * as Yup from "yup";
import {
  IDescontarFacturaDto,
  IDescontarFacturaForm,
} from "../../../../types/request";
import { EPeriodo, ETipoTasa } from "../../../../types/enums";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DateTime } from "luxon";
import FacturasService from "../../../../services/FacturasService";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IFactura } from "../../../../types/response";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { getTipoComisionData } from "../../../../utils";

interface IProps {
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
  factura: IFactura | null;
}

const DescontarFacturaDialog: React.FC<IProps> = (props) => {
  const toast = useRef<Toast>(null);
  const stepperRef = useRef<any>(null);
  const queryClient = useQueryClient();

  //mutations
  const descontarFacturaMutation = useMutation({
    mutationFn: FacturasService.descontarFactura,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
  });

  const formik = useFormik<IDescontarFacturaForm>({
    initialValues: {
      fechaDescuento: null,
      tasa: 0,
      tipoTasa: null,
      periodoTasa: null,
      periodoCapitalizacion: null,
    },
    validationSchema: Yup.object().shape({
      fechaDescuento: Yup.date()
        .nullable()
        .required("La fecha de descuento es requerida")
        .min(
          new Date(),
          "La fecha de descuento debe ser posterior a la fecha actual"
        ),
      tasa: Yup.number()
        .required("La tasa es requerida")
        .positive("La tasa debe ser un número positivo")
        .max(90, "La tasa no debe exceder el 90%"),
      tipoTasa: Yup.mixed()
        .oneOf(
          Object.values(ETipoTasa),
          "Debe seleccionar un tipo de tasa válida"
        )
        .required("El tipo de tasa es requerido"),
      periodoTasa: Yup.mixed()
        .oneOf(
          Object.values(EPeriodo),
          "Debe seleccionar un periodo de tasa válido"
        )
        .required("El periodo de tasa es requerido"),
    }),
    onSubmit: (values, form) => {
      form.setSubmitting(true);

			//valida el periodo de capitalización si la tasa es nominal
			if (values.tipoTasa === ETipoTasa.NOMINAL && !values.periodoCapitalizacion) {
				form.setSubmitting(false);
				toast.current?.show({
					severity: "warn",
					summary: "Error",
					detail: "El periodo de capitalización es requerido",
					life: 3000,
				});
				return;
			}

      const formattedValues: IDescontarFacturaDto = {
        fechaDescuento: DateTime.fromJSDate(values.fechaDescuento!).toFormat(
          "yyyy-MM-dd"
        ),
        tasa: values.tasa!,
        tipoTasa: values.tipoTasa!,
        periodoTasa: values.periodoTasa!,
        periodoCapitalizacion: values.periodoCapitalizacion,
      };

      descontarFacturaMutation.mutate(
        {
          data: formattedValues,
          facturaId: props.factura!.id,
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
        header="Descontar Factura"
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
                descontarFacturaMutation.reset();
              }}
            />
            <Button
              label={formik.isSubmitting ? "Descontando..." : "Descontar"}
              icon={
                formik.isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"
              }
              type="button"
              disabled={formik.isSubmitting}
              onClick={() => formik.handleSubmit()}
            />
          </>
        }
        onHide={() => props.setVisible(false)}
      >
        <form>
          <Stepper ref={stepperRef} orientation="vertical">
            <StepperPanel header="Fecha de descuento">
              <div className="field">
                <label htmlFor="fechaDescuento">Fecha de descuento</label>
                <Calendar
                  id="fechaDescuento"
                  name="fechaDescuento"
                  showIcon
                  showButtonBar
                  required
									autoFocus
                  minDate={new Date()}
                  value={formik.values.fechaDescuento}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid":
                      formik.touched.fechaDescuento &&
                      Boolean(formik.errors.fechaDescuento),
                  })}
                />
                {formik.touched.fechaDescuento &&
                  Boolean(formik.errors.fechaDescuento) && (
                    <small className="p-error">
                      {formik.touched.fechaDescuento &&
                        formik.errors.fechaDescuento}
                    </small>
                  )}
              </div>
              <div className="flex py-4">
                <Button
                  label="Siguiente"
                  icon="pi pi-arrow-right"
                  iconPos="right"
									type="button"
                  onClick={() => stepperRef.current?.nextCallback()}
                />
              </div>
            </StepperPanel>
            <StepperPanel header="Tasa de descuento">
              <div className="formgrid grid">
                <div className="field col">
                  <label htmlFor="tasa">Tasa</label>
                  <InputNumber
                    id="tasa"
                    name="tasa"
                    mode="decimal"
                    minFractionDigits={2}
                    maxFractionDigits={7}
                    suffix="%"
                    required
                    value={formik.values.tasa}
                    onValueChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={classNames({
                      "p-invalid":
                        formik.touched.tasa && Boolean(formik.errors.tasa),
                    })}
                  />
                  {formik.touched.tasa && Boolean(formik.errors.tasa) && (
                    <small className="p-error">
                      {formik.touched.tasa && formik.errors.tasa}
                    </small>
                  )}
                </div>

                <div className="field col">
                  <label htmlFor="periodoTasa">Periodo de la tasa</label>
                  <Dropdown
                    id="periodoTasa"
                    name="periodoTasa"
                    optionLabel="name"
                    optionValue="code"
                    placeholder="Periodo de la tasa"
                    required
                    value={formik.values.periodoTasa}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={[
                      { name: "Mensual", code: EPeriodo.MENSUAL },
                      { name: "Bimestral", code: EPeriodo.BIMESTRAL },
                      { name: "Trimestral", code: EPeriodo.TRIMESTRAL },
                      { name: "Semestral", code: EPeriodo.SEMESTRAL },
                      { name: "Anual", code: EPeriodo.ANUAL },
                    ]}
                    className={classNames({
                      "p-invalid":
                        formik.touched.periodoTasa &&
                        Boolean(formik.errors.periodoTasa),
                    })}
                  />
                  {formik.touched.periodoTasa &&
                    Boolean(formik.errors.periodoTasa) && (
                      <small className="p-error">
                        {formik.touched.periodoTasa &&
                          formik.errors.periodoTasa}
                      </small>
                    )}
                </div>
              </div>

              <div className="field">
                <label htmlFor="tipoTasa">Tipo de tasa</label>
                <Dropdown
                  id="tipoTasa"
                  name="tipoTasa"
                  optionLabel="name"
                  optionValue="code"
                  placeholder="Tipo de tasa"
                  required
                  value={formik.values.tipoTasa}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={[
                    { name: "Efectiva", code: ETipoTasa.EFECTIVA },
                    { name: "Nominal", code: ETipoTasa.NOMINAL },
                  ]}
                  className={classNames({
                    "p-invalid":
                      formik.touched.tipoTasa &&
                      Boolean(formik.errors.tipoTasa),
                  })}
                />
                {formik.touched.tipoTasa && Boolean(formik.errors.tipoTasa) && (
                  <small className="p-error">
                    {formik.touched.tipoTasa && formik.errors.tipoTasa}
                  </small>
                )}
              </div>

              {formik.values.tipoTasa === ETipoTasa.NOMINAL && (
                <div className="field">
                  <label htmlFor="periodoCapitalizacion">
                    Periodo de capitalización
                  </label>
                  <Dropdown
                    id="periodoCapitalizacion"
                    name="periodoCapitalizacion"
                    optionLabel="name"
                    optionValue="code"
                    placeholder="Periodo de capitalización"
                    required={formik.values.tipoTasa === ETipoTasa.NOMINAL}
                    value={formik.values.periodoCapitalizacion}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={[
                      { name: "Mensual", code: EPeriodo.MENSUAL },
                      { name: "Bimestral", code: EPeriodo.BIMESTRAL },
                      { name: "Trimestral", code: EPeriodo.TRIMESTRAL },
                      { name: "Semestral", code: EPeriodo.SEMESTRAL },
                      { name: "Anual", code: EPeriodo.ANUAL },
                    ]}
                    className={classNames({
                      "p-invalid":
                        formik.touched.periodoCapitalizacion &&
                        Boolean(formik.errors.periodoCapitalizacion),
                    })}
                  />
                  {formik.touched.periodoCapitalizacion &&
                    Boolean(formik.errors.periodoCapitalizacion) && (
                      <small className="p-error">
                        {formik.touched.periodoCapitalizacion &&
                          formik.errors.periodoCapitalizacion}
                      </small>
                    )}
                </div>
              )}
              <div className="flex py-4 gap-2">
                <Button
                  label="Atrás"
                  severity="secondary"
									type="button"
                  icon="pi pi-arrow-left"
                  onClick={() => stepperRef.current?.prevCallback()}
                />
                <Button
                  label="Siguiente"
                  icon="pi pi-arrow-right"
									type="button"
                  iconPos="right"
                  onClick={() => stepperRef.current?.nextCallback()}
                />
              </div>
            </StepperPanel>
            <StepperPanel header="Comisiones">
							<p>Las siguientes comisiones serán descontadas de la factura.</p>
							<DataTable 
								value={[{
									nombre: "Gastos administrativos",
									momento: "DESCUENTO",
									tipo: "MONTO_FIJO",
									valor: 1000,
								}]} 
								size="small"
								showGridlines 
							>
                <Column field="nombre" header="Nombre" />
								<Column header="Momento" body={(data) => data.momento} />
                <Column field="valor" header="Valor" body={(data) => data.valor.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column 
									header="Tipo" 
									body={(data) => 
										<Tag 
											//@ts-ignore idk why this is not working
											severity={getTipoComisionData(data.tipo).color} 
											value={getTipoComisionData(data.tipo).label} 
										/>
									} 
								/>
            	</DataTable>
              <div className="flex py-4">
                <Button 
									label="Atrás" 
									severity="secondary"
									type="button"
									icon="pi pi-arrow-left"
									onClick={() => stepperRef.current?.prevCallback()} 
								/>
              </div>
            </StepperPanel>
          </Stepper>
        </form>
      </Dialog>
    </>
  );
};

export default DescontarFacturaDialog;
