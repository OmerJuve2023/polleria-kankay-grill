import React, { useState} from "react";
import { agregarProducto, Producto } from "../api/productoApi.ts";
import { FaPlus, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from '../styles/AgregarProducto.module.css';

const AgregarProducto: React.FC = () => {
    const [nombre, setNombre] = useState<string>("");
    const [categoria, setCategoria] = useState<string>("");
    const [precio, setPrecio] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [errors, setErrors] = useState<{
        nombre?: string;
        categoria?: string;
        precio?: string;
    }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!nombre.trim()) {
            newErrors.nombre = "El nombre es requerido";
        }

        if (!categoria.trim()) {
            newErrors.categoria = "La categoría es requerida";
        }

        const precioNum = parseFloat(precio);
        if (!precio || isNaN(precioNum) || precioNum <= 0) {
            newErrors.precio = "Ingrese un precio válido mayor a 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setNombre("");
        setCategoria("");
        setPrecio("");
        setErrors({});
    };

    const handleAgregarProducto = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const nuevoProducto: Omit<Producto, "id"> = {
            nombre: nombre.trim(),
            categoria: categoria.trim(),
            precio: parseFloat(precio),
        };

        try {
            await agregarProducto(nuevoProducto);
            setShowSuccess(true);
            resetForm();

            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

        } catch (error) {
            toast.error("Error al agregar el producto");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={`${styles.productoFormContainer} ${showSuccess ? styles.success : ''}`}>
                <div className={styles.formHeader}>
                    <h2 className={styles.productoTitle}>
                        <FaPlus className={styles.headerIcon} />
                        Agregar Nuevo Producto
                    </h2>
                    {showSuccess && (
                        <div className={styles.successAnimation}>
                            <FaCheckCircle className={styles.checkIcon} />
                            <span>¡Producto agregado exitosamente!</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleAgregarProducto} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Nombre del Producto
                            <input
                                type="text"
                                className={`${styles.formControl} ${errors.nombre ? styles.error : ''}`}
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Manzana"
                            />
                        </label>
                        {errors.nombre && (
                            <div className={styles.errorMessage}>{errors.nombre}</div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Categoría
                            <input
                                type="text"
                                className={`${styles.formControl} ${errors.categoria ? styles.error : ''}`}
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                placeholder="Ej: Frutas"
                            />
                        </label>
                        {errors.categoria && (
                            <div className={styles.errorMessage}>{errors.categoria}</div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Precio
                            <div className={styles.priceInputContainer}>
                                <span className={styles.currencySymbol}>$</span>
                                <input
                                    type="number"
                                    className={`${styles.formControl} ${styles.priceInput} ${errors.precio ? styles.error : ''}`}
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </label>
                        {errors.precio && (
                            <div className={styles.errorMessage}>{errors.precio}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`${styles.submitBtn} ${isLoading ? styles.loading : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className={styles.spinnerIcon} />
                                <span>Agregando...</span>
                            </>
                        ) : (
                            <>
                                <FaPlus />
                                <span>Agregar Producto</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AgregarProducto;