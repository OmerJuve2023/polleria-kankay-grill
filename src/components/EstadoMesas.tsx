import styles from "../../src/styles/EstadoMesas.module.css";
import React, { useEffect, useState } from "react";
import { cambiarEstadoMesa, listarMesas, Mesa } from "../api/mesaApi";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {FaTable, FaClipboardList, FaSearch, FaFilter, FaPlus} from 'react-icons/fa';
import { MdEventAvailable, MdEventBusy, MdRestaurant, MdRefresh } from 'react-icons/md';
import {FaList} from "react-icons/fa6";
import api from "../api/api.ts";
import {BsWallet} from "react-icons/bs";
import {BiBox} from "react-icons/bi";


const EstadoMesas: React.FC = () => {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEstado, setFilterEstado] = useState<string>("TODOS");
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();
    const [salesStats, setSalesStats] = useState({ totalSalesAmount: 0, totalProductsSold: 0 });

    useEffect(() => {
        const fetchMesas = async () => {
            try {
                setLoading(true);
                const mesasData = await listarMesas();
                setMesas(mesasData);
                toast.success('Mesas cargadas correctamente');
            } catch (error) {
                toast.error('Error al cargar las mesas');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchSalesStats = async () => {
            try {
                const response = await api.get("/ordenes/sales",{
                    withCredentials: true
                });
                setSalesStats(response.data);
            } catch (error) {
                toast.error('Error al cargar las estadísticas de ventas');
                console.error('Error:', error);
            }
        };

        fetchMesas();
        fetchSalesStats();

        // Actualizar datos cada 30 segundos
        const interval = setInterval(() => {
            setRefreshKey(old => old + 1);
        }, 30000);

        return () => clearInterval(interval);
    }, [refreshKey]);


    const actualizarEstado = async (id: number, nuevoEstado: Mesa["estado"]) => {
        try {
            const loadingToast = toast.loading("Actualizando estado...");
            const mesaActualizada = await cambiarEstadoMesa(id, nuevoEstado);
            setMesas((prevMesas) =>
                prevMesas.map((mesa) =>
                    mesa.id === mesaActualizada.id ? mesaActualizada : mesa
                )
            );
            toast.dismiss(loadingToast);
            toast.success(`Mesa ${mesaActualizada.numero} actualizada a ${nuevoEstado}`);
        } catch (error) {
            toast.error('Error al actualizar el estado de la mesa');
            console.error('Error:', error);
        }
    };

    const handleAgregarOrden = (idMesa: number) => {
        const mesa = mesas.find((mesa) => mesa.id === idMesa);
        if (mesa && (mesa.estado === "DISPONIBLE" || mesa.estado === "RESERVADO")) {
            navigate(`/agregar-orden/${idMesa}`);
        } else {
            toast.warning("La mesa no está disponible para agregar una orden.");
        }
    };

    const handleManualRefresh = () => {
        setRefreshKey(old => old + 1);
        toast.info('Actualizando datos...');
    };

    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case "DISPONIBLE":
                return <MdEventAvailable className="mb-2" size={24} />;
            case "RESERVADO":
                return <MdEventBusy className="mb-2" size={24} />;
            case "OCUPADO":
                return <MdRestaurant className="mb-2" size={24} />;
            default:
                return <FaTable className="mb-2" size={24} />;
        }
    };

    const filteredMesas = mesas
        .filter(mesa =>
            mesa.numero.toString().includes(searchTerm) &&
            (filterEstado === "TODOS" || mesa.estado === filterEstado)
        )
        .sort((a, b) => a.numero - b.numero);

    const estadisticas = {
        total: mesas.length,
        disponibles: mesas.filter(m => m.estado === "DISPONIBLE").length,
        reservadas: mesas.filter(m => m.estado === "RESERVADO").length,
        ocupadas: mesas.filter(m => m.estado === "OCUPADO").length
    };

    return (
        <div className="container py-4">
            {/* Header y Estadísticas */}
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className={`${styles.title} text-center`}>
                        <FaTable className="me-2"/>
                        Estado de las Mesas
                    </h1>
                </div>
                <div className="col-12">
                    <div className={`${styles.statsContainer} row text-center g-2`}>
                        <div className="col-6 col-md-3">
                            <div className={`${styles.statCard} bg-light`}>
                                <h5>Total</h5>
                                <span>{estadisticas.total}</span>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className={`${styles.statCard} bg-success bg-opacity-25`}>
                                <h5>Disponibles</h5>
                                <span>{estadisticas.disponibles}</span>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className={`${styles.statCard} bg-warning bg-opacity-25`}>
                                <h5>Reservadas</h5>
                                <span>{estadisticas.reservadas}</span>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className={`${styles.statCard} bg-danger bg-opacity-25`}>
                                <h5>Ocupadas</h5>
                                <span>{estadisticas.ocupadas}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row text-center g-4 mb-4">
                {/* Card de Ventas Totales */}
                <div className="col-12 col-md-6">
                    <div className="card bg-light shadow-sm border-info rounded p-4">
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <BsWallet className="text-info" size={48}/> {/* Icono de billetera de Lucide */}
                            <h5 className="text-info">Ventas Totales</h5>
                        </div>
                        <div className="fs-4 fw-bold text-info">
                            <span>S/. {salesStats.totalSalesAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                {/* Card de Productos Vendidos */}
                <div className="col-12 col-md-6">
                    <div className="card bg-light shadow-sm border-primary rounded p-4">
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <BiBox className="text-primary" size={48}/> {/* Icono de caja de productos de Lucide */}
                            <h5 className="text-primary">Productos Vendidos</h5>
                        </div>
                        <div className="fs-4 fw-bold text-primary">
                            <span>{salesStats.totalProductsSold}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="row mb-4">
                <div className="col-12 col-md-4 mb-3 mb-md-0">
                    <div className="input-group">
                        <span className="input-group-text">
                            <FaSearch/>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por número..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-4 mb-3 mb-md-0">
                    <div className="input-group">
                        <span className="input-group-text">
                            <FaFilter/>
                        </span>
                        <select
                            className="form-select"
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                        >
                            <option value="TODOS">Todos los estados</option>
                            <option value="DISPONIBLE">Disponibles</option>
                            <option value="RESERVADO">Reservadas</option>
                            <option value="OCUPADO">Ocupadas</option>
                        </select>
                    </div>
                </div>
                <div className="col-12 col-md-4 text-end">
                    <button
                        className="btn btn-outline-primary w-100"
                        onClick={handleManualRefresh}
                        disabled={loading}
                    >
                        <MdRefresh className={loading ? styles.spin : ''}/>
                        {loading ? ' Cargando...' : ' Actualizar'}
                    </button>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex gap-2 justify-content-center">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/productos')}
                        >
                            <FaList className="me-2"/>
                            Listar Productos
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={() => navigate('/addProducto')}
                        >
                            <FaPlus className="me-2"/>
                            Agregar pedido
                        </button>
                        <button
                            className="btn btn-info text-white"
                            onClick={() => navigate('/ordenes')}
                        >
                            <FaClipboardList className="me-2"/>
                            Lista de Órdenes
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid de Mesas */}
            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : filteredMesas.length === 0 ? (
                <div className={`${styles.emptyState} text-center`}>
                    <FaTable size={48} className="text-muted mb-3"/>
                    <h3>No se encontraron mesas</h3>
                    <p className="text-muted">Prueba con otros filtros de búsqueda</p>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                    {filteredMesas.map((mesa) => (
                        <div key={mesa.id} className="col">
                            <div className={`${styles.mesaCard} card h-100`}>
                                <div className={`card-body text-center ${styles[mesa.estado.toLowerCase()]}`}>
                                    {getEstadoIcon(mesa.estado)}
                                    <h3 className={`${styles.mesaTitle} card-title`}>
                                        Mesa {mesa.numero}
                                    </h3>
                                    <div className={`${styles.estadoTag} badge mb-3`}>
                                        {mesa.estado}
                                    </div>

                                    <div className={`${styles.buttonContainer} d-grid gap-2`}>
                                        {mesa.estado === "DISPONIBLE" && (
                                            <>
                                                <button
                                                    onClick={() => actualizarEstado(mesa.id, "RESERVADO")}
                                                    className="btn btn-success"
                                                >
                                                    <MdEventBusy className="me-2"/>
                                                    Reservar
                                                </button>
                                                <button
                                                    onClick={() => handleAgregarOrden(mesa.id)}
                                                    className="btn btn-primary"
                                                >
                                                    <FaClipboardList className="me-2"/>
                                                    Agregar Orden
                                                </button>
                                            </>
                                        )}
                                        {mesa.estado === "RESERVADO" && (
                                            <>
                                                <button
                                                    onClick={() => actualizarEstado(mesa.id, "DISPONIBLE")}
                                                    className="btn btn-warning"
                                                >
                                                    <MdEventAvailable className="me-2"/>
                                                    Liberar Mesa
                                                </button>
                                                <button
                                                    onClick={() => handleAgregarOrden(mesa.id)}
                                                    className="btn btn-primary"
                                                >
                                                    <FaClipboardList className="me-2"/>
                                                    Agregar Orden
                                                </button>
                                            </>
                                        )}
                                        {mesa.estado === "OCUPADO" && (
                                            <button
                                                onClick={() => actualizarEstado(mesa.id, "DISPONIBLE")}
                                                className="btn btn-danger"
                                            >
                                                <MdEventAvailable className="me-2"/>
                                                Finalizar Uso
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EstadoMesas;