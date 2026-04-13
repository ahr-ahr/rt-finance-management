import { useState } from "react";
import { Modal, Button, TextInput, Select, Stack } from "@mantine/core";
import { createHouse, updateHouse } from "../api/house";

export default function HouseModal({
  opened,
  onClose,
  onSuccess,
  initialData,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    house_number: initialData?.house_number || "",
    status: initialData?.status || "vacant",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (initialData) {
        await updateHouse(initialData.id, form);
      } else {
        await createHouse(form);
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
      title={initialData ? "Edit House" : "Create House"}
      centered
    >
      <Stack>
        <TextInput
          label="House Number"
          value={form.house_number}
          onChange={(e) => handleChange("house_number", e.target.value)}
        />

        <Select
          label="Status"
          value={form.status}
          onChange={(value) => handleChange("status", value)}
          data={[
            { value: "occupied", label: "Occupied" },
            { value: "vacant", label: "Vacant" },
          ]}
        />

        <Button onClick={handleSubmit} loading={loading}>
          {initialData ? "Update" : "Submit"}
        </Button>
      </Stack>
    </Modal>
  );
}
