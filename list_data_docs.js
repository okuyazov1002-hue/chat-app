const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const costDocs = await db.collection("data").find({ _id: { $regex: "^prep_cost_curve_" } }).toArray();
  const mobDocs = await db.collection("data").find({ _id: { $regex: "^prep_mobilization_" } }).toArray();
  console.log("=== prep_cost_curve_* ===");
  costDocs.forEach(d => console.log(d._id, "| code:", d.code, "| months:", (d.value && d.value.labels) ? d.value.labels.length : 0, "| updatedAt:", d.updatedAt));
  console.log("=== prep_mobilization_* ===");
  mobDocs.forEach(d => console.log(d._id, "| code:", d.code, "| months:", (d.value && d.value.labels) ? d.value.labels.length : 0, "| updatedAt:", d.updatedAt));
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
