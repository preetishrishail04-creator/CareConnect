import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  =======================================================
  🚀 CareConnect Backend REST API Server is running!
  -------------------------------------------------------
  🔊 URL:         http://localhost:${PORT}
  🏥 Health:      http://localhost:${PORT}/api/health
  🛡️ Medical:     Care Coordination & Remote Family Platform
  =======================================================
  `);
});
