import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  Text,
  Group,
  Table,
  Loader,
  Center,
  Stack,
  Badge,
  Select,
  Button,
} from "@mantine/core";

import { getMonthlyReport } from "../api/report";

export default function ReportDetail() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const navigate = useNavigate();

  const month = params.get("month");
  const year = params.get("year");

  const [selectedMonth, setSelectedMonth] = useState(month || "");
  const [selectedYear, setSelectedYear] = useState(year || "");

  const income = data?.income || [];
  const expenses = data?.expense || [];

  const fetchData = async () => {
    if (!selectedMonth || !selectedYear) return;

    setLoading(true);
    try {
      const res = await getMonthlyReport({
        month: selectedMonth,
        year: selectedYear,
      });
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (month && year) {
      setSelectedMonth(month);
      setSelectedYear(year);
      fetchData();
    }
  }, [month, year]);

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID").format(num || 0);

  const months = [
    { value: "1", label: "Jan" },
    { value: "2", label: "Feb" },
    { value: "3", label: "Mar" },
    { value: "4", label: "Apr" },
    { value: "5", label: "May" },
    { value: "6", label: "Jun" },
    { value: "7", label: "Jul" },
    { value: "8", label: "Aug" },
    { value: "9", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  });

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={600}>
          Report Detail
        </Text>
      </Group>

      <Card withBorder mb="md">
        <Group>
          <Select
            placeholder="Select Month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            data={months}
          />

          <Select
            placeholder="Select Year"
            value={selectedYear}
            onChange={setSelectedYear}
            data={years}
          />

          <Button
            onClick={() => {
              if (!selectedMonth || !selectedYear) return;

              navigate(`/reports?month=${selectedMonth}&year=${selectedYear}`);
            }}
          >
            Load Report
          </Button>
        </Group>
      </Card>

      {loading ? (
        <Center h={300}>
          <Loader />
        </Center>
      ) : !selectedMonth || !selectedYear ? (
        <Center h={300}>
          <Text c="dimmed">Select month & year first</Text>
        </Center>
      ) : !data ? (
        <Center h={300}>
          <Text c="dimmed">No data</Text>
        </Center>
      ) : (
        <>
          <Group grow mb="md">
            <Card withBorder>
              <Text size="sm" c="dimmed">
                Income
              </Text>
              <Text fw={700}>Rp {formatRupiah(data.total_income)}</Text>
            </Card>

            <Card withBorder>
              <Text size="sm" c="dimmed">
                Expense
              </Text>
              <Text fw={700}>Rp {formatRupiah(data.total_expense)}</Text>
            </Card>

            <Card withBorder>
              <Text size="sm" c="dimmed">
                Balance
              </Text>
              <Text fw={700} c={data.balance < 0 ? "red" : "green"}>
                Rp {formatRupiah(data.balance)}
              </Text>
            </Card>
          </Group>

          <Card withBorder mb="md">
            <Text fw={600} mb="sm">
              Payments
            </Text>

            {income.length === 0 ? (
              <Text c="dimmed">No payments</Text>
            ) : (
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Method</Table.Th>
                    <Table.Th>Date</Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {income.map((p) => (
                    <Table.Tr key={p.id}>
                      <Table.Td>{p.id}</Table.Td>
                      <Table.Td>Rp {formatRupiah(p.amount)}</Table.Td>
                      <Table.Td>{p.payment_method}</Table.Td>
                      <Table.Td>{p.paid_at}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>

          <Card withBorder>
            <Text fw={600} mb="sm">
              Expenses
            </Text>

            {expenses.length === 0 ? (
              <Text c="dimmed">No expenses</Text>
            ) : (
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Date</Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {expenses.map((e) => (
                    <Table.Tr key={e.id}>
                      <Table.Td>{e.id}</Table.Td>
                      <Table.Td>{e.title}</Table.Td>
                      <Table.Td>Rp {formatRupiah(e.amount)}</Table.Td>
                      <Table.Td>
                        <Badge color={e.type === "monthly" ? "blue" : "orange"}>
                          {e.type}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{e.date}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        </>
      )}
    </>
  );
}
