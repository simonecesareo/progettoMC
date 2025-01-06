import ApiService from "./models/api/ApiService";
import Menu from "./models/objects/Menu";
import DetailedMenu from "./models/objects/DetailedMenu";
import StorageManager from "./models/storage/StorageManager";

const ViewModel = {
    async fetchMenus(latitude, longitude, sid) {
        try {
            const result = await ApiService.getNearbyMenus(latitude, longitude, sid);
            return result.map(item => 
                new Menu(
                    item.mid,
                    item.name,
                    item.shortDescription,
                    item.price,
                    item.deliveryTime,
                    item.imageVersion,
                    item.location
                )
            );
        } catch (error) {
            console.error("Errore durante il recupero della lista dei menu:", error);
            return [];
        }
    },

    async fetchDetailedMenu(mid, sid, latitude, longitude) {
        try {
            const result = await ApiService.getMenuDetails(mid, sid, latitude, longitude);
            return new DetailedMenu(
                result.mid,
                result.name,
                result.shortDescription,
                result.price,
                result.deliveryTime,
                result.imageVersion,
                result.location,
                result.longDescription
            );
        } catch (error) {
            console.error("Errore durante il recupero dei dettagli del menu:", error);
            return null;
        }
    },

    async getLocationPermits() {
        try {
            return await ApiService.locationPermissionAsync();
        } catch (error) {
            console.error("Errore durante la richiesta dei permessi di posizione:", error);
            return false;
        }
    },

    async getUserLocation(canUseLocation) {
        try {
            if (!canUseLocation) throw new Error("Permessi di posizione non concessi.");
            return await ApiService.getUserCurrentLocation(canUseLocation);
        } catch (error) {
            console.error("Errore durante il recupero della posizione dell'utente:", error);
            return null;
        }
    },


    
};

export default ViewModel;
