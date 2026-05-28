<template>
  <div class="box-formulario">
    <h2>Registrar Nuevo Partido</h2>

    <form @submit.prevent="guardarPartido" class="form-partido">
      <div class="grupo">
        <label>Número de Jornada:</label>
        <input type="number" v-model.number="partido.round" min="1" required />
      </div>

      <div class="grupo">
        <label>Equipo Local:</label>
        <select v-model="partido.team1" required>
          <option value="">-- Selecciona Equipo Local --</option>
          <option v-for="eq in equipos" :key="eq.id" :value="eq.name">
            {{ eq.name }}
          </option>
        </select>
      </div>

      <div class="grupo">
        <label>Equipo Visitante:</label>
        <select v-model="partido.team2" required>
          <option value="">-- Selecciona Equipo Visitante --</option>
          <option v-for="eq in equipos" :key="eq.id" :value="eq.name">
            {{ eq.name }}
          </option>
        </select>
      </div>

      <div class="grupo-goles">
        <div class="grupo">
          <label>Goles Local (Opcional):</label>
          <input type="number" v-model.number="partido.golesLocal" min="0" />
        </div>
        <div class="grupo">
          <label>Goles Visitante (Opcional):</label>
          <input type="number" v-model.number="partido.golesVisitante" min="0" />
        </div>
      </div>

      <button type="submit" class="btn-submit">Guardar Partido</button>
    </form>

    <div v-if="error" class="alerta error">{{ error }}</div>
    <div v-if="exito" class="alerta exito">{{ exito }}</div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'NuevoPartidoView',
  data() {
    return {
      equipos: [],
      partido: {
        round: 1,
        team1: '',
        team2: '',
        golesLocal: null,
        golesVisitante: null
      },
      error: '',
      exito: ''
    };
  },
  async mounted() {
    this.cargarClubes();
  },
  methods: {
    async cargarClubes() {
      try {
        const response = await api.getClubs();
        this.equipos = response.data;
      } catch (err) {
        console.error("Error al obtener los clubes:", err);
        this.error = "Error al cargar los equipos";
      }
    },

    async guardarPartido() {
      this.error = '';
      this.exito = '';

      // Validaciones
      if (this.partido.team1 === this.partido.team2) {
        this.error = "El equipo local y visitante no pueden ser el mismo.";
        return;
      }

      // Preparar objeto 
      const nuevoPartido = {
        round: `Jornada ${this.partido.round}`,
        date: new Date().toISOString().split('T')[0], // fecha actual
        team1: this.partido.team1,
        team2: this.partido.team2
      };

      // Si se han introducido goles
      if (this.partido.golesLocal !== null && this.partido.golesVisitante !== null) {
        nuevoPartido.score = [
          this.partido.golesLocal,
          this.partido.golesVisitante
        ];
      }

      try {
        await api.createMatch(nuevoPartido);
        
        this.exito = `¡Partido de la Jornada ${this.partido.round} registrado correctamente!`;
        
        // Resetear formulario
        this.partido = {
          round: this.partido.round,
          team1: '',
          team2: '',
          golesLocal: null,
          golesVisitante: null
        };
      } catch (err) {
        console.error(err);
        this.error = "Error al guardar el partido en la base de datos.";
      }
    }
  }
};
</script>

<style scoped>

.box-formulario { max-width: 480px; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.form-partido { display: flex; flex-direction: column; gap: 15px; }
.grupo { display: flex; flex-direction: column; gap: 5px; }
.grupo label { font-weight: bold; color: #2c3e50; }
.grupo input, .grupo select { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
.grupo-goles { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.btn-submit { background-color: #2ecc71; color: white; padding: 12px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; font-size: 15px; }
.btn-submit:hover { background-color: #27ae60; }
.alerta { margin-top: 15px; padding: 12px; border-radius: 4px; font-weight: bold; text-align: center; }
.alerta.error { color: #c0392b; background-color: #fadbd8; }
.alerta.exito { color: #27ae60; background-color: #d4efdf; }
</style>