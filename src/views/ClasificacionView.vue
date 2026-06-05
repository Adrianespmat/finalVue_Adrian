<template>
  <div class="clasificacion-page">
    <h1>Clasificación Actual</h1>
    
    <table class="clasificacion-table">
      <thead>
        <tr>
          <th>Posición</th>
          <th>Equipo</th>
          <th>Puntos</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(club, index) in clasificacion" 
          :key="club.id"
          @click="mostrarJugadores(club)"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ club.name }}</td>
          <td><strong>{{ club.points || 0 }}</strong></td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedClub" class="detalle-jugadores">
      <h2>Jugadores de {{ selectedClub.name }}</h2>
      <ul>
        <li v-for="jugador in jugadoresEquipo" :key="jugador.id">
          {{ jugador.name || jugador.nombre }} — 
          <strong>{{ jugador.scores || jugador.goles }} goles</strong>
        </li>
      </ul>
      <button @click="selectedClub = null" class="btn-cerrar">Cerrar</button>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'ClasificacionView',
  data() {
    return {
      clubs: [],
      players: [],
      selectedClub: null
    };
  },
  computed: {
    clasificacion() {
      return [...this.clubs].sort((a, b) => (b.points || 0) - (a.points || 0));
    },
    jugadoresEquipo() {
      if (!this.selectedClub) return [];
      return this.players.filter(p => 
        (p.team || p.equipo) === this.selectedClub.name
      );
    }
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
      console.error("Error al cargar datos:", error);
    }
  },
  methods: {
    mostrarJugadores(club) {
      this.selectedClub = club;
    }
  }
};
</script>

<style scoped>
.clasificacion-page h1 { text-align: center; margin-bottom: 25px; color: #2c3e50; }
.clasificacion-table { 
  width: 100%; 
  border-collapse: collapse; 
  background: white; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
}
.clasificacion-table th, .clasificacion-table td { 
  padding: 14px; 
  text-align: left; 
  border-bottom: 1px solid #ddd; 
}
.clasificacion-table th { 
  background-color: #2c3e50; 
  color: white; 
}
.clasificacion-table tr:hover { 
  background-color: #f1f8ff; 
  cursor: pointer; 
}
.detalle-jugadores { 
  margin-top: 30px; 
  padding: 25px; 
  background: white; 
  border-radius: 8px; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
}
.btn-cerrar { 
  background-color: #e74c3c; 
  color: white; 
  margin-top: 15px; 
}
</style>