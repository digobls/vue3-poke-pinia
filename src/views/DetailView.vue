<template>
  <div class="block-list">
    <div v-if="dataPokemon" class="box-data">
      <div class="box-data__pokemon">
        <img :src="dataPokemon.imageDreamWorld" :alt="dataPokemon.name" class="box-data__image" />
        <h2 class="box-data__name">{{ dataPokemon.code }} {{ dataPokemon.name }}</h2>
        <div class="box-data__bg-bottom" :style="{ backgroundImage: `url(${currentSvgDataUrl})` }">
          <div class="box-data__bg-bottom hover" :style="{ backgroundImage: `url(${currentSvgDataUrl})` }">
          </div>
        </div>
      </div>

      <div class="box-data__box-description">
        <h4 class="box-data__sub-title">Descrição</h4>
        <div class="box-data__line-color" :class="getColorClass(dataPokemon.types)"></div>
        <p class="box-data__description">
          <span class="box-data__description-name">{{ dataPokemon.name }}</span>
          {{ dataPokemon.description }}
        </p>

        <div class="box-data__type-container">
          <div v-for="type in dataPokemon.types" :key="type" class="box-data__type">
            <img :src="getTypeIconUrl(type)" :alt="type" class="box-data_image-type" />
            <span class="box-data__name-type">{{ type }}</span>
          </div>
        </div>
        <h4 class="box-data__sub-title">Estatistica</h4>
        <div class="box-data__line-color" :class="getColorClass(dataPokemon.types)"></div>
        <ul class="box-data__stats">
          <li v-for="stat in dataPokemon.stats" :key="stat.name" class="box-data__stat">
            <span class="box-data__stat-name"> {{ getAbbreviatedStatName(stat.name) }}</span>
            <div class="box-data__progress-bar">
              <div class="box-data__progress-fill" :style="{ width: stat.baseValue + '%' }"
                   :class="getTypeClass(dataPokemon.types)"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { usePokemonStore } from '@/stores/pokemon';
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

enum StatName {
  HP = 'hp',
  Attack = 'attack',
  Defense = 'defense',
  SpecialAttack = 'special-attack',
  SpecialDefense = 'special-defense',
  Speed = 'speed'
}

export default defineComponent({
  name: 'DetailPokemon',
  props: ['pokemonId'],
  setup() {
    const route = useRoute();
    const pokemonStore = usePokemonStore();
    const { getDataPokemon } = pokemonStore;
    const { dataPokemon } = storeToRefs(pokemonStore);
    const colorMap = new Map([
      ['normal', '#A8A878'],
      ['fighting', '#C03028'],
      ['poison', '#A040A0'],
      ['ground', '#E0C068'],
      ['rock', '#B8A038'],
      ['bug', '#A8B820'],
      ['ghost', '#705898'],
      ['steel', '#B8B8D0'],
      ['fire', '#F08030'],
      ['water', '#6890F0'],
      ['grass', '#78C850'],
      ['electric', '#F8D030'],
      ['psychic', '#F85888'],
      ['ice', '#98D8D8'],
      ['dragon', '#7038F8'],
      ['dark', '#705848'],
      ['fairy', '#EE99AC'],
      ['flying', '#A890F0']
    ]);
    const statAbbreviations = {
      [StatName.HP]: 'HP',
      [StatName.Attack]: 'ATK',
      [StatName.Defense]: 'DEF',
      [StatName.SpecialAttack]: 'SpP',
      [StatName.SpecialDefense]: 'SpD',
      [StatName.Speed]: 'spd'
    };

    let svgUrlHillBig = '';
    let svgUrlHillSmall = '';
    let currentSvgDataUrl = ref('');

    onMounted(async () => {
      const idPokemon = route.params.idPokemon;
      if (idPokemon) {
        await getDataPokemon(idPokemon);
      }

      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
    });

    // Generate svg background url
    const generateSvgDataUrl = async (svgUrl, color) => {
      const response = await fetch(svgUrl);
      const svgText = await response.text();
      const modifiedSvgText = svgText.replace(/fill="#[A-Fa-f0-9]+"/, `fill="${color}"`);
      const svgBlob = new Blob([modifiedSvgText], { type: 'image/svg+xml' });
      return URL.createObjectURL(svgBlob);
    };

    // Get icon from pokemon type
    const getTypeIconUrl = (type: string) => {
      return `/src/assets/img/types/${type}.svg`;
    };

    // Get class from pokemon type
    const getTypeClass = (types: any) => {
      return `type-${types[0]}`
    };

    // Get color class from pokemon type
    const getColorClass = (types: any) => {
      return `background-${types[0]}`
    };

    // Get stat abbreviations
    const getAbbreviatedStatName = (statName: StatName) => {
      return statAbbreviations[statName] || statName;
    }

    // On resize window
    const handleResize = () => {
      currentSvgDataUrl.value = window.innerWidth > 580 ? svgUrlHillBig : svgUrlHillSmall;
    };

    // Watch for changes in dataPokemon
    watch(dataPokemon, async (newValue: any) => {
      if (newValue) {
        const type = newValue?.types[0]?.toLowerCase();
        const color = colorMap.get(type || 'transparent');

        svgUrlHillBig = await generateSvgDataUrl('/src/assets/img/icons/hillBig.svg', color);
        svgUrlHillSmall = await generateSvgDataUrl('/src/assets/img/icons/hillSmall.svg', color);
        currentSvgDataUrl.value = window.innerWidth > 580 ? svgUrlHillBig : svgUrlHillSmall;
      }
    });

    return {
      dataPokemon,
      currentSvgDataUrl,
      getTypeIconUrl,
      getTypeClass,
      getColorClass,
      getAbbreviatedStatName
    };
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

@each $type, $color in $color-map {
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
  min-height: 100vh;
}

.box-data {
  position: relative;
  max-width: 860px;
  width: 100%;
  margin: 0 auto;

  &__pokemon {
    padding: 20px;
    position: relative;
  }

  &__bg-bottom {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    z-index: 1;
    display: block;
    width: 100%;
    height: 200px;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .hover {
    opacity: 0.5;
    bottom: 18px;
  }

  &__image {
    position: relative;
    background: transparent;
    width: 100%;
    max-width: 200px;
    display: block;
    object-fit: cover;
    margin: 70px auto 0;
    z-index: 2;
  }

  &__name {
    position: relative;
    color: $color-white;
    text-align: center;
    font-family: $font-family-fira;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    text-transform: capitalize;
    z-index: 2;
    margin: 0;
    height: 40px;
    line-height: 55px;
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
    padding: 20px 20px 40px;
    background: #2C2C2D;
    box-shadow: none;
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

    &__bg-bottom {
      position: fixed;
      height: 352px;
      width: 100vw;
      background-position: 50% 0;
    }

    &__image {
      width: 362px;
      max-width: 362px;
      margin-top: 197px;
    }

    &__name {
      font-size: 45px;
      white-space: nowrap;
      margin-top: 20px;
    }

    &__box-description {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      margin: 73px 0 0 48px;
      border-radius: 4px;
      box-shadow: 0 0 10px 0 #000;
      padding: 20px 2px 0;
      max-height: 620px;
    }

    &__stats {
      margin-top: 11px;
    }

    &__stat-name {
      font-size: 25px;
      min-width: 45px;
    }

    &__line-color {
      left: 0;
      width: 100%;
    }

    &__stats {
      padding: 20px;
    }

    &__progress-bar {
      width: 80%;
      max-width: 315px;
    }

    &__name-type {
      font-size: 25px;
      min-width: 46px;
    }
  }
}
</style>
