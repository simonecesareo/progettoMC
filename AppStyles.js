// AppStyles.js
import { StyleSheet } from 'react-native';

const AppStyles = StyleSheet.create({
  // =======================
  // Contenitore principale dell'app
  // =======================
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },

  // =======================
  // Contenitore per la schermata principale
  // =======================
  screenContainer: {
    flex: 9,
    padding: 10,
    paddingTop: 40,
    backgroundColor: '#fff',
  },

  // =======================
  // Barra di navigazione
  // =======================
  navigationTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 5,
  },
  navigationButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationButtonIcon: {
    fontSize: 24,
    marginBottom: 3,
  },
  navigationButtonActiveIcon: {
    color: '#FFA500',
    fontSize: 30,
  },
  navigationButtonInactiveIcon: {
    color: '#9e9e9e',
  },
  navigationButtonText: {
    fontSize: 12,
  },
  navigationButtonActiveText: {
    color: '#FF7F00',
    fontWeight: 'bold',
  },
  navigationButtonInactiveText: {
    color: '#9e9e9e',
  },

  // =======================
  // Stile per le card di menu
  // =======================
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  menuCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  menuCardDescription: {
    fontSize: 16,
    color: '#666',
  },
  menuCardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7F00',
    marginTop: 10,
  },
  menuCardDeliveryTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
  },
  menuCardImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },

  // =======================
  // Stile per la schermata di caricamento
  // =======================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },

  // =======================
  // Stile per la schermata di dettagli utente
  // =======================
  userDetailsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  profilePageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#666',
    marginBottom: 10,
  },
  userDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userDetailsLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    marginRight: 10,
  },
  userDetailsValue: {
    fontSize: 18,
    color: '#333',
    flexShrink: 1,
  },

  // =======================
  // Stile per input
  // =======================
  input: {
    height: 50,
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // =======================
  // Stili dedicati ai form
  // =======================
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF7F00',
    marginVertical: 10,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  formErrorText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
  },
  formButton: {
    backgroundColor: '#FF7F00',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  formButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // =======================
  // Stili dedicati a OrderStatus
  // =======================
  orderStatusContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  orderStatusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF7F00',
    marginBottom: 10,
    textAlign: 'center',
  },
  orderStatusMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    lineHeight: 22,
    marginTop: 15,
  },
  orderStatusMessageSmall:{
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    lineHeight: 22,
  },
  orderStatusMap: {
    height: 350,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  orderStatusDetailContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  orderStatusDetailText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  orderStatusEmoji: {
    fontSize: 22,
  },
});

export default AppStyles;
