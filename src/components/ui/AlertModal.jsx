import { useState } from 'react';
import s from './AlertModal.module.css';

const ASSETS = ['BTC', 'ETH', 'SOL', 'BNB', 'Gold', 'Oil', 'NVDA', 'AAPL', 'SPY', 'Custom'];

const AlertModal = ({ onClose, onSave, prefillAsset }) => {
  const [form, setForm] = useState({
    asset: prefillAsset || 'BTC',
    condition: 'below',
    price: '',
    type: 'price',
    note: '',
  });

  const handleSave = () => {
    if (!form.price) return;
    onSave({
      id: Date.now(),
      ...form,
      price: parseFloat(form.price),
      createdAt: new Date().toLocaleString(),
      triggered: false,
      active: true,
    });
    onClose();
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <div className={s.header}>
          <div className={s.title}>Set price alert</div>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={s.body}>
          <div className={s.row}>
            <div className={s.field}>
              <label>Asset</label>
              <select value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })}>
                {ASSETS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className={s.field}>
              <label>Condition</label>
              <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                <option value="above">Price goes above</option>
                <option value="below">Price goes below</option>
                <option value="change_up">% change up</option>
                <option value="change_down">% change down</option>
              </select>
            </div>
          </div>

          <div className={s.field}>
            <label>{form.condition.includes('change') ? 'Percentage (%)' : 'Target price (USD)'}</label>
            <input
              type="number"
              placeholder={form.condition.includes('change') ? 'e.g. 5' : 'e.g. 80000'}
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <div className={s.field}>
            <label>Note (optional)</label>
            <input
              placeholder="e.g. Support level, take profit..."
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <div className={s.preview}>
            <span className={s.previewDot}></span>
            Alert when <strong>{form.asset}</strong> goes {form.condition.includes('above') ? 'above' : form.condition.includes('below') ? 'below' : form.condition === 'change_up' ? 'up' : 'down'} <strong>{form.price ? (form.condition.includes('change') ? `${form.price}%` : `$${parseFloat(form.price).toLocaleString()}`) : '—'}</strong>
          </div>
        </div>

        <div className={s.footer}>
          <button className={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={s.saveBtn} onClick={handleSave} disabled={!form.price}>Save alert</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
