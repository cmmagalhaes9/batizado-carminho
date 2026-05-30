import { useCallback, useRef, useState } from 'react';
import { AppHeader } from '@shared/components/AppHeader';
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

function UploadFlow({ eventId, eventName }: { eventId: string; eventName: string }) {
  const { name, setName, clearName } = useGuestName();
  const { showToast } = useToast();

  const { items, successCount, enqueue } = useUploadQueue({
    eventId,
    guestName: name ?? '',
  });

  const [pendingFiles, setPendingFiles] = useState<readonly File[]>([]);
  const [pendingUrls, setPendingUrls] = useState<readonly string[]>([]);
  const pendingUrlsRef = useRef<readonly string[]>([]);

  const handleFiles = useCallback(
    (files: readonly File[]) => {
      if (!name) {
        showToast('adicione o teu nome primeiro ✿');
        return;
      }
      pendingUrlsRef.current.forEach((u) => u && URL.revokeObjectURL(u));
      const urls = files.map((f) => (f.type.startsWith('image/') ? URL.createObjectURL(f) : ''));
      pendingUrlsRef.current = urls;
      setPendingFiles(files);
      setPendingUrls(urls);
    },
    [name, showToast],
  );

  const handleConfirm = useCallback(() => {
    enqueue(pendingFiles);
    showToast(`a enviar ${pendingFiles.length} ficheiro${pendingFiles.length === 1 ? '' : 's'}…`);
    pendingUrlsRef.current.forEach((u) => u && URL.revokeObjectURL(u));
    pendingUrlsRef.current = [];
    setPendingFiles([]);
    setPendingUrls([]);
  }, [pendingFiles, enqueue, showToast]);

  const handleCancel = useCallback(() => {
    pendingUrlsRef.current.forEach((u) => u && URL.revokeObjectURL(u));
    pendingUrlsRef.current = [];
    setPendingFiles([]);
    setPendingUrls([]);
  }, []);

  const hasPending = pendingFiles.length > 0;

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

          {hasPending && (
            <div className={styles.previewPanel}>
              <div className={styles.previewHeader}>
                <span>{pendingFiles.length} ficheiro{pendingFiles.length === 1 ? '' : 's'} selecionado{pendingFiles.length === 1 ? '' : 's'}</span>
                <button type="button" onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 13 }}>
                  cancelar
                </button>
              </div>
              <div className={styles.previewList}>
                {pendingFiles.map((file, i) => (
                  <div key={i} className={styles.previewItem}>
                    {pendingUrls[i] ? (
                      <img src={pendingUrls[i]} alt={file.name} />
                    ) : (
                      <div className={styles.previewFallback}>▶</div>
                    )}
                    <div className={styles.previewName}>{file.name}</div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleConfirm}
                style={{ marginTop: 16, width: '100%', padding: '14px 20px', background: 'var(--ink)', color: 'var(--cream)', border: 'none', borderRadius: 18, fontFamily: "'Nunito', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
              >
                enviar ♡
              </button>
            </div>
          )}

          <UploadQueueList items={items} />

          {!hasPending && <p className={styles.help}>dica: podes selecionar várias de uma vez ✿</p>}
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
