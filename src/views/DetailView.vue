<template>
  <div class="block-list">
    <div v-if="pokemonData" class="box-data">
      <div class="box-data__pokemon">
        <img :src="pokemonData.detailImage" :alt="pokemonData.name" class="box-data__image" />
        <h2 class="box-data__name">{{ pokemonData.code }} {{ pokemonData.name }}</h2>
      </div>

      <div class="box-data__box-description">
        <h4 class="box-data__sub-title">Descrição</h4>
        <div class="box-data__line-color" :class="getColorClass(pokemonData.types)"></div>
        <p class="box-data__description">
          <span class="box-data__description-name">{{ pokemonData.name }}</span>
          {{ pokemonData.description }}
        </p>

        <div class="box-data__type-container">
          <div v-for="type in pokemonData.types" :key="type" class="box-data__type">
            <img :src="getTypeIconUrl(type)" :alt="type" class="box-data_image-type" />
            <span class="box-data__name-type">{{ type }}</span>
          </div>
        </div>
        <h4 class="box-data__sub-title">Estatistica</h4>
        <div class="box-data__line-color" :class="getColorClass(pokemonData.types)"></div>
        <ul class="box-data__stats">
          <li v-for="stat in pokemonData.stats" :key="stat.stat.name" class="box-data__stat">
            <span class="box-data__stat-name"> {{ getAbbreviatedStatName(stat.stat.name) }}</span>
            <div class="box-data__progress-bar">
              <div class="box-data__progress-fill" :style="{ width: stat.base_stat + '%' }" :class="getTypeClass(pokemonData.types)"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

enum StatName {
  HP = 'hp',
  Attack = 'attack',
  Defense = 'defense',
  SpecialAttack = 'special-attack',
  SpecialDefense = 'special-defense',
  Speed = 'speed'
}

export default defineComponent({
  name: 'DetailPokemonComponent',
  props: ['pokemonId'],
  data() {
    return {
      pokemonData: {},
      statAbbreviations: {
        [StatName.HP]: 'HP',
        [StatName.Attack]: 'ATK',
        [StatName.Defense]: 'DEF',
        [StatName.SpecialAttack]: 'SpP',
        [StatName.SpecialDefense]: 'SpD',
        [StatName.Speed]: 'spd'
      }
    };
  },
  created() {
    this.fetchPokemonById();
  },
  methods: {
    getTypeIconUrl(type: string) {
      return `/src/assets/img/types/${type}.svg`;
    },
    getTypeClass(types: any) {
      return `type-${types[0]}`
    },
    getColorClass(types: any) {
      return `background-grass`
    },
    getAbbreviatedStatName(statName: StatName) {
      return this.statAbbreviations[statName] || statName;
    },
    async fetchPokemonById() {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/3`);
        this.pokemonData = {
          id: 1,
          code: '001',
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
          detailImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
          name: 'bulbasour',
          types: ['grass', 'poision'],
          stats: [],
          description: 'Bulbasaur is a Grass/Poison-type Pokémon.'
        };
      } catch (error) {
        console.error("Error fetching Pokemon details:", error);
      }
    },
  }
})
</script>

<style lang="scss" scoped>
$color-white: #fff;
$font-family-fira: 'Fira Code', monospace;
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

@each $type,
$color in $color-map {
  .type-#{$type} {
    background-color: $color;
  }

  .background-#{$type} {
    background: $color;
  }
}

.block-list {
  background-image: url('/src/assets/img/global/pokemon-bg.png');
  background-repeat: repeat;
  height: 100vh;
}

.box-data {
  position: relative;
  max-width: 860px;
  width: 100%;
  margin: 0 auto;

  &__pokemon {
    padding: 20px;
  }

  &__image {
    background: transparent;
    width: 100%;
    max-width: 200px;
    display: block;
    object-fit: cover;
    margin: 70px auto 0;
  }

  &__name {
    color: $color-white;
    text-align: center;
    font-family: $font-family-fira;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    line-height: 10px;
    text-transform: capitalize;
  }

  &__sub-title {
    color: $color-white;
    text-align: center;
    font-family: $font-family-fira;
    font-size: 25px;
    font-style: normal;
    font-weight: 700;
    margin: 0;
    height: 60px;
    line-height: 50px;
  }

  &__line-color {
    width: calc(100% + 40px);
    height: 2px;
    position: relative;
    left: -20px;
  }

  &__box-description {
    padding: 20px;
    background: #2C2C2D;
    box-shadow: 0 0 10px 0 #000;
  }

  &__description {
    color: $color-white;
    text-align: center;
    font-family: $font-family-fira;
    font-size: 14px;
    font-style: normal;
    font-weight: 450;
    line-height: 15px;
    margin-top: 20px;
  }

  &__description-name {
    text-transform: uppercase;
    margin-right: 6px;
    display: inline-block;
  }

  &__type-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0 23px;
  }

  &__type {
    display: flex;
    align-items: center;

    &:first-of-type {
      margin-right: 40px;
    }
  }

  &__image-type {
    margin-right: 10px;
    max-width: 52px;
  }

  &__name-type {
    font-family: $font-family-fira;
    color: $color-white;
    text-align: center;
    text-transform: capitalize;
    font-size: 14px;
    font-style: normal;
    font-weight: 450;
    line-height: 15px;
    margin-left: 10px;
    position: relative;
    top: 4px;
  }

  &__stats {
    display: block;
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 33px 0 0;
  }

  &__stat {
    display: flex;
    align-items: center;
    margin-bottom: 17px;
  }

  &__stat-name {
    color: $color-white;
    font-family: $font-family-fira;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 10px;
    margin-right: 14px;
    min-width: 32px;
    text-align: right;
  }

  &__progress-bar {
    width: 100%;
    height: 20px;
    border-radius: 10px;
    background: #C4C4C4;
    overflow: hidden;
    margin-top: 10px;
    display: inline-block;
    position: relative;
    top: -4px;
  }

  &__progress-fill {
    height: 100%;
  }

  @media only screen and (min-width: 581px) {
    display: flex;
    justify-content: center;

    &__pokemon {
      padding: 0;
    }

    &__image {
      width: 362px;
      max-width: 362px;
      margin-top: 197px;
    }

    &__name {
      font-size: 45px;
      white-space: nowrap;
    }

    &__box-description {
      width: 100%;
      max-width: 420px;
      margin-left: 48px;
      margin-top: 73px;
      padding: 20px 2px 0;
      border-radius: 4px;
    }

    &__stats {
      margin-top: 11px;
    }

    &__line-color {
      left: 0px;
      width: 100%;
    }

    &__stats {
      padding: 20px;
    }

    &__progress-bar {
      width: 80%;
    }

    &__name-type {
      font-size: 25px;
      min-width: 46px;
    }
  }
}
</style>
