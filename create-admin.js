const bcrypt = require("bcryptjs");
require("dotenv").config();
const sequelize = require("./config/database");
const User = require("./models/User");

async function run() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  const name = process.argv[4] || "Fuzion Admin";

  if (!email || !password) {
    console.log('Usage: node create-admin.js "admin@example.com" "StrongPassword123" "Admin Name"');
    process.exit(1);
  }
  if (password.length < 6) {
    console.error("Password must be at least 6 characters.");
    process.exit(1);
  }

  await sequelize.sync();
  const hashed = await bcrypt.hash(password, 10);
  const [user, created] = await User.findOrCreate({
    where: { email: email.toLowerCase() },
    defaults: { name, email: email.toLowerCase(), password: hashed, role: "admin", status: "active" }
  });

  if (!created) await user.update({ name, password: hashed, role: "admin", status: "active" });
  console.log(`Admin account ready: ${email.toLowerCase()}`);
  await sequelize.close();
}

run().catch(err => { console.error(err); process.exit(1); });
