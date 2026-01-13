import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import { apiConfig } from '../config';

export const auditService = {
    // Record an action in the audit log
    async logAction(action, resourceType, resourceId, details = {}) {
        try {
            const user = auth.currentUser;
            if (!user) return;

            // Get IP Info (using ipapi.co as configured)
            let ipData = null;
            try {
                const response = await fetch(apiConfig.ipGeolocation);
                ipData = await response.json();
            } catch (err) {
                console.warn('Geolocation fetch failed:', err);
            }

            const logEntry = {
                userId: user.uid,
                userEmail: user.email,
                action, // 'create' | 'update' | 'delete' | 'login' | 'approve_user'
                resourceType, // 'data_entry' | 'user' | 'auth'
                resourceId,
                timestamp: serverTimestamp(),
                details,
                ip: ipData?.ip || 'unknown',
                location: ipData ? {
                    city: ipData.city,
                    region: ipData.region,
                    country: ipData.country_name,
                    latitude: ipData.latitude,
                    longitude: ipData.longitude
                } : null,
                userAgent: navigator.userAgent
            };

            await addDoc(collection(db, 'audit_logs'), logEntry);
        } catch (error) {
            console.error('Audit log error:', error);
            // We don't throw error here to avoid blocking the main action
        }
    }
};
