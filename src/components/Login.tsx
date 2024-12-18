import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/Login.module.css";
import logo from "../assets/kankay.jpg";
import { FaLock, FaUser } from "react-icons/fa";
import {fetchUser} from "../services/fetchUser.ts";
import {User} from "../types/models.ts";
import {HOME_ROUTE} from "../routes/RestaurantRoute.ts";
import {useUser} from "../context/AuthContext.tsx";


const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setUser } = useUser();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetchUser(username, password);
            const userData:User =response;
            setUser(userData);
            if (userData) {
                console.log("Usuario a guardar:", userData);  // Log para ver el usuario antes de guardarlo
                setUser(userData);  // Aquí se guarda el usuario en el contexto
            } else {
                console.error("No se obtuvo un usuario válido de la respuesta.");
            }
            setError(null);
            setTimeout(() => {
                setLoading(false);
                navigate(HOME_ROUTE);
            }, 2000);
        } catch (error) {
            setLoading(false);
            setError('Credenciales inválidas. Inténtalo de nuevo.');
            console.error('Error en el login:', error);
        }
    };

    return (
        <div className={`${styles.loginWrapper} ${mounted ? styles.mounted : ''}`}>
            <div className={styles.backgroundOverlay}></div>
            <div className={styles.companyInfo}>
                <h1 className={styles.companyTitle}>Bienvenido a Kankay Grill</h1>
                <p className={styles.companySubtitle}>Control de Pedidos</p>
            </div>
            <div className={styles.loginContainer}>
                <div className={styles.loginBox}>
                    <img src={logo} alt="Logo" className={styles.logo}/>
                    <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
                    <form onSubmit={handleLogin}>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Email</label>
                            <div className={styles.inputIconContainer}>
                                <FaUser className={styles.inputIcon}/>
                                <input
                                    type="email"
                                    className={styles.formControl}
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Ingresa tu correo electrónico"
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Contraseña</label>
                            <div className={styles.inputIconContainer}>
                                <FaLock className={styles.inputIcon}/>
                                <input
                                    type="password"
                                    className={styles.formControl}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Ingresa tu contraseña"
                                />
                            </div>
                        </div>
                        <br/>
                        <button type="submit" className={styles.btnPrimary} disabled={loading}>
                            {loading ? (
                                <>
                                    <span>Cargando...</span>
                                    <div className={styles.spinner}></div>
                                </>
                            ) : (
                                'Iniciar sesión'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;