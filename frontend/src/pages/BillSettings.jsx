import { useEffect, useState } from "react";
import {
  Text,
  Table,
  Card,
  Stack,
  NumberInput,
  Button,
  Group,
  Loader,
  Center,
  Badge,
} from "@mantine/core";

import { getBillSettings, createBillSetting } from "../api/billSetting";

export default function BillSettings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    security_fee: 0,
    cleaning_fee: 0,
    effective_date: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBillSettings();
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!form.effective_date) return;

    setSubmitting(true);

    try {
      await createBillSetting(form);
      fetchData();

      setForm({
        security_fee: 0,
        cleaning_fee: 0,
        effective_date: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (val) => new Intl.NumberFormat("id-ID").format(val);

  return (
    <>
      <Text size="xl" fw={600} mb="md">
        Bill Settings
      </Text>

      {/* 🔥 FORM */}
      <Card withBorder mb="lg">
        <Stack>
          <NumberInput
            label="Security Fee"
            value={form.security_fee}
            onChange={(val) => setForm({ ...form, security_fee: val || 0 })}
          />

          <NumberInput
            label="Cleaning Fee"
            value={form.cleaning_fee}
            onChange={(val) => setForm({ ...form, cleaning_fee: val || 0 })}
          />

          <input
            type="date"
            value={form.effective_date}
            onChange={(e) =>
              setForm({
                ...form,
                effective_date: e.target.value,
              })
            }
          />

          <Button
            onClick={handleSubmit}
            loading={submitting}
            disabled={!form.effective_date}
          >
            Save New Setting
          </Button>
        </Stack>
      </Card>

      {/* 🔥 LOADING */}
      {loading ? (
        <Center>
          <Loader />
        </Center>
      ) : data.length === 0 ? (
        <Text c="dimmed">No bill settings yet</Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Security</Table.Th>
              <Table.Th>Cleaning</Table.Th>
              <Table.Th>Effective Date</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {data.map((item, index) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.id}</Table.Td>

                <Table.Td>Rp {formatRupiah(item.security_fee)}</Table.Td>

                <Table.Td>Rp {formatRupiah(item.cleaning_fee)}</Table.Td>

                <Table.Td>{item.effective_date}</Table.Td>

                <Table.Td>
                  {index === 0 ? (
                    <Badge color="green">Active</Badge>
                  ) : (
                    <Badge color="gray" variant="light">
                      Old
                    </Badge>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  );
}
