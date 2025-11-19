import { handleResponse as handleResponseStatus } from "../utils/functions";
import { ResponseStatus } from "../utils/types";

const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

emailInput.addEventListener('input', disableBtnState);
passwordInput.addEventListener('input', disableBtnState);

const saveSubjectsBtn = document.getElementById('save-subjects') as HTMLButtonElement;
const checkChangesBtn = document.getElementById('check-changes') as HTMLButtonElement;

const statusDiv = document.getElementById('status') as HTMLDivElement;

let watching = false;

function disableBtnState() {

    const hasEmail = emailInput.value.trim().length > 0;
    const hasPassword = passwordInput.value.trim().length > 0;

    // if email or password is empty, disable buttons
    const shouldDisable = !hasEmail || !hasPassword;

    saveSubjectsBtn.disabled = shouldDisable;
    checkChangesBtn.disabled = shouldDisable;
}

// display spinner
function toggleButtonsLoading(isLoading: boolean, button: HTMLButtonElement) {

    const spinner = button.querySelector('.spinner-border') as HTMLElement;
    if (isLoading) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
}

// Form validation
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
    // Preload
    testOutput.innerText = (window as any).guaraniAPI.testClick();
});


// Save subjects
saveSubjectsBtn.addEventListener('click', async () => {
    if (!validateInputs()) return;

    toggleButtonsLoading(true, saveSubjectsBtn);
    statusDiv.innerText = 'Obteniendo notas...';

    try {
        const response = await window.guaraniAPI.getSubjects(emailInput.value, passwordInput.value);
        statusDiv.innerText = response === ResponseStatus.SUCCESS
            ? 'Se guardaron las notas correctamente'
            : 'Algo salió mal: \n' + handleResponseStatus(response); //! I believe this is unnecesary.
    } catch (err) {
        statusDiv.innerText = 'Error al conectarse con Guaraní';
        console.error(err);
    } finally {
        toggleButtonsLoading(false, saveSubjectsBtn);
    }
});

// Observar por minuto con node-cron
checkChangesBtn.addEventListener('click', async () => {
    if (!validateInputs()) return;

    toggleButtonsLoading(true, checkChangesBtn);

    try {
        //TODO: handle response
        const [changes, responseStatus] = await window.guaraniAPI.checkForChanges(emailInput.value, passwordInput.value);

        checkChangesBtn.innerText = watching ? 'Detener observación' : 'Observar por minuto';
        statusDiv.innerText = watching ? 'Observando cambios cada minuto...' : 'Observación detenida';
    } catch (err) {
        statusDiv.innerText = 'Error al iniciar observación';
        console.error(err);
    } finally {
        toggleButtonsLoading(false, checkChangesBtn);
    }
});

// Escuchar actualizaciones de notas desde main process
window.guaraniAPI.onCronJobUpdate((updated) => {
    statusDiv.innerText = updated ? '¡Se actualizaron las notas!' : 'Sin cambios';
});

window.guaraniAPI.onCronJobError((error) => {
    statusDiv.innerText = `Error al observar: ${error}`;
});
