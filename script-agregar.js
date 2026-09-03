import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

  const expedienteIngresado = document.getElementById('expediente').value.toUpperCase().trim();

  try {
    // 1. Consulta si existe un paciente registrado con el mismo número de expediente
    const q = query(collection(db, "pacientes"), where("expediente", "==", expedienteIngresado));
    const querySnapshot = await getDocs(q);

    // 2. Si se encuentra una coincidencia, interrumpe el guardado y muestra la alerta
    if (!querySnapshot.empty) {
      const pacienteExistente = querySnapshot.docs[0].data();
      alert(`⚠️ EL EXPEDIENTE "${expedienteIngresado}" YA ESTÁ REGISTRADO A NOMBRE DE: ${pacienteExistente.nombre}`);
      return;
    }

    // 3. Si no existe duplicado, procede a guardar
    const data = {
      expediente: expedienteIngresado,
      nombre: document.getElementById('nombre').value.toUpperCase().trim(),
      edad: Number(document.getElementById('edad').value),
      genero: document.getElementById('genero').value,
      diagnostico: document.getElementById('diagnostico').value.toUpperCase().trim() || 'SIN OBSERVACIONES'
    };

    await addDoc(collection(db, "pacientes"), data);
    alert('✅ PACIENTE GUARDADO EXITOSAMENTE.');
    patientForm.reset();

  } catch (error) {
    console.error(error);
    alert('❌ ERROR AL CONECTAR O GUARDAR EN LA BASE DE DATOS.');
  }
});
