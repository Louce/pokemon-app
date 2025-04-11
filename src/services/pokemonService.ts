import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      home: {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  species: {
    name: string;
    url: string;
  };
};

export type PokemonSpecies = {
  id: number;
  name: string;
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  evolution_chain: {
    url: string;
  };
  color: {
    name: string;
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
  is_legendary: boolean;
  is_mythical: boolean;
};

export type EvolutionChain = {
  id: number;
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: {
      species: {
        name: string;
        url: string;
      };
      evolution_details: {
        min_level: number | null;
        trigger: {
          name: string;
          url: string;
        };
        item: {
          name: string;
          url: string;
        } | null;
      }[];
      evolves_to: {
        species: {
          name: string;
          url: string;
        };
        evolution_details: {
          min_level: number | null;
          trigger: {
            name: string;
            url: string;
          };
          item: {
            name: string;
            url: string;
          } | null;
        }[];
      }[];
    }[];
  };
};

export const getPokemonList = async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
};

export const getPokemonDetail = async (idOrName: string | number): Promise<PokemonDetail> => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${idOrName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokemon details for ${idOrName}:`, error);
    throw error;
  }
};

export const getPokemonSpecies = async (idOrName: string | number): Promise<PokemonSpecies> => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon-species/${idOrName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokemon species for ${idOrName}:`, error);
    throw error;
  }
};

export const getEvolutionChain = async (id: number): Promise<EvolutionChain> => {
  try {
    const response = await axios.get(`${BASE_URL}/evolution-chain/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching evolution chain for id ${id}:`, error);
    throw error;
  }
};

export const getPokemonByType = async (type: string): Promise<PokemonListResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/type/${type}`);
    // Transform the response to match PokemonListResponse format
    const pokemonList: PokemonListResponse = {
      count: response.data.pokemon.length,
      next: null,
      previous: null,
      results: response.data.pokemon.map((entry: { pokemon: { name: string; url: string } }) => entry.pokemon)
    };
    return pokemonList;
  } catch (error) {
    console.error(`Error fetching Pokemon by type ${type}:`, error);
    throw error;
  }
};

export const searchPokemon = async (query: string): Promise<PokemonDetail[]> => {
  try {
    // First get a list of all pokemon that match the query
    const response = await axios.get(`${BASE_URL}/pokemon`, {
      params: { limit: 1000 }
    });
    
    const results = response.data.results.filter((pokemon: { name: string }) => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Then fetch details for each matching pokemon (limit to first 10 for performance)
    const pokemonDetailsPromises = results.slice(0, 10).map((pokemon: { name: string }) => 
      getPokemonDetail(pokemon.name)
    );
    
    return await Promise.all(pokemonDetailsPromises);
  } catch (error) {
    console.error('Error searching for Pokemon:', error);
    throw error;
  }
};

// Helper function to extract evolution chain ID from URL
export const getEvolutionChainIdFromUrl = (url: string): number => {
  const matches = url.match(/\/evolution-chain\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 0;
}; 