export default {
  apps: [{
    name: "caja-om-backend",
    script: "server.js",
    env: {
      NODE_ENV: "production",
      PORT: "5008", // Corregido a 5005
      MONGO_URI: "mongodb+srv://aabeguier:FlujoCajaOdontomed1235813@cluster0.xx1m0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      FRONTEND_URL: "https://caja-om.estudiobeguier.com"
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}