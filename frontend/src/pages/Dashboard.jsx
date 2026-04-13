import { useEffect, useState } from "react";
import {
  Card,
  Text,
  Group,
  Center,
  Select,
  Stack,
  Skeleton,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";

import { getSummaryReport } from "../api/report";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));

  const years = Array.from({ length: 5 }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getSummaryReport({ year });
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID").format(num || 0);

  const chartData = data.map((item) => ({
    ...item,
    month_name: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][item.month - 1],
  }));

  const totalIncome = data.reduce((a, b) => a + b.income, 0);
  const totalExpense = data.reduce((a, b) => a + b.expense, 0);
  const totalBalance = data.reduce((a, b) => a + b.balance, 0);

  const bestMonth = data.reduce(
    (prev, curr) => (curr.balance > prev.balance ? curr : prev),
    data[0] || {},
  );

  const worstMonth = data.reduce(
    (prev, curr) => (curr.balance < prev.balance ? curr : prev),
    data[0] || {},
  );

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={600}>
          Dashboard
        </Text>

        <Select value={year} onChange={setYear} data={years} />
      </Group>

      <Group grow mb="md">
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Total Income
          </Text>
          <Text fw={700}>Rp {formatRupiah(totalIncome)}</Text>
        </Card>

        <Card withBorder>
          <Text size="sm" c="dimmed">
            Total Expense
          </Text>
          <Text fw={700}>Rp {formatRupiah(totalExpense)}</Text>
        </Card>

        <Card withBorder>
          <Text size="sm" c="dimmed">
            Balance
          </Text>
          <Text fw={700} c={totalBalance < 0 ? "red" : "green"}>
            Rp {formatRupiah(totalBalance)}
          </Text>
        </Card>
      </Group>

      <Group grow mb="md">
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Best Month
          </Text>
          <Text fw={700}>
            {bestMonth?.month
              ? `${bestMonth.month} (Rp ${formatRupiah(bestMonth.balance)})`
              : "-"}
          </Text>
        </Card>

        <Card withBorder>
          <Text size="sm" c="dimmed">
            Worst Month
          </Text>
          <Text fw={700} c="red">
            {worstMonth?.month
              ? `${worstMonth.month} (Rp ${formatRupiah(worstMonth.balance)})`
              : "-"}
          </Text>
        </Card>
      </Group>

      <Card withBorder>
        {loading ? (
          <Stack>
            <Skeleton height={300} />
          </Stack>
        ) : chartData.length === 0 ? (
          <Center h={300}>
            <Text c="dimmed">No data available</Text>
          </Center>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={chartData}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                const month = e?.activePayload?.[0]?.payload?.month;
                if (month) {
                  navigate(`/reports?month=${month}&year=${year}`);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month_name" />

              <YAxis
                tickFormatter={(val) =>
                  val >= 1000000
                    ? `${val / 1000000}jt`
                    : val >= 1000
                      ? `${val / 1000}k`
                      : val
                }
              />

              <ReferenceLine y={0} stroke="#aaa" strokeDasharray="3 3" />

              <Tooltip
                formatter={(value, name) => [`Rp ${formatRupiah(value)}`, name]}
                labelFormatter={(label) => `${label} (click for detail)`}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#22c55e"
              />

              <Line
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#ef4444"
              />

              <Line
                type="monotone"
                dataKey="balance"
                name="Balance"
                stroke="#3b82f6"
                dot={(props) => {
                  const { cx, cy, payload } = props;

                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={payload.balance < 0 ? 7 : 5}
                      fill={payload.balance < 0 ? "red" : "#3b82f6"}
                      stroke="white"
                      style={{ cursor: "pointer", transition: "0.2s" }}
                      onClick={() =>
                        navigate(`/reports?month=${payload.month}&year=${year}`)
                      }
                      onMouseEnter={(e) => {
                        e.target.setAttribute("r", payload.balance < 0 ? 9 : 7);
                      }}
                      onMouseLeave={(e) => {
                        e.target.setAttribute("r", payload.balance < 0 ? 7 : 5);
                      }}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </>
  );
}
