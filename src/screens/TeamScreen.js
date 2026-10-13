import React, { useContext } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TeamContext } from '../context/TeamContext';

export default function TeamScreen({ navigation }) {
  const { team, removePokemonFromTeam } = useContext(TeamContext);

  const renderTeamItem = ({ item }) => (
    <Pressable 
      style={styles.card}
      onPress={() => navigation.navigate('PokédexTab', {
        screen: 'Detail',
        params: { pokemonName: item.name }
      })}
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      
      <View style={styles.infoContainer}>
        <Text style={styles.pokemonName}>{item.name.toUpperCase()}</Text>
        <Text style={styles.pokemonId}>#{item.id}</Text>
        <View style={styles.typesRow}>
          {item.types?.map(t => (
            <View key={t} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      <Pressable 
        style={styles.removeButton} 
        onPress={() => removePokemonFromTeam(item.name)}
      >
        <Ionicons name="trash-outline" size={22} color="#ca1f1f" />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Pokémon Team ({team.length}/6)</Text>

      {team.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#125463" />
          <Text style={styles.emptyTitle}>Your team is empty!</Text>
          <Text style={styles.emptySubtitle}>
            Go to the Pokédex tab and add up to 6 Pokémon to your squad.
          </Text>
        </View>
      ) : (
        <FlatList
          data={team}
          keyExtractor={(item) => item.name}
          renderItem={renderTeamItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b0d1d8',
    paddingTop: 45,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0d0101',
    textAlign: 'center',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#125463',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 70,
    height: 70,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  pokemonId: {
    fontSize: 12,
    color: '#e5f4f2',
    marginTop: 2,
  },
  typesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  typeBadge: {
    backgroundColor: '#f8fafa',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  typeText: {
    color: '#0b313a',
    fontWeight: 'bold',
    fontSize: 10,
  },
  removeButton: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#b2dfdb',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});