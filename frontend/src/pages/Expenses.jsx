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
} from "@mantine/core";

import { getExpenses, deleteExpense } from "../api/expense";

import ExpenseModal from "../components/ExpenseModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const [type, setType] = useState("");

  const [opened, setOpened] = useState(false);
  const [editData, setEditData] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const [date, setDate] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("desc");

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await getExpenses({
        page,
        type,
        date,
        sort_by: sortBy,
        sort_dir: sortDir,
      });

      setExpenses(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, type, date, sortBy, sortDir]);

  const handleDelete = async () => {
    try {
      await deleteExpense(deleteId);
      fetchExpenses();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={600}>
          Expenses
        </Text>

        <Button
          onClick={() => {
            setEditData(null);
            setOpened(true);
          }}
        >
          + Add Expense
        </Button>
      </Group>

      <Group mb="md">
        <Select
          placeholder="Filter type"
          value={type}
          onChange={setType}
          data={[
            { value: "", label: "All" },
            { value: "monthly", label: "Monthly" },
            { value: "incident", label: "Incident" },
          ]}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Select
          placeholder="Sort by"
          value={sortBy}
          onChange={setSortBy}
          data={[
            { value: "created_at", label: "Created At" },
            { value: "amount", label: "Amount" },
            { value: "date", label: "Date" },
          ]}
        />

        <Select
          placeholder="Sort direction"
          value={sortDir}
          onChange={setSortDir}
          data={[
            { value: "desc", label: "DESC" },
            { value: "asc", label: "ASC" },
          ]}
        />
      </Group>

      {loading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {expenses.map((e) => (
                <Table.Tr key={e.id}>
                  <Table.Td>{e.id}</Table.Td>
                  <Table.Td>{e.title}</Table.Td>
                  <Table.Td>Rp {e.amount}</Table.Td>
                  <Table.Td>{e.type}</Table.Td>
                  <Table.Td>{e.date}</Table.Td>

                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        onClick={() => {
                          setEditData(e);
                          setOpened(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="xs"
                        color="red"
                        onClick={() => setDeleteId(e.id)}
                      >
                        Delete
                      </Button>
                    </Group>
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

      <ExpenseModal
        opened={opened}
        onClose={() => setOpened(false)}
        onSuccess={fetchExpenses}
        initialData={editData}
      />

      <DeleteConfirmModal
        opened={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
