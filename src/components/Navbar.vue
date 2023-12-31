<template>
  <nav class="navbar">
    <div class="navbar__container">
      <input class="navbar__container__checkbox" type="checkbox" name="menu" id="menu" />
      <div class="navbar__container__hamburger-lines">
        <span class="navbar__container__hamburger-lines__line navbar__container__hamburger-lines__line--1"></span>
        <span class="navbar__container__hamburger-lines__line navbar__container__hamburger-lines__line--2"></span>
        <span class="navbar__container__hamburger-lines__line navbar__container__hamburger-lines__line--3"></span>
      </div>
      <div class="navbar__container__logo">
        <router-link to="/" class="navbar__container__logo--text">Pokemon</router-link>
      </div>
      <ul class="navbar__container__menu-items">
        <li class="navbar__container__menu-items__menu-item">
          <router-link to="/" class="navbar__container__menu-items__menu-item__menu-link">
            <span class="navbar__container__menu-items__menu-item__menu-link__menu-link-text"
                  :class="{ active: isRouteActive('/') }"
            >Home</span>
          </router-link>
        </li>
        <li class="navbar__container__menu-items__menu-item">
          <router-link to="/list" class="navbar__container__menu-items__menu-item__menu-link">
            <span class="navbar__container__menu-items__menu-item__menu-link__menu-link-text"
                  :class="{ active: isRouteActive('/list') }"
            >List</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NavbarMenu',
  methods: {
    isRouteActive(routePath: string): boolean {
      return window.location.pathname === routePath;
    },
  }
});
</script>

<style lang="scss" scoped>
$font-family: 'Fira Code', monospace;
$white-color: #fff;
$background-menu: #2C2C2D;

.navbar {
  width: calc(100% + 1px);
  background: transparent;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;

  &__container {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;

    &__checkbox {
      position: absolute;
      display: block;
      height: 32px;
      width: 32px;
      top: 12px;
      right: 20px;
      z-index: 5;
      opacity: 0;
      cursor: pointer;
    }

    &__hamburger-lines {
      height: 18px;
      width: 25px;
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &__line {
        display: block;
        height: 3px;
        width: 100%;
        border-radius: 10px;
        background: $white-color;
      }

      &__line--1 {
        transform-origin: 0 0;
        transition: transform 0.4s ease-in-out;
      }

      &__line--2 {
        transition: transform 0.2s ease-in-out;
      }

      &__line--3 {
        transform-origin: 0 100%;
        transition: transform 0.4s ease-in-out;
      }
    }

    &__logo {
      margin-left: 20px;
      z-index: 2;

      &--text {
        color: $white-color;
        text-align: left;
        font-family: $font-family;
        font-size: 20px;
        font-style: normal;
        font-weight: 450;
        line-height: normal;
        text-decoration: none;
      }
    }

    &__menu-items {
      position: absolute;
      width: 100%;
      height: 100vh;
      background: $background-menu;
      top: -1px;
      left: -1px;
      padding: 100px 0 0;
      margin: 0;
      text-align: left;
      display: flex;
      flex-direction: column;
      transform: translate(-150%);
      transition: transform 0.5s ease-in-out;
      z-index: 1;

      &__menu-item {
        list-style: none;

        &__menu-link {
          display: flex;
          margin-left: 29px;
          padding-bottom: 30px;
          text-decoration: none;

          &__menu-link-text {
            position: relative;
            color: $white-color;
            font-family: $font-family;
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            padding-bottom: 30px;
          }

          &__menu-link-text.active {
            &::before {
              content: "";
              width: 160px;
              height: 1px;
              background: $white-color;
              position: absolute;
              bottom: 0;
            }
          }
        }
      }
    }

    input[type="checkbox"]:checked ~ .navbar__container__menu-items {
      transform: translateX(0);

      &__hamburger-lines {
        &__line--1 {
          transform: rotate(45deg);
        }

        &__line--2 {
          transform: scaleY(0);
        }

        &__line--3 {
          transform: rotate(-45deg);
        }
      }
    }

    @media only screen and (min-width: 581px) {
      max-width: 860px;
      margin: 0 auto;
      display: flex;

      &__logo {
        margin: 0;
        position: relative;

        &--text {
          &:before {
            content: "";
            width: 70px;
            height: 1px;
            background: $white-color;
            position: absolute;
            right: -86px;
            top: 0;
            bottom: 0;
            margin: auto;
          }
        }
      }

      &__checkbox, &__hamburger-lines {
        display: none;
      }

      &__menu-items {
        background: transparent;
        position: unset;
        height: 60px;
        padding: 0;
        margin: 0;
        transform: initial;
        transition: auto;
        display: flex;
        justify-content: end;
        flex-direction: unset;

        &__menu-item {
          position: relative;
          list-style: none;
          width: 100%;
          max-width: 200px;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          &__menu-link {
            padding: 0;

            &__menu-link-text {
              position: relative;
              color: $white-color;
              font-family: $font-family;
              font-size: 16px;
              font-style: normal;
              font-weight: 450;
              line-height: normal;
              padding: 0;
              text-align: center;

              &::before {
                display: none;
              }
            }

            &__menu-link-text.active {
              font-weight: 700;

              &::before {
                display: none;
              }
            }
          }

          &:first-of-type {
            &:before {
              content: "";
              width: 1px;
              height: 35px;
              background: $white-color;
              position: absolute;
              right: 0;
            }
          }
        }
      }
    }
  }

  @media only screen and (min-width: 581px) {
    width: 100%;
  }
}
</style>
