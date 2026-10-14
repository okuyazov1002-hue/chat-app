require("dotenv").config();
require("dotenv").config();
const m=require('mongoose');
m.connect(process.env.MONGODB_URI).then(async()=>{
const db=m.connection.db;
const r=await db.collection('reports').find({code:{$regex:'^PSP01'}}).toArray();
console.log('reports:',r.map(x=>x.code+' keys='+Object.keys(x).join(',')+' rows='+(x.rows?x.rows.length:0)));
const d=await db.collection('data').find({_id:{$regex:'PSP01|psp01'}}).project({_id:1}).toArray();
console.log('data:',d.map(x=>x._id));
const ids=await db.collection('data').find({}).project({_id:1}).toArray();
console.log('all data ids:',ids.map(x=>x._id).join(' | ').slice(0,1500));
process.exit(0);});
