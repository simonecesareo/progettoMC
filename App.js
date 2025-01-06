import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import NavigationTab from './components/NavigationTab';
import MenuView from './components/MenuView';
import AppStyles from './AppStyles';
import StorageManager from './models/storage/StorageManager';
import ApiService from './models/api/ApiService';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserProfile from './components/UserProfile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('MenuView'); // Schermata attiva
  const [sid, setSid] = useState(null);                          // SID dell'utente
  const [uid, setUid] = useState(null);                          // UID dell'utente
  const [canUseLocation, setCanUseLocation] = useState(false);   // Permessi posizione
  const [loading, setLoading] = useState(true);                  // Stato caricamento
  const storage = new StorageManager();                          // Istanza di StorageManager

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Inizializza lo storage
        await storage.openDB();

        let currentSid;
        let currentUid;
        // Recupera il SID dallo storage o lo crea
        const storedSid = await storage.getSid();
        const storedUid = await storage.getUid();
        if (storedSid?.sid) {
          currentSid = storedSid.sid;
          if(storedUid?.uid){
            currentUid = storedUid.uid;
            console.log("SID recuperato dallo storage:", currentSid);
            console.log("UID recuperato dallo storage:", currentUid);
            console.log("Info recuperate, SID:", storedSid, "UID:", storedUid);
          }
        } else {
          const response = await ApiService.registerUser();
          currentSid = response.sid;
          currentUid = response.uid;
          console.log("Nuovo SID registrato:", currentSid);
          console.log("Nuovo UID registrato:", currentUid);
          await storage.saveSid(currentSid);
          await storage.saveUid(currentUid);
        }
        setSid(currentSid);
        setUid(currentUid);

        // Gestione permessi posizione
        const permits = await ApiService.locationPermissionAsync();
        setCanUseLocation(permits);
      } catch (error) {
        console.error("Errore durante l'inizializzazione:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const onTabSelect = (screen) => setCurrentScreen(screen);

  const renderScreen = () => {
    if (loading) return renderLoadingScreen();
    switch (currentScreen) {
      case 'MenuView':
        return <MenuView sid={sid} canUseLocation={canUseLocation} />;
      case 'OrderStatus':
        return <Text style={AppStyles.text}>Order Status</Text>;
      case 'UserProfile':
        return <UserProfile uid={uid} sid={sid} />;
      default:
        return <Text style={AppStyles.text}>Schermata non trovata</Text>;
    }
  };

  function renderLoadingScreen() {
    return (
      <View style={AppStyles.loadingContainer}>
        <Image source={require('../assets/pizzagif.webp')} style={AppStyles.loadingImage} />
        <Text style={AppStyles.loadingText}>
          Stiamo preparando il tuo piatto preferito...
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={AppStyles.container}>
    <View style={AppStyles.container}>
      <View style={AppStyles.screenContainer}>{renderScreen()}</View>
      <NavigationTab
        currentScreen={currentScreen}
        onTabSelect={onTabSelect}
      />
      <StatusBar style="auto" />
    </View>
    </GestureHandlerRootView>
  );
}
