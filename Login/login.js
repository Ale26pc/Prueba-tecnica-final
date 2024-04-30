// Obtener los elementos del formulario de inicio de sesión
const loginUsername = document.getElementById('username');
const loginPassword = document.getElementById('password');
const buttonlogin = document.getElementById('button-login');

// Evento de click en el botón de inicio de sesión
buttonlogin.addEventListener('click', (e) => {
    e.preventDefault();
    // Obtener los valores de los campos de inicio de sesión
    const loginUsernameValue = loginUsername.value.trim();
    const loginPasswordValue = loginPassword.value.trim();

    // Obtener los datos de usuario almacenados en localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    // Verificar si se encontraron datos de usuario en el localStorage
    if (storedUserData) {
        // Verificar si los datos de inicio de sesión coinciden con los datos almacenados
        if (loginUsernameValue === storedUserData.username && loginPasswordValue === storedUserData.password) {
            // Inicio de sesión exitoso
            alert("Inicio de sesión exitoso");
            // Redirigir a la página de inicio después de iniciar sesión
            window.location.href = "../Front/Inicio.html";
        } else {
            // Datos de inicio de sesión incorrectos
            alert("Nombre de usuario o contraseña incorrectos");
        }
    } else {
        // No se encontraron datos de usuario en el localStorage
        alert("No hay datos de usuario almacenados");
    }
});