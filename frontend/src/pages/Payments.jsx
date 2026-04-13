import { useEffect, useState } from "react";
import {
  Table,
  Text,
  Loader,
  Center,
  Pagination,
  Group,
  Select,
  Card,
  Stack,
} from "@mantine/core";

import { getPayments } from "../api/payment";

export default function Payments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const [method, setMethod] = useState("");
  const [date, setDate] = useState("");

  const [sortBy, setSortBy] = useState("paid_at");
  const [sortDir, setSortDir] = useState("desc");

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page,
      };

      if (method) params.payment_method = method;
      if (date) params.date = date;

      params.sort_by = sortBy;
      params.sort_dir = sortDir;

      const res = await getPayments(params);

      setData(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, method, date]);

  return (
    <>
      <Text size="xl" fw={600} mb="md">
        Payments
      </Text>

      <Card withBorder mb="md">
        <Stack>
          <Text fw={500}>Filter</Text>

          <Group grow>
            <Select
              placeholder="Payment Method"
              value={method}
              onChange={setMethod}
              data={[
                { value: "", label: "All" },
                { value: "cash", label: "Cash" },
                { value: "transfer", label: "Transfer" },
              ]}
            />

            <Select
              placeholder="Sort By"
              value={sortBy}
              onChange={setSortBy}
              data={[
                { value: "paid_at", label: "Date" },
                { value: "amount", label: "Amount" },
              ]}
            />

            <Select
              placeholder="Direction"
              value={sortDir}
              onChange={setSortDir}
              data={[
                { value: "desc", label: "Newest" },
                { value: "asc", label: "Oldest" },
              ]}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Group>
        </Stack>
      </Card>

      {loading ? (
        <Center h={200}>
          <Loader />
        </Center>
      ) : data.length === 0 ? (
        <Center h={200}>
          <Text c="dimmed">No payments found</Text>
        </Center>
      ) : (
        <>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Bill</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Method</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Remaining</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {data.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>{p.id}</Table.Td>

                  <Table.Td>
                    {p.monthly_bill
                      ? `${p.monthly_bill.month}/${p.monthly_bill.year}`
                      : "-"}
                  </Table.Td>

                  <Table.Td>Rp {formatRupiah(p.amount)}</Table.Td>

                  <Table.Td>{p.payment_method}</Table.Td>

                  <Table.Td>{p.paid_at}</Table.Td>

                  <Table.Td>
                    {p.remaining_amount !== null
                      ? `Rp ${formatRupiah(p.remaining_amount)}`
                      : "-"}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Pagination
            mt="md"
            total={meta.last_page || 1}
            value={meta.current_page || 1}
            onChange={setPage}
          />
        </>
      )}
    </>
  );
}
