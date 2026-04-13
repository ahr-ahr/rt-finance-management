import { useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  Select,
  Checkbox,
  FileInput,
  Stack,
} from "@mantine/core";
import { createResident, updateResident } from "../api/resident";

export default function ResidentModal({
  opened,
  onClose,
  onSuccess,
  initialData,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: initialData?.full_name || "",
    phone: initialData?.phone || "",
    is_married: initialData?.is_married || false,
    type: initialData?.type || "tetap",
    ktp_photo: null,
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("full_name", form.full_name);
      formData.append("phone", form.phone);
      formData.append("is_married", form.is_married ? 1 : 0);
      formData.append("type", form.type);

      if (form.ktp_photo) {
        formData.append("ktp_photo", form.ktp_photo);
      }

      if (initialData) {
        await updateResident(initialData.id, formData);
      } else {
        await createResident(formData);
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
      title={initialData ? "Edit Resident" : "Create Resident"}
      centered
    >
      <Stack>
        <TextInput
          label="Full Name"
          value={form.full_name}
          onChange={(e) => handleChange("full_name", e.target.value)}
        />

        <TextInput
          label="Phone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <Checkbox
          label="Married"
          checked={form.is_married}
          onChange={(e) => handleChange("is_married", e.target.checked)}
        />

        <Select
          label="Type"
          value={form.type}
          onChange={(value) => handleChange("type", value)}
          data={[
            { value: "tetap", label: "Tetap" },
            { value: "kontrak", label: "Kontrak" },
          ]}
        />

        <FileInput
          label="KTP Photo"
          onChange={(file) => handleChange("ktp_photo", file)}
        />

        <Button onClick={handleSubmit} loading={loading}>
          {initialData ? "Update" : "Submit"}
        </Button>
      </Stack>
    </Modal>
  );
}
