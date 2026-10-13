import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import Global State Provider
import { TeamProvider } from './src/context/TeamContext';

// Import Screens (Check that all these files exist in src/screens/)
import PokedexScreen from './src/screens/PokedexScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';
import TeamScreen from './src/screens/TeamScreen';
import GameScreen from './src/screens/GameScreen';

// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Pokedex Stack: Wraps the Pokedex list and the Detail screen together
function PokedexStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PokedexMain" component={PokedexScreen} />
      <Stack.Screen name="Detail" component={PokemonDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <TeamProvider>
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{ 
            headerShown: false,
            tabBarActiveTintColor: '#ffffff',   
            tabBarInactiveTintColor: '#a0c4cc', 
            tabBarStyle: {
              backgroundColor: '#125463',       
              borderTopWidth: 0,
              paddingBottom: 6,
              paddingTop: 6,
              height: 62,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            }
          }}
        >
          <Tab.Screen 
            name="PokédexTab" 
            component={PokedexStack} 
            options={{ 
              title: 'Pokédex',
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons name={focused ? "list" : "list-outline"} size={size} color={color} />
              ),
            }} 
          />
          <Tab.Screen 
            name="Team" 
            component={TeamScreen} 
            options={{ 
              title: 'My Team',
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons name={focused ? "people" : "people-outline"} size={size} color={color} />
              ),
            }} 
          />
          <Tab.Screen 
            name="Game" 
            component={GameScreen} 
            options={{ 
              title: 'Game',
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons name={focused ? "flash" : "flash-outline"} size={size} color={color} />
              ),
            }} 
          />
        </Tab.Navigator>
      </NavigationContainer>
    </TeamProvider>
  );
}