import React, {createContext, useState, useContext, ReactNode} from 'react';
import {User} from "../types/models.ts";
import {logoutService} from "../services/fetchUser.ts";

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {
    },
    logout: () => {
    }
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const [user, setUserState] = useState<User | null>(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error al deserializar los datos del usuario", error);
            return null;
        }
    });


    const setUser = (newUser: User | null) => {
        console.log("Nuevo usuario a guardar:", newUser);  // Debugging
        if (newUser && typeof newUser === 'object') {
            try {
                localStorage.setItem('user', JSON.stringify(newUser)); // serializa y guarda
                console.log("Usuario guardado en localStorage");
            } catch (error) {
                console.error("Error al guardar en localStorage", error);
            }
        } else {
            localStorage.removeItem('user'); // elimina si el usuario es null
        }
        setUserState(newUser); // actualiza el estado del usuario
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('login');
        setUserState(null);
        logoutService();
    };

    return (
        <UserContext.Provider value={{user, setUser, logout}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);