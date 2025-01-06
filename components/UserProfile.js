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

import React, { useEffect, useState } from 'react';
import UserDetails from './UserDetails';
import UserModify from './UserModify';
import ViewModel from '../ViewModel';
import ApiService from '../models/api/ApiService';
import User from '../models/objects/User';
import AppStyles from '../AppStyles';
import { View, Text, Image } from 'react-native';
import { Button } from 'react-native';
import UserRegistrationForm from './UserRegistrationForm';

export default function UserProfile({ sid, uid }) {
    const [user, setUser] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await ApiService.getUser(uid, sid);
                const newUser = new User(response); 
                setUser(newUser); //nella variabile di stato "user" è presente l'oggetto User creato con la risposta del server.
                console.log("newUser", newUser);
    
                const registered = isUserRegistered(response); // controlla se l'utente ha già compilato il form di registrazione
                setIsRegistered(registered);
                console.log("isRegistered", registered);
            }
            catch (error) {
                console.error("Errore durante il recupero dei dati utente:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, [isEditing]);

    const isUserRegistered = (response) => {
        if (response.firstName == null)
            return false;
        return true;
    };

    const handleModify = ()=>{
        setIsEditing(true);
    }

    const handleSaveModification = async (updatedUser) => {
        try {
            await ApiService.modifyUser(uid, sid, updatedUser);
            setUser(updatedUser);
            setIsEditing(false);
            console.log("IsEditing", isEditing);
        }
        catch (error) {
            console.error("Errore durante il salvataggio delle modifiche:", error);
        }
    }

    const handleSaveRegistration = async (updatedUser) => {
        try {
            await ApiService.modifyUser(uid, sid, updatedUser);
            setUser(updatedUser);
            setIsRegistered(true);
            console.log("IsRegistered", isEditing);
        }
        catch (error) {
            console.error("Errore durante il salvataggio delle modifiche:", error);
        }
    }

    if (!isRegistered){
        return <UserRegistrationForm onSave={handleSaveRegistration} />
    }
    if(isEditing){
        return <UserModify user={user} onSave={handleSaveModification} />
    }
    else {
        return <UserDetails user={user} onModify={handleModify} />
    }
}