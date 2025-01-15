export default class Menu {
    constructor(mid, name, shortDescription, price, deliveryTime, imageVersion, location) {
        this.mid = mid; // ID del menù
        this.name = name; // Nome del menù
        this.shortDescription = shortDescription; // Breve descrizione
        this.price = price; // Prezzo
        this.deliveryTime = deliveryTime; // Tempo di consegna
        this.imageVersion = imageVersion; // Versione dell'immagine
        this.location = location; // Oggetto con latitudine e longitudine
        this.image=null; // Immagine del menu
    }
}

