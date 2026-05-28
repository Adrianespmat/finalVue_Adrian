<template>
  <div class="box-formulario">
    <h2>Añadir Nuevo Jugador</h2>

    <form @submit.prevent="guardarJugadorAPI" class="form-jugador">
      <div class="grupo">
        <label>Nombre Completo del Jugador:</label>
        <input type="text" v-model="jugador.nombre" required />
      </div>

      <div class="grupo">
        <label>Equipo:</label>
        <select v-model="jugador.equipo" :disabled="bloquearCampoEquipo" required>
          <option value="">-- Elige un Club --</option>
          <option v-for="eq in equipos" :key="eq.id" :value="eq.name">
            {{ eq.name }}
          </option>
        </select>
      </div>

      <div class="grupo">
        <label>Goles Iniciales:</label>
        <input type="number" v-model.number="jugador.goles" min="0" required />
      </div>

      <button type="submit" class="btn-submit">Dar de Alta</button>
    </form>

    <div v-if="feedback" class="alerta exito">{{ feedback }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NuevoJugadorView',
  data() {
    return {
      equipos: [],
      jugador: {
        nombre: '',
        equipo: '',
        goles: 0
      },
      bloquearCampoEquipo: false,
      feedback: ''
    };
  },
  mounted() {
    this.cargarClubes();
    
    // Coger el parámetro "?equipo=Nombre"
    if (this.$route.query.equipo) {
      this.jugador.equipo = this.$route.query.equipo;
      this.bloquearCampoEquipo = true;
    }
  },
  methods: {
    cargarClubes() {
      axios.get('http://localhost:3000/clubs')
        .then(response => { 
          this.equipos = response.data; 
        })
        .catch(err => console.error("Error al cargar clubes:", err));
    },
    guardarJugadorAPI() {
      axios.post('http://localhost:3000/players', this.jugador)
        .then(() => {
          this.feedback = `El jugador "${this.jugador.nombre}" fue dado de alta con éxito en el ${this.jugador.equipo}.`;
          
          if (this.bloquearCampoEquipo) {
            this.jugador.nombre = '';
            this.jugador.goles = 0;
          } else {
            this.jugador = { nombre: '', equipo: '', goles: 0 };
          }
        })
        .catch(err => console.error("Error al registrar jugador:", err));
    }
  }
}
</script>

<style scoped>

.box-formulario { max-width: 480px; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.form-jugador { display: flex; flex-direction: column; gap: 15px; }
.grupo { display: flex; flex-direction: column; gap: 5px; }
.grupo label { font-weight: bold; color: #2c3e50; }
.grupo input, .grupo select { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
.grupo select:disabled { background-color: #e9ecef; color: #131517; cursor: not-allowed; }
.btn-submit { background-color: #3498db; color: white; padding: 12px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; font-size: 15px; }
.btn-submit:hover { background-color: #2980b9; }
.alerta.exito { margin-top: 15px; padding: 12px; border-radius: 4px; font-weight: bold; text-align: center; color: #27ae60; background-color: #d4efdf; }

</style>