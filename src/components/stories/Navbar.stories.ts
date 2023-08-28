import Navbar from '../Navbar.vue';

export default {
    title: 'Components/Navbar',
    component: Navbar,
};

export const Default = () => ({
    components: { Navbar },
    template: `
      <div style="height: 60px; width: 100%; position: relative; background-color: black;">
      <NavbarMenu />
      </div>
    `,
});
