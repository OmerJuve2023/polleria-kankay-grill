import styles from "../styles/AgregarOrden.module.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiTrash2, FiShoppingCart, FiCheck } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { listarProductos, Producto } from "../api/productoApi";
import { agregarProductoOrden, OrdenProducto } from "../api/ordenApi";
import api from "../api/api";
import { obtenerEstadoMesa, cambiarEstadoMesa } from "../api/mesaApi";


const AgregarOrden: React.FC = () => {
    const { idMesa } = useParams<{ idMesa: string }>();
    const navigate = useNavigate();
    const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [productosSeleccionados, setProductosSeleccionados] = useState<(OrdenProducto & Producto)[]>([]);
    const [estadoMesa, setEstadoMesa] = useState<string>("");
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    useEffect(() => {
        const fetchEstadoMesa = async () => {
            const estado = await obtenerEstadoMesa(Number(idMesa));
            setEstadoMesa(estado);
        };
        if (idMesa) fetchEstadoMesa();
    }, [idMesa]);

    const handleBusqueda = async (query: string) => {
        setBusqueda(query);
        if (query.trim() === "") {
            setProductosFiltrados([]);
            return;
        }

        const todosProductos = await listarProductos();
        const filtrados = todosProductos.filter((producto) =>
            producto.nombre.toLowerCase().includes(query.toLowerCase())
        );
        setProductosFiltrados(filtrados);
    };

    const handleCantidadChange = (productoId: number, cantidad: number) => {
        setProductosSeleccionados((prev) =>
            prev.map((p) =>
                p.productoId === productoId ? { ...p, cantidad } : p
            )
        );
    };

    const handleEliminarProducto = (productoId: number) => {
        const elementToRemove = document.querySelector(`[data-id="${productoId}"]`);
        if (elementToRemove) {
            elementToRemove.classList.add(styles.slideOut);
            setTimeout(() => {
                setProductosSeleccionados((prev) =>
                    prev.filter((p) => p.productoId !== productoId)
                );
                toast.success("Producto eliminado");
            }, 300);
        }
    };

    const handleSeleccionarProducto = (producto: Producto) => {
        if (productosSeleccionados.some((p) => p.productoId === producto.id)) {
            toast.warning("El producto ya ha sido agregado");
            return;
        }

        setProductosSeleccionados((prev) => [
            ...prev,
            { ...producto, productoId: producto.id, cantidad: 1 },
        ]);
        setBusqueda("");
        setProductosFiltrados([]);

        // Mostrar toast con animación personalizada
        toast.success("Producto agregado", {
            position: "top-right",
            className: styles.customToast,
        });
    };

    const handleCrearOrden = async () => {
        if (!idMesa) {
            toast.error("Por favor, selecciona una mesa");
            return;
        }

        if (estadoMesa === "OCUPADO") {
            toast.error("La mesa está ocupada, no puedes agregar una orden");
            return;
        }

        try {
            setIsCreatingOrder(true);

            const ordenResponse = await api.post("/ordenes", {
                mesa_id: idMesa,
                estado: "ABIERTA",
            }, { withCredentials: true });

            const nuevaOrdenId = ordenResponse.data.id;
            await cambiarEstadoMesa(Number(idMesa), "OCUPADO");

            for (const producto of productosSeleccionados) {
                await agregarProductoOrden(nuevaOrdenId, {
                    productoId: producto.productoId,
                    cantidad: producto.cantidad,
                });
            }

            setShowSuccessAnimation(true);

            // Toast personalizado para orden creada
            toast.success("¡Orden creada exitosamente!", {
                position: "top-center",
                className: styles.successToast,
            });

            setTimeout(() => {
                setProductosSeleccionados([]);
                navigate("/home");
            }, 2000);

        } catch (error) {
            console.log(error);
            toast.error("Ocurrió un error al crear la orden");
        } finally {
            setIsCreatingOrder(false);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            {showSuccessAnimation && (
                <div className={styles.successOverlay}>
                    <div className={styles.successAnimation}>
                        <FiCheck className={styles.checkIcon} />
                        <p>¡Orden Creada!</p>
                    </div>
                </div>
            )}

            <div className={styles.header}>
                <h2 className={styles.title}>
                    Agregar Orden - Mesa {idMesa}
                </h2>
                {estadoMesa === "OCUPADO" && (
                    <div className={styles.alertOcupado}>
                        La mesa está ocupada. No se puede agregar orden.
                    </div>
                )}
            </div>

            <div className={styles.searchSection}>
                <div className={styles.searchContainer}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar producto..."
                        value={busqueda}
                        onChange={(e) => handleBusqueda(e.target.value)}
                    />
                </div>

                {productosFiltrados.length > 0 && (
                    <div className={styles.searchResults}>
                        {productosFiltrados.map((producto) => (
                            <div
                                key={producto.id}
                                className={`${styles.searchItem} ${styles.fadeIn}`}
                            >
                                <div className={styles.productInfo}>
                                    <span className={styles.productName}>{producto.nombre}</span>
                                    <span className={styles.productPrice}>
                                        ${producto.precio.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    className={styles.addButton}
                                    onClick={() => handleSeleccionarProducto(producto)}
                                >
                                    <FiPlus />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.selectedProducts}>
                <h3 className={styles.sectionTitle}>
                    <FiShoppingCart /> Productos Seleccionados
                </h3>
                {productosSeleccionados.map((producto) => (
                    <div
                        key={producto.productoId}
                        data-id={producto.productoId}
                        className={`${styles.selectedItem} ${styles.slideIn}`}
                    >
                        <div className={styles.productInfo}>
                            <span className={styles.productName}>{producto.nombre}</span>
                            <span className={styles.productPrice}>
                                ${producto.precio.toFixed(2)}
                            </span>
                        </div>
                        <div className={styles.productActions}>
                            <input
                                type="number"
                                min="1"
                                className={styles.quantityInput}
                                value={producto.cantidad}
                                onChange={(e) =>
                                    handleCantidadChange(
                                        producto.productoId,
                                        Number(e.target.value)
                                    )
                                }
                            />
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleEliminarProducto(producto.productoId)}
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className={`${styles.createOrderButton} ${isCreatingOrder ? styles.loading : ''}`}
                onClick={handleCrearOrden}
                disabled={productosSeleccionados.length === 0 || estadoMesa === "OCUPADO" || isCreatingOrder}
            >
                {isCreatingOrder ? 'Creando orden...' : 'Crear Orden'}
            </button>
        </div>
    );
};

export default AgregarOrden;