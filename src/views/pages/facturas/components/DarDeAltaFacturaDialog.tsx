import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IFactura } from "../../../../types/response";
import FacturasService from "../../../../services/FacturasService";

interface IProps {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	factura: IFactura | null;
}

const DarDeAltaFacturaDialog: React.FC<IProps> = (props) => {
	const toast = useRef<Toast>(null);
	const queryClient = useQueryClient();

	//mutations
	const darDeAltaFacturaMutation = useMutation({
		mutationFn: FacturasService.darDeAltaFactura,
		onSuccess: () => {
			toast.current?.show({
				severity: "success",
				summary: "Éxito",
        detail: "Factura dada de alta correctamente",
			});
      props.setVisible(false);
			queryClient.invalidateQueries({ queryKey: ["facturas"] });
		},
		onError: (err) => {
			toast.current?.show({
				severity: "error",
				summary: "Error al dar de alta la factura",
        detail: err?.message,
			});
		},
	});

	return (
		<>
			<Toast ref={toast} />
			<Dialog
				visible={props.isVisible}
				style={{ width: "450px" }}
				header={`Dar de alta factura ${props.factura?.id}`}
				modal
				closable={false}
				className="p-fluid"
				footer={
					<>
						<Button
							label="Cancelar"
							icon="pi pi-times"
							text
							onClick={() => props.setVisible(false)}
						/>
						<Button
							label={darDeAltaFacturaMutation.isPending ? "Cargando..." : "Dar de alta"}
							icon={darDeAltaFacturaMutation.isPending ? "pi pi-spin pi-spinner" : "pi pi-check"}
							type="button"
							disabled={darDeAltaFacturaMutation.isPending}
							onClick={() => darDeAltaFacturaMutation.mutate(props.factura?.id ?? 0)}
						/>
					</>
				}
				onHide={() => props.setVisible(false)}
			>
				<div className="field">
					<label htmlFor="numero">Número de factura</label>
					<InputText id="numero" name="numero" required value={props.factura?.numero} />
				</div>
			</Dialog>
		</>
	);
};

export default DarDeAltaFacturaDialog;
