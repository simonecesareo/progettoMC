//La componente UserProfile è figlia di App, gestisce la visualizzazione di due componenti:
// -UserDetails
// -UserModify
//a) riceve da App:
//  -il sid
//  -l'uid
//b) quando UserProfile viene inizializzata fa una chiamata a ApiService per ottenere i dettagli dell'utente, che salva in un oggetto User
//c) UserProfile passa quindi l'oggetto User a UserDetails e UserModify
//d) UserProfile gestisce anche la logica di passaggio da una schermata all'altra:
//      -se l'utente preme il pulsante "Modifica" in UserDetails, UserProfile passa a UserModify
//      -se l'utente preme il pulsante "Salva" in UserModify, UserProfile passa a UserDetails
//e) la logica di modifica dei dati dell'utente è gestita da UserModify, UserProfile si limita a chiamare i dettagli dal server ogni volta che viene inizializzata.

import React, { useEffect, useState } from "react";
// Import dei moduli React e hook per gestire lo stato e gli effetti
import UserDetails from "./UserDetails";
import UserModify from "./UserModify";
import ViewModel from "../ViewModel";
import ApiService from "../models/api/ApiService";
import User from "../models/objects/User";
import AppStyles from "../AppStyles";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { Button } from "react-native";
import UserRegistrationForm from "./UserRegistrationForm";

export default function UserProfile({ sid, uid }) {
	// Dichiarazione degli stati per gestire l'utente, la registrazione, la modifica e il caricamento
	const [user, setUser] = useState(null);
	const [isRegistered, setIsRegistered] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Effetto che recupera i dati utente quando il componente viene montato o quando isEditing cambia
		const fetchUserData = async () => {
			try {
				// Chiamata API per ottenere i dati dell'utente
				const response = await ApiService.getUser(uid, sid);
				console.log("getUser response", response);
				const newUser = new User(response); // Creazione di un nuovo oggetto User
				setUser(newUser); // Salvataggio dell'utente nello stato
				console.log("newUser", newUser);

				const registered = await ApiService.isRegistered(uid, sid); // Verifica se l'utente è registrato
				setIsRegistered(registered); // Aggiornamento dello stato di registrazione
				console.log("isRegistered", registered);
			} catch (error) {
				// Gestione degli errori in caso di fallimento della chiamata API
				console.error("Errore durante il recupero dei dati utente:", error);
			} finally {
				setLoading(false); // Disattiva il caricamento alla fine del fetch
			}
		};
		fetchUserData(); // Esegue la funzione fetchUserData
	}, [isEditing]); // Rilancia l'effetto quando isEditing cambia

	const handleModify = () => {
		// Funzione per abilitare la modalità modifica
		setIsEditing(true);
	};

	const handleSaveModification = async (updatedUser) => {
		// Salvataggio delle modifiche utente tramite chiamata API
		try {
			await ApiService.modifyUser(uid, sid, updatedUser);
			setUser(updatedUser); // Aggiornamento dello stato utente con i nuovi dati
			setIsEditing(false); // Disattivazione della modalità modifica
		} catch (error) {
			// Gestione degli errori durante il salvataggio
			console.error("Errore durante il salvataggio delle modifiche:", error);
		}
	};

	const handleSaveRegistration = async (updatedUser) => {
		// Salvataggio della registrazione utente tramite chiamata API
		try {
			await ApiService.modifyUser(uid, sid, updatedUser);
			setUser(updatedUser); // Aggiornamento dello stato utente
			setIsRegistered(true); // Aggiornamento dello stato di registrazione
		} catch (error) {
			// Gestione degli errori durante la registrazione
			console.error("Errore durante la registrazione utente:", error);
		}
	};

	function renderLoadingScreen() {
		// Funzione che restituisce uno screen di caricamento
		return (
			<View style={AppStyles.loadingContainer}>
				<Image
					source={require("../assets/pizzagif.webp")}
					style={AppStyles.loadingImage}
				/>
				<Text style={AppStyles.loadingText}>Caricamento in corso...</Text>
			</View>
		);
	}

	if (loading) {
		// Se loading è attivo, mostra lo screen di caricamento
		return renderLoadingScreen();
	}

	if (!isRegistered) {
		// Se l'utente non è registrato, mostra il form di registrazione
		return <UserRegistrationForm onSave={handleSaveRegistration} />;
	}

	if (isEditing) {
		// Se l'utente sta modificando, mostra la schermata di modifica
		return <UserModify user={user} onSave={handleSaveModification} />;
	} else {
		// Altrimenti mostra i dettagli utente
		return <UserDetails user={user} onModify={handleModify} />;
	}
}
