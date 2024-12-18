import React, { useEffect, useState } from "react";
import { listarProductos, Producto } from "../api/productoApi.ts";
import { FaBox, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from '../styles/ProductoList.module.css';

const ProductoList: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                const productosData = await listarProductos();
                setProductos(productosData);
            } catch (err) {
                console.log(err)
                setError('Error al cargar los productos');
                toast.error('No se pudieron cargar los productos');
            } finally {
                setLoading(false);
            }
        };
        fetchProductos().then(r => r);
    }, []);

    const getCategoriaClass = (categoria: string) => {
        const categoriaLower = categoria.toLowerCase();
        return styles[`categoria${categoriaLower}`] || styles.categoriaDefault;
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <FaSpinner className={styles.spinner} />
                <p>Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <FaExclamationTriangle className={styles.errorIcon} />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.productosContainer}>
            <div className={styles.header}>
                <FaBox className={styles.headerIcon} />
                <h2>Productos</h2>
            </div>

            {productos.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No hay productos disponibles.</p>
                </div>
            ) : (
                <div className={styles.productosGrid}>
                    {productos.map((producto) => (
                        <div key={producto.id} className={styles.productoCard}>
                            <div className={styles.productoImageContainer}>
                                {/*<img
                                    src="/api/placeholder/200/200"
                                    alt={producto.nombre}
                                    className={styles.productoImage}
                                />*/}
                            </div>
                            <div className={styles.productoInfo}>
                                <h3 className={styles.productoNombre}>{producto.nombre}</h3>
                                <span className={`${styles.categoria} ${getCategoriaClass(producto.categoria)}`}>
                                    {producto.categoria}
                                </span>
                                <div className={styles.productoFooter}>
                                    <span className={styles.productoPrecio}>
                                        ${producto.precio.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductoList;