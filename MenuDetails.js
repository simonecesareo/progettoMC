
//La componente MenuDetails è figlia di MenuView, gestisce la visualizzazione dei dettagli di un menu e la logica di acquisto
//a) riceve da MenuView
//      - il menu selezionato   
//      - il sid
//      - la funzione compraMenu
//b) richiede i dettagli del menu a ViewModel
//c) visualizza i dettagli del menu selezionato
//d) visualizza un pulsante per acquistare il menu
//e) gestisce la pressione del pulsante di acquisto chiamando la funzione compraMenu

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import ViewModel from '../ViewModel';
import AppStyles from '../AppStyles';
import { ScrollView } from 'react-native';


export default function MenuDetails({menu, sid, onBack, userLocation}) {

    const [detailedMenu, setDetailedMenu] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const initializeMenuDetails = async () => {
            try{
                const newDetailedMenu = await ViewModel.fetchDetailedMenu(menu.mid, sid, userLocation.coords.latitude, userLocation.coords.longitude);
                console.log("Dettagli del menu:", newDetailedMenu);
                setDetailedMenu({
                    ...newDetailedMenu,
                    image: menu.image,
                  });
            } catch (error) {
                console.error("Errore durante il recupero dei dettagli del menu:", error);
            } finally {
                setLoading(false);
            }
        }
        initializeMenuDetails();
    }, []);

    if (loading) {
        return <Text style={AppStyles.loadingText}>Caricamento...</Text>;
    }
    
    if (!detailedMenu) {
        return <Text style={AppStyles.errorText}>Errore: dati del menu non disponibili.</Text>;
    }

    console.log("Menu da visualizzare: {nome:", detailedMenu.name, ", prezzo: ", detailedMenu.price, ", tempo: ", detailedMenu.deliveryTime, ", descrizione: ", detailedMenu.longDescription);
    return (
        <View style={AppStyles.menuCard}>
            <Button title="Torna alla lista" onPress={onBack} color="#FF7F00" />
            <Text style={AppStyles.menuCardTitle} >{detailedMenu.name}</Text>
            <Text style={AppStyles.menuDetailsDescription} >{detailedMenu.longDescription}</Text>
            <Text style={AppStyles.menuCardPrice} >€{detailedMenu.price}</Text>
            <Text style={AppStyles.menuCardDeliveryTime} >
                Tempo di consegna: {detailedMenu.deliveryTime} min
            </Text>
            <Image source={{ uri: detailedMenu.image }} style={AppStyles.menuDetailsImage} />
        </View>
      );
    

}