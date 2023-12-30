import { defineStore } from 'pinia';
import { computed, ref } from "vue";
import axios from 'axios';

interface Pokemon {
    id: number;
    code: string;
    name: string;
    description: string;
    url: string;
    image: string;
    types: string[];
    stats: any[];
}

export const usePokemonStore = defineStore("pokemon", () => {
    // State
    const listTypes = ref([]);
    const listFullPokemon = ref([] as Pokemon[]);
    const listPokemon = ref([] as Pokemon[]);
    const dataPokemon = ref(null as Pokemon);
    const isLoading = ref(false);

    // Actions
    const fetchPokemonList = async () => {
        isLoading.value = true;
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
        const listResult = await Promise.all(response.data.results.map(async (pokemon: Pokemon) => {
            // Get pokemon data
            const pokemonDataResponse = await axios.get(pokemon.url);
            const pokemonData = pokemonDataResponse.data;

            // Add types to array
            pokemonData.types.forEach((type) => {
                const capitalizedType = type.type.name.replace(/^\w/, (c) => c.toUpperCase());
                if (!listTypes.value.includes(capitalizedType)) {
                    listTypes.value = [...listTypes.value, capitalizedType];
                }
            });
            listTypes.value.sort((a, b) => a.localeCompare(b));

            // Get description of pokemon
            const pokemonSpeciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}/`);
            const pokemonSpeciesData = pokemonSpeciesResponse.data;
            const description = pokemonSpeciesData.flavor_text_entries.find(entry => entry.language.name === 'en' && entry.version.name === 'ruby');

            return {
                id: pokemonData.id,
                code: pokemonData.id < 10 ? `00${pokemonData.id}` : (pokemonData.id < 100 ? `0${pokemonData.id}` : `${pokemonData.id}`),
                name: pokemonData.name,
                url: pokemon.url,
                image: pokemonData.sprites?.other?.['official-artwork']?.front_default,
                description: description?.flavor_text,
                types: pokemonData.types.map((type) => type.type.name),
                stats: pokemonData.stats.map((stat) => ({
                    name: stat.stat.name,
                    baseValue: stat.base_stat,
                }))
            };
        }));

        listFullPokemon.value = listResult;
        listPokemon.value = listResult;
        isLoading.value = false;
    }

    const filterPokemonList = async (search: string, searchType: string) => {
        if (search || searchType) {
            listPokemon.value = listFullPokemon.value.filter((pokemon) => {
                const hasName = pokemon.name.toLowerCase().includes(search.toLowerCase());
                const hasType = !searchType || pokemon.types.includes(searchType.toLowerCase());
                return hasName && hasType;
            });
        } else {
            listPokemon.value = listFullPokemon.value;
        }
    };

    const getDataPokemon = async (id: string) => {
        dataPokemon.value = listFullPokemon.value.find(pokemon => pokemon.id === parseInt(id));
    }

    // Getters
    const totalPokemon = computed(() => listPokemon.value.length);

    return {
        getDataPokemon,
        fetchPokemonList,
        filterPokemonList,
        isLoading,
        listTypes,
        listPokemon,
        totalPokemon,
        dataPokemon
    };
});
