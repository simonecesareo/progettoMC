import * as SQLite from 'expo-sqlite';

export default class StorageManager {
    constructor() {
        this.db = null; // Inizializza il database a null
    }

    // Metodo per aprire il database
    async openDB() {
        try {
            this.db = await SQLite.openDatabaseAsync("StorageDB"); // Apre il database
            const createSidTableQuery = `CREATE TABLE IF NOT EXISTS Sid (sid TEXT);`;
            const createMenuImageTableQuery = `CREATE TABLE IF NOT EXISTS MenuImage (mid INTEGER PRIMARY KEY, imageVersion INTEGER, imageBase64 TEXT);`;
            const createUidTableQuery = `CREATE TABLE IF NOT EXISTS Uid (uid INTEGER);`;
            // Esegui le query di creazione delle tabelle
            await this.db.execAsync(createSidTableQuery);
            await this.db.execAsync(createMenuImageTableQuery);
            await this.db.execAsync(createUidTableQuery);
        } catch (error) {
            console.error("Errore durante l'apertura del database:", error);
        }
    }

    // Metodo per salvare il SID nel database
    async saveSid(sid) {
        try {
            if (!this.db) throw new Error("Database non aperto.");
            const query = "INSERT OR REPLACE INTO Sid (sid) VALUES (?);";
            await this.db.runAsync(query, sid);
            console.log("SID salvato con successo.");
        } catch (error) {
            console.error("Errore durante il salvataggio del SID:", error);
        }
    }

    // Metodo per salvare l'UID nel database
    async saveUid(uid) {
        try{
            if (!this.db) throw new Error("Database non aperto.");
            const query = "INSERT OR REPLACE INTO Uid (uid) VALUES (?);";
            await this.db.runAsync(query, uid);
            console.log("UID salvato con successo.");
        } catch (error) {
            console.error("Errore durante il salvataggio dell'UID:", error);
        }
    }

    // Metodo per recuperare il Sid dell'utente dal database
    async getSid() {
        try {
            if (!this.db) throw new Error("Database non aperto.");
            const query = "SELECT * FROM Sid";
            const result = await this.db.getFirstAsync(query);
            return result; // Restituisce il SID o null se non presente
        } catch (error) {
            console.error("Errore durante il recupero del SID:", error);
            return null;
        }
    }

    // Metodo per recuperare l'Uid dell'utente dal database
    async getUid() {
        try {
            if (!this.db) throw new Error("Database non aperto.");
            const query = "SELECT * FROM Uid";
            const result = await this.db.getFirstAsync(query);
            return result; // Restituisce l'UID o null se non presente
        } catch (error) {
            console.error("Errore durante il recupero dell'UID:", error);
            return null;
        }
    }

    // Metodo per salvare un'immagine di menu nel database
    async saveMenuImage(mid, imageVersion, imageBase64) {
        try {
            if (!this.db) throw new Error("Database non aperto.");
            const query = "INSERT OR REPLACE INTO MenuImage (mid, imageVersion, imageBase64) VALUES (?, ?, ?);";
            await this.db.runAsync(query, [mid, imageVersion, imageBase64]);
            console.log(`Immagine del menu con mid ${mid} salvata con successo.`);
        } catch (error) {
            console.error(`Errore durante il salvataggio dell'immagine del menu con mid ${mid}:`, error);
        }
    }

    // Metodo per verificare se l'immagine è aggiornata
    async isImageUpToDate(mid, imageVersion) {
        try {
            if (!this.db) throw new Error("Database non aperto.");
            const query = "SELECT imageVersion FROM MenuImage WHERE mid = ?;";
            const result = await this.db.getFirstAsync(query, mid);

            //console.log(`Risultato della query per mid ${mid}:`, result, "confrontato con imageVersion", imageVersion);

            // Converte entrambi i valori a stringa per il confronto
            const isUpToDate = result ? String(result.imageVersion) === String(imageVersion) : false;
            //console.log("Risultato del confronto per immagine del menu (", mid, "):", isUpToDate);

            return isUpToDate;
        } catch (error) {
            console.error(`Errore durante la verifica dell'immagine con mid ${mid}:`, error);
            return false; // Ritorna false in caso di errore
        }
    }


    // Metodo per eliminare un'immagine dal database
    async deleteMenuImage(mid) {
        try {
            if (!this.db) throw new Error("Database non aperto.");
            const query = "DELETE FROM MenuImage WHERE mid = ?;";
            await this.db.runAsync(query, [mid]);
            console.log(`Immagine del menu con mid ${mid} eliminata con successo.`);
        } catch (error) {
            console.error(`Errore durante l'eliminazione dell'immagine del menu con mid ${mid}:`, error);
        }
    }

    // Metodo per recuperare un'immagine di menu dal database
    async getMenuImage(mid) {
        try {
            if (!this.db) throw new Error("Database non aperto.");
            const query = "SELECT imageBase64 FROM MenuImage WHERE mid = ?;";
            const result = await this.db.getFirstAsync(query, mid);
            return result ? result : null; // Restituisce l'immagine o null se non trovata
        } catch (error) {
            console.error(`Errore durante il recupero dell'immagine del menu con mid ${mid}:`, error);
            return null;
        }
    }

}
