import { useEffect, useRef, useState } from 'react';
import {
  formatAnimeSubtitle,
  getAnimeDescription,
  getAnimeTitle,
  getStreamingLinks,
  safeExternalUrl,
  type AnimeMedia,
  type WatchlistItem,
} from '../lib/anime';

export type DialogMode =
  | { type: 'closed' }
  | { type: 'details'; anime: AnimeMedia }
  | { type: 'watchlist' };

interface AnimeDialogProps {
  mode: DialogMode;
  watchlist: WatchlistItem[];
  onClose: () => void;
  onToggleWatchlist: (anime: AnimeMedia) => void;
  onRemoveWatchlistId: (id: number) => void;
  onInspectWatchlistItem: (item: WatchlistItem) => void;
}

export function AnimeDialog({
  mode,
  watchlist,
  onClose,
  onToggleWatchlist,
  onRemoveWatchlistId,
  onInspectWatchlistItem,
}: AnimeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [coverFailed, setCoverFailed] = useState(false);

  const selectedAnime = mode.type === 'details' ? mode.anime : null;
  const coverUrl =
    selectedAnime?.coverImage?.extraLarge || selectedAnime?.coverImage?.large || '';

  useEffect(() => {
    setCoverFailed(false);
  }, [selectedAnime?.id, coverUrl]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (mode.type === 'closed') {
      if (dialog.open) dialog.close();
    } else if (!dialog.open) {
      dialog.showModal();
    }
  }, [mode]);

  const isSaved =
    selectedAnime !== null && watchlist.some((item) => item.id === selectedAnime.id);
  const providers = selectedAnime ? getStreamingLinks(selectedAnime) : [];
  const infoUrl = selectedAnime ? safeExternalUrl(selectedAnime.siteUrl) : null;

  return (
    <dialog
      ref={dialogRef}
      className="anime-dialog"
      id="animeDialog"
      aria-labelledby="animeDialogTitle"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="anime-dialog-shell">
        <button
          className="dialog-close"
          id="closeAnimeDialog"
          type="button"
          aria-label="Close anime details"
          onClick={onClose}
        >
          ×
        </button>

        <div id="animeDetail">
          {mode.type === 'details' && selectedAnime && (
            <div className="anime-detail">
              {coverUrl && !coverFailed ? (
                <img
                  className="anime-detail-cover"
                  src={coverUrl}
                  alt={`${getAnimeTitle(selectedAnime)} cover artwork`}
                  referrerPolicy="no-referrer"
                  onError={() => setCoverFailed(true)}
                />
              ) : (
                <div className="anime-detail-cover cover-fallback">
                  Cover unavailable
                </div>
              )}

              <div className="anime-detail-copy">
                <h2 id="animeDialogTitle">{getAnimeTitle(selectedAnime)}</h2>
                <p className="anime-detail-native">
                  {formatAnimeSubtitle(selectedAnime)}
                </p>
                <p className="anime-detail-description">
                  {getAnimeDescription(selectedAnime)}
                </p>
                {(selectedAnime.genres || []).length > 0 && (
                  <p className="provider-note">
                    {(selectedAnime.genres || []).join(' · ')}
                  </p>
                )}

                <h3>Official streaming services</h3>
                <div className="provider-list">
                  {providers.length > 0 ? (
                    providers.map((link) => (
                      <a
                        key={`${link.site}-${link.safeUrl}`}
                        className="btn btn-primary"
                        href={link.safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch on {link.site}
                      </a>
                    ))
                  ) : (
                    <p className="provider-note">
                      No streaming provider is listed for this title yet. Check
                      the anime details for updates.
                    </p>
                  )}
                </div>

                <div className="provider-list">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => onToggleWatchlist(selectedAnime)}
                  >
                    {isSaved ? 'Remove from watchlist' : 'Save to watchlist'}
                  </button>
                  {infoUrl && (
                    <a
                      className="btn btn-secondary"
                      href={infoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Anime details
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {mode.type === 'watchlist' && (
            <div>
              <h2 id="animeDialogTitle">Your Watchlist</h2>
              {watchlist.length === 0 ? (
                <p className="provider-note">
                  Your watchlist is empty. Search anime and save a few titles.
                </p>
              ) : (
                <ul className="saved-list">
                  {watchlist.map((item) => (
                    <li key={item.id}>
                      <span>{item.title}</span>
                      <div className="saved-item-actions">
                        <button
                          className="btn btn-secondary"
                          type="button"
                          aria-label={`View details for ${item.title}`}
                          onClick={() => onInspectWatchlistItem(item)}
                        >
                          Details
                        </button>
                        <button
                          className="btn btn-secondary"
                          type="button"
                          aria-label={`Remove ${item.title} from watchlist`}
                          onClick={() => onRemoveWatchlistId(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
