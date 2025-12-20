const { createApp } = require("./app");
const { env } = require("./config/env");

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`✅ API running at http://localhost:${env.PORT}`);
  console.log(`   - GET   /products`);
  console.log(`   - GET   /products/:id?k=3`);
  console.log(`   - POST  /auth/register`);
  console.log(`   - POST  /auth/login`);
  console.log(`   - POST  /user/onboarding (Bearer token)`);
  console.log(`   - GET   /api/health`);
});
