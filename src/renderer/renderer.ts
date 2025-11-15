const form = document.getElementById('login-form') as HTMLFormElement;
const statusDiv = document.getElementById('status') as HTMLDivElement;

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Save form values.
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    statusDiv.innerText = 'Iniciando sesión...';

    try {
        const result = await window.guaraniAPI.checkNotas(email, password);
        statusDiv.innerText = result ? '¡Se actualizaron las notas!' : 'Sin cambios';
    } catch (err) {
        statusDiv.innerText = 'Error al conectarse con Guaraní';
        console.error(err);
    }
});
