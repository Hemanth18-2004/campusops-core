interface Props {
  title: string;
  value: number | string;
}

export default function StatCard({ title, value }: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="text-gray-500">{title}</h3>

      <h1 className="mt-3 text-3xl font-bold text-blue-600">
        {value}
      </h1>
    </div>
  );
}