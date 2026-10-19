/* =====================================================
   Consultorio Médico CC - IndexedDB Layer
   ===================================================== */

const DB_NAME = 'ConsultorioMedicoCC';
const DB_VERSION = 1;

const STORES = {
  medicos: 'medicos',
  pacientes: 'pacientes',
  consultas: 'consultas',
  medicamentos: 'medicamentos',
  estudios: 'estudios',
  cobros: 'cobros',
  config: 'config'
};

let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Médicos
      if (!database.objectStoreNames.contains(STORES.medicos)) {
        const store = database.createObjectStore(STORES.medicos, { keyPath: 'id', autoIncrement: true });
        store.createIndex('nombre', 'nombre', { unique: false });
        store.createIndex('activo', 'activo', { unique: false });
      }

      // Pacientes
      if (!database.objectStoreNames.contains(STORES.pacientes)) {
        const store = database.createObjectStore(STORES.pacientes, { keyPath: 'id', autoIncrement: true });
        store.createIndex('nombre', 'nombre', { unique: false });
        store.createIndex('medicoId', 'medicoId', { unique: false });
      }

      // Consultas
      if (!database.objectStoreNames.contains(STORES.consultas)) {
        const store = database.createObjectStore(STORES.consultas, { keyPath: 'id', autoIncrement: true });
        store.createIndex('pacienteId', 'pacienteId', { unique: false });
        store.createIndex('medicoId', 'medicoId', { unique: false });
        store.createIndex('fecha', 'fecha', { unique: false });
      }

      // Medicamentos
      if (!database.objectStoreNames.contains(STORES.medicamentos)) {
        const store = database.createObjectStore(STORES.medicamentos, { keyPath: 'id', autoIncrement: true });
        store.createIndex('nombre', 'nombre', { unique: false });
      }

      // Estudios de laboratorio
      if (!database.objectStoreNames.contains(STORES.estudios)) {
        const store = database.createObjectStore(STORES.estudios, { keyPath: 'id', autoIncrement: true });
        store.createIndex('nombre', 'nombre', { unique: false });
      }

      // Cobros
      if (!database.objectStoreNames.contains(STORES.cobros)) {
        const store = database.createObjectStore(STORES.cobros, { keyPath: 'id', autoIncrement: true });
        store.createIndex('fecha', 'fecha', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('medicoId', 'medicoId', { unique: false });
      }

      // Configuración (NIP, etc.)
      if (!database.objectStoreNames.contains(STORES.config)) {
        database.createObjectStore(STORES.config, { keyPath: 'key' });
      }
    };
  });
}

// Generic CRUD
async function add(storeName, data) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.add(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function put(storeName, data) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function get(storeName, id) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAll(storeName) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function remove(storeName, id) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function clearStore(storeName) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Config helpers
async function getConfig(key) {
  const item = await get(STORES.config, key);
  return item ? item.value : null;
}

async function setConfig(key, value) {
  return put(STORES.config, { key, value });
}

// Seed initial data if empty
async function seedIfEmpty() {
  const meds = await getAll(STORES.medicamentos);
  if (meds.length === 0) {
    const defaultMeds = [
      { nombre: 'Paracetamol', presentacion: 'Tabletas', concentracion: '500 mg' },
      { nombre: 'Ibuprofeno', presentacion: 'Tabletas', concentracion: '400 mg' },
      { nombre: 'Amoxicilina', presentacion: 'Cápsulas', concentracion: '500 mg' },
      { nombre: 'Omeprazol', presentacion: 'Cápsulas', concentracion: '20 mg' },
      { nombre: 'Loratadina', presentacion: 'Tabletas', concentracion: '10 mg' },
      { nombre: 'Metformina', presentacion: 'Tabletas', concentracion: '850 mg' },
      { nombre: 'Losartán', presentacion: 'Tabletas', concentracion: '50 mg' },
      { nombre: 'Salbutamol', presentacion: 'Inhalador', concentracion: '100 mcg' }
    ];
    for (const m of defaultMeds) {
      await add(STORES.medicamentos, m);
    }
  }

  const ests = await getAll(STORES.estudios);
  if (ests.length === 0) {
    const defaultEst = [
      { nombre: 'Biometría hemática completa', precio: 250 },
      { nombre: 'Química sanguínea de 6 elementos', precio: 320 },
      { nombre: 'Examen general de orina', precio: 120 },
      { nombre: 'Perfil lipídico', precio: 280 },
      { nombre: 'Prueba de embarazo (sangre)', precio: 180 },
      { nombre: 'TSH', precio: 350 },
      { nombre: 'Glucosa en ayunas', precio: 90 },
      { nombre: 'Hemoglobina glucosilada (HbA1c)', precio: 380 }
    ];
    for (const e of defaultEst) {
      await add(STORES.estudios, e);
    }
  }

  // Default NIPs (already documented)
  const nipCobros = await getConfig('nip_cobros');
  if (!nipCobros) await setConfig('nip_cobros', '202503');
  const nipBalance = await getConfig('nip_balance');
  if (!nipBalance) await setConfig('nip_balance', '1973');
}

// Export / Import full backup
async function exportBackup() {
  const data = {
    version: 1,
    fecha: new Date().toISOString(),
    medicos: await getAll(STORES.medicos),
    pacientes: await getAll(STORES.pacientes),
    consultas: await getAll(STORES.consultas),
    medicamentos: await getAll(STORES.medicamentos),
    estudios: await getAll(STORES.estudios),
    cobros: await getAll(STORES.cobros),
    config: await getAll(STORES.config)
  };
  return data;
}

async function importBackup(data) {
  if (!data || !data.version) throw new Error('Archivo de respaldo inválido');

  // Clear existing
  for (const store of Object.values(STORES)) {
    await clearStore(store);
  }

  // Import
  const importStore = async (storeName, items) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      await put(storeName, item);
    }
  };

  await importStore(STORES.medicos, data.medicos);
  await importStore(STORES.pacientes, data.pacientes);
  await importStore(STORES.consultas, data.consultas);
  await importStore(STORES.medicamentos, data.medicamentos);
  await importStore(STORES.estudios, data.estudios);
  await importStore(STORES.cobros, data.cobros);
  await importStore(STORES.config, data.config);

  // Ensure NIPs exist
  await seedIfEmpty();
}

// Make available globally
window.DB = {
  openDB,
  add,
  put,
  get,
  getAll,
  remove,
  clearStore,
  getConfig,
  setConfig,
  seedIfEmpty,
  exportBackup,
  importBackup,
  STORES
};
