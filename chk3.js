require("dotenv").config();
const m=require('mongoose');
m.connect(process.env.MONGODB_URI).then(async()=>{
const r=await m.connection.db.collection('reports').findOne({code:'PSP01'});
const g={};r.rows.forEach(x=>{const k=(x.stage||'')+' | '+(x.currency||'-');g[k]=g[k]||{n:0,cost:0,done:0};g[k].n++;g[k].cost+=x.cost||0;g[k].done+=x.done||0;});
Object.keys(g).forEach(k=>console.log(k,g[k].n,Math.round(g[k].cost),Math.round(g[k].done)));
process.exit(0);});
