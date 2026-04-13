import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  TextInput,
  NumberInput,
  Select,
  Stack,
} from "@mantine/core";

import { createExpense, updateExpense } from "../api/expense";

export default function ExpenseModal({
  opened,
  onClose,
  onSuccess,
  initialData,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    amount: 0,
    type: "monthly",
    date: "",
  });

  // 🔥 INI KUNCINYA
  useEffect(() => {
    if (opened) {
      setForm({
        title: initialData?.title || "",
        amount: initialData?.amount || 0,
        type: initialData?.type || "monthly",
        date: initialData?.date || "",
      });
    }
  }, [opened, initialData]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (initialData) {
        await updateExpense(initialData.id, form);
      } else {
        await createExpense(form);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={initialData ? "Edit Expense" : "Create Expense"}
      centered
    >
      <Stack>
        <TextInput
          label="Title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <NumberInput
          label="Amount"
          value={form.amount}
          onChange={(val) => handleChange("amount", val)}
        />

        <Select
          label="Type"
          value={form.type}
          onChange={(val) => handleChange("type", val)}
          data={[
            { value: "monthly", label: "Monthly" },
            { value: "incident", label: "Incident" },
          ]}
        />

        <TextInput
          label="Date (YYYY-MM-DD)"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />

        <Button onClick={handleSubmit} loading={loading}>
          {initialData ? "Update" : "Submit"}
        </Button>
      </Stack>
    </Modal>
  );
}
