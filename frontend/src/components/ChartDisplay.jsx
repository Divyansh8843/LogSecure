import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartDisplay({ data }) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  return (
    <div className="mt-6 bg-gray-900 p-4 rounded-xl">
      <h4 className="mb-2 font-semibold">IP Access Frequency</h4>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Access Count",
              data: values,
              backgroundColor: "rgba(75,192,192,0.5)",
            },
          ],
        }}
      />
    </div>
  );
}
