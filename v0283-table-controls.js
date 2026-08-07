'use strict';

/* Reliable table selection/movement and complete text-frame alignment. */
(()=>{
  const byId=id=>document.getElementById(id);
  const style=document.createElement('style');
  style.textContent='.table-move-handle{position:absolute;left:6px;top:6px;width:30px;height:30px;border:2px solid #fff;border-radius:7px;background:#2374e1;color:#fff;display:grid;place-items:center;font:700 20px/1 Arial,sans-serif;box-shadow:0 2px 7px #0007;cursor:move;z-index:60;user-select:none}.designer-item[data-type=table].selected .table-move-handle{background:#f72585}.table-move-handle:hover{transform:scale(1.08)}';
  document.head.appendChild(style);

  const vertical=item=>item.verticalAlign||'middle';
  const baseRender=render;
  render=function(){
    const result=baseRender.apply(this,arguments);
    stage.querySelectorAll('.designer-item').forEach(el=>{
      const item=currentItems().find(value=>value.id===el.dataset.id);
      if(!item)return;
      if(item.type!=='table'){
        el.style.alignItems=vertical(item)==='top'?'flex-start':vertical(item)==='bottom'?'flex-end':'center';
        el.style.textAlign=item.align||'left';
        return;
      }
      el.querySelectorAll('.fs-table-cell').forEach(cellEl=>{
        const cell=tableCell(item,Number(cellEl.dataset.row),Number(cellEl.dataset.col));
        cellEl.style.setProperty('font-size',(item.tableFontSize||16)+'px','important');
        if(cell.bg)cellEl.style.setProperty('background-color',cell.bg,'important');
      });
      const handle=document.createElement('span');
      handle.className='table-move-handle';
      handle.textContent='✥';
      handle.title='Komplette Tabelle markieren und verschieben';
      handle.setAttribute('aria-label','Komplette Tabelle verschieben');
      el.appendChild(handle);
    });
    return result;
  };

  const baseProps=renderProps;
  renderProps=function(){
    baseProps.apply(this,arguments);
    const item=currentItems().find(value=>value.id===selected);
    if(item&&byId('pVerticalAlign'))byId('pVerticalAlign').value=vertical(item);
  };
  byId('pVerticalAlign')?.addEventListener('change',event=>{const item=currentItems().find(value=>value.id===selected);if(item){item.verticalAlign=event.target.value;render();}});

  const wholeTable={pFont:'tableFontSize',pColor:'color',pBg:'tableBg',pAlign:'tableTextAlign',pVerticalAlign:'tableVerticalAlign'};
  Object.entries(wholeTable).forEach(([id,key])=>byId(id)?.addEventListener('input',event=>{
    const item=currentItems().find(value=>value.id===selected);
    if(item?.type==='table'){item[key]=id==='pFont'?Number(event.target.value):event.target.value;render();}
  }));
  byId('tableCellBg')?.addEventListener('change',event=>{const item=selectedTable();if(item){tableCell(item,activeTableCell.row,activeTableCell.col).bg=event.target.value;render();}});
  byId('tableFontSize')?.addEventListener('change',event=>{const item=selectedTable();if(item){item.tableFontSize=Number(event.target.value);render();}});
  render();
})();
