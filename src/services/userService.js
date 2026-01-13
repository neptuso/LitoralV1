import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';

export const userService = {
    // Get all users (Admin only)
    async getAllUsers() {
        try {
            const q = query(collection(db, USERS_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    },

    // Get users pending approval
    async getPendingUsers() {
        try {
            const q = query(
                collection(db, USERS_COLLECTION),
                where('isActive', '==', false),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting pending users:', error);
            throw error;
        }
    },

    // Update user role and status (Admin only)
    async updateUserAccess(uid, { role, plantId, isActive }) {
        try {
            const userRef = doc(db, USERS_COLLECTION, uid);
            await updateDoc(userRef, {
                role,
                plantId: plantId || null,
                isActive,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating user access:', error);
            throw error;
        }
    },

    // Get specific user profile
    async getUserProfile(uid) {
        try {
            const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
            if (userDoc.exists()) {
                return { id: userDoc.id, ...userDoc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    }
};
