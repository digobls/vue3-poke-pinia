<template>
  <div class="carousel-container">
    <div class="carousel-container__box-images">
      <transition name="carousel-slide" mode="out-in">
        <div :key="activeIndex" class="carousel-container__slide">
          <img :src="images[activeIndex].url" :alt="images[activeIndex].name" class="carousel-container__image"/>
        </div>
      </transition>
    </div>
    <div class="carousel-container__bullets">
      <span
          v-for="(image, index) in images"
          :key="index"
          class="carousel-container__bullet"
          :class="{'carousel-container__bullet--active': index === activeIndex}"
          @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import image1 from '../assets/home/venosaur-carousel.png';
import image2 from '../assets/home/charizard-carousel.png';
import image3 from '../assets/home/blastoise-carousel.png';

interface Image {
  url: string;
  name: string;
}

export default defineComponent({
  name: 'Carousel',
  data() {
    return {
      images: [
        { url: image1, name: 'Venosaur' },
        { url: image2, name: 'Charizard' },
        { url: image3, name: 'Blastoise' },
      ] as Image[],
      activeIndex: 0,
      autoplayInterval: 0,
    };
  },
  mounted() {
    this.startAutoplay();
  },
  methods: {
    nextSlide() {
      this.activeIndex = (this.activeIndex + 1) % this.images.length;
    },
    goToSlide(index: number) {
      this.activeIndex = index;
      this.stopAutoplay();
      this.startAutoplay();
    },
    startAutoplay() {
      this.autoplayInterval = setInterval(() => {
        this.nextSlide();
      }, 4500);
    },
    stopAutoplay() {
      clearInterval(this.autoplayInterval);
    }
  },
  beforeUnmount() {
    this.stopAutoplay();
  },
});
</script>

<style scoped lang="scss">
.carousel-container {
  position: relative;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;

  &__box-images {
    display: flex;
    overflow: hidden;
  }

  &__slide {
    flex-shrink: 0;
    width: 400px;
    height: 300px;
  }

  &__image {
    width: 100%;
    max-width: 475px;
    height: 100%;
    object-fit: cover;
  }

  &__bullets {
    position: absolute;
    top: 50%;
    right: -30px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  &__bullet {
    width: 10px;
    height: 10px;
    background-color: #ccc;
    border-radius: 50%;
    margin: 5px 0;
    cursor: pointer;

    &--active {
      background-color: #333;
    }
  }
}

.bullet-container {
  position: absolute;
  top: 50%;
  right: -30px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.bullets {
  position: absolute;
  top: 50%;
  right: -30px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}



.active {
  background-color: #333;
}

.carousel-slide-enter-active, .carousel-slide-leave-active {
  transition: opacity 1s;
}

.carousel-slide-enter, .carousel-slide-leave-to {
  opacity: 0;
}
</style>
