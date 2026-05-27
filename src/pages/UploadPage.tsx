import { useEffect, useMemo, useRef, useState } from 'react';
import { AppHeader } from '@shared/components/AppHeader';
import { Button } from '@shared/components/Button';
import { EventBanner } from '@features/upload/components/EventBanner';
import { GuestNameCard } from '@features/upload/components/GuestNameCard';
import { DropZone } from '@features/upload/components/DropZone';
import { UploadQueueList } from '@features/upload/components/UploadQueueList';
import { SuccessBadge } from '@features/upload/components/SuccessBadge';
import { useGuestName } from '@features/upload/hooks/useGuestName';
import { useUploadQueue } from '@features/upload/hooks/useUploadQueue';
import { useToast } from '@shared/components/useToast';
import { isConfigured } from '@config/env';
import { GLOBAL_EVENT_ID, GLOBAL_EVENT_NAME } from '@features/events/services/globalEvent';
import styles from './UploadPage.module.css';

export function UploadPage() {
  if (!isConfigured()) {
    return (
      <ErrorScreen
        icon="⚙️"
        title="ainda não está pronto"
        message="a app precisa ser configurada. veja o README para detalhes."
      />
    );
  }

  return <UploadFlow eventId={GLOBAL_EVENT_ID} eventName={GLOBAL_EVENT_NAME} />;
}

interface SelectedFile {
  readonly file: File;
  readonly previewUrl: string | null;
}

function UploadFlow({ eventId, eventName }: { eventId: string; eventName: string }) {
  const { name, setName, clearName } = useGuestName();
  const { showToast } = useToast();

  // useUploadQueue requires a guestName — use empty string when missing, and gate the UI instead.
  const { items, successCount, enqueue } = useUploadQueue({
    eventId,
    guestName: name ?? '',
  });

  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];
    };
  }, []);

  const handleFiles = useMemo(
    () => (files: readonly File[]) => {
      if (!name) {
        showToast('adicione o teu nome primeiro ✿');
        return;
      }

      const nextFiles = files.map((file) => {
        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
        if (previewUrl) previewUrlsRef.current.push(previewUrl);
        return { file, previewUrl };
      });

      setSelectedFiles((prev) => [...prev, ...nextFiles]);
    },
    [name, showToast],
  );

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      showToast('seleciona pelo menos uma foto primeiro ✿');
      return;
    }
    enqueue(selectedFiles.map((item) => item.file));
    setSelectedFiles([]);
  };

  return (
    <div className="wrap">
      <AppHeader logoAsLink={false} />

      <main>
        <EventBanner eventName={eventName} />

        <GuestNameCard name={name} onSave={setName} onClear={clearName} />

        <section className="card">
          <h2 className="heading">
            partilha uma lembrança <span className="accent">♡</span>
          </h2>
          <p className="lead" style={{ fontSize: 14, marginBottom: 18 }}>
            as tuas fotos e vídeos vão direto para o álbum do batizado
          </p>

          <DropZone onFiles={handleFiles} disabled={!name} />

          {selectedFiles.length > 0 && (
            <div className={styles.previewPanel}>
              <div className={styles.previewHeader}>
                <div>{selectedFiles.length} ficheiro{selectedFiles.length === 1 ? '' : 's'} selecionado{selectedFiles.length === 1 ? '' : 's'}</div>
                <Button type="button" variant="pink" onClick={handleSubmit}>
                  enviar selecionados
                </Button>
              </div>
              <div className={styles.previewList}>
                {selectedFiles.map((item, index) => (
                  <div key={`${item.file.name}-${index}`} className={styles.previewItem}>
                    {item.previewUrl ? (
                      <img src={item.previewUrl} alt={item.file.name} />
                    ) : (
                      <div className={styles.previewFallback}>✿</div>
                    )}
                    <div className={styles.previewName}>{item.file.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <UploadQueueList items={items} />

          <p className={styles.help}>dica: podes selecionar várias de uma vez ✿</p>
        </section>

        <SuccessBadge count={successCount} />
      </main>

      <footer className="app-footer">obrigada por partilhares ♡</footer>
    </div>
  );
}

function ErrorScreen({ icon, title, message }: { icon: string; title: string; message: string }) {
  return (
    <div className="wrap">
      <AppHeader logoAsLink={false} />
      <main>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>{icon}</div>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
      </main>
    </div>
  );
}
