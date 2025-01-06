//La componente MenuView è figlia di App, gestisce la visualizzazione di due componenti:
// - MenuList
// - MenuDetails
//a) riceve da App 
//      - il sid, 
//      - la funzione compraMenu 
//b) ottiene la posizione corrente dell'utente con una funzione di ViewModel
//c) ottiene la lista dei 20 menu più vicini con una funzione di ViewModel
//d) passa la lista dei menu a MenuList
//c) riceve da MenuList il menu selezionato e lo passa a MenuDetails, 
//d) passa a MenuDetails il menu selezionato, il sid e la funzione compraMenu

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Image } from 'react-native';
import MenuList from '../MenuList';
import ViewModel from '../ViewModel';
import StorageManager from '../models/storage/StorageManager';
import ApiService from '../models/api/ApiService';
import AppStyles from '../AppStyles';
import MenuDetails from '../MenuDetails';

export default function MenuView({ sid, canUseLocation }) {
  const [menus, setMenus] = useState([]);        // Menu visualizzati
  const [loading, setLoading] = useState(true);  // Stato caricamento
  const [location, setLocation] = useState(null); // Posizione utente
  const [selectedMenu, setSelectedMenu] = useState(null); // Menu selezionato

  const storage = new StorageManager();

  const fetchMenuImages = async (menus) => {
    for(const menu of menus){
      try {
        let menuImage;
        const isUpToDate = await storage.isImageUpToDate(menu.mid, menu.imageVersion);
        if(!isUpToDate){
          menuImage = await ApiService.getMenuImage(menu.mid, sid);
          await storage.saveMenuImage(menu.mid, menu.imageVersion, menuImage);
        }
        else{
          let menuImageObject = await storage.getMenuImage(menu.mid);
          menuImage = menuImageObject.imageBase64;
        }
        menu.image = 'data:image/jpeg;base64,' + menuImage;

      } catch (error) {
        console.error(`Errore durante il recupero dell'immagine per mid ${menu.mid}:`, error);
      }
    }
  }

  useEffect(() => {
    const initializeMenuView = async () => {
      try {
        // Inizializza lo storage
        await storage.openDB();

        // Verifica permessi posizione
        if (!canUseLocation) {
          console.warn("Permessi per la posizione non disponibili.");
          return;
        }

        // Ottieni posizione
        const userLocation = await ViewModel.getUserLocation(canUseLocation);
        setLocation(userLocation);

        if (userLocation) {
          const latitude = userLocation.coords.latitude;
          const longitude = userLocation.coords.longitude;

          // Recupera menu
          const menuList = await ViewModel.fetchMenus(latitude, longitude, sid);
          await fetchMenuImages(menuList);
          setMenus(menuList);
        }
      } catch (error) {
        console.error("Errore durante l'inizializzazione di MenuView:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeMenuView();
  }, [sid, canUseLocation]);

  const handleSeeDetails = (menu) => {
    setSelectedMenu(menu);
    console.log("Menu selezionato:", menu.mid, menu.name, menu.shortDescription, menu.price, menu.deliveryTime, menu.location);
  };

  const handleBackToList = () => {
    setSelectedMenu(null);
  };

  if (loading) {
    return (
      <View style={AppStyles.loadingContainer}>
        <Image source={require('../../assets/pizzagif.webp')} style={AppStyles.loadingImage} />
        <Text style={AppStyles.loadingText}>Stiamo preparando il tuo piatto preferito...</Text>
      </View>
    );
  }

  if (!menus.length) {
    return <Text>Nessun menu disponibile nella tua area.</Text>;
  }

  return (
    <View>
      {selectedMenu ? (
        <MenuDetails menu={selectedMenu} sid={sid} onBack={handleBackToList} userLocation={location} />
      ) : (
        <MenuList menus={menus} onSeeDetails={handleSeeDetails} />
      )}
    </View>
  );
}
