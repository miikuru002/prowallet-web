import { useState, useEffect, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { ListBox } from "primereact/listbox";

interface InputValue {
  name: string;
  code: string;
}

interface Factura {
  numero: string;
  fechaEmision: string;
  fechaVencimiento: string;
  valorNominal: number;
  moneda: string;
  clienteId: string;
}

interface Cliente {
    name: string;
    code: string;
}

const clientes = [
  { name: "Empresa ABC", code: "1" },
  { name: "Empresa XYZ", code: "2" },
  { name: "Empresa 123", code: "3" },
  { name: "Empresa 456", code: "4" },
  { name: "Empresa 789", code: "5" },
  { name: "Empresa 000", code: "6" },
  { name: "Empresa 111", code: "7" },
  { name: "Empresa 222", code: "8" },
  { name: "Empresa 333", code: "9" },
  { name: "Empresa 444", code: "10" },
  { name: "Empresa 555", code: "11" },
  { name: "Empresa 666", code: "12" },
  { name: "Empresa 777", code: "13" },
  { name: "Empresa 888", code: "14" },
  { name: "Empresa 999", code: "15" },
  { name: "Empresa 0000", code: "16" },
  { name: "Empresa 1111", code: "17" },
  { name: "Empresa 2222", code: "18" },
  { name: "Empresa 3333", code: "19" },
  { name: "Empresa 4444", code: "20" },
  { name: "Empresa 5555", code: "21" },
  { name: "Empresa 6666", code: "22" },
  { name: "Empresa 7777", code: "23" },
  { name: "Empresa 8888", code: "24" },
  { name: "Empresa 9999", code: "25" },
];

const AgregarFactura = () => {
  const [inputNumeroFactura, setInputNumeroFactura] = useState<any>("");
  const [calendarioEmision, setCalendarioEmision] = useState<any>(null);
  const [calendarioVencimiento, setCalendarioVencimiento] = useState<any>(null);
  const [valorNominal, setValorNominal] = useState<number | null>(0);
  const [moneda, setMoneda] = useState<string>("");
  const [cliente, setCliente] = useState<Cliente | null>(null);

  const handleSubmit = () => {
    const factura: Factura = {
      numero: inputNumeroFactura,
      fechaEmision: calendarioEmision,
      fechaVencimiento: calendarioVencimiento,
      valorNominal: valorNominal ?? 0,
      moneda: moneda,
      clienteId: cliente?.code ?? "",
    };
    console.log(factura);
  };

  const selectedClienteTemplate = (option: Cliente, props: any) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const clienteOptionTemplate = (option: Cliente) => {
    return (
      <div className="flex align-items-center">
        <div>{option.name}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-fluid formgrid grid">
        <div className="field col-12">
          <label htmlFor="numero">Número de Factura</label>
          <div className="p-inputgroup">
            <InputText
              value={inputNumeroFactura}
              onChange={(e) => setInputNumeroFactura(e.value ?? null)}
            ></InputText>
          </div>
        </div>
        <div className="field col-6">
          <label htmlFor="fechaemision">Fecha de emisión</label>
          <div>
            <div className="p-inputgroup">
              <Calendar
                showIcon
                showButtonBar
                value={calendarioEmision}
                onChange={(e) => setCalendarioEmision(e.value ?? null)}
              />
            </div>
          </div>
        </div>
        <div className="field col-6">
          <label htmlFor="fechavencimiento">Fecha de Vencimiento</label>
          <div>
            <div className="p-inputgroup">
              <Calendar
                showIcon
                showButtonBar
                value={calendarioVencimiento}
                onChange={(e) => setCalendarioVencimiento(e.value ?? null)}
              />
            </div>
          </div>
        </div>
        <div className="field col-9">
          <label htmlFor="valornominal">Valor Nominal</label>
          <InputNumber
            value={valorNominal}
            onValueChange={(e) => setValorNominal(e.value ?? null)}
            min={0}
          ></InputNumber>
        </div>
        <div className="field col-3">
          <label htmlFor="moneda">Moneda</label>
          <Dropdown
            id="tipotasa"
            value={moneda}
            onChange={(e) => setMoneda(e.value)}
            options={[
              { name: "USD", code: "USD" },
              { name: "PEN", code: "PEN" },
            ]}
            optionLabel="name"
            placeholder="Select One"
          ></Dropdown>
        </div>
        <div className="field col-12">
          <label htmlFor="cliente">Cliente</label>
          <Dropdown
            value={cliente}
            onChange={(e) => setCliente(e.value)}
            options={clientes}
            optionLabel="name"
            placeholder="Seleccione un cliente"
            valueTemplate={selectedClienteTemplate}
            itemTemplate={clienteOptionTemplate}
            filter
          />
        </div>
        <Button onClick={handleSubmit} label="Registrar"></Button>
      </div>
    </div>
  );
};

export default AgregarFactura;
