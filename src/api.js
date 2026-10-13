// Base URL for the free PokeAPI (no API key or sign-up required)
const BASE_URL = 'https://pokeapi.co/api/v2';

// 1. Fetch a paged list of Pokémon (defaults to offset 0, limit 20)
export const fetchPokemonList = async (offset = 0, limit = 20) => {
  const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  const data = await response.json();
  return data.results; // Returns an array of objects: [{ name: 'bulbasaur', url: '...' }]
};

// 2. Fetch all Pokémon names (up to 1025) for the global search feature
export const fetchAllPokemonNames = async () => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=1025`);
  const data = await response.json();
  return data.results; // Returns array of all names and URLs
};

// 3. Fetch detailed data for a single Pokémon using its ID or name
export const fetchPokemonDetails = async (idOrName) => {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!response.ok) {
    throw new Error('Pokémon not found');
  }
  return await response.json(); // Returns full details (stats, types, height, weight, etc.)
};