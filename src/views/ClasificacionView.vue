<template>
  <div class="clasificacion-page">
    <h1>Clasificación Actual</h1>
    
    <!-- Tabla de clasificación-->
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
          :class="{ selected: selectedClub?.name === club.name }"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ club.name }}</td>
          <td><strong>{{ club.points }}</strong></td>
        </tr>
      </tbody>
    </table>

    <!--jugadores -->
    <div v-if="selectedClub" class="detalle-jugadores">
      <h2>Jugadores de {{ selectedClub.name }}</h2>
      <ul v-if="jugadoresEquipo.length > 0">
        <li v-for="jugador in jugadoresEquipo" :key="jugador.id">
          {{ jugador.name || jugador.nombre }} — 
          <strong>{{ jugador.scores || jugador.goles }} goles</strong>
        </li>
      </ul>
      <p v-else>No hay jugadores registrados para este equipo.</p>
      
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
      return [...this.clubs].sort((a, b) => b.points - a.points);
    },
    jugadoresEquipo() {
      if (!this.selectedClub) return [];
      
      const nombreEquipo = this.selectedClub.name.trim();
      
      return this.players.filter(p => {
        const teamJugador = (p.team || p.equipo || '').trim();
        return teamJugador === nombreEquipo;
      });
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
      console.error("Error al cargar clasificación:", error);
    }
  },
  methods: {
    mostrarJugadores(club) {
      this.selectedClub = club;
      console.log("Equipo seleccionado:", club.name);
      console.log("Jugadores encontrados:", this.jugadoresEquipo.length);
    }
  }
};
</script>

<style scoped>
.clasificacion-page h1 {
  text-align: center;
  margin-bottom: 25px;
  color: #2c3e50;
}
.clasificacion-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
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
.selected {
  background-color: #d4e6ff;
}
.detalle-jugadores {
  margin-top: 20px;
  padding: 25px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.detalle-jugadores ul {
  list-style: none;
  padding: 0;
}
.detalle-jugadores li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.btn-cerrar {
  margin-top: 20px;
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>