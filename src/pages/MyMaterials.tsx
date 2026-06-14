import React, { useState, useEffect } from 'react';
import type { InventoryItem } from '../types';
import { getInventory, addInventoryItem, removeInventoryItem } from '../utils/storage';

interface Props {
  onNavigate: (page: string) => void;
}

export const MyMaterials: React.FC<Props> = ({ onNavigate }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'tool' | 'consumable'>('consumable');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState<'' | 'tool' | 'consumable'>('');

  useEffect(() => {
    setItems([...getInventory()]);
  }, []);

  const handleAdd = () => {
    if (!name.trim()) return;
    const item: InventoryItem = {
      id: 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      category,
      note: note.trim(),
    };
    addInventoryItem(item);
    setItems([...getInventory()]);
    setName('');
    setNote('');
  };

  const handleRemove = (id: string) => {
    removeInventoryItem(id);
    setItems([...getInventory()]);
  };

  const filtered = filter ? items.filter((i) => i.category === filter) : items;
  const tools = items.filter((i) => i.category === 'tool');
  const consumables = items.filter((i) => i.category === 'consumable');

  return (
    <div className="my-materials-page">
      <div className="back-link" onClick={() => onNavigate('home')}>← 返回首页</div>
      <h2>我的材料库</h2>
      <p style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>
        登记你已有的工具和耗材，浏览教程时会自动比对材料清单，缺什么一目了然。
      </p>

      <div className="inventory-add-card">
        <h3>添加材料</h3>
        <div className="inventory-form">
          <div className="form-group">
            <label>名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：高筋面粉、8mm钩针"
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            />
          </div>
          <div className="form-group">
            <label>类型</label>
            <div className="category-toggle">
              <button
                className={`toggle-btn ${category === 'consumable' ? 'active' : ''}`}
                onClick={() => setCategory('consumable')}
              >
                🧴 耗材
              </button>
              <button
                className={`toggle-btn ${category === 'tool' ? 'active' : ''}`}
                onClick={() => setCategory('tool')}
              >
                🔧 工具
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>备注（可选）</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="如：开封的、还剩半包"
            />
          </div>
          <button className="btn-add-inventory" onClick={handleAdd} disabled={!name.trim()}>
            添加
          </button>
        </div>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <span className="stat-num">{items.length}</span>
          <span className="stat-label">全部</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{tools.length}</span>
          <span className="stat-label">工具</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{consumables.length}</span>
          <span className="stat-label">耗材</span>
        </div>
      </div>

      <div className="inventory-filter">
        <button className={`filter-chip ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>全部</button>
        <button className={`filter-chip ${filter === 'tool' ? 'active' : ''}`} onClick={() => setFilter('tool')}>🔧 工具</button>
        <button className={`filter-chip ${filter === 'consumable' ? 'active' : ''}`} onClick={() => setFilter('consumable')}>🧴 耗材</button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📦</div>
          <p>{items.length === 0 ? '还没有登记任何材料，快添加吧' : '该分类下暂无材料'}</p>
        </div>
      ) : (
        <div className="inventory-list">
          {filtered.map((item) => (
            <div key={item.id} className="inventory-item">
              <span className="inventory-icon">{item.category === 'tool' ? '🔧' : '🧴'}</span>
              <div className="inventory-info">
                <span className="inventory-name">{item.name}</span>
                {item.note && <span className="inventory-note">{item.note}</span>}
              </div>
              <button className="btn-remove-inventory" onClick={() => handleRemove(item.id)}>删除</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
