const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

const getNotesBtn = document.getElementById('get-notes') as HTMLButtonElement;
const watchNotesBtn = document.getElementById('watch-notes') as HTMLButtonElement;

const statusDiv = document.getElementById('status') as HTMLDivElement;

let watching = false;

// Helper para manejar spinner y deshabilitar botones
function toggleButtonsLoading(isLoading: boolean, button: HTMLButtonElement) {
    getNotesBtn.disabled = isLoading;
    watchNotesBtn.disabled = isLoading;
    const spinner = button.querySelector('.spinner-border') as HTMLElement;
    if (isLoading) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
}

// Validación básica
function validateInputs(): boolean {
    if (!emailInput.value.trim()) {
        statusDiv.innerText = 'El email o usuario es obligatorio';
        return false;
    }
    if (!passwordInput.value.trim()) {
        statusDiv.innerText = 'La contraseña es obligatoria';
        return false;
    }
    statusDiv.innerText = '';
    return true;
}

const testBtn = document.getElementById('test-btn') as HTMLButtonElement;
const testOutput = document.getElementById('test-output') as HTMLDivElement;

testBtn.addEventListener('click', () => {
    // Llamada al preload
    testOutput.innerText = (window as any).guaraniAPI.testClick();
});


// Obtener notas
getNotesBtn.addEventListener('click', async () => {
    if (!validateInputs()) return;

    toggleButtonsLoading(true, getNotesBtn);
    statusDiv.innerText = 'Obteniendo notas...';

    try {
        const success = await window.guaraniAPI.getSubjects(emailInput.value, passwordInput.value);
        statusDiv.innerText = success ? '¡Se actualizaron las notas!' : 'Sin cambios';
    } catch (err) {
        statusDiv.innerText = 'Error al conectarse con Guaraní';
        console.error(err);
    } finally {
        toggleButtonsLoading(false, getNotesBtn);
    }
});

// Observar por minuto con node-cron
watchNotesBtn.addEventListener('click', async () => {
    if (!validateInputs()) return;

    toggleButtonsLoading(true, watchNotesBtn);

    try {
        const { running } = await window.guaraniAPI.toggleWatch(emailInput.value, passwordInput.value);
        watching = running;
        watchNotesBtn.innerText = watching ? 'Detener observación' : 'Observar por minuto';
        statusDiv.innerText = watching ? 'Observando cambios cada minuto...' : 'Observación detenida';
    } catch (err) {
        statusDiv.innerText = 'Error al iniciar observación';
        console.error(err);
    } finally {
        toggleButtonsLoading(false, watchNotesBtn);
    }
});

// Escuchar actualizaciones de notas desde main process
window.guaraniAPI.onWatchUpdate((updated) => {
    statusDiv.innerText = updated ? '¡Se actualizaron las notas!' : 'Sin cambios';
});

window.guaraniAPI.onWatchError((error) => {
    statusDiv.innerText = `Error al observar: ${error}`;
});
