import re

with open('src/public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_line = "  }).join('');\n}\n/* ===== LETTERS ===== */"

new_block = """  }).join('');
}

function renderStageBars(id){
  const sp = stageProgress(id);
  let html = '';
  STAGES.forEach(s => {
    if(sp[s].total > 0){
      const pct = Math.round(sp[s].done / sp[s].total * 100);
      html += '<div style="display:flex;align-items:center;gap:4px;margin-top:3px"><span style="font-size:9px;color:#7aa89a;width:90px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + s + '</span><div style="flex:1;height:4px;background:#e0f0ec;border-radius:2px;overflow:hidden"><div style="height:100%;border-radius:2px;width:' + pct + '%;background:#0d8a7a"></div></div><span style="font-size:9px;color:#7aa89a;width:28px;text-align:right">' + pct + '%</span></div>';
    }
  });
  return html;
}
/* ===== LETTERS ===== */"""

if old_line in content:
    content = content.replace(old_line, new_block)
    with open('src/public/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("УСПЕХ: функция renderStageBars добавлена")
else:
    print("ОШИБКА: не найден маркер для вставки")
