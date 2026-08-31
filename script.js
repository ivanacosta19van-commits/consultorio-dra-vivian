import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
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

let patients = [];

const tableBody = document.getElementById('patientTableBody');
const tableFilter = document.getElementById('tableFilter');
const editCard = document.getElementById('editCard');
const editForm = document.getElementById('editForm');
const editId = document.getElementById('editId');
const editExpediente = document.getElementById('editExpediente');
const editNombre = document.getElementById('editNombre');
const editEdad = document.getElementById('editEdad');
const editGenero = document.getElementById('editGenero');
const editDiagnostico = document.getElementById('editDiagnostico');
const btnCancel = document.getElementById('btnCancel');

document.querySelectorAll('input[type="text"], textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase();
  });
});

onSnapshot(collection(db, "pacientes"), (snapshot) => {
  patients = [];
  snapshot.forEach(d => patients.push({ id: d.id, ...d.data() }));
  renderTable(patients);
});

function renderTable(dataList) {
  tableBody.innerHTML = '';
  dataList.forEach(patient => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${patient.expediente}</strong></td>
      <td>${patient.nombre}</td>
      <td>${patient.edad} AÑOS</td>
      <td>${patient.genero || 'N/E'}</td>
      <td>${patient.diagnostico || 'SIN OBSERVACIONES'}</td>
      <td>
        <button class="btn btn-secondary edit-btn" data-id="${patient.id}">Editar</button>
        <button class="btn btn-danger delete-btn" data-id="${patient.id}">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => editPatient(btn.getAttribute('data-id')));
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deletePatient(btn.getAttribute('data-id')));
  });
}

tableFilter.addEventListener('input', () => {
  const query = tableFilter.value.toUpperCase().trim();
  const filtered = patients.filter(p => 
    p.nombre.toUpperCase().includes(query) || 
    p.expediente.toUpperCase().includes(query)
  );
  renderTable(filtered);
});

function editPatient(id) {
  const patient = patients.find(p => p.id === id);
  if (patient) {
    editId.value = patient.id;
    editExpediente.value = patient.expediente;
    editNombre.value = patient.nombre;
    editEdad.value = patient.edad;
    editGenero.value = patient.genero || '';
    editDiagnostico.value = patient.diagnostico === 'SIN OBSERVACIONES' ? '' : patient.diagnostico;
    
    editCard.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = editId.value;

  const data = {
    expediente: editExpediente.value.toUpperCase(),
    nombre: editNombre.value.toUpperCase(),
    edad: Number(editEdad.value),
    genero: editGenero.value,
    diagnostico: editDiagnostico.value.toUpperCase() || 'SIN OBSERVACIONES'
  };

  try {
    await updateDoc(doc(db, "pacientes", id), data);
    alert('✅ PACIENTE ACTUALIZADO.');
    editCard.style.display = 'none';
  } catch (error) {
    alert('❌ ERROR AL ACTUALIZAR.');
  }
});

async function deletePatient(id) {
  if (confirm('¿DESEAS ELIMINAR ESTE REGISTRO DE PACIENTE?')) {
    await deleteDoc(doc(db, "pacientes", id));
  }
}

btnCancel.addEventListener('click', () => {
  editCard.style.display = 'none';
});