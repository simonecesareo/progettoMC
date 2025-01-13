// MenuList.js
import AppStyles from '../AppStyles';
import React, { use } from 'react';
import { ScrollView } from 'react-native';
import MenuCard from './MenuCard';

export default function MenuList({ menus, onSeeDetails, onOrder, userLocation}) {
  return (
    <ScrollView contentContainerStyle={AppStyles.menuListContainer}>
        {menus.map((menu) => (
            <MenuCard key={menu.mid} menu={menu} onSeeDetails={onSeeDetails} userLocation={userLocation} onOrder={onOrder} />
        ))}
    </ScrollView>
  );
}
