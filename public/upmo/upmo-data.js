(function(){
window.upmoScData=function(ty,code){
var q=ty?'type='+ty:'';
var g=fetch('/api/prep/scurve'+(q?'?'+q:'')).then(function(r){return r.json();});
if(!code){return g;}
var o=fetch('/api/prep/scurve?code='+encodeURIComponent(code)+(q?'&'+q:'')).then(function(r){return r.json();});
return Promise.all([g,o]).then(function(a){
var G=a[0],O=a[1]||{};
var idx={};
(O.labels||[]).forEach(function(k,i){idx[k]=i;});
var res={labels:G.labels||[],planPer:[],factPer:[],planCum:[],factCum:[],planAmt:[],factAmt:[]};
res.labels.forEach(function(k,i){
var j=idx[k];var has=(j!==undefined);
var gnull=(G.factAmt&&G.factAmt[i]==null);
res.planPer.push(has?((O.planPer&&O.planPer[j])||0):0);
res.planAmt.push(has?((O.planAmt&&O.planAmt[j])||0):0);
res.factPer.push(gnull?null:(has?((O.factPer&&O.factPer[j])||0):0));
res.factAmt.push(gnull?null:(has?((O.factAmt&&O.factAmt[j])||0):0));
res.planCum.push(0);res.factCum.push(gnull?null:0);
});
return res;
});
};
window.upmoSumData=function(ty,code,o){
if(!code){return fetch('/api/prep/summary'+(ty?'?type='+ty:'')).then(function(r){return r.json();});}
var c=(o&&o.cost)||0;var d=(o&&o.done)||0;
return Promise.resolve({totalCost:c,done:d,remaining:c-d,planPct:(o&&o.planPct)||0});
};
})();
