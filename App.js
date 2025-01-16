import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState, useEffect, Image } from "react";
import NavigationTab from "./components/NavigationTab";
import MenuView from "./components/MenuView";
import AppStyles from "./AppStyles";
import StorageManager from "./models/storage/StorageManager";
import ApiService from "./models/api/ApiService";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import UserProfile from "./components/UserProfile";
import ViewModel from "./ViewModel";
import OrderStatus from "./components/OrderStatus";
import { Alert } from "react-native";

export default function App() {
	const [currentScreen, setCurrentScreen] = useState("MenuView"); // Stato per tenere traccia della schermata attuale
	const [sid, setSid] = useState(null); // Stato per memorizzare il SID dell'utente
	const [uid, setUid] = useState(null); // Stato per memorizzare l'UID dell'utente
	const [canUseLocation, setCanUseLocation] = useState(false); // Stato per gestire i permessi di localizzazione
	const [loading, setLoading] = useState(true); // Stato per gestire il caricamento iniziale
	const storage = new StorageManager(); // Inizializza una nuova istanza di StorageManager

	useEffect(() => {
		const initializeApp = async () => {
			try {
				await storage.openDB(); // Apre o crea il database locale

				let currentSid;
				let currentUid;
				let currentScreenView; 

				// Recupera il SID, UID e SCREEN salvati nello storage locale
				const storedSid = await storage.getSid();
				const storedUid = await storage.getUid();
				const storedScreen = await storage.getScreen();

				if (storedSid?.sid) {
					currentSid = storedSid.sid; // Assegna il SID recuperato
					if (storedUid?.uid) {
						currentUid = storedUid.uid; // Assegna l'UID recuperato
						console.log("SID recuperato dallo storage:", currentSid);
						console.log("UID recuperato dallo storage:", currentUid);
					}
				} else {
					// Se SID e UID non sono presenti nello storage locale, registra un nuovo utente
					const response = await ApiService.registerUser();
					currentSid = response.sid;
					currentUid = response.uid;
					console.log("Nuovo SID registrato:", currentSid);
					console.log("Nuovo UID registrato:", currentUid);

					// Salva il nuovo SID e UID nello storage locale
					await storage.saveSid(currentSid);
					await storage.saveUid(currentUid);
				}

				setSid(currentSid); // Aggiorna lo stato con il nuovo SID
				setUid(currentUid); // Aggiorna lo stato con il nuovo UID

				if (storedScreen?.screen) {
					currentScreenView = storedScreen.screen;
					console.log("SCREEN recuperato dallo storage:", currentScreenView); 
					setCurrentScreen(currentScreenView); // Imposta la schermata attuale
					await storage.saveScreen(currentScreenView); // Salva la schermata attuale nello storage locale
				} else {
					// Se SCREEN non presente nello storage locale, imposta la schermata iniziale a MenuView
					setCurrentScreen("MenuView"); 
					console.log("SCREEN non trovato, impostato a MenuView.");
					await storage.saveScreen("MenuView"); // Salva la schermata attuale nello storage locale
				}

				// Richiede permessi per la localizzazione
				const permits = await ApiService.locationPermissionAsync();
				setCanUseLocation(permits);
			} catch (error) {
				console.error("Errore durante l'inizializzazione:", error); // Gestisce eventuali errori
			} finally {
				setLoading(false); // Disabilita lo stato di caricamento
			}
		};

		initializeApp(); // Avvia l'inizializzazione all'avvio del componente
	}, []);

	// Funzione per gestire un nuovo ordine
	const handleOrder = async (mid, location) => {
		await storage.openDB(); // Apre o crea il database locale
		const isRegistered = await ApiService.isRegistered(uid, sid); // Controlla se l'utente è registrato
		console.log("Utente registrato:", isRegistered);

		if (!isRegistered) {
			alert("Per effettuare un ordine devi essere registrato."); // Avvisa l'utente se non è registrato
			setCurrentScreen("UserProfile"); // Reindirizza alla schermata del profilo
			await storage.saveScreen("UserProfile"); // Salva la schermata attuale nello storage locale
			return;
		}

		const isOrderActive = await ApiService.isOrderActive(uid, sid); // Controlla se esiste un ordine in corso
		if (isOrderActive) {
			alert("Hai già un ordine in corso, attendi la consegna."); // Avvisa se c'è già un ordine attivo
			return;
		}

		// Mostra una finestra di conferma prima di procedere con l'ordine
		Alert.alert(
			"Conferma acquisto",
			"Sei sicuro di voler ordinare questo menu?",
			[
				{
					text: "Annulla",
					style: "cancel",
				},
				{
					text: "Conferma",
					onPress: async () => {
						try {
							await ViewModel.buyMenu(mid, uid, sid, location); // Esegue l'ordine
							console.log("Ordine effettuato con successo.");
							setCurrentScreen("OrderStatus"); // Passa alla schermata di stato ordine
						} catch (error) {
							console.error("Errore durante l'ordine:", error); // Gestisce errori durante l'ordine
						}
					},
				},
			],
			{ cancelable: false } // Imposta la finestra di conferma come non annullabile
		);
	};

	// Cambia schermata in base alla tab selezionata
	const onTabSelect = async (screen) => { 
		try {
			setCurrentScreen(screen);
			await storage.openDB(); // Apre o crea il database locale
			await storage.saveScreen(screen); // Salva la schermata attuale nello storage locale
		} catch (error) {
			console.error("Errore durante il cambio di schermata:", error); // Gestisce errori durante il cambio di schermata
		} finally {
			console.log("Schermata currentScreen:", currentScreen);
			console.log("Schermata screen:", screen);
		}
	};

	// Funzione per eliminare il database
	const handleDeleteDB = async () => {
		try {
			await storage.openDB(); // Apre o crea il database locale
			await storage.deleteDB(); // Elimina il database locale
		} catch (error) {
			console.error("Errore durante l'eliminazione del database:", error); // Gestisce errori durante l'eliminazione del database
		}
	};

	// Renderizza la schermata attuale in base allo stato
	const renderScreen = () => {
		if (loading) return renderLoadingScreen(); // Mostra schermata di caricamento
		switch (currentScreen) {
			case "MenuView":
				return (
					<MenuView
						sid={sid}
						canUseLocation={canUseLocation}
						handleOrder={handleOrder}
					/>
				);
			case "OrderStatus":
				return <OrderStatus sid={sid} uid={uid} />;
			case "UserProfile":
				return <UserProfile uid={uid} sid={sid} />;
			default:
				return <Text style={AppStyles.text}>Schermata non trovata</Text>; // Gestisce schermata non valida
		}
	};
	1;
	// Renderizza la schermata di caricamento
	function renderLoadingScreen() {
		return (
			<View style={AppStyles.loadingContainer}>
				<Text style={AppStyles.loadingText}>Caricamento in corso...</Text>
			</View>
		);
	}

	// Render principale dell'app
	return (
		<GestureHandlerRootView style={AppStyles.container}>
			<View style={AppStyles.container}>
				<View style={AppStyles.screenContainer}>{renderScreen()}</View>
				<NavigationTab
					currentScreen={currentScreen}
					onTabSelect={onTabSelect}
				/>
				<TouchableOpacity style={AppStyles.formButton} onPress={handleDeleteDB}>
					<Text style={AppStyles.formButtonText}>Cancella dati dal DB</Text>
				</TouchableOpacity>
			</View>
		</GestureHandlerRootView>
	);
}
