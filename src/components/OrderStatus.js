//OrderStatus è la componente in cui l'utente può visualizzare lo stato del suo ultimo ordine.
//Ci sono due possibili stati per l'ultimo ordine, può essere "ON_DELIVERY" oppure "COMPLETED".
//In base a questo stato vengono visualizzate due schermate diverse.
//CASO "ON_DELIVERY":
//L'utente visualizza una schermata con 
// - un messaggio che informa l'utente che il suo ordine è in corso di consegna
// - una mappa che mostra la posizione dell'ordine in real-time.
// - l'indicazione del tempo di consegna stimato
// - le informazioni sul menu ordinato
//CASO "COMPLETED":
//L'utente visualizza una schermata con
// - un messaggio che informa l'utente che il suo ordine è stato consegnato
// - l'indicazione del tempo di consegna effettivo
// - le informazioni sul menu ordinato
// - la locazione di consegna dell'ordine

//LOGICA APPLCATIVA DELLA COMPONENTE:
//Cosa riceve come props la componente OrderStatus:
// - sid: il sid dell'utente
// - uid: l'uid dell'utente
// - 
//Funzione in useEffect per inizializzare la componente:
// - controlla se l'utente è registrato, se l'utente non è registrato visualizza il messaggio 
// "Registrati per effettuare il tuo primo ordine!" e un bottone "Registrati" che porta alla componente UserProfile
// - se l'utente è registrato, controlla se l'utente ha mai effettuato un ordine, questo viene fatto tramite la chiamata
// a server di ApiService.getUser() se la risposta ha il campo orderStatus valorizzato a "COMPLETED" allora l'utente ha già effettuato un ordine,
// altrimenti l'utente non ha mai effettuato un ordine. !!!!Questa funzione potrebbe essere implementata in ViewModel.js
// - se l'utente non ha mai effettuato un ordine allora viene visualizzato il messaggio "Scopri i menu e fai il tuo primo ordine!" e un bottone che porta alla componente MenuView.
// - se l'utente ha già effettuato un ordine allora si distinguono due casi:
//      a) se l'ultimo ordine è in stato "ON_DELIVERY" allora viene visualizzata la schermata con il messaggio "Il tuo ordine è in consegna" e la mappa con la posizione dell'ordine in tempo reale
//      b) se l'ultimo ordine è in stato "COMPLETED" allora viene visualizzata la schermata con il messaggio "Il tuo ordine è stato consegnato" e la locazione di consegna dell'ordine (magari in una mappa fissa)

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import ApiService from '../models/api/ApiService';
import AppStyles from '../AppStyles';

