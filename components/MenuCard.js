import React from "react";
import { View, Text, Image, Button } from "react-native";
import AppStyles from "../AppStyles";

export default function MenuCard({
	menu,
	onSeeDetails,
	userLocation,
	onOrder,
}) {
	//stampa menuImage a log per debug
	return (
		<View style={AppStyles.menuCard}>
			{/* Immagine del menu */}
			<Image
				source={{ uri: menu.image }}
				style={AppStyles.menuCardImage}
				resizeMode="cover"
			/>
			{/* Nome del menu */}
			<Text style={AppStyles.menuCardTitle}>{menu.name}</Text>
			{/* Descrizione breve */}
			<Text style={AppStyles.menuCardDescription}>{menu.shortDescription}</Text>
			{/* Prezzo */}
			<Text style={AppStyles.menuCardPrice}>€{menu.price}</Text>
			{/* Tempo di consegna */}
			<Text style={AppStyles.menuCardDescription}>
				Tempo di consegna: {menu.deliveryTime} min
			</Text>
			{/* Pulsante per visualizzare i dettagli */}
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<View style={{ flex: 2 }}>
					<Button
						title="Vedi Dettagli"
						onPress={() => onSeeDetails(menu)}
						color="#FF7F00" // Colore del pulsante
					/>
				</View>
				<View style={{ flex: 3 }}>
					<Button
						title="Compra menu"
						onPress={() => onOrder(menu.mid, userLocation)}
						color="blue"
					/>
				</View>
			</View>
		</View>
	);
}
