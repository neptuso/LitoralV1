import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { auditService } from './auditService';

const DATA_COLLECTION = 'data_entries';

export const dataService = {
    // Create a new data entry
    async createEntry(userId, plantId, data) {
        try {
            const entry = {
                userId,
                plantId,
                data,
                status: 'pending', // pending, synced, error
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, DATA_COLLECTION), entry);

            // Log the action
            await auditService.logAction('create', 'data_entry', docRef.id, { plantId });

            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error creating data entry:', error);
            throw error;
        }
    },

    // Get entries for a specific plant (Plant Manager)
    async getPlantEntries(plantId) {
        try {
            const q = query(
                collection(db, DATA_COLLECTION),
                where('plantId', '==', plantId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting plant entries:', error);
            throw error;
        }
    },

    // Get all entries (Admin/Gerente Operativo)
    async getAllEntries() {
        try {
            const q = query(collection(db, DATA_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting all entries:', error);
            throw error;
        }
    },

    // Get statistics for the dashboard
    async getDashboardStats(plantId = null) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let q;
            if (plantId) {
                q = query(
                    collection(db, DATA_COLLECTION),
                    where('plantId', '==', plantId),
                    where('createdAt', '>=', today),
                    orderBy('createdAt', 'desc')
                );
            } else {
                q = query(
                    collection(db, DATA_COLLECTION),
                    where('createdAt', '>=', today),
                    orderBy('createdAt', 'desc')
                );
            }

            const querySnapshot = await getDocs(q);
            const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const lastSyncedEntry = entries.find(e => e.status === 'synced');

            return {
                todayCount: entries.length,
                pendingCount: entries.filter(e => e.status === 'pending').length,
                lastSyncTime: lastSyncedEntry?.updatedAt?.toDate() || null
            };
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            // Fallback for missing indexes or errors
            return { todayCount: 0, pendingCount: 0, lastSyncTime: null };
        }
    }
};
