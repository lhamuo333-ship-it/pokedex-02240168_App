import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TeamContext } from '../context/TeamContext';

export default function PokemonDetailScreen({ route, navigation }) {
  const { pokemonName } = route.params;
  const { team, addPokemonToTeam, removePokemonFromTeam } = useContext(TeamContext);

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if this Pokémon is already added to My Team
  const isInTeam = team.some(p => p.name === pokemonName);

  useEffect(() => {
    fetchPokemonDetails();
  }, [pokemonName]);

  const fetchPokemonDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await res.json();
      setDetails(data);
    } catch (error) {
      console.log('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTeamStatus = () => {
    if (!details) return;
    if (isInTeam) {
      removePokemonFromTeam(details.name);
    } else {
      addPokemonToTeam({
        name: details.name,
        id: details.id,
        image: details.sprites.other['official-artwork'].front_default,
        types: details.types.map(t => t.type.name),
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4db6ac" />
        <Text style={styles.loadingText}>Loading Details...</Text>
      </View>
    );
  }

  if (!details) return null;

  const imageUrl = details.sprites.other['official-artwork'].front_default;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Back Button Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>#{details.id} {details.name.toUpperCase()}</Text>
      </View>

      {/* Pokémon Image Card */}
      <View style={styles.imageCard}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      </View>

      {/* Team Toggle Action Button */}
      <Pressable 
        style={[styles.teamButton, isInTeam ? styles.removeButton : styles.addButton]} 
        onPress={toggleTeamStatus}
      >
        <Ionicons name={isInTeam ? "trash-outline" : "add-circle-outline"} size={22} color="#fff" />
        <Text style={styles.teamButtonText}>
          {isInTeam ? "Remove from Team" : "Add to Team"}
        </Text>
      </Pressable>

      {/* Types Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Types</Text>
        <View style={styles.typesRow}>
          {details.types.map(item => (
            <View key={item.type.name} style={styles.typeBadge}>
              <Text style={styles.typeText}>{item.type.name.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Physical Attributes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attributes</Text>
        <View style={styles.attrRow}>
          <View style={styles.attrBox}>
            <Text style={styles.attrValue}>{details.height / 10} m</Text>
            <Text style={styles.attrLabel}>Height</Text>
          </View>
          <View style={styles.attrBox}>
            <Text style={styles.attrValue}>{details.weight / 10} kg</Text>
            <Text style={styles.attrLabel}>Weight</Text>
          </View>
        </View>
      </View>

      {/* Base Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Base Stats</Text>
        {details.stats.map(item => (
          <View key={item.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{item.stat.name.toUpperCase()}</Text>
            <Text style={styles.statValue}>{item.base_stat}</Text>
            <View style={styles.statBarBackground}>
              <View style={[styles.statBarFill, { width: `${Math.min(item.base_stat, 100)}%` }]} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#b0d1d8' },
  contentContainer: { padding: 16, paddingTop: 45 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b313a' },
  loadingText: { color: '#e0f2f1', marginTop: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backButton: { padding: 8, marginRight: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#130505' },
  imageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  image: { width: 135, height: 135 },
  teamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
  },
  addButton: { backgroundColor: '#125463'},
  removeButton: { backgroundColor: '#b63733' },
  teamButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  section: { backgroundColor: '#12414d', borderRadius: 12, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  typesRow: { flexDirection: 'row', gap: 10 },
  typeBadge: { backgroundColor: '#4db6ac', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
  typeText: { color: '#0b313a', fontWeight: 'bold', fontSize: 12 },
  attrRow: { flexDirection: 'row', justifyContent: 'space-around' },
  attrBox: { alignItems: 'center' },
  attrValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  attrLabel: { color: '#b2dfdb', fontSize: 12, marginTop: 4 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statName: { width: 100, color: '#b2dfdb', fontSize: 11, fontWeight: '600' },
  statValue: { width: 35, color: '#fff', fontWeight: 'bold', fontSize: 12 },
  statBarBackground: { flex: 1, height: 8, backgroundColor: '#0b313a', borderRadius: 4, overflow: 'hidden' },
  statBarFill: { height: '100%', backgroundColor: '#4db6ac' },
});