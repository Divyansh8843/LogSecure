export default function TableDisplay({ errors }) {
  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2">Error & Warning Logs</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl">
          <thead>
            <tr>
              <th className="p-2 text-left">Timestamp</th>
              <th className="p-2 text-left">Level</th>
              <th className="p-2 text-left">IP</th>
              <th className="p-2 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((err, idx) => (
              <tr key={idx} className="border-t border-gray-700">
                <td className="p-2">
                  {new Date(err.timestamp).toLocaleString()}
                </td>
                <td
                  className={`p-2 ${
                    err.level === "ERROR" ? "text-red-400" : "text-yellow-400"
                  }`}
                >
                  {err.level}
                </td>
                <td className="p-2">{err.ip}</td>
                <td className="p-2">{err.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
