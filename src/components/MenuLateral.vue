<template>
  <nav class="menu-lateral">
    <h3>Liga 1ª División</h3>
    <hr />
    <router-link to="/">Inicio</router-link>
    <router-link to="/clasificacion">Clasificación</router-link>
    <router-link to="/jornadas">Jornadas</router-link>
    <router-link to="/nuevo-partido">Nuevo Partido</router-link>
    <router-link to="/equipos">Equipos</router-link>
    <router-link to="/jugadores">Jugadores</router-link>
    <router-link to="/nuevo-jugador">Nuevo Jugador</router-link>
    <router-link to="/eliminar-jugador">Eliminar Jugador</router-link>
  </nav>
</template>

<script>
export default {
  name: 'MenuLateral'
}
</script>

<style scoped>
.menu-lateral {
  width: 240px;
  background-color: #1a252f;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
}
.menu-lateral h3 {
  margin: 0;
  text-align: center;
  color: #3498db;
}
.menu-lateral hr {
  border: 0;
  height: 1px;
  background-color: #34495e;
  width: 100%;
  margin-bottom: 10px;
}
.menu-lateral a {
  color: #ecf0f1;
  text-decoration: none;
  font-weight: bold;
  padding: 10px;
  border-radius: 4px;
  transition: background 0.2s;
}
.menu-lateral a:hover {
  background-color: #2c3e50;
}
.menu-lateral a.router-link-active {
  background-color: #3498db;
}
</style>