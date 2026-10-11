"use client";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">

      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
      >
        Previous
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
      >
        Next
      </button>

    </div>
  );
}