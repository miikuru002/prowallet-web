import React, { useState, useEffect, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

interface InputValue {
  name: string;
  code: string;
}

interface Descuento {
  plazoDescuento: number;
  tasa: number;
  tipoTasa: string;
  periodoTasa: string;
  periodoCapitalizacion: string;
  facturaId: number;
}

const FacturaDescuento = () => {
  const [inputPlazoDescuento, setInputPlazoDescuento] = useState<number | null>(
    30
  );
  const [inputTasa, setInputTasa] = useState<number | null>(0);
  const [dropdownTipoTasa, setDropdownTipoTasa] = useState(null);
  const [dropdownPeriodoTasa, setDropdownPeriodoTasa] = useState(null);
  const [
    dropdownPeriodoCapitalizacion,
    setDropdowndropdownPeriodoCapitalizacion,
  ] = useState(null);
  const [descuentoDeFactura, setDescuentoDeFactura] = useState(null);

  const dropdownTipoTasaValues: InputValue[] = [
    { name: "Efectiva", code: "EFECTIVA" },
    { name: "Nominal", code: "NOMINAL" },
  ];

  const dropdownPeriodoValues: InputValue[] = [
    { name: "Diario", code: "DIARIO" },
    { name: "Quincenal", code: "QUINCENAL" },
    { name: "Mensual", code: "MENSUAL" },
    { name: "Bimestral", code: "BIMESTRAL" },
    { name: "Trimestral", code: "TRIMESTRAL" },
    { name: "Cuatrimestral", code: "CUATRIMESTRAL" },
    { name: "Semestral", code: "SEMESTRAL" },
    { name: "Anual", code: "ANUAL" },
  ];

  const handleSubmit = () => {
    const descuento: Descuento = {
      plazoDescuento: inputPlazoDescuento ?? 0,
      tasa: inputTasa ?? 0,
      tipoTasa: dropdownTipoTasa?.code ?? "",
      periodoTasa: dropdownPeriodoTasa?.code ?? "",
      periodoCapitalizacion: dropdownPeriodoCapitalizacion?.code ?? "",
      facturaId: 1,
    };

    console.log(descuento);
  };

  return (
    <div className="card">
      <h5>Registrar Descuento</h5>
      <div className="p-fluid formgrid grid">
        <div className="field col-6">
          <label htmlFor="plazo">Plazo del Descuento</label>
          <div className="p-inputgroup">
            <InputNumber
              value={inputPlazoDescuento}
              onValueChange={(e) => setInputPlazoDescuento(e.value ?? null)}
              mode="decimal"
              min={30}
            ></InputNumber>
            <span className="p-inputgroup-addon">Días</span>
          </div>
        </div>
        <div className="field col-6">
          <label htmlFor="tasa">Tasa</label>
          <InputNumber
            value={inputTasa}
            onValueChange={(e) => setInputTasa(e.value ?? null)}
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={7}
            suffix="%"
          ></InputNumber>
        </div>
        <div className="field col-12">
          <label htmlFor="state">Tipo de Tasa</label>
          <Dropdown
            id="tipotasa"
            value={dropdownTipoTasa}
            onChange={(e) => setDropdownTipoTasa(e.value)}
            options={dropdownTipoTasaValues}
            optionLabel="name"
            placeholder="Select One"
          ></Dropdown>
        </div>
        <div className="field col-12">
          <label htmlFor="state">Periodo de la Tasa</label>
          <Dropdown
            id="periodotasa"
            value={dropdownPeriodoTasa}
            onChange={(e) => setDropdownPeriodoTasa(e.value)}
            options={dropdownPeriodoValues}
            optionLabel="name"
            placeholder="Select One"
          ></Dropdown>
        </div>
        <div className="field col-12">
          <label htmlFor="state">Periodo de Capitalizacización</label>
          <Dropdown
            id="periodocapitalizacion"
            value={dropdownPeriodoCapitalizacion}
            onChange={(e) => setDropdowndropdownPeriodoCapitalizacion(e.value)}
            options={dropdownPeriodoValues}
            optionLabel="name"
            placeholder="Select One"
          ></Dropdown>
        </div>
        <Button label="Descontar" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default FacturaDescuento;
