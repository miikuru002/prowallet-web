import React, {useState, useEffect, useRef} from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';


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
    const [carteraOptions, setCarteraOptions] = useState<{label: string, value: number}[]>([]);
    const [selectedCartera, setSelectedCartera] = useState<number | null>(null);
    const [razonSocial, setRazonSocial] = useState('');
    const [ruc, setRuc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [carteraName, setCarteraName] = useState('');
    const [carteraDescription, setCarteraDescription] = useState('');
    const toast = useRef<Toast>(null);


    const showWarn = (message: string) => {
        toast.current?.show({
            severity: 'warn',
            summary: 'Warn Message',
            detail: message,
            life: 3000
        });
    };


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
                    const options = data.result.map((item: CarteraItem) => ({
                        label: item.nombre,
                        value: item.id
                    }));
                    setCarteraOptions(options);
                }
            });
        setGlobalFilterValue('');
    }, []);

    const handleRegisterClient = () => {
        if(!selectedCartera || !razonSocial || !ruc || !direccion) {
            showWarn('Por favor, completa todos los campos.');
            return;

        }

        if (!selectedCartera) {
            showWarn('Por favor, selecciona una cartera.');
            return;
        }
        if (!ruc) {
            showWarn('El campo RUC no puede estar vacío');
            return;
        }

        if (ruc.length != 11) {
            showWarn('El RUC debe tener 11 dígitos');
            return;
        }



        const requestData = {
            razonSocial,
            ruc,
            direccion
        };

        fetch(`https://prowallet.onrender.com/api/cliente/registrar/${selectedCartera}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                return response.json();
            })
            .then(data => {
                console.log('Registro exitoso:', data);
                setDisplayBasic(false);
                setRazonSocial('');
                setRuc('');
                setDireccion('');
                setSelectedCartera(null);
                setDisplayBasic(false);
            })
            .catch(error => {
                console.error('Error al registrar cliente:', error);
            });
    };

    const handleAddCartera = () => {
        if (!carteraName || !carteraDescription) {
            console.error('Por favor, completa el nombre y la descripción de la cartera.');
            return;
        }

        const requestData = {
            nombre: carteraName,
            descripcion: carteraDescription
        };

        fetch('https://prowallet.onrender.com/api/cartera/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al crear la cartera: ' + response.statusText);
                }
            })
            .then(data => {
                console.log('Cartera creada exitosamente:', data);
                setDisplayAddCarteraDialog(false);
                setCarteraName('');
                setCarteraDescription('');
            })
            .catch(error => {
                console.error(error);
            });
    };

    const basicDialogFooter = (
        <Button label="Registrar" icon="pi pi-check" onClick={handleRegisterClient} />
    );


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

    const carteraDialogFooter = (
        <Button label="Agregar nueva cartera" icon="pi pi-check" onClick={handleAddCartera}/>
    );

    return (
        <div className="grid">
            <Toast ref={toast} />
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
                        <InputText id="name1" type="text" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="email1">RUC</label>
                        <InputText id="email1" type="text" value={ruc} onChange={(e) => setRuc(e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="age1">Dirección</label>
                        <InputText id="age1" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="carteraSelect">Seleccionar Cartera</label>
                        <Dropdown
                            id="carteraSelect"
                            value={selectedCartera}
                            options={carteraOptions}
                            onChange={(e) => setSelectedCartera(e.value)}
                            placeholder="Seleccione una cartera"
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog header="Agregar Cartera" visible={displayAddCarteraDialog} style={{ width: '30vw' }} modal
                    footer={carteraDialogFooter} onHide={() => setDisplayAddCarteraDialog(false)}>
                <div className="card p-fluid">
                    <div className="field">
                        <label htmlFor="carteraName">Nombre</label>
                        <InputText id="carteraName" type="text" value={carteraName} onChange={(e) => setCarteraName(e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="carteraDescription">Descripción</label>
                        <InputText id="carteraDescription" type="text" value={carteraDescription} onChange={(e)=>setCarteraDescription(e.target.value)}/>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Cartera;
