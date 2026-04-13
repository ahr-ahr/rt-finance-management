import { useEffect, useState } from "react";
import {
  Table,
  Text,
  Loader,
  Center,
  Pagination,
  Button,
  Group,
  Select,
  Badge,
  NumberInput,
  Card,
  Stack,
} from "@mantine/core";

import { getMonthlyBills, generateMonthlyBills } from "../api/monthlyBill";
import MonthlyBillDetailModal from "../components/MonthlyBillDetailModal";
import PaymentModal from "../components/PaymentModal";

export default function MonthlyBills() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [status, setStatus] = useState("");

  const [genMonth, setGenMonth] = useState("");
  const [genYear, setGenYear] = useState(new Date().getFullYear());
  const [generateLoading, setGenerateLoading] = useState(false);

  const [detailOpened, setDetailOpened] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [payOpened, setPayOpened] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMonthlyBills({
        page,
        month: filterMonth,
        year: filterYear,
        status,
      });

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
  }, [page, filterMonth, filterYear, status]);

  const handleGenerate = async () => {
    if (!genMonth || !genYear) {
      alert("Month & Year required");
      return;
    }

    setGenerateLoading(true);
    try {
      await generateMonthlyBills({
        month: genMonth,
        year: genYear,
      });

      setGenMonth("");
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerateLoading(false);
    }
  };

  return (
    <>
      <Text size="xl" fw={600} mb="md">
        Monthly Bills
      </Text>

      <Card withBorder mb="md">
        <Stack>
          <Text fw={500}>Generate Bills</Text>

          <Group grow>
            <NumberInput
              label="Month"
              placeholder="1 - 12"
              value={genMonth}
              onChange={setGenMonth}
              min={1}
              max={12}
            />

            <NumberInput label="Year" value={genYear} onChange={setGenYear} />

            <Button mt="xl" onClick={handleGenerate} loading={generateLoading}>
              Generate
            </Button>
          </Group>
        </Stack>
      </Card>

      <Card withBorder mb="md">
        <Stack>
          <Text fw={500}>Filter</Text>

          <Group grow>
            <NumberInput
              placeholder="Month"
              value={filterMonth}
              onChange={setFilterMonth}
              min={1}
              max={12}
            />

            <NumberInput
              placeholder="Year"
              value={filterYear}
              onChange={setFilterYear}
            />

            <Select
              placeholder="Status"
              value={status}
              onChange={setStatus}
              data={[
                { value: "", label: "All" },
                { value: "paid", label: "Paid" },
                { value: "unpaid", label: "Unpaid" },
              ]}
            />

            <Button
              variant="light"
              onClick={() => {
                setFilterMonth("");
                setFilterYear("");
                setStatus("");
              }}
            >
              Reset
            </Button>
          </Group>
        </Stack>
      </Card>

      {loading ? (
        <Center h={200}>
          <Loader />
        </Center>
      ) : data.length === 0 ? (
        <Center h={200}>
          <Text c="dimmed">No data found</Text>
        </Center>
      ) : (
        <>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>House</Table.Th>
                <Table.Th>Resident</Table.Th>
                <Table.Th>Period</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Paid</Table.Th>
                <Table.Th>Remaining</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {data.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.house.house_number}</Table.Td>

                  <Table.Td>{item.resident.full_name}</Table.Td>

                  <Table.Td>
                    {item.month}/{item.year}
                  </Table.Td>

                  <Table.Td>Rp {formatRupiah(item.total)}</Table.Td>

                  <Table.Td>Rp {formatRupiah(item.paid_amount)}</Table.Td>

                  <Table.Td>Rp {formatRupiah(item.remaining_amount)}</Table.Td>

                  <Table.Td>
                    <Badge
                      color={item.status === "paid" ? "green" : "red"}
                      variant="light"
                    >
                      {item.status}
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => {
                        setDetailData(item);
                        setDetailOpened(true);
                      }}
                    >
                      Detail
                    </Button>

                    <Button
                      size="xs"
                      color="green"
                      disabled={item.status === "paid"}
                      onClick={() => {
                        setSelectedBill(item);
                        setPayOpened(true);
                      }}
                    >
                      Pay
                    </Button>
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
          <MonthlyBillDetailModal
            opened={detailOpened}
            onClose={() => setDetailOpened(false)}
            data={detailData}
          />
          <PaymentModal
            opened={payOpened}
            onClose={() => setPayOpened(false)}
            onSuccess={fetchData}
            bill={selectedBill}
          />
        </>
      )}
    </>
  );
}
