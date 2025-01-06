//La componente UserDetails è figlia di UserProfile, gestisce la visualizzazione dei dettagli di un utente:
//a) riceve da UserProfile: 
//      -l'oggetto User
//b) visualizza i dettagli dell'utente
//c) visualizza un pulsante per modificare i dati dell'utente
//d) gestisce la pressione del pulsante di modifica chiamando la funzione onModify
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import AppStyles from '../AppStyles'; // Assicurati che il path sia corretto

export default function UserDetails({ user, onModify }) {
  return (
    <ScrollView style={AppStyles.container}>

      {/* Titolo principale, centrato */}
      <Text style={AppStyles.profilePageTitle}>Profilo</Text>

      {/* Prima sezione: Dati personali */}
      <View style={AppStyles.userDetailsContainer}>
        <Text style={AppStyles.sectionTitle}>I tuoi dati personali</Text>

        <View style={AppStyles.userDetailsRow}>
          <Text style={AppStyles.userDetailsLabel}>Nome:</Text>
          <Text style={AppStyles.userDetailsValue}>{user.firstName}</Text>
        </View>

        <View style={AppStyles.userDetailsRow}>
          <Text style={AppStyles.userDetailsLabel}>Cognome:</Text>
          <Text style={AppStyles.userDetailsValue}>{user.lastName}</Text>
        </View>
      </View>

      {/* Seconda sezione: Dati di pagamento */}
      <View style={AppStyles.userDetailsContainer}>
        <Text style={AppStyles.sectionTitle}>I tuoi dati di pagamento</Text>

        <View style={AppStyles.userDetailsRow}>
          <Text style={AppStyles.userDetailsLabel}>Nome e Cognome:</Text>
          <Text style={AppStyles.userDetailsValue}>{user.cardFullName}</Text>
        </View>

        <View style={AppStyles.userDetailsRow}>
          <Text style={AppStyles.userDetailsLabel}>Numero:</Text>
          <Text style={AppStyles.userDetailsValue}>{user.cardNumber}</Text>
        </View>

        <View style={AppStyles.userDetailsRow}>
          <Text style={AppStyles.userDetailsLabel}>Scadenza:</Text>
          <Text style={AppStyles.userDetailsValue}>
            {user.cardExpireMonth}/{user.cardExpireYear}
          </Text>
        </View>

        <View style={AppStyles.userDetailsRow}>
          <Text style={AppStyles.userDetailsLabel}>CVV:</Text>
          <Text style={AppStyles.userDetailsValue}>{user.cardCVV}</Text>
        </View>
      </View>

      {/* Pulsante "Modifica" in fondo */}
      <View style={{ marginHorizontal: 10 }}>
        <TouchableOpacity
          style={AppStyles.formButton}
          onPress={onModify}
        >
          <Text style={AppStyles.formButtonText}>Modifica</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}
