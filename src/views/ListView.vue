<template>
  <section>
    <div class="block-list">
      <!-- Search -->
      <div v-if="!isLoading" class="pokemon-search">
        <input v-model="search" type="text" placeholder="Search" class="pokemon-search__input" />

        <select v-model="searchType" class="pokemon-search__select">
          <option value="">Show All</option>
          <option v-for="type in allTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>

      <!-- List -->
      <a v-for="pokemon in filteredPokemonList" :key="pokemon.code" :class="[pokemon.types[0]]" :href="'/detail/' + pokemon.id" class="pokemon-card">
        <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-card__figure" />
        <span class="pokemon-card__code">{{ pokemon.code }}</span>
        <div class="pokemon-card__box">
          <p class="pokemon-card__name">{{ pokemon.name }}</p>
          <div class="pokemon-card__type">
            <img v-for="type in pokemon.types"
                 :key="type"
                 :src="getTypeIconUrl(type)"
                 :alt="type"
                 class="pokemon-card__image" />
          </div>
        </div>
      </a>

      <!-- Loading -->
      <div v-if="isLoading" class="container-loading">
        <a v-for="index in 20"
           :key="index"
           class="pokemon-card">
          <p class="pokemon-card--loading-adjust loading-on-element-custom"></p>
        </a>
      </div>

      <!-- Empty search -->
      <div v-if="!filteredPokemonList.length && !isLoading" class="container-empty-search">
        <p class="container-empty-search__text">Pokémon not found.</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  name: "ListPokemonComponent",
  data() {
    return {
      filteredPokemonList: [],
      isLoading: false,
      search: '',
      searchType: '',
    };
  },
  methods: {
    getTypeIconUrl(type: string) {
      return `/src/assets/img/types/${type}.svg`;
    },
    async fetchPokemonData() {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
        const pokemonList = await Promise.all(response.data.results.map(async (pokemon) => {
          const pokemonData = await axios.get(pokemon.url);
          return {
            id: pokemonData.data.id,
            code: pokemonData.data.id,
            name: pokemonData.data.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.data.id}.png`,
            types: pokemonData.data.types.map((type) => type.type.name),
          };
        }));
        this.filteredPokemonList = pokemonList;
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchPokemonData();
  }
});
</script>

<style lang="scss" scoped>
$color-white: #fff;
$font-family-fira: 'Fira Code', monospace;
$color-gray: #ccc;
$color-map: (
    normal: #A8A878,
    fighting: #C03028,
    poison: #A040A0,
    ground: #E0C068,
    rock: #B8A038,
    bug: #A8B820,
    dragon: #7038F8,
    ghost: #705898,
    dark: #705848,
    fairy: #EE99AC,
    fire: #F08030,
    water: #6890F0,
    grass: #78C850,
    electric: #F8D030,
    steel: #B8B8D0,
    psychic: #F85888,
    ice: #98D8D8,
    flying: #A890F0
);

@function get-pokemon-color($type) {
  @return map-get($color-map, $type);
}

@each $type, $color in $color-map {
  .pokemon-card.#{$type} {
    border-color: $color;

    p {
      color: $color;
    }
  }
}

section {
  background-image: url('/src/assets/img/global/pokemon-bg.png');
  background-repeat: repeat;
}

.block-list {
  padding: 83px 0;
  position: relative;

  .pokemon-search {
    width: calc(100% - 40px);
    display: block;
    margin: 0 auto;

    &__input,
    &__select {
      border-radius: 100px;
      border: 1px solid $color-gray;
      background-color: $color-white;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      display: block;
      height: 30px;
      font-family: $font-family-fira;
      font-size: 10px;
      color: $color-gray;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      padding: 0 10px;
      background-repeat: no-repeat;
      background-position: right 10px center;

      &::before {
        content: '';
        position: absolute;
        right: 10px;
        top: 50%;
        width: 12px;
        height: 14px;
        background-size: contain;
      }
    }

    &__input {
      width: calc(100% - 22px);
      background-image: url('/src/assets/img/icons/search.svg');

      &::placeholder {
        color: $color-gray;
      }
    }

    &__select {
      width: 100%;
      margin: 17px 0 30px;
      appearance: none;
      background-image: url('/src/assets/img/icons/arrow.svg');
      -webkit-appearance: none;
      -moz-appearance: none;

      option {
        font-family: $font-family-fira;
        font-size: 10px;
        color: $color-gray;
      }
    }
  }

  .pokemon-card {
    width: calc(100% - 40px);
    display: block;
    position: relative;
    height: 65px;
    padding: 0;
    margin: 0 auto 15px;
    border-radius: 8px;
    background: $color-white;
    border-width: 25px 0 10px 0;
    border-style: solid;
    text-decoration: none;
    cursor: pointer;

    &__code {
      position: absolute;
      top: -22px;
      left: 9px;
      font-family: $font-family-fira;
      color: $color-white;
      text-align: center;
      font-size: 16px;
      font-style: normal;
      font-weight: 450;
      line-height: normal;
    }

    &__figure {
      position: absolute;
      right: 0;
      bottom: -9px;
      width: 100px;
      height: 100px;
    }

    &__box {
      height: 65px;
      width: 100%;
      padding: 0 10px;
      display: flex;
      align-items: center;
    }

    &__type {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      top: -1px;
      right: 111px;
      margin: auto;
      height: 65px;
    }

    &__image {
      max-width: 18px;
      margin-bottom: 9px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    &__name {
      font-family: $font-family-fira;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 0;
      margin: 0;
      text-transform: capitalize;
    }
  }

  @media only screen and (min-width: 581px) {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    max-width: 860px;
    width: 100%;
    margin: 0 auto;

    .pokemon-search {
      width: 100%;
      margin: 90px 0 70px;
      text-align: right;

      &__input,
      &__select {
        margin: 0;
        width: 100%;
        max-width: 200px;
        display: inline-block;
      }

      &__input {
        max-width: calc(200px - 22px);
        margin-right: 21px;
      }
    }

    .pokemon-card {
      width: calc(25% - 20px);
      max-width: 200px;
      max-height: 156px;
      margin: 10px 10px 68px;

      &__code {
        left: unset;
        right: 5px;
      }

      &__figure {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 50px;
        margin: 0 auto;
      }

      &__box {
        justify-content: center;
        flex-direction: column;
      }

      &__type {
        top: 0;
        right: unset;
        left: 10px;
      }

      &__name {
        font-weight: 450;
      }
    }
  }
}

.container-loading {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .pokemon-card {
    border-color: #ccc;

    &--loading-adjust {
      height: 100%;
      position: relative;
      top: -20px;
    }
  }

  @media only screen and (min-width: 581px) {
    margin-top: 73px;

    .pokemon-card {
      margin-bottom: 10px;
    }
  }
}

.container-empty-search {
  display: block;
  width: 100%;

  &__text {
    font-family: $font-family-fira;
    color: $color-white;
    text-align: center;
    font-size: 26px;
    font-style: normal;
    font-weight: 450;
    line-height: normal;
  }
}
</style>
