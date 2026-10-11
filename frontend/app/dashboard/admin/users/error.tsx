"use client";

export default function Error({
  error,
}: {
  error: Error;
}) {
  return (
    <div className="p-10 text-red-600">
      <h2 className="text-2xl font-bold mb-4">
        Something went wrong
      </h2>

      <p>{error.message}</p>
    </div>
  );
}