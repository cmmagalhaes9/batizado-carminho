import { useState, type FormEvent } from 'react';
import { Button } from '@shared/components/Button';
import { useToast } from '@shared/components/useToast';
import styles from './GuestNameCard.module.css';

interface GuestNameCardProps {
  readonly name: string | null;
  readonly onSave: (name: string) => void;
  readonly onClear: () => void;
}

export function GuestNameCard({ name, onSave, onClear }: GuestNameCardProps) {
  if (name) {
    return <Greeted name={name} onClear={onClear} />;
  }
  return <NameForm onSave={onSave} />;
}

function Greeted({ name, onClear }: { name: string; onClear: () => void }) {
  return (
    <div className={styles.greeted}>
      <div className={styles.greetedMsg}>
        hi, <strong>{name}</strong> ✿
      </div>
      <button type="button" className={styles.change} onClick={onClear}>
        not me
      </button>
    </div>
  );
}

function NameForm({ onSave }: { onSave: (name: string) => void }) {
  const [value, setValue] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) {
      showToast('add your name first ✿');
      return;
    }
    onSave(value.trim());
    showToast(`hi ${value.trim()} ♡`);
  };

  return (
    <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
      <h2 className="heading">
        who are you? <span className="accent">✿</span>
      </h2>
      <p className="lead" style={{ fontSize: 14, marginBottom: 14 }}>
        so the family knows whose photos are whose
      </p>
      <div className={styles.row}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="your name"
          maxLength={30}
          autoFocus
          aria-label="Your name"
        />
        <Button type="submit" variant="pink" className={styles.saveBtn}>
          save
        </Button>
      </div>
    </form>
  );
}
