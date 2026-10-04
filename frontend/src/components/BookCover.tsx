import { useEffect, useMemo, useState } from 'react';
import type { Book } from '../types';
import { bookCoverCandidates } from '../utils/bookCover';

type BookCoverProps = {
  book: Pick<Book, 'title' | 'coverImageUrl' | 'isbn'>;
  className?: string;
  imageClassName?: string;
  placeholderClassName?: string;
};

export function BookCover({
  book,
  className = 'flex aspect-[2/3] items-center justify-center p-2',
  imageClassName = 'max-h-full max-w-full object-contain shadow-sm',
  placeholderClassName = 'text-4xl text-brand-600',
}: BookCoverProps) {
  const candidates = useMemo(() => bookCoverCandidates(book), [book.coverImageUrl, book.isbn]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setFailed(false);
  }, [candidates]);

  const src = candidates[candidateIndex];

  if (!src || failed) {
    return (
      <div className={className}>
        <span className={placeholderClassName} aria-hidden>
          📚
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        key={src}
        src={src}
        alt={`Cover of ${book.title}`}
        className={imageClassName}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => {
          if (candidateIndex < candidates.length - 1) {
            setCandidateIndex((index) => index + 1);
          } else {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}
