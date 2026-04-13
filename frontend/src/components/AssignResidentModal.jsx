import { useEffect, useState } from "react";
import { Modal, Button, Select, Stack, Text } from "@mantine/core";
import { getResidents } from "../api/resident";
import { assignResident } from "../api/house";

export default function AssignResidentModal({
  opened,
  onClose,
  onSuccess,
  house,
}) {
  const [loading, setLoading] = useState(false);
  const [residents, setResidents] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (opened) {
      fetchResidents();
    }
  }, [opened]);

  const fetchResidents = async () => {
    try {
      const res = await getResidents({ per_page: 100 });
      setResidents(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!selected) return;

    setLoading(true);

    try {
      await assignResident(house.id, {
        resident_id: selected,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Assign Resident" centered>
      <Stack>
        <Text>
          <b>House:</b> {house?.house_number}
        </Text>

        <Text>
          <b>Current Resident:</b> {house?.current_resident?.full_name || "-"}
        </Text>

        <Select
          label="Select Resident"
          placeholder="Choose resident"
          value={selected}
          onChange={setSelected}
          data={residents.map((r) => ({
            value: String(r.id),
            label: r.full_name,
          }))}
        />

        <Button onClick={handleSubmit} loading={loading}>
          Assign
        </Button>
      </Stack>
    </Modal>
  );
}
