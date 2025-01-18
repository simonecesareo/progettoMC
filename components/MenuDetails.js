//La componente MenuDetails è figlia di MenuView, gestisce la visualizzazione dei dettagli di un menu e la logica di acquisto
//a) riceve da MenuView
//      - il menu selezionato
//      - il sid
//      - la funzione compraMenu
//b) richiede i dettagli del menu a ViewModel
//c) visualizza i dettagli del menu selezionato
//d) visualizza un pulsante per acquistare il menu
//e) gestisce la pressione del pulsante di acquisto chiamando la funzione compraMenu
/*COME FUNZIONA LA LOGICA DI ACQUISTO DEL MENU:
- Nella componente MenuDetails appare il pulsante "compra menu",
- Quando il pulsante "compra menu" viene premuto appare un alert con una richiesta di conferma, con i relativi pulsanti "conferma" o "annulla"
- Se viene premuto il pulsante "annulla", l'alert scompare e si torna alla pagina MenuDetails
- Se viene premuto il pulsante "conferma", viene invocata la funzione "compraMenu" definita a livello di ViewModel, chiamata a livello di App.js e passata a MenuDetails come props.
- La funzione compraMenu() esegue le seguenti azioni:
    a) controlla che l'utente sia registrato tramite il controllo (già previsto) isRegistered, se l'utente non è registrato porta alla componente "UserProfile"
    b) controlla che l'utente non abbia ordini in corso facendo una chiamata a server definita in ApiService.js: isOrderActive(), 
    se c'è un'ordine in corso appare un alert che segnala che c'è un ordine in corso e non è possibile piazzarne un altro
    c) se l'utente è registrato e non ci sono ordini in corso, effettua un ordine tramite una chiamata a server definita in ApiService.js: makeOrder()
- TODO: Lavorare su ApiService per scrivere le funzioni necessarie per fare un ordine:
    a) makeOrder()
    b) isOrderActive()
*/
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import ViewModel from "../ViewModel";
import AppStyles from "../AppStyles";
import { ScrollView } from "react-native";

export default function MenuDetails({
	menu,
	sid,
	onBack,
	userLocation,
	onOrder,
}) {
	const [detailedMenu, setDetailedMenu] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initializeMenuDetails = async () => {
			try {
				const newDetailedMenu = await ViewModel.fetchDetailedMenu(
					menu.mid,
					sid,
					userLocation.coords.latitude,
					userLocation.coords.longitude
				);
				console.log("Dettagli del menu:", newDetailedMenu);
				setDetailedMenu({
					...newDetailedMenu,
					image: menu.image,
				});
			} catch (error) {
				console.error(
					"Errore durante il recupero dei dettagli del menu:",
					error
				);
			} finally {
				setLoading(false);
			}
		};
		initializeMenuDetails();
	}, []);

	if (loading) {
		return <Text style={AppStyles.loadingText}>Caricamento...</Text>;
	}

	if (!detailedMenu) {
		return (
			<Text style={AppStyles.errorText}>
				Errore: dati del menu non disponibili.
			</Text>
		);
	}

	console.log(
		"Menu da visualizzare: {nome:",
		detailedMenu.name,
		", prezzo: ",
		detailedMenu.price,
		", tempo: ",
		detailedMenu.deliveryTime,
		", descrizione: ",
		detailedMenu.longDescription
	);
	return (
		<View style={AppStyles.menuCard}>
			<Text style={AppStyles.menuCardTitle}>{detailedMenu.name}</Text>
			<Text style={AppStyles.menuCardDescription}>
				{detailedMenu.longDescription}
			</Text>
			<Text style={AppStyles.menuCardPrice}>€{detailedMenu.price}</Text>
			<Text style={AppStyles.menuCardDeliveryTime}>
				Tempo di consegna: {detailedMenu.deliveryTime} min
			</Text>
			<Image
				source={{ uri: detailedMenu.image }}
				style={AppStyles.menuCardImage}
			/>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<View style={{ flex: 3 }}>
					<Button
						title="Compra menu"
						onPress={() => onOrder(menu.mid, userLocation)}
						color="blue"
					/>
				</View>
				<View style={{ flex: 2 }}>
					<Button title="Torna alla lista" onPress={onBack} color="#FF7F00" />
				</View>
			</View>
		</View>
	);
}
