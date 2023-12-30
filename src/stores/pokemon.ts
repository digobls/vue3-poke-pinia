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
    imageDreamWorld: string;
    types: string[];
    stats: any[];
}

export const usePokemonStore = defineStore("pokemon", () => {
    // State
    const loadingList = ref(false);
    const loadingData = ref(false);
    const listTypes = ref([]);
    const listFullPokemon = ref([] as Pokemon[]);
    const listPokemon = ref([] as Pokemon[]);
    const dataPokemon = ref(null as Pokemon);

    // Actions
    const fetchPokemonList = async () => {
        loadingList.value = true;
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
                code: pokemonData.id < 10 ? `#00${pokemonData.id}` : (pokemonData.id < 100 ? `#0${pokemonData.id}` : `#${pokemonData.id}`),
                name: pokemonData.name,
                url: pokemon.url,
                image: pokemonData.sprites?.other?.['official-artwork']?.front_default,
                imageDreamWorld: pokemonData.sprites?.other?.dream_world?.front_default,
                description: description?.flavor_text,
                types: pokemonData?.types?.map((type: any) => type?.type?.name),
                stats: pokemonData?.stats?.map((stat: any) => ({
                    name: stat?.stat?.name,
                    baseValue: stat?.base_stat,
                }))
            };
        }));

        listFullPokemon.value = listResult;
        listPokemon.value = listResult;
        loadingList.value = false;
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

    const getPokemonById = async (id: string) => {
        loadingData.value = true;
        const detailResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const detailData = detailResponse.data;

        // Fetch the species data to get the description
        const speciesResponse = await axios.get(detailData.species.url);
        const speciesData = speciesResponse.data;

        // Find the English description
        const englishDescription = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en' && entry.version.name === 'ruby');

        dataPokemon.value = {
            id: detailData.id,
            code: detailData.id < 10 ? `#00${detailData.id}` : (detailData.id < 100 ? `#0${detailData.id}` : `#${detailData.id}`),
            name: detailData.name,
            url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detailData.id}.png`,
            image: detailData?.sprites?.other['official-artwork']?.front_default,
            imageDreamWorld: detailData?.sprites?.other?.dream_world?.front_default,
            description: englishDescription ? englishDescription.flavor_text : 'No description available',
            types: detailData?.types?.map((type: any) => type?.type?.name),
            stats: detailData?.stats?.map((stat: any) => ({
                name: stat?.stat?.name,
                baseValue: stat?.base_stat,
            }))
        };
        loadingData.value = false;
    }

    const getDataPokemon = async (id: string) => {
        if (listFullPokemon.value.length) {
            dataPokemon.value = listFullPokemon.value.find(pokemon => pokemon.id === parseInt(id));
        } else {
            await getPokemonById(id);
        }
    }

    // Getters
    const totalPokemon = computed(() => listPokemon.value.length);

    return {
        loadingList,
        loadingData,
        listTypes,
        listPokemon,
        totalPokemon,
        dataPokemon,
        getPokemonById,
        getDataPokemon,
        fetchPokemonList,
        filterPokemonList
    };
});
