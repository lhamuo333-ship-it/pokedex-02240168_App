import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { fetchPokemonList, fetchAllPokemonNames } from '../api';
import PokemonCard from '../components/PokemonCard';

export default function PokedexScreen({ navigation }) {
  const STUDENT_NAME = "Rinzin Lhamo"; 
  const INITIAL_OFFSET = 168; 

  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(INITIAL_OFFSET);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [allNames, setAllNames] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPokemonList(INITIAL_OFFSET, 20);
      const allData = await fetchAllPokemonNames();
      setPokemonList(data);
      setAllNames(allData);
    } catch (err) {
      setError('Failed to load Pokédex. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePokemon = async () => {
    if (loadingMore || searchQuery.length > 0) return;
    try {
      setLoadingMore(true);
      const nextOffset = offset + 20;
      const moreData = await fetchPokemonList(nextOffset, 20);
      
      setPokemonList(prev => {
        const existingUrls = new Set(prev.map(p => p.url));
        const uniqueNew = moreData.filter(p => !existingUrls.has(p.url));
        return [...prev, ...uniqueNew];
      });
      setOffset(nextOffset);
    } catch (err) {
      console.log('Failed to load more items');
    } finally {
      setLoadingMore(false);
    }
  };

  const displayedList = searchQuery.trim() === '' 
    ? pokemonList 
    : allNames.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4db6ac" />
        <Text style={styles.loadingText}>Loading {STUDENT_NAME}'s Pokédex...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadInitialData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Personalized Header Title */}
      <Text style={styles.headerTitle}>{STUDENT_NAME}'s Pokédex</Text>

      {/* Search Bar Input */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search all Pokémon by name..."
        placeholderTextColor="#888888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Virtualized FlatList */}
      <FlatList
        data={displayedList}
        keyExtractor={(item) => item.name}
        numColumns={2}
        renderItem={({ item }) => (
          <PokemonCard 
            name={item.name} 
            url={item.url} 
            onPress={() => navigation.navigate('Detail', { pokemonName: item.name })}
          />
        )}
        onEndReached={loadMorePokemon}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#4db6ac" style={{ margin: 12 }} /> : null}
        ListEmptyComponent={<Text style={styles.emptyText}>No Pokémon found matching "{searchQuery}"</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // --- DARK MAIN SCREEN BACKGROUND ---
  container: { 
    flex: 1, 
    backgroundColor: '#b0d1d8', // Rich, deep dark teal background
    paddingTop: 45, 
    paddingHorizontal: 10 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#0b313a' 
  },
  headerTitle: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 12, 
    color: '#281414' // Crisp white text
  },
  searchBox: { 
    backgroundColor: '#ffffff', 
    color: '#000000',
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 12, 
    fontSize: 15
  },
  loadingText: { 
    marginTop: 12, 
    color: '#e0f2f1',
    fontWeight: '600' 
  },
  errorText: { 
    color: '#ff6b6b', 
    textAlign: 'center', 
    marginBottom: 12, 
    fontSize: 16 
  },
  retryButton: { 
    backgroundColor: '#125463', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 8 
  },
  retryButtonText: { 
    color: '#ffffff', 
    fontWeight: 'bold' 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 40, 
    color: '#b2dfdb', 
    fontSize: 16 
  }
});