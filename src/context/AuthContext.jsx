import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { USER_ROLES } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch user profile from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data());
                    } else {
                        // User exists in Auth but not in Firestore (shouldn't happen normally)
                        console.warn('User authenticated but no Firestore profile found');
                        setUserProfile(null);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setUserProfile(null);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Sign up new user
    const signUp = async (email, password, displayName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update display name
            await updateProfile(user, { displayName });

            // Create user profile in Firestore (pending admin approval)
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: displayName,
                role: null, // Will be assigned by admin
                plantId: null,
                isActive: false, // Pending admin approval
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
            });

            return { success: true, user };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    };

    // Sign in existing user
    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if user is active
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                await firebaseSignOut(auth);
                return { success: false, error: 'Usuario no encontrado. Contacte al administrador.' };
            }

            const userData = userDoc.data();
            if (!userData.isActive) {
                await firebaseSignOut(auth);
                return { success: false, error: 'Cuenta pendiente de aprobación por el administrador.' };
            }

            if (!userData.role) {
                await firebaseSignOut(auth);
                return { success: false, error: 'Usuario sin rol asignado. Contacte al administrador.' };
            }

            // Update last login
            await setDoc(doc(db, 'users', user.uid), {
                lastLogin: serverTimestamp(),
            }, { merge: true });

            return { success: true, user };
        } catch (error) {
            console.error('Sign in error:', error);
            let errorMessage = 'Error al iniciar sesión';

            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Email o contraseña incorrectos';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Demasiados intentos fallidos. Intente más tarde.';
            }

            return { success: false, error: errorMessage };
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return userProfile?.role === role;
    };

    // Check if user has any of the specified roles
    const hasAnyRole = (roles) => {
        return roles.includes(userProfile?.role);
    };

    // Check permissions
    const canCreateEntry = () => {
        return hasAnyRole([
            USER_ROLES.ADMIN,
            USER_ROLES.OPERATIONAL_MANAGER,
            USER_ROLES.PLANT_MANAGER,
            USER_ROLES.DATA_ENTRY,
        ]);
    };

    const canEditEntry = (entryUserId) => {
        if (hasRole(USER_ROLES.ADMIN)) return true;
        if (hasRole(USER_ROLES.OPERATIONAL_MANAGER)) return true;
        if (hasRole(USER_ROLES.PLANT_MANAGER)) return true;
        if (hasRole(USER_ROLES.DATA_ENTRY) && entryUserId === currentUser?.uid) return true;
        return false;
    };

    const canDeleteEntry = () => {
        return hasAnyRole([
            USER_ROLES.ADMIN,
            USER_ROLES.OPERATIONAL_MANAGER,
            USER_ROLES.PLANT_MANAGER,
        ]);
    };

    const canManageUsers = () => {
        return hasRole(USER_ROLES.ADMIN);
    };

    const canViewAuditLogs = () => {
        return hasAnyRole([USER_ROLES.ADMIN, USER_ROLES.OPERATIONAL_MANAGER]);
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        signUp,
        signIn,
        signOut,
        hasRole,
        hasAnyRole,
        canCreateEntry,
        canEditEntry,
        canDeleteEntry,
        canManageUsers,
        canViewAuditLogs,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
