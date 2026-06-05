<template>
  <div class="equipos-page">
    <h1>Equipos de la Liga</h1>
    
    <div v-for="club in clubs" :key="club.id" class="equipo-card">
      <h2 @click="seleccionarEquipo(club)" :class="{ active: equipoSeleccionado?.name === club.name }">
        {{ club.name }}
      </h2>
      
      <!-- Lista de jugadores -->
      <ul class="lista-jugadores">
        <li v-for="jugador in jugadoresDelEquipo(club)" :key="jugador.id">
          {{ jugador.name || jugador.nombre }} — 
          <strong>{{ jugador.scores || jugador.goles || 0 }} goles</strong>
        </li>
      </ul>

      <!-- Botón Nuevo Jugador (deshabilitado hasta hacer click en el equipo) -->
      <button 
        @click="irANuevoJugador(club)"
        :disabled="equipoSeleccionado?.name !== club.name"
        class="btn-nuevo-jugador"
      >
        Nuevo Jugador
      </button>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'EquiposView',
  data() {
    return {
      clubs: [],
      players: [],
      equipoSeleccionado: null
    };
  },
  async mounted() {
    try {
      const [clubsRes, playersRes] = await Promise.all([
        api.getClubs(),
        api.getPlayers()
      ]);
      this.clubs = clubsRes.data;
      this.players = playersRes.data;
    } catch (error) {
      console.error("Error cargando equipos:", error);
    }
  },
  methods: {
    seleccionarEquipo(club) {
      this.equipoSeleccionado = club;
    },

    jugadoresDelEquipo(club) {
      if (!club?.name) return [];
      
      const nombreEquipo = club.name.trim();
      
      return this.players.filter(jugador => {
        const equipoJugador = (jugador.team || jugador.equipo || '').trim();
        return equipoJugador === nombreEquipo;
      });
    },

    irANuevoJugador(club) {
      this.$router.push({
        path: '/nuevo-jugador',
        query: { equipo: club.name }
      });
    }
  }
};
</script>

<style scoped>
.equipos-page h1 {
  text-align: center;
  margin-bottom: 30px;
}
.equipo-card {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.equipo-card h2 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  cursor: pointer;
}
.equipo-card h2:hover, .equipo-card h2.active {
  color: #3498db;
}
.lista-jugadores {
  list-style: none;
  padding: 0;
  margin-bottom: 15px;
}
.lista-jugadores li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
.btn-nuevo-jugador {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-nuevo-jugador:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
</style>