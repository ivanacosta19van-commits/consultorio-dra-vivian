import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const patientForm = document.getElementById('patientForm');

document.querySelectorAll('input[type="text"], textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase();
  });
});

patientForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    expediente: document.getElementById('expediente').value.toUpperCase(),
    nombre: document.getElementById('nombre').value.toUpperCase(),
    edad: Number(document.getElementById('edad').value),
    genero: document.getElementById('genero').value,
    diagnostico: document.getElementById('diagnostico').value.toUpperCase() || 'SIN OBSERVACIONES'
  };

  try {
    await addDoc(collection(db, "pacientes"), data);
    alert('✅ PACIENTE GUARDADO EXITOSAMENTE.');
    patientForm.reset();
  } catch (error) {
    alert('❌ ERROR AL GUARDAR EN LA BASE DE DATOS.');
  }
});