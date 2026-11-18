import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';

export type BookletState = { status: 'idle' | 'downloading' | 'done' | 'error'; progress: number };

let state: BookletState = { status: 'idle', progress: 0 };
const listeners = new Set<(s: BookletState) => void>();
const set = (next: BookletState) => {
  state = next;
  listeners.forEach((l) => l(state));
};

export function useBookletState() {
  const [s, setS] = useState(state);
  useEffect(() => {
    listeners.add(setS);
    setS(state);
    return () => {
      listeners.delete(setS);
    };
  }, []);
  return s;
}

export async function openBooklet() {
  if (state.status === 'downloading') return;
  set({ status: 'downloading', progress: 0 });
  try {
    const asset = Asset.fromModule(require('../../assets/booklet/swachh-kal-booklet.pdf'));
    const dest = new File(Paths.document, 'Swachh-Kal-Booklet.pdf');
    if (dest.exists) dest.delete();
    if (asset.uri.startsWith('http')) {
      // Dev server serves the asset over HTTP, so real progress is available.
      const task = File.createDownloadTask(asset.uri, dest, {
        onProgress: ({ bytesWritten, totalBytes }) => {
          // Native values can arrive as BigInt, so coerce before doing math.
          const total = Number(totalBytes);
          if (total > 0) set({ status: 'downloading', progress: Math.min(1, Number(bytesWritten) / total) });
        },
      });
      await task.downloadAsync();
    } else {
      // In a release build the PDF ships inside the app, so this is a local copy.
      await asset.downloadAsync();
      new File(asset.localUri ?? asset.uri).copy(dest);
    }
    set({ status: 'done', progress: 1 });
    setTimeout(() => state.status === 'done' && set({ status: 'idle', progress: 0 }), 3500);
    await Sharing.shareAsync(dest.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: 'Swachh Kal Booklet' });
  } catch {
    set({ status: 'error', progress: 0 });
    setTimeout(() => state.status === 'error' && set({ status: 'idle', progress: 0 }), 3500);
  }
}
