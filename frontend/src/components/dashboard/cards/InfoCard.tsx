interface InfoCardProps {
  title: string;
  description: string;
}

export default function InfoCard({
  title,
  description,
}: InfoCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-gray-600">
        {description}
      </p>

    </div>
  );
}