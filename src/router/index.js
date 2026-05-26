import { createRouter, createWebHistory } from 'vue-router';
import InicioView from '../views/InicioView.vue';
import NuevoPartidoView from '../views/NuevoPartidoView.vue';
import NuevoJugadorView from '../views/NuevoJugadorView.vue';

const EnDesarrollo = { 
  template: '<div style="padding:20px;"><h2>Sección en desarrollo para la Entrega Final</h2></div>' 
};

const routes = [
  { path: '/', name: 'Inicio', component: InicioView },
  { path: '/clasificacion', name: 'Clasificacion', component: EnDesarrollo },
  { path: '/jornadas', name: 'Jornadas', component: EnDesarrollo },
  { path: '/nuevo-partido', name: 'NuevoPartido', component: NuevoPartidoView },
  { path: '/equipos', name: 'Equipos', component: EnDesarrollo },
  { path: '/jugadores', name: 'Jugadores', component: EnDesarrollo },
  { path: '/nuevo-jugador', name: 'NuevoJugador', component: NuevoJugadorView },
  { path: '/eliminar-jugador', name: 'EliminarJugador', component: EnDesarrollo }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;