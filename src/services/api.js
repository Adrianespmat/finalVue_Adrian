
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  // Clubs
  getClubs() {
    return axios.get(`${API_URL}/clubs`);
  },

  // Partidos
  getMatches() {
    return axios.get(`${API_URL}/matches`);
  },
  createMatch(match) {
    return axios.post(`${API_URL}/matches`, match);
  },
  updateMatch(id, data) {
    return axios.patch(`${API_URL}/matches/${id}`, data);
  },

  // Jugadores
  getPlayers() {
    return axios.get(`${API_URL}/players`);
  },
  createPlayer(player) {
    return axios.post(`${API_URL}/players`, player);
  },
  updatePlayer(id, data) {
    return axios.patch(`${API_URL}/players/${id}`, data);
  },
  deletePlayer(id) {
    return axios.delete(`${API_URL}/players/${id}`);
  }
};