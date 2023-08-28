import PokemonCarousel from '../PokemonCarousel.vue';

export default {
    title: 'Components/PokemonCarousel',
    component: PokemonCarousel,
};

export const Default = (args) => ({
    components: { PokemonCarousel },
    setup() {
        return { args };
    },
    template: '<div style="background-color: #2C2C2DE5;"><PokemonCarousel v-bind="args" /></div>',
});

Default.args = {};
