import { defineStore } from "pinia";
import axios from 'axios';

interface Pokemon {
    id: number;
    name: string;
    types: string[];
}

interface PokemonState {
    pokemonList: Pokemon[];
    isLoading: boolean;
}

export const usePokemonStore = defineStore({
    id: "pokemon",
    state: (): PokemonState => ({
        pokemonList: [],
        isLoading: false,
    }),
    actions: {
        async fetchPokemonList() {
            if (this.pokemonList.length === 0) {
                try {
                    this.isLoading = true;

                    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
                    const data = response.data;

                    const pokemonData = await Promise.all(data.results.map(async (pokemon: any) => {
                        const detailResponse = await axios.get(pokemon.url);
                        const detailData = detailResponse.data;

                        return {
                            id: detailData.id,
                            name: detailData.name,
                            types: detailData.types.map((type: any) => type.type.name),
                        };
                    }));

                    console.log('pokemonData', pokemonData);
                    this.pokemonList = pokemonData;
                    this.isLoading = false;
                } catch (error) {
                    console.error('Error fetching Pokémon data:', error);
                } finally {
                    this.isLoading = false;
                }
            }
        },
    },
});
