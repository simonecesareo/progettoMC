import React, { useState, useEffect } from "react";
import {
	ScrollView,
	View,
	Text,
	TextInput,
	Button,
	Alert,
	KeyboardAvoidingView,
} from "react-native";
import AppStyles from "../AppStyles";

export default function UserRegistrationForm({ onSave }) {
	// Stato per i dati del form
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		cardFullName: "",
		cardNumber: "",
		cardExpireMonth: "",
		cardExpireYear: "",
		cardCVV: "",
	});

	// Stato per gli errori
	const [errors, setErrors] = useState({
		cardFullName: "",
		cardNumber: "",
		cardExpireMonth: "",
		cardExpireYear: "",
		cardCVV: "",
	});

	// Stato per la validità del form
	const [formValid, setFormValid] = useState(false);

	// Controlla che il nome e cognome siano uguali al nome sulla carta
	const checkFullName = (firstName, lastName, cardFullName) => {
		const fullNameNoSpace = (firstName + lastName)
			.replace(/\s+/g, "")
			.toLowerCase();
		const cardFullNameNoSpace = cardFullName.replace(/\s+/g, "").toLowerCase();
		return fullNameNoSpace === cardFullNameNoSpace;
	};

	// Controlla che il numero della carta sia composto da 16 cifre
	const checkCardNumber = (number) => /^[0-9]{16}$/.test(number);

	// Controlla che la data di scadenza sia valida
	const checkCardExpiryDate = (month, year) => {
		const mm = parseInt(month, 10);
		const yy = parseInt(year, 10);
		if (isNaN(mm) || isNaN(yy)) return false; // Non sono numeri
		if (mm < 1 || mm > 12) return false; // Mese non valido

		const expiryDate = new Date(yy, mm - 1, 1);
		const now = new Date();

		if (expiryDate.getFullYear() - now.getFullYear() > 10) return false; // Anno troppo lontano
		if (expiryDate.getFullYear() < now.getFullYear()) return false; // Anno passato
		if (
			expiryDate.getFullYear() === now.getFullYear() &&
			expiryDate.getMonth() < now.getMonth()
		) {
			return false; // Mese passato
		}
		return true;
	};

	// Controlla che il CVV sia composto da 3 cifre
	const checkCVV = (cvv) => /^[0-9]{3}$/.test(cvv);

	// Stile del campo input
	// Se il campo è compilato correttamente, il bordo diventa verde, altrimenti resta grigio
	const getInputStyle = (value, fieldError) => [
		AppStyles.input,
		value.trim().length > 0 && fieldError === "" && { borderColor: "#3BB143" },
	];

	// Funzione per gestire i cambiamenti nei campi del form
	const handleChange = (field, value) => {
		const newFormData = { ...formData, [field]: value };
		setFormData(newFormData); // Aggiorna lo stato dei dati del form

		// Controlla la validità del campo
		setErrors((prev) => {
			const newErrors = { ...prev };

			// Nome + cognome ≠ cardFullName
			if (["firstName", "lastName", "cardFullName"].includes(field)) {
				const isOk = checkFullName(
					newFormData.firstName,
					newFormData.lastName,
					newFormData.cardFullName
				);
				newErrors.cardFullName = isOk
					? ""
					: "Assicurati che il nome sulla carta corrisponda a Nome e Cognome";
			}

			// Numero carta
			if (field === "cardNumber") {
				newErrors.cardNumber = checkCardNumber(value)
					? ""
					: "Per favore, inserisci 16 cifre per il numero della carta";
			}

			// Data di scadenza
			if (field === "cardExpireMonth" || field === "cardExpireYear") {
				const isValid = checkCardExpiryDate(
					newFormData.cardExpireMonth,
					newFormData.cardExpireYear
				);
				if (!isValid) {
					newErrors.cardExpireMonth =
						"Controlla il mese e l’anno: la data di scadenza non sembra valida";
					newErrors.cardExpireYear =
						"Controlla il mese e l’anno: la data di scadenza non sembra valida";
				} else {
					newErrors.cardExpireMonth = "";
					newErrors.cardExpireYear = "";
				}
			}

			// CVV
			if (field === "cardCVV") {
				newErrors.cardCVV = checkCVV(value)
					? ""
					: "Ricorda di inserire esattamente 3 cifre per il CVV";
			}

			return newErrors;
		});
	};

	// Controlla se il form è completamente valido
	const isFormCompletelyValid = () => {
		// Nessun campo vuoto
		for (const key in formData) {
			if (!formData[key].trim()) return false;
		}
		// Nessun errore
		for (const key in errors) {
			if (errors[key]) return false;
		}
		return true;
	};

	// Effettua un controllo iniziale per la validità del form
	useEffect(() => {
		setFormValid(isFormCompletelyValid());
	}, [formData, errors]);

	return (
		<KeyboardAvoidingView contentContainerStyle={AppStyles.container}>
			<ScrollView>
				<View style={AppStyles.formContainer}>
					<Text style={AppStyles.formTitle}>Registrazione</Text>

					<TextInput
						style={getInputStyle(formData.firstName, errors.cardFullName)}
						placeholder="Nome"
						value={formData.firstName}
						onChangeText={(text) => handleChange("firstName", text)}
					/>

					<TextInput
						style={getInputStyle(formData.lastName, errors.cardFullName)}
						placeholder="Cognome"
						value={formData.lastName}
						onChangeText={(text) => handleChange("lastName", text)}
					/>

					<Text style={AppStyles.formSubtitle}>Dati di pagamento</Text>

					<TextInput
						style={getInputStyle(formData.cardFullName, errors.cardFullName)}
						placeholder="Nome e cognome (carta)"
						value={formData.cardFullName}
						onChangeText={(text) => handleChange("cardFullName", text)}
					/>
					{errors.cardFullName !== "" && (
						<Text style={AppStyles.formErrorText}>{errors.cardFullName}</Text>
					)}

					{/* Card Number */}
					<TextInput
						style={getInputStyle(formData.cardNumber, errors.cardNumber)}
						placeholder="Numero carta (16 cifre)"
						keyboardType="numeric"
						maxLength={16}
						value={formData.cardNumber}
						onChangeText={(text) => handleChange("cardNumber", text)}
					/>
					{errors.cardNumber !== "" && (
						<Text style={AppStyles.formErrorText}>{errors.cardNumber}</Text>
					)}

					{/* Scadenza (MM - YYYY) in due riquadri contigui */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginVertical: 10,
						}}
					>
						<TextInput
							style={[
								...getInputStyle(
									formData.cardExpireMonth,
									errors.cardExpireMonth || errors.cardExpireYear
								),
								{ width: 70, marginRight: 10 },
							]}
							placeholder="MM"
							keyboardType="numeric"
							maxLength={2}
							value={formData.cardExpireMonth}
							onChangeText={(text) => handleChange("cardExpireMonth", text)}
						/>
						<TextInput
							style={[
								...getInputStyle(
									formData.cardExpireYear,
									errors.cardExpireMonth || errors.cardExpireYear
								),
								{ width: 100 },
							]}
							placeholder="YYYY"
							keyboardType="numeric"
							maxLength={4}
							value={formData.cardExpireYear}
							onChangeText={(text) => handleChange("cardExpireYear", text)}
						/>
					</View>
					{(errors.cardExpireMonth || errors.cardExpireYear) && (
						<Text style={AppStyles.formErrorText}>
							{errors.cardExpireMonth || errors.cardExpireYear}
						</Text>
					)}

					{/* CVV */}
					<TextInput
						style={getInputStyle(formData.cardCVV, errors.cardCVV)}
						placeholder="CVV (3 cifre)"
						keyboardType="numeric"
						maxLength={3}
						value={formData.cardCVV}
						onChangeText={(text) => handleChange("cardCVV", text)}
					/>
					{errors.cardCVV !== "" && (
						<Text style={AppStyles.formErrorText}>{errors.cardCVV}</Text>
					)}

					<Button
						title="Salva"
						onPress={() => {
							if (formValid) {
								onSave(formData);
							} else {
								Alert.alert("Errore", "Compila correttamente tutti i campi.");
							}
						}}
						disabled={!formValid}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
