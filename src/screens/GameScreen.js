import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BEST_SCORE_KEY = '@pokemon_game_best_score';

export default function GameScreen() {
  const [targetPokemon, setTargetPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Game Stats
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  const [revealed, setRevealed] = useState(false);
  
  // Custom Feature: Hint State
  const [showHint, setShowHint] = useState(false);
  const [pokemonTypes, setPokemonTypes] = useState([]);

  useEffect(() => {
    loadBestScore();
    startNewRound();
  }, []);

  // Load saved Best Score from AsyncStorage on app launch
  const loadBestScore = async () => {
    try {
      const savedBestScore = await AsyncStorage.getItem(BEST_SCORE_KEY);
      if (savedBestScore !== null) {
        setBestScore(parseInt(savedBestScore, 10));
      }
    } catch (error) {
      console.log('Error loading best score:', error);
    }
  };

  // Save new Best Score to AsyncStorage
  const saveBestScore = async (newBest) => {
    try {
      await AsyncStorage.setItem(BEST_SCORE_KEY, newBest.toString());
    } catch (error) {
      console.log('Error saving best score:', error);
    }
  };

  const getRandomId = () => Math.floor(Math.random() * 151) + 1; // Gen 1 range

  const startNewRound = async () => {
    setLoading(true);
    setSelectedOption(null);
    setRevealed(false);
    setShowHint(false); // Reset hint for the new round

    try {
      const correctId = getRandomId();
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${correctId}`);
      const correctData = await res.json();

      const wrongNames = [];
      while (wrongNames.length < 3) {
        const wrongId = getRandomId();
        if (wrongId !== correctId && !wrongNames.includes(wrongId)) {
          wrongNames.push(wrongId);
        }
      }

      const wrongPromises = wrongNames.map(id => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json())
      );
      const wrongData = await Promise.all(wrongPromises);

      const allChoices = [
        correctData.name,
        ...wrongData.map(p => p.name)
      ].sort(() => Math.random() - 0.5);

      setTargetPokemon({
        name: correctData.name,
        id: correctData.id,
        image: correctData.sprites.other['official-artwork'].front_default,
      });
      setPokemonTypes(correctData.types.map(t => t.type.name));
      setOptions(allChoices);
    } catch (error) {
      console.log('Error loading game round:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = (choice) => {
    if (revealed) return;

    setSelectedOption(choice);
    setRevealed(true);
    setShowHint(false); // Hide hint once guessed

    if (choice === targetPokemon.name) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);

      if (newScore > bestScore) {
        setBestScore(newScore);
        saveBestScore(newScore); // Persist to AsyncStorage!
      }
    } else {
      setStreak(0); // Reset streak on incorrect guess
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4db6ac" />
        <Text style={styles.loadingText}>Loading Wild Pokémon...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Who's That Pokémon?</Text>
      
      {/* Score, Streak, and Best Score Row */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Streak</Text>
          <Text style={styles.scoreValue}>{streak}</Text>
        </View>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Best Score</Text>
          <Text style={styles.scoreValue}>{bestScore}</Text>
        </View>
      </View>

      {/* Pokémon Display Card */}
      {targetPokemon && (
        <View style={styles.imageCard}>
          <Image 
            source={{ uri: targetPokemon.image }} 
            style={[
              styles.pokemonImage,
              !revealed && styles.silhouette
            ]} 
            resizeMode="contain"
          />
        </View>
      )}

      {/* Custom Feature: Hint Button & Display Box */}
      {!revealed && (
        <View style={styles.hintContainer}>
          {!showHint ? (
            <Pressable style={styles.hintButton} onPress={() => setShowHint(true)}>
              <Ionicons name="bulb-outline" size={16} color="#ffe082" />
              <Text style={styles.hintButtonText}>Show Hint (Type)</Text>
            </Pressable>
          ) : (
            <View style={styles.hintBox}>
              <Text style={styles.hintTitle}>💡 Hint:</Text>
              <View style={styles.hintTypesRow}>
                {pokemonTypes.map(t => (
                  <View key={t} style={styles.hintBadge}>
                    <Text style={styles.hintBadgeText}>{t.toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Multiple Choice Option Buttons */}
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          let buttonStyle = styles.optionButton;
          let textStyle = styles.optionText;

          if (revealed) {
            if (option === targetPokemon.name) {
              buttonStyle = [styles.optionButton, styles.correctButton];
              textStyle = [styles.optionText, styles.resultText];
            } else if (option === selectedOption) {
              buttonStyle = [styles.optionButton, styles.wrongButton];
              textStyle = [styles.optionText, styles.resultText];
            }
          }

          return (
            <Pressable 
              key={option} 
              style={buttonStyle} 
              onPress={() => handleGuess(option)}
              disabled={revealed}
            >
              <Text style={textStyle}>{option.toUpperCase()}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Next Round Button */}
      {revealed && (
        <Pressable style={styles.nextButton} onPress={startNewRound}>
          <Ionicons name="arrow-forward-circle-outline" size={22} color="#fff" />
          <Text style={styles.nextButtonText}>Next Pokémon</Text>
        </Pressable>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b313a',
  },
  loadingText: {
    color: '#e0f2f1',
    marginTop: 10,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scoreCard: {
    flex: 0.31,
    backgroundColor: '#12414d',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#b2dfdb',
    fontSize: 11,
    fontWeight: '600',
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  imageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  pokemonImage: {
    width: 120,
    height: 120,
  },
  silhouette: {
    tintColor: '#125463',
  },
  hintContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12414d',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#4db6ac',
  },
  hintButtonText: {
    color: '#ffe082',
    fontSize: 12,
    fontWeight: '600',
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12414d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  hintTitle: {
    color: '#ffe082',
    fontSize: 12,
    fontWeight: 'bold',
  },
  hintTypesRow: {
    flexDirection: 'row',
    gap: 4,
  },
  hintBadge: {
    backgroundColor: '#4db6ac',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  hintBadgeText: {
    color: '#0b313a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#12414d',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  optionText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  correctButton: {
    backgroundColor: '#2e7d32',
  },
  wrongButton: {
    backgroundColor: '#c62828',
  },
  resultText: {
    color: '#ffffff',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#125463',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});