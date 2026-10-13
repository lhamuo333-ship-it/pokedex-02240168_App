import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

export default function PokemonCard({ name, url, onPress }) {
  // 1. Extract the Pokémon ID from its URL string (e.g., "https://pokeapi.co/api/v2/pokemon/25/")
  const id = url.split('/').filter(Boolean).pop();

  // 2. Construct the official artwork image URL using the extracted ID
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.number}>#{id}</Text>
      <Text style={styles.name}>{name.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3, // Adds a soft shadow effect on Android
    shadowColor: '#000', // Shadow properties for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { 
    width: 80, 
    height: 80, 
    resizeMode: 'contain' 
  },
  number: { 
    fontSize: 12, 
    color: '#888', 
    marginTop: 4 
  },
  name: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginTop: 2,
    color: '#333'
  },
});