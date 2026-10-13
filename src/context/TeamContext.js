import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState([]);

  // Load saved team from AsyncStorage when app starts
  useEffect(() => {
    loadStoredTeam();
  }, []);

  const loadStoredTeam = async () => {
    try {
      const storedTeam = await AsyncStorage.getItem('@pokemon_team');
      if (storedTeam) {
        setTeam(JSON.parse(storedTeam));
      }
    } catch (error) {
      console.log('Failed to load team from storage', error);
    }
  };

  const saveTeam = async (newTeam) => {
    try {
      setTeam(newTeam);
      await AsyncStorage.setItem('@pokemon_team', JSON.stringify(newTeam));
    } catch (error) {
      console.log('Failed to save team to storage', error);
    }
  };

  const addPokemonToTeam = (pokemon) => {
    if (team.length >= 6) {
      alert('Your team is full! Maximum 6 Pokémon allowed.');
      return false;
    }
    if (team.some(p => p.name === pokemon.name)) {
      alert('This Pokémon is already on your team!');
      return false;
    }
    const updatedTeam = [...team, pokemon];
    saveTeam(updatedTeam);
    return true;
  };

  const removePokemonFromTeam = (pokemonName) => {
    const updatedTeam = team.filter(p => p.name !== pokemonName);
    saveTeam(updatedTeam);
  };

  return (
    <TeamContext.Provider value={{ team, addPokemonToTeam, removePokemonFromTeam }}>
      {children}
    </TeamContext.Provider>
  );
};