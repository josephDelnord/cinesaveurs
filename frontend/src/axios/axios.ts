import axios from 'axios';

const token = localStorage.getItem('authToken');

axios.get('http://localhost:5000/api/', {
  headers: {
    'Authorization': `Bearer ${token}`, // Envoi du token JWT dans l'en-tête
    'Content-Type': 'application/json',
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error:', error);
});
