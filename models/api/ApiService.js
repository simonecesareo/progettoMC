import * as Location from 'expo-location';
import { Alert } from "react-native";

export default class ApiService {
    // URL base del server
    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";

    // Metodo generico per effettuare richieste al server
    static async genericRequest(endpoint, method, queryParams = {}, bodyParams = null) {
        const url = `${this.BASE_URL}${endpoint}?${new URLSearchParams(queryParams).toString()}`;
        //console.log(`Sending ${method} request to: ${url}`);

        const options = {
            method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            ...(bodyParams && { body: JSON.stringify(bodyParams) }), // Aggiunge il body solo se non è null
        };

        try {
            const response = await fetch(url, options); // Effettua la richiesta
            if (![200, 201, 204].includes(response.status)) {
                const errorMessage = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorMessage}`);
            }
            const responseText = await response.text(); // Legge la risposta come testo
            return responseText ? JSON.parse(responseText) : null; // Restituisce null se il corpo è vuoto
        } catch (error) {
            console.error(`Error during ${method} request to ${url}:`, error);
            throw error;
        }
    }

    // Effettua una richiesta GET generica
    static async genericGetRequest(endpoint, queryParams = {}) {
        return this.genericRequest(endpoint, "GET", queryParams);
    }

    // Effettua una richiesta POST generica
    static async genericPostRequest(endpoint, queryParams = {}, bodyParams = {}) {
        return this.genericRequest(endpoint, "POST", queryParams, bodyParams);
    }

    // Effettua una richiesta PUT generica
    static async genericPutRequest(endpoint, queryParams = {}, bodyParams = {}) {
        return this.genericRequest(endpoint, "PUT", queryParams, bodyParams);
    }

    // Registra un utente sul server
    static async registerUser() {
        return this.genericPostRequest("user");
    }

    // Ottiene i dati di un utente dal server
    static async getUser(uid, sid) {
        const endpoint = `user/${uid}`;
        return this.genericGetRequest(endpoint, { sid });
    }

    // Modifica i dati di un utente sul server
    static async modifyUser(uid, sid, user) {
        const endpoint = `user/${uid}`;
        const bodyParams = { ...user, sid };
        console.log("Modifying user with body:", bodyParams);
        return this.genericPutRequest(endpoint, {}, bodyParams);
    }

    // Ottiene una lista di menu vicini all'utente
    static async getNearbyMenus(latitude, longitude, sid) {
        const queryParams = { lat: latitude, lng: longitude, sid };
        return this.genericGetRequest("menu", queryParams);
    }

    // Ottiene i dettagli di un menu specifico
    static async getMenuDetails(mid, sid, latitude, longitude) {
        const queryParams = { sid, lat: latitude, lng: longitude };
        const endpoint = `menu/${mid}`;
        return this.genericGetRequest(endpoint, queryParams);
    }

    // Ottiene l'immagine di un menu
    static async getMenuImage(mid, sid) {
        const queryParams = { sid };
        const endpoint = `menu/${mid}/image`;
        let image = await this.genericGetRequest(endpoint, queryParams);
        console.log(`Length of image received for mid ${mid}:`, image.base64.length);
        return image.base64;
    }

    // Chiede i permessi per accedere alla posizione dell'utente
    static async locationPermissionAsync() {
        try {
            const granted = await Location.getForegroundPermissionsAsync();
            if (granted.status === "granted") return true;

            const request = await Location.requestForegroundPermissionsAsync();
            return request.status === "granted";
        } catch (error) {
            console.error("Error requesting location permission:", error);
            Alert.alert(
                "Accesso alla posizione negato o non disponibile",
                "Concedi i permessi tramite le impostazioni del dispositivo per accedere alla posizione.",
                [
                    {
                        text: "Ho capito",
                        style: "cancel",
                    }
                ],
                { cancelable: false } // Imposta la finestra di conferma come non annullabile
            );
            return false;
        }
    }

    // Ottiene la posizione corrente dell'utente
    static async getUserCurrentLocation(canUseLocation) {
        if (!canUseLocation) return null;

        try {
            const location = await Location.getCurrentPositionAsync();
            console.log("User location received:", location);
            return location;
        } catch (error) {
            console.error("Error retrieving user location:", error);
            return null;
        }
    }

    // Effettua un ordine di un menu
    static async makeOrder(mid, sid, userLocation){
        const bodyParams = {
            "sid": sid, 
            "deliveryLocation":{
                "lat": userLocation.coords.latitude,
                "lng": userLocation.coords.longitude
            } 
        };
        const endpoint = `menu/${mid}/buy`;
        console.log("Making order with body:", bodyParams);
        return this.genericPostRequest(endpoint, {}, bodyParams);
    }

    // Ottiene lo stato di un ordine
    static async getOrderStatus(sid, oid){
        const queryParams = { sid };
        const endpoint = `order/${oid}`;
        return this.genericGetRequest(endpoint, queryParams);
    }

    // Verifica se l'utente ha già un ordine in corso non completato
    static async isOrderActive(uid, sid){
        const user = await this.getUser(uid, sid);
        if(user.orderStatus === "ON_DELIVERY") return true;
        return false;
    }

    // Verifica se l'utente è già registrato 
    // (il campo del nome non può essere null se l'utente si è registrato, poichè in fase di modifica del profilo il campo del nome è obbligatorio)
    static async isRegistered (uid, sid){
        const user = await this.getUser(uid, sid);
        console.log("User data:", user);
        if(user.firstName !== null) return true;
        return false;
    }
}
