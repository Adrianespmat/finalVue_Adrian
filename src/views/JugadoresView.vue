<template>
  <div class="jugadores-page">
    <h1>Jugadores</h1>
    
    <div class="contenido-jugadores">
      <!-- Lista de equipos a la izquierda -->
      <div class="lista-equipos">
        <h2>Equipos</h2>
        <ul>
          <li 
            v-for="club in clubs" 
            :key="club.id"
            @click="seleccionarEquipo(club)"
            :class="{ active: equipoSeleccionado?.name === club.name }"
          >
            {{ club.name }}
          </li>
        </ul>
      </div>

      <!-- Zona derecha: jugadores del equipo seleccionado -->
      <div class="zona-jugadores">
        <h2 v-if="equipoSeleccionado">
          Jugadores de {{ equipoSeleccionado.name }}
        </h2>
        <p v-else>Selecciona un equipo para ver sus jugadores</p>

        <div v-if="equipoSeleccionado" class="lista-jugadores">
          <div 
            v-for="jugador in jugadoresEquipo" 
            :key="jugador.id"
            class="jugador-item"
            @click="mostrarDetalleJugador(jugador)"
          >
            {{ jugador.name || jugador.nombre }}
          </div>
        </div>
      </div>
    </div>

    <!-- Detalle del jugador (cuando se hace click) -->
    <div v-if="jugadorSeleccionado" class="detalle-jugador">
      <h2>Detalle de {{ jugadorSeleccionado.name || jugadorSeleccionado.nombre }}</h2>
      <p><strong>Equipo:</strong> {{ jugadorSeleccionado.team || jugadorSeleccionado.equipo }}</p>
      <p><strong>Goles:</strong> {{ jugadorSeleccionado.scores || jugadorSeleccionado.goles }}</p>

      <div class="acciones">
        <input 
          type="number" 
          v-model="golesASumar" 
          min="0" 
          placeholder="Goles a sumar"
        >
        <button @click="sumarGoles" class="btn-sumar">Sumar Goles</button>
        <button @click="eliminarJugador" class="btn-eliminar">Eliminar Jugador</button>
      </div>

      <button @click="cerrarDetalle" class="btn-cerrar">Cerrar</button>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'JugadoresView',
  data() {
    return {
      clubs: [],
      players: [],
      equipoSeleccionado: null,
      jugadorSeleccionado: null,
      golesASumar: 0
    };
  },
  computed: {
    jugadoresEquipo() {
      if (!this.equipoSeleccionado) return [];
      return this.players.filter(p => 
        (p.team === this.equipoSeleccionado.name || p.equipo === this.equipoSeleccionado.name)
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
    seleccionarEquipo(club) {
      this.equipoSeleccionado = club;
      this.jugadorSeleccionado = null;
    },

    mostrarDetalleJugador(jugador) {
      this.jugadorSeleccionado = jugador;
      this.golesASumar = 0;
    },

    async sumarGoles() {
      if (!this.jugadorSeleccionado || this.golesASumar <= 0) return;

      const nuevoGoles = (this.jugadorSeleccionado.scores || this.jugadorSeleccionado.goles || 0) + this.golesASumar;

      try {
        await api.updatePlayer(this.jugadorSeleccionado.id, { 
          scores: nuevoGoles,
          goles: nuevoGoles 
        });

        // Actualizar en local
        this.jugadorSeleccionado.scores = nuevoGoles;
        this.jugadorSeleccionado.goles = nuevoGoles;

        alert(`Se sumaron ${this.golesASumar} goles a ${this.jugadorSeleccionado.name || this.jugadorSeleccionado.nombre}`);
        this.golesASumar = 0;
      } catch (error) {
        console.error("Error sumando goles:", error);
        alert("Error al actualizar goles");
      }
    },

    async eliminarJugador() {
      if (!confirm(`¿Seguro que quieres eliminar a ${this.jugadorSeleccionado.name || this.jugadorSeleccionado.nombre}?`)) {
        return;
      }

      try {
        await api.deletePlayer(this.jugadorSeleccionado.id);
        
        // Eliminar de la lista local
        this.players = this.players.filter(p => p.id !== this.jugadorSeleccionado.id);
        
        alert("Jugador eliminado correctamente");
        this.jugadorSeleccionado = null;
      } catch (error) {
        console.error("Error eliminando jugador:", error);
        alert("Error al eliminar el jugador");
      }
    },

    cerrarDetalle() {
      this.jugadorSeleccionado = null;
    }
  }
};
</script>

<style scoped>
.jugadores-page {
  max-width: 1100px;
}
.contenido-jugadores {
  display: flex;
  gap: 30px;
}
.lista-equipos {
  width: 280px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.lista-equipos ul {
  list-style: none;
  padding: 0;
}
.lista-equipos li {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}
.lista-equipos li:hover, .lista-equipos li.active {
  background-color: #e3f2fd;
}
.zona-jugadores {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.jugador-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.jugador-item:hover {
  background-color: #f8f9fa;
}
.detalle-jugador {
  margin-top: 25px;
  padding: 25px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.acciones {
  margin: 20px 0;
}
.acciones input {
  padding: 8px;
  width: 120px;
  margin-right: 10px;
}
.btn-sumar { background-color: #27ae60; margin-right: 10px; }
.btn-eliminar { background-color: #e74c3c; }
.btn-cerrar { background-color: #95a5a6; margin-top: 15px; }
</style>