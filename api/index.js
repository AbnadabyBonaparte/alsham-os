// Adaptador Vercel para o ALSHAM OS
const app = require('../dist/index.js'); // Aponta para o servidor compilado

module.exports = (req, res) => {
  // Passa a requisição para o app compilado
  if (app && typeof app === 'function') {
    return app(req, res);
  }
  // Fallback se algo der errado
  res.status(500).json({ error: 'Server initialization failed' });
};
