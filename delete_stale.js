const mongoose = require("mongoose");
require("dotenv").config();
const codesToDelete = [
  "CCW01-SC","CSM01-AP","CSM01-PR","CSM01-SA","HER01-EN","HER01-IT","HER01-PR","HER01-RD","HER01-SP",
  "MSC01-BR","MSC01-PR","OEE01-HW","OEE01-KA","OEE01-KB","OEE01-KC","OEE01-KD","OPS01-AR","OPS01-CP",
  "OPS01-RR","OPS01-TC","OPS01-TW","OXS01-AB","OXS01-AR","OXS01-GP","OXS01-WP","OXS01-WS","PSP01-CG",
  "PSP01-EF","PSP01-GD","PSP01-MS","PSP01-RF","PSP01-RM","PSP01-RS","PSP01-WP","PSP01-WT","WAC01-PS"
];
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const r1 = await db.collection("reports").deleteMany({ code: { $in: codesToDelete } });
  const r2 = await db.collection("data").deleteMany({ _id: { $in: codesToDelete.map(c => "prep_cost_curve_" + c) } });
  const r3 = await db.collection("data").deleteMany({ _id: { $in: codesToDelete.map(c => "prep_mobilization_" + c) } });
  console.log("reports удалено:", r1.deletedCount);
  console.log("prep_cost_curve удалено:", r2.deletedCount);
  console.log("prep_mobilization удалено:", r3.deletedCount);
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
