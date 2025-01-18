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

export default function UserModify({ onSave, user }) {
	// -----------------------
	// STATO
	// -----------------------
	const [formData, setFormData] = useState({
		firstName: user.firstName || "",
		lastName: user.lastName || "",
		cardFullName: user.cardFullName || "",
		cardNumber: user.cardNumber || "",
		cardExpireMonth: user.cardExpireMonth.toString() || "",
		cardExpireYear: user.cardExpireYear.toString() || "",
		cardCVV: user.cardCVV || "",
	});

	const [errors, setErrors] = useState({
		cardFullName: "",
		cardNumber: "",
		cardExpireMonth: "",
		cardExpireYear: "",
		cardCVV: "",
	});

	const [formValid, setFormValid] = useState(false);

	// -----------------------
	// FUNZIONI DI VALIDAZIONE
	// -----------------------
	const checkFullName = (firstName, lastName, cardFullName) => {
		const fullNameNoSpace = (firstName + lastName)
			.replace(/\s+/g, "")
			.toLowerCase();
		const cardFullNameNoSpace = cardFullName.replace(/\s+/g, "").toLowerCase();
		return fullNameNoSpace === cardFullNameNoSpace;
	};

	const checkCardNumber = (number) => /^[0-9]{16}$/.test(number);

	const checkCardExpiryDate = (month, year) => {
		const mm = parseInt(month, 10);
		const yy = parseInt(year, 10);
		if (isNaN(mm) || isNaN(yy)) return false;
		if (mm < 1 || mm > 12) return false;

		const expiryDate = new Date(yy, mm - 1, 1);
		const now = new Date();

		if (expiryDate.getFullYear() - now.getFullYear() > 10) return false; // Anno troppo lontano
		if (expiryDate.getFullYear() < now.getFullYear()) return false;
		if (
			expiryDate.getFullYear() === now.getFullYear() &&
			expiryDate.getMonth() < now.getMonth()
		) {
			return false;
		}
		return true;
	};

	const checkCVV = (cvv) => /^[0-9]{3}$/.test(cvv);

	// -----------------------
	// FUNZIONE PER STILE INPUT
	// -----------------------
	const getInputStyle = (value, fieldError) => [
		AppStyles.input,
		value.toString().trim().length > 0 &&
			fieldError === "" && { borderColor: "#3BB143" },
	];

	// -----------------------
	// GESTIONE CAMBI INPUT
	// -----------------------
	const handleChange = (field, value) => {
		const newFormData = { ...formData, [field]: value };
		setFormData(newFormData);

		setErrors((prev) => {
			const newErrors = { ...prev };

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

			if (field === "cardNumber") {
				newErrors.cardNumber = checkCardNumber(value)
					? ""
					: "Per favore, inserisci 16 cifre per il numero della carta";
			}

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

			if (field === "cardCVV") {
				newErrors.cardCVV = checkCVV(value)
					? ""
					: "Ricorda di inserire esattamente 3 cifre per il CVV";
			}

			return newErrors;
		});
	};

	// -----------------------
	// VERIFICA VALIDITÀ
	// -----------------------
	const isFormCompletelyValid = () => {
		for (const key in formData) {
			if (!formData[key].toString().trim()) return false;
		}
		for (const key in errors) {
			if (errors[key]) return false;
		}
		return true;
	};

	useEffect(() => {
		setFormValid(isFormCompletelyValid());
	}, [formData, errors]);

	// -----------------------
	// RENDER
	// -----------------------
	return (
		<KeyboardAvoidingView contentContainerStyle={AppStyles.container}>
			<ScrollView>
				<View style={AppStyles.formContainer}>
					<Text style={AppStyles.formTitle}>Modifica Dati Utente</Text>

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

					<Text style={AppStyles.formSubtitle}>Modifica Dati di Pagamento</Text>

					<TextInput
						style={getInputStyle(formData.cardFullName, errors.cardFullName)}
						placeholder="Nome sulla carta"
						value={formData.cardFullName}
						onChangeText={(text) => handleChange("cardFullName", text)}
					/>
					{errors.cardFullName !== "" && (
						<Text style={AppStyles.formErrorText}>{errors.cardFullName}</Text>
					)}

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

					{/* Scadenza (MM - YYYY) in due riquadri contigui e CVV in riquadro separato*/}
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
								{ width: 70, marginRight: 5 },
							]}
							placeholder="MM"
							keyboardType="numeric"
							maxLength={2}
							value={formData.cardExpireMonth}
							onChangeText={(text) => handleChange("cardExpireMonth", text)}
						/>
						<Text style={{ fontSize: 25 }}>/</Text>
						<TextInput
							style={[
								...getInputStyle(
									formData.cardExpireYear,
									errors.cardExpireMonth || errors.cardExpireYear
								),
								{ width: 100, marginLeft: 5 },
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
						title="Salva modifiche"
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
