import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrva6HkQEmzDszrpeOgHewUkDsZBUIfgM",
  authDomain: "control-pacientes-doctor-88920.firebaseapp.com",
  projectId: "control-pacientes-doctor-88920",
  storageBucket: "control-pacientes-doctor-88920.firebasestorage.app",
  messagingSenderId: "16909279858",
  appId: "1:16909279858:web:9d5d9c2de714290d1c58eb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Control de bienvenida por sesión de navegación
const welcomeModal = document.getElementById('welcomeModal');
const closeModal = document.getElementById('closeModal');

// Se usa sessionStorage para verificar si es una nueva pestaña/visita inicial
if (!sessionStorage.getItem('welcomeShownSession')) {
  setTimeout(() => {
    welcomeModal.classList.add('show');
  }, 100);
}

closeModal.addEventListener('click', () => {
  welcomeModal.classList.remove('show');
  sessionStorage.setItem('welcomeShownSession', 'true');
});

// Control de Búsqueda de Pacientes
let patients = [];
const searchInput = document.getElementById('searchInput');
const suggestionsList = document.getElementById('suggestions');
const searchResult = document.getElementById('searchResult');

searchInput.addEventListener('input', () => {
  searchInput.value = searchInput.value.toUpperCase();
});

onSnapshot(collection(db, "pacientes"), (snapshot) => {
  patients = [];
  snapshot.forEach(doc => patients.push({ id: doc.id, ...doc.data() }));
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toUpperCase().trim();
  suggestionsList.innerHTML = '';
  searchResult.style.display = 'none';

  if (query.length === 0) return;

  const matches = patients.filter(p => p.nombre.toUpperCase().includes(query));

  matches.forEach(patient => {
    const li = document.createElement('li');
    li.textContent = patient.nombre;
    li.onclick = () => {
      searchInput.value = patient.nombre;
      suggestionsList.innerHTML = '';
      searchResult.style.display = 'block';
      searchResult.innerHTML = `
        <h3>Ficha del Paciente</h3><br>
        <strong>Nombre:</strong> ${patient.nombre}<br>
        <strong>N° Expediente:</strong> ${patient.expediente}<br>
        <strong>Edad:</strong> ${patient.edad} AÑOS<br>
        <strong>Género:</strong> ${patient.genero || 'NO ESPECIFICADO'}<br>
        <strong>Observaciones / Diagnóstico:</strong> ${patient.diagnostico || 'SIN OBSERVACIONES'}
      `;
    };
    suggestionsList.appendChild(li);
  });
});

document.addEventListener('click', (e) => {
  if (e.target !== searchInput) suggestionsList.innerHTML = '';
});