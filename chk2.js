require("dotenv").config();
const m=require('mongoose');
m.connect(process.env.MONGODB_URI).then(async()=>{
const db=m.connection.db;
const r=await db.collection('reports').findOne({code:'PSP01'});
console.log(JSON.stringify(r.rows.slice(0,3)).slice(0,1500));
const c=await db.collection('reports').findOne({code:'PSP01-CH'});
console.log(c.totalCost,c.totalDone,JSON.stringify(c.rows.slice(0,2)).slice(0,800));
process.exit(0);});
