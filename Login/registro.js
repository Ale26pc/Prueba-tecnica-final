const username = document.getElementById('username');
const password = document.getElementById('password');
const button = document.getElementById('button');

button.addEventListener('click', (e) => {
    e.preventDefault();

    // Obtener los valores de los campos de usuario y contraseña
    const usernameValue = username.value.trim(); // Trim elimina espacios en blanco al inicio y al final
    const passwordValue = password.value.trim();

    // Verificar si los campos están vacíos
    if (usernameValue === '' || passwordValue === '') {
        // Mostrar un mensaje de error si algún campo está vacío
        alert("Por favor completa todos los campos");
        return; // Detener la ejecución si algún campo está vacío
    }
    const userData = {
        username: usernameValue,
        password: passwordValue
    };
    
    // Almacenar datos en localStorage
localStorage.setItem('userData', JSON.stringify(userData));

// Recuperar datos de localStorage
const storedUserData = localStorage.getItem('userData');

    // Mostrar un mensaje de confirmación
    alert("Registrado con éxito");

    // Redireccionar a la página de login después de que se cierre el alert
    setTimeout(() => {
        window.location.href = "./login.html";
    }, 0); // Redirige después de que se cierre el alert
});
