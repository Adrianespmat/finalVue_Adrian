<template>
  <div class="eliminar-page">
    <h1>Eliminar Jugador</h1>
    
    <div class="formulario-eliminar">
      <!-- Select de Equipos -->
      <div class="grupo">
        <label>Selecciona un Equipo:</label>
        <select v-model="equipoSeleccionado" @change="cargarJugadoresEquipo">
          <option value="">-- Selecciona un equipo --</option>
          <option v-for="club in clubs" :key="club.id" :value="club.name">
            {{ club.name }}
          </option>
        </select>
      </div>

      <!-- Select de Jugadores-->
      <div class="grupo">
        <label>Selecciona un Jugador:</label>
        <select v-model="jugadorSeleccionado" :disabled="!equipoSeleccionado">
          <option value="">-- Selecciona un jugador --</option>
          <option v-for="jugador in jugadoresFiltrados" :key="jugador.id" :value="jugador">
            {{ jugador.name || jugador.nombre }}
          </option>
        </select>
      </div>

      <!-- Botón Eliminar -->
      <button 
        @click="confirmarEliminacion"
        :disabled="!jugadorSeleccionado"
        class="btn-eliminar"
      >
        Eliminar Jugador
      </button>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'EliminarJugadorView',
  data() {
    return {
      clubs: [],
      players: [],
      equipoSeleccionado: '',
      jugadorSeleccionado: null
    };
  },
  computed: {
    jugadoresFiltrados() {
      if (!this.equipoSeleccionado) return [];
      return this.players.filter(p => 
        (p.team === this.equipoSeleccionado || p.equipo === this.equipoSeleccionado)
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
      console.error("Error cargando datos:", error);
    }
  },
  methods: {
    cargarJugadoresEquipo() {
      this.jugadorSeleccionado = null; // Resetear selección de jugador
    },

    async confirmarEliminacion() {
      if (!this.jugadorSeleccionado) return;

      const nombreJugador = this.jugadorSeleccionado.name || this.jugadorSeleccionado.nombre;

      if (!confirm(`¿Estás seguro de que quieres eliminar a ${nombreJugador}?`)) {
        return;
      }

      try {
        await api.deletePlayer(this.jugadorSeleccionado.id);

        // Actualizar lista 
        this.players = this.players.filter(p => p.id !== this.jugadorSeleccionado.id);
        
        alert(`Jugador ${nombreJugador} eliminado correctamente.`);
        
        // Resetear selección
        this.jugadorSeleccionado = null;
      } catch (error) {
        console.error("Error eliminando jugador:", error);
        alert("Error al eliminar el jugador");
      }
    }
  }
};
</script>

<style scoped>
.eliminar-page {
  max-width: 600px;
  margin: 0 auto;
}
.formulario-eliminar {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.grupo {
  margin-bottom: 20px;
}
.grupo label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
.grupo select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}
.btn-eliminar {
  background-color: #e74c3c;
  color: white;
  padding: 12px 25px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}
.btn-eliminar:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
</style>