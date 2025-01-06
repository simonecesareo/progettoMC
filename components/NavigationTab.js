import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AppStyles from '../AppStyles'; // Importa il file degli stili

export default function NavigationTab({ onTabSelect, currentScreen }) {
  const tabs = [
    { key: 'MenuView', label: 'Menu', icon: 'utensils' },
    { key: 'OrderStatus', label: 'Order', icon: 'shopping-basket' },
    { key: 'UserProfile', label: 'Profile', icon: 'user-circle' },
  ];

  return (
    <View style={AppStyles.navigationTab}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabSelect(tab.key)}
          style={AppStyles.navigationButton}
        >
          <FontAwesome5
            name={tab.icon}
            style={[
              AppStyles.navigationButtonIcon,
              currentScreen === tab.key
                ? AppStyles.navigationButtonActiveIcon
                : AppStyles.navigationButtonInactiveIcon,
            ]}
          />
          <Text
            style={[
              AppStyles.navigationButtonText,
              currentScreen === tab.key
                ? AppStyles.navigationButtonActiveText
                : AppStyles.navigationButtonInactiveText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
