import { useRef } from "react";
import { Sidebar } from "primereact/sidebar";
import { IFactura } from "../../../../types/response";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Timeline } from "primereact/timeline";
import { Tooltip } from "primereact/tooltip";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Badge } from "primereact/badge";
import FacturaDescuento from "./FacturaDescuento";

interface TimelineEvent {
	status?: string;
	date?: string;
	value?: string;
}

interface IProps {
	isVisibleRight: boolean;
	setIsVisibleRight: (isVisibleRight: boolean) => void;
	factura: IFactura | null;
}

const FacturaDetails: React.FC<IProps> = ({
	isVisibleRight,
	setIsVisibleRight,
	factura,
}) => {
	const stepperRef = useRef(null);

	const events = [
		{
			status: "Emisión",
			date: factura?.fechaEmision,
			value: factura?.valorNominal,
		},
		{
			status: "Vencimiento",
			date: factura?.fechaVencimiento,
			value: factura?.valorNominal,
		},
	];

	const customizedMarker = (item: TimelineEvent) => {
		return (
			<>
				<Tooltip target=".marker" position="top" content={item.value} />
				<span className="marker flex w-2rem h-2rem align-items-center justify-content-center border-circle border-1">
					<i className="pi pi-money-bill"></i>
				</span>
			</>
		);
	};

	return (
		<Sidebar
			visible={isVisibleRight}
			onHide={() => setIsVisibleRight(false)}
			position="right"
      className="w-full md:w-20rem lg:w-30rem"
		>
      <h2>Detalles de la factura </h2>
			<Stepper ref={stepperRef}>
				<StepperPanel>
					<div className="card">
						<h1 style={{ fontWeight: "normal", textAlign: "center" }}>
							{factura?.numero}
						</h1>
						<Divider />
						<div className="flex justify-content-between mb-3">
							<span>Cliente</span>
							<span>{factura?.cliente.razonSocial}</span>
						</div>
						<div className="flex justify-content-between mb-3">
							<span>Valor Nominal</span>
							<span>
								{factura?.valorNominal.toLocaleString(
									factura?.moneda == "PEN" ? "es-PE" : "en-US",
									{
										style: "currency",
										currency: factura?.moneda == "PEN" ? "PEN" : "USD",
									}
								)}
							</span>
						</div>
						<div className="flex justify-content-between mb-3">
							<span>Fecha de Emisión</span>
							<span>{factura?.fechaEmision}</span>
						</div>
						<div className="flex justify-content-between mb-3">
							<span>Fecha de Vencimiento</span>
							<span>{factura?.fechaVencimiento}</span>
						</div>
						<div className="flex justify-content-between mb-3">
							<span>Estado</span>
							<Badge value={factura?.estado} />
						</div>
						<div className="flex justify-content-between mb-3">
							<span>Moneda</span>
							<span>{factura?.moneda}</span>
						</div>
						<Divider />
						<div className="card" style={{ border: "none" }}>
							<Timeline
								value={events}
								content={(item) => item.status}
								opposite={(item) => (
									<small className="text-color-secondary">{item.date}</small>
								)}
								// marker={customizedMarker}
							/>
						</div>
						<div className="text-center">
							<Button
								label="Registrar Descuento"
								icon="pi pi-arrow-right"
								iconPos="right"
								onClick={() => stepperRef.current.nextCallback()}
							/>
						</div>
					</div>
				</StepperPanel>
				<StepperPanel>
					<FacturaDescuento />
					<div className="flex pt-4 justify-content-between">
						<Button
							label="Back"
							severity="secondary"
							icon="pi pi-arrow-left"
							onClick={() => stepperRef.current.prevCallback()}
						/>
					</div>
				</StepperPanel>
			</Stepper>
		</Sidebar>
	);
};

export default FacturaDetails;
