module.exports = {
  apps: [
    {
      name: 'caja-om-backend',
      script: 'server.js',
      cwd: '/var/www/FlujoDeCajaOdontomed/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5005,
        CORS_ORIGIN: 'https://caja-om.estudiobeguier.com',
        // Otras variables de entorno necesarias para tu backend
      }
    },
    {
      name: 'caja-om-frontend',
      script: 'serve',
      cwd: '/var/www/FlujoDeCajaOdontomed/dist',
      args: ['-s', 'build', '--', '--port', '3000'],  // Cambié el formato de los argumentos
      env: {
        NODE_ENV: 'production',
        // Otras variables de entorno necesarias para tu frontend
      }
    }
  ]
};
