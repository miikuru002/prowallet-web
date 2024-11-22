import { Chart } from "primereact/chart";
import { useContext, useEffect, useState } from "react";
import { LayoutContext } from "../../layout/context/layoutcontext";
import { ChartData, ChartOptions } from "chart.js";

interface ReportData {
	totalCarteras: number;
	totalClientes: number;
	totalFacturasdDescontadas: number;
	totalFacturasPendientes: number;
	totalFacturasPagadas: number;
	totalFacturas: number;
}

const Dashboard = () => {
	const [doughnutData, setDoughnutData] = useState<ChartData>({
		labels: ["Descontadas", "Pendientes", "Pagadas"],
		datasets: [
			{
				data: [0, 0, 0],
				backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
				hoverBackgroundColor: ["#FF5A5E", "#4E95D1", "#FFB750"],
			},
		],
	});

	const [doughnutOptions, setDoughnutOptions] = useState<ChartOptions>({});
	const { layoutConfig } = useContext(LayoutContext);

	const [reportData, setReportData] = useState<ReportData | null>(null);

	const applyLightTheme = () => {
		const doughnutOptions: ChartOptions = {
			plugins: {
				legend: {
					labels: {
						color: "#495057",
					},
				},
			},
			responsive: true,
		};
		setDoughnutOptions(doughnutOptions);
	};

	const applyDarkTheme = () => {
		const doughnutOptions = {
			plugins: {
				legend: {
					labels: {
						color: "#ebedef",
					},
				},
			},
			responsive: true,
		};
		setDoughnutOptions(doughnutOptions);
	};

	const fetchReportData = async () => {
		try {
			const response = await fetch(
				"https://prowallet.onrender.com/api/reporte/estadisticas-generales"
			);
			const data = await response.json();

			if (data.message === "OK" && data.result) {
				const result = data.result;

				if (
					result &&
					typeof result.totalCarteras === "number" &&
					typeof result.totalClientes === "number" &&
					typeof result.totalFacturasdDescontadas === "number" &&
					typeof result.totalFacturasPendientes === "number" &&
					typeof result.totalFacturasPagadas === "number"
				) {
					setDoughnutData({
						labels: ["Descontadas", "Pendientes", "Pagadas"],
						datasets: [
							{
								data: [
									result.totalFacturasdDescontadas,
									result.totalFacturasPendientes,
									result.totalFacturasPagadas,
								],
								backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
								hoverBackgroundColor: ["#FF5A5E", "#4E95D1", "#FFB750"],
							},
						],
					});

					setReportData({
						totalCarteras: result.totalCarteras,
						totalClientes: result.totalClientes,
						totalFacturas:
							result.totalFacturasdDescontadas +
							result.totalFacturasPendientes +
							result.totalFacturasPagadas,
						totalFacturasdDescontadas: result.totalFacturasdDescontadas,
						totalFacturasPendientes: result.totalFacturasPendientes,
						totalFacturasPagadas: result.totalFacturasPagadas,
					});
				} else {
					console.error("Datos incompletos en la respuesta de la API");
					setReportData(null);
				}
			} else {
				console.error("Error en la respuesta de la API");
				setReportData(null);
			}
		} catch (error) {
			console.error("Error al obtener los datos:", error);
			setReportData(null);
		}
	};

	useEffect(() => {
		if (layoutConfig.colorScheme === "light") {
			applyLightTheme();
		} else {
			applyDarkTheme();
		}
	}, [layoutConfig.colorScheme]);

	useEffect(() => {
		fetchReportData();
	}, []);

	return (
		<div className="grid">
			<div className="col-12 lg:col-6 xl:col-4">
				<div className="card mb-0">
					<div className="flex justify-content-between mb-3">
						<div>
							<span className="block text-500 font-medium mb-3">Total Carteras</span>
							<div className="text-900 font-medium text-xl">
								{reportData ? reportData.totalCarteras : "Cargando..."}
							</div>
						</div>
						<div
							className="flex align-items-center justify-content-center bg-blue-100 border-round"
							style={{ width: "2.5rem", height: "2.5rem" }}
						>
							<i className="pi pi-wallet text-blue-500 text-xl" />
						</div>
					</div>
				</div>
			</div>

			<div className="col-12 lg:col-6 xl:col-4">
				<div className="card mb-0">
					<div className="flex justify-content-between mb-3">
						<div>
							<span className="block text-500 font-medium mb-3">Total Clientes</span>
							<div className="text-900 font-medium text-xl">
								{reportData ? reportData.totalClientes : "Cargando..."}
							</div>
						</div>
						<div
							className="flex align-items-center justify-content-center bg-orange-100 border-round"
							style={{ width: "2.5rem", height: "2.5rem" }}
						>
							<i className="pi pi-users text-orange-500 text-xl" />
						</div>
					</div>
				</div>
			</div>

			<div className="col-12 lg:col-6 xl:col-4">
				<div className="card mb-0">
					<div className="flex justify-content-between mb-3">
						<div>
							<span className="block text-500 font-medium mb-3">Total Facturas</span>
							<div className="text-900 font-medium text-xl">
								{reportData ? reportData.totalFacturas : "Cargando..."}
							</div>
						</div>
						<div
							className="flex align-items-center justify-content-center bg-cyan-100 border-round"
							style={{ width: "2.5rem", height: "2.5rem" }}
						>
							<i className="pi pi-file text-cyan-500 text-xl" />
						</div>
					</div>
				</div>
			</div>

			<div className="col-12 xl:col-6">
				<div className="card">
					<h5>Facturas</h5>
					<Chart type="doughnut" data={doughnutData} options={doughnutOptions} />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