const OrderStatus = ({ sid, uid }) => {
  const [screenState, setScreenState] = useState('LOADING');
  const [orderData, setOrderData] = useState(null);
  const [courierPosition, setCourierPosition] = useState(null);
  const [menuDetails, setMenuDetails] = useState(null);
  const [loadingMenu, setLoadingMenu] = useState(false);

  // Formattazione data consegna
  const formatDeliveryTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDeliveryTimeAndDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
  

  // Inizializzazione stato ordine
  useEffect(() => {
    const initializeOrderStatus = async () => {
      try {
        const userData = await ApiService.getUser(uid, sid);

        if (userData.lastOid === null) {
          setScreenState('NO_ORDER');
          return;
        }

        const details = await ApiService.getOrderStatus(sid, userData.lastOid);
        setOrderData(details);

        if (details.status === 'ON_DELIVERY') {
          setCourierPosition(details.currentPosition);
          setScreenState('ON_DELIVERY');
        } else if (details.status === 'COMPLETED') {
          // Carica i dettagli del menu
          fetchMenuDetails(details);
          setScreenState('COMPLETED');
        } else {
          console.log('Stato ordine sconosciuto:', details.status);
          setScreenState('ERROR');
        }
      } catch (error) {
        console.log('Errore durante il recupero dati utente:', error);
        setScreenState('ERROR');
      }
    };

    initializeOrderStatus();
  }, [sid, uid]);

  // Polling posizione corriere
  useEffect(() => {
    let intervalId;
    if (screenState === 'ON_DELIVERY' && orderData) {
      const pollOrderStatus = async () => {
        try {
          const updatedDetails = await ApiService.getOrderStatus(sid, orderData.oid);
          setCourierPosition(updatedDetails.currentPosition);

          if (updatedDetails.status === 'COMPLETED') {
            setScreenState('COMPLETED');
            fetchMenuDetails(updatedDetails);
            clearInterval(intervalId);
          }
        } catch (err) {
          console.log('Errore durante il polling della posizione:', err);
        }
      };

      pollOrderStatus();
      intervalId = setInterval(pollOrderStatus, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [screenState, orderData, sid]);

  // Fetch dettagli del menu per ordine completato
  const fetchMenuDetails = async (details) => {
    setLoadingMenu(true);
    try {
      const latitude = details.deliveryLocation.lat;
      const longitude = details.deliveryLocation.lng;
      const menu = await ApiService.getMenuDetails(
        details.mid,
        sid,
        latitude,
        longitude
      );
      setMenuDetails(menu);
    } catch (error) {
      console.log('Errore durante il recupero dei dettagli del menu:', error);
    }
    setLoadingMenu(false);
  };

  // Mappa
  const renderMap = () => {
    if (!orderData) {
      return (
        <View style={AppStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    const deliveryLocation = orderData.deliveryLocation;
    const initialRegion = {
      latitude: courierPosition ? courierPosition.lat : deliveryLocation.lat,
      longitude: courierPosition ? courierPosition.lng : deliveryLocation.lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };

    return (
<MapView
  style={{ height: 400, width: '100%' }}
  initialRegion={initialRegion}
>
  {/* Marker Corriere (dinamico) */}
  {courierPosition && (
    <Marker
      coordinate={{
        latitude: courierPosition.lat,
        longitude: courierPosition.lng,
      }}
      title="Corriere"
    >
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 28 }}>🚁</Text>
      </View>
    </Marker>
  )}

  {/* Marker Destinazione */}
  {deliveryLocation && (
    <Marker
      coordinate={{
        latitude: deliveryLocation.lat,
        longitude: deliveryLocation.lng,
      }}
      title="Destinazione"
    >
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 28 }}>🤤</Text>
      </View>
    </Marker>
  )}
</MapView>
    );
  };

  // Contenuto in base allo stato
  const renderContent = () => {
    switch (screenState) {
      case 'LOADING':
        return (
          <View style={AppStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={AppStyles.loadingText}>Caricamento in corso...</Text>
          </View>
        );

      case 'NO_ORDER':
        return (
          <View style={AppStyles.orderStatusContainer}>
            <Text style={AppStyles.orderStatusTitle}>
              Nessun ordine disponibile
            </Text>
            <Text style={AppStyles.orderStatusMessage}>
              Non hai ancora effettuato nessun ordine :(
            </Text>
            <Text style={AppStyles.orderStatusMessage}>
              Effettua un ordine e torna qui per tenerlo sotto controllo.
            </Text>
          </View>
        );

      case 'ON_DELIVERY':
        return (
          <View style={AppStyles.orderStatusContainer}>
            <Text style={AppStyles.orderStatusTitle}>
              Il tuo ordine è in arrivo!
            </Text>
            <Text style={AppStyles.orderStatusMessageSmall}>
              Prepara la tavola, il drone sta volando verso di te.
            </Text>

            {renderMap()}

            {orderData?.expectedDeliveryTimestamp && (
              <Text style={AppStyles.orderStatusMessage}>
                Il tuo menu verrà consegnato alle ore{' '} 
                {formatDeliveryTime(orderData.expectedDeliveryTimestamp)}
              </Text>
            )}
          </View>
        );

      case 'COMPLETED':
        return (
          <View style={AppStyles.orderStatusContainer}>
            <Text style={AppStyles.orderStatusTitle}>
              Ecco le info del tuo ultimo ordine:
            </Text>
            {renderMap()}

            {loadingMenu ? (
              <View style={AppStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={AppStyles.loadingText}>Caricamento menu...</Text>
              </View>
            ) : (
              menuDetails && (
                <View style={AppStyles.orderStatusDetailContainer}>
                  <Text style={AppStyles.orderStatusDetailText}>
                    <Text style={AppStyles.orderStatusEmoji}>🍕</Text> Menu: {menuDetails.name}
                  </Text>
                  <Text style={AppStyles.orderStatusDetailText}>
                    <Text style={AppStyles.orderStatusEmoji}>📜</Text> Descrizione: {menuDetails.shortDescription}
                  </Text>
                  <Text style={AppStyles.orderStatusDetailText}>
                    <Text style={AppStyles.orderStatusEmoji}>💰</Text> Costo: {menuDetails.price}€
                  </Text>
                  {orderData?.deliveryTimestamp && (
                    <Text style={AppStyles.orderStatusDetailText}>
                      <Text style={AppStyles.orderStatusEmoji}>📅</Text> Consegna effettuata il giorno{' '}
                      {formatDeliveryTimeAndDate(orderData.deliveryTimestamp)}.
                    </Text>
                  )}
                </View>
              )
            )}
          </View>
        );

      case 'ERROR':
      default:
        return (
          <View style={AppStyles.orderStatusContainer}>
            <Text style={AppStyles.orderStatusTitle}>
              Oops, c'è stato un problema
            </Text>
            <Text style={AppStyles.orderStatusMessage}>
              Si è verificato un errore. Riprova più tardi.
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={AppStyles.container}>
      {renderContent()}
    </View>
  );
};

export default OrderStatus;
