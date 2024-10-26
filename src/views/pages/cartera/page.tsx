import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

interface CarteraItem {
    id: number;
    nombre: string;
    descripcion: string;
    fechaCreacion: string;
    fechaModificacion: string;
}

const Cartera = () => {
    const [dataViewValue, setDataViewValue] = useState<CarteraItem[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<CarteraItem[] | null>(null);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField, setSortField] = useState<string>('');
    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayAddCarteraDialog, setDisplayAddCarteraDialog] = useState(false);

    const sortOptions = [
        { label: 'Nombre A-Z', value: 'nombre' },
        { label: 'Nombre Z-A', value: '!nombre' }
    ];

    useEffect(() => {
        fetch('https://prowallet.onrender.com/api/cartera/listar')
            .then(response => response.json())
            .then(data => {
                if (data.message === 'OK') {
                    setDataViewValue(data.result);
                }
            });
        setGlobalFilterValue('');
    }, []);

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue.filter((item) => {
                const nombreLowercase = item.nombre.toLowerCase();
                const searchValueLowercase = value.toLowerCase();
                return nombreLowercase.includes(searchValueLowercase);
            });
            setFilteredValue(filtered);
        }
    };

    const onSortChange = (event: DropdownChangeEvent) => {
        const value = event.value;
        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const itemTemplate = (data: CarteraItem) => {
        return (
            <div className="col-12 lg:col-4">
                <div className="card m-3 border-1 surface-border">
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <div className="text-2xl font-bold">{data.nombre}</div>
                        <div className="mb-3">{data.descripcion}</div>
                    </div>
                </div>
            </div>
        );
    };

    const basicDialogFooter = (
        <Button label="OK" icon="pi pi-check" onClick={() => setDisplayBasic(false)} />
    );

    const carteraDialogFooter = (
        <Button label="OK" icon="pi pi-check" onClick={() => setDisplayAddCarteraDialog(false)} />
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="card-header flex justify-content-between align-items-center mb-3">
                        <h5 className="m-0">Cartera de clientes</h5>
                        <div className="flex gap-2">
                            <Button label="Agregar cliente" icon="pi pi-plus" onClick={() => setDisplayBasic(true)} />
                            <Button label="Agregar cartera" icon="pi pi-folder-open" severity="secondary" onClick={() => setDisplayAddCarteraDialog(true)} />
                        </div>
                    </div>
                    <DataView
                        value={filteredValue || dataViewValue}
                        layout={layout}
                        paginator
                        rows={9}
                        sortOrder={sortOrder}
                        sortField={sortField}
                        itemTemplate={itemTemplate}
                        header={
                            <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
                                <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Name" onChange={onSortChange} />
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText value={globalFilterValue} onChange={onFilter} placeholder="Search by Name" />
                                </span>
                                <DataViewLayoutOptions
                                    layout={layout}
                                    onChange={(e) => setLayout(e.value as 'grid' | 'list')}
                                />
                            </div>
                        }
                    />
                </div>
            </div>

            <Dialog header="Registrar nuevo cliente" visible={displayBasic} style={{ width: '30vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                <div className="card p-fluid">
                    <div className="field">
                        <label htmlFor="name1">Razón social</label>
                        <InputText id="name1" type="text"/>
                    </div>
                    <div className="field">
                        <label htmlFor="email1">RUC</label>
                        <InputText id="email1" type="text"/>
                    </div>
                    <div className="field">
                        <label htmlFor="age1">Dirección</label>
                        <InputText id="age1" type="text"/>
                    </div>
                </div>
            </Dialog>

            <Dialog header="Agregar Cartera" visible={displayAddCarteraDialog} style={{width: '30vw'}} modal footer={carteraDialogFooter} onHide={() => setDisplayAddCarteraDialog(false)}>
                <div className="card p-fluid">
                    <div className="field">
                        <label htmlFor="carteraName">Nombre</label>
                        <InputText id="carteraName" type="text"/>
                    </div>
                    <div className="field">
                        <label htmlFor="carteraDescription">Descripción</label>
                        <InputText id="carteraDescription" type="text"/>
                    </div>
                    <div className="flex justify-center mt-3">
                        <Button className="btn btn-primary w-full">Agregar</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Cartera;
