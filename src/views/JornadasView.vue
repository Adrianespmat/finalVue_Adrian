<template>
  <div class="jornadas-page">
    <h1>Jornadas de la Liga</h1>
    
    <div class="selector-jornada">
      <label>Seleccionar Jornada:</label>
      <select v-model="jornadaSeleccionada" @change="cargarPartidosJornada">
        <option value="">-- Selecciona una jornada --</option>
        <option v-for="jornada in jornadasUnicas" :key="jornada" :value="jornada">
          {{ jornada }}
        </option>
      </select>
    </div>

    <div v-if="jornadaSeleccionada" class="partidos-jornada">
      <h2>{{ jornadaSeleccionada }}</h2>
      
      <div v-for="partido in partidosFiltrados" :key="partido.id" class="partido-card">
        <div class="equipos">
          <span class="local">{{ partido.team1 }}</span>
          
          <span v-if="partido.score && partido.score.length === 2" class="resultado">
            {{ partido.score[0] }} - {{ partido.score[1] }}
          </span>
          
          <div v-else class="resultado-input">
            <input 
              type="number" 
              v-model.number="partido.golesLocalTemp" 
              min="0" 
              class="input-gol"
              placeholder="0"
            >
            <span class="guion">–</span>
            <input 
              type="number" 
              v-model.number="partido.golesVisitanteTemp" 
              min="0" 
              class="input-gol"
              placeholder="0"
            >
            <button @click="guardarResultado(partido)" class="btn-guardar">Guardar</button>
          </div>
          
          <span class="visitante">{{ partido.team2 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'JornadasView',
  data() {
    return {
      matches: [],
      clubs: [],
      jornadaSeleccionada: '',
      partidosFiltrados: []
    };
  },
  computed: {
    jornadasUnicas() {
      const jornadas = this.matches.map(m => m.round);
      return [...new Set(jornadas)].sort();
    }
  },
  async mounted() {
    await this.cargarDatos();
    await this.calcularPuntosIniciales(); // Calcula puntos de partidos ya jugados
  },
  methods: {
    async cargarDatos() {
      try {
        const [matchesRes, clubsRes] = await Promise.all([
          api.getMatches(),
          api.getClubs()
        ]);
        this.matches = matchesRes.data;
        this.clubs = clubsRes.data;
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    },

    // Calcula puntos iniciales de todos los partidos ya jugados
    async calcularPuntosIniciales() {
      for (const partido of this.matches) {
        if (partido.score && partido.score.length === 2) {
          await this.actualizarPuntos(
            partido.team1, 
            partido.team2, 
            partido.score[0], 
            partido.score[1]
          );
        }
      }
    },

    cargarPartidosJornada() {
      this.partidosFiltrados = this.matches
        .filter(m => m.round === this.jornadaSeleccionada)
        .map(partido => ({
          ...partido,
          golesLocalTemp: partido.score ? partido.score[0] : null,
          golesVisitanteTemp: partido.score ? partido.score[1] : null
        }));
    },

    async guardarResultado(partido) {
      if (partido.golesLocalTemp === null || partido.golesVisitanteTemp === null) {
        alert("Debes introducir ambos resultados");
        return;
      }

      const golesLocal = parseInt(partido.golesLocalTemp);
      const golesVisitante = parseInt(partido.golesVisitanteTemp);

      try {
        await api.updateMatch(partido.id, { 
          score: [golesLocal, golesVisitante] 
        });

        await this.actualizarPuntos(partido.team1, partido.team2, golesLocal, golesVisitante);

        partido.score = [golesLocal, golesVisitante];
        
        
        this.cargarPartidosJornada();
      } catch (error) {
        console.error(error);
        alert("Error al guardar el resultado");
      }
    },

    async actualizarPuntos(team1, team2, goles1, goles2) {
      let puntos1 = 0;
      let puntos2 = 0;

      if (goles1 > goles2) puntos1 = 3;
      else if (goles2 > goles1) puntos2 = 3;
      else {
        puntos1 = 1;
        puntos2 = 1;
      }

      // Actualizar equipo local
      const club1 = this.clubs.find(c => c.name === team1);
      if (club1) {
        const nuevosPuntos = (club1.points || 0) + puntos1;
        await api.updateClub(club1.id, { points: nuevosPuntos });
        club1.points = nuevosPuntos;
      }

      // Actualizar equipo visitante
      const club2 = this.clubs.find(c => c.name === team2);
      if (club2) {
        const nuevosPuntos = (club2.points || 0) + puntos2;
        await api.updateClub(club2.id, { points: nuevosPuntos });
        club2.points = nuevosPuntos;
      }
    }
  }
};
</script>

<style scoped>
.jornadas-page h1 { text-align: center; margin-bottom: 25px; }
.selector-jornada { text-align: center; margin-bottom: 30px; }
.selector-jornada select { 
  padding: 10px 15px; 
  font-size: 16px; 
  border-radius: 6px; 
  min-width: 250px;
}
.partidos-jornada h2 { 
  text-align: center; 
  margin: 25px 0 20px; 
  color: #2c3e50; 
}
.partido-card {
  background: white;
  padding: 18px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.equipos { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 25px; 
  font-size: 18px; 
}
.local, .visitante { font-weight: bold; min-width: 180px; text-align: center; }
.resultado { 
  font-size: 24px; 
  font-weight: bold; 
  color: #2c3e50; 
  min-width: 80px;
  text-align: center;
}
.resultado-input { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
}
.input-gol { 
  width: 70px; 
  text-align: center; 
  padding: 8px; 
  font-size: 18px; 
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn-guardar { 
  background-color: #27ae60; 
  color: white; 
  padding: 8px 18px; 
  border: none; 
  border-radius: 4px; 
  cursor: pointer;
  font-weight: bold;
}
</style>