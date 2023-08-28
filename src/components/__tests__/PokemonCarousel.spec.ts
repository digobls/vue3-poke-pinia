import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import PokemonCarousel from '../PokemonCarousel.vue'
import image2 from '@/assets/img/home/charizard-carousel.png';

describe('PokemonCarousel', () => {
  it('renders images and bullets properly', async () => {
    const wrapper = mount(PokemonCarousel);
    await wrapper.vm.$nextTick();

    const bullets = wrapper.findAll('.carousel-container__bullet');

    // Simulates clicking on the second bullet/bullet
    await bullets[1].trigger('click');
    await wrapper.vm.$nextTick();

    // Checks if the second image is being displayed after clicking on the second bullet/bullet
    expect(wrapper.find('.carousel-container__slide img[src="' + image2 + '"]').exists()).toBe(true);
  });
});
