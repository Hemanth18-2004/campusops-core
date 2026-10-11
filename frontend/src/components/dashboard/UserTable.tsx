const users = [
  {
    id: 1,
    name: "Admin",
    email: "admin@campus.com",
    role: "Admin",
  },
  {
    id: 2,
    name: "Faculty",
    email: "faculty@campus.com",
    role: "Faculty",
  },
];

export default function UserTable() {
  return (
    <div className="rounded-xl bg-white shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-5">
        User Management
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left p-3">Name</th>

            <th className="text-left p-3">Email</th>

            <th className="text-left p-3">Role</th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user.id} className="border-b">

              <td className="p-3">{user.name}</td>

              <td className="p-3">{user.email}</td>

              <td className="p-3">{user.role}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}