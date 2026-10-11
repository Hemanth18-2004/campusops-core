interface StatCardProps {
  title: string;
  value: number | string;
  color?: string;
}

export default function StatCard({
  title,
  value,
  color = "text-blue-600",
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className={`mt-4 text-4xl font-bold ${color}`}>
        {value}
      </h2>

    </div>
  );
}