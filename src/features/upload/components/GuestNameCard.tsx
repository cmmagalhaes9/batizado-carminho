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

function Greeted({ name }: { name: string; onClear: () => void }) {
  return (
    <div className={styles.greeted}>
      <div className={styles.greetedMsg}>
        Olá, <strong>{name}</strong> ✿
      </div>
    </div>
  );
}

function NameForm({ onSave }: { onSave: (name: string) => void }) {
  const [value, setValue] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) {
      showToast('adiciona o teu nome primeiro ✿');
      return;
    }
    onSave(value.trim());
    showToast(`olá ${value.trim()} ♡`);
  };

  return (
    <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
      <h2 className="heading">
        qual o teu nome?
      </h2>
      <p className="lead" style={{ fontSize: 14, marginBottom: 14 }}>
        para a família saber de quem é cada foto
      </p>
      <div className={styles.row}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="o teu nome"
          maxLength={30}
          autoFocus
          aria-label="O teu nome"
        />
        <Button type="submit" variant="pink" className={styles.saveBtn}>
          guardar
        </Button>
      </div>
    </form>
  );
}
