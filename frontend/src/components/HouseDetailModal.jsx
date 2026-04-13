import { Modal, Text, Stack, Badge } from "@mantine/core";

export default function HouseDetailModal({ opened, onClose, data }) {
  if (!data) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="House Detail" centered>
      <Stack>
        <Text>
          <b>ID:</b> {data.id}
        </Text>

        <Text>
          <b>House Number:</b> {data.house_number}
        </Text>

        <Text component="span">
          <b>Status:</b>{" "}
          <Badge color={data.status === "occupied" ? "green" : "gray"}>
            {data.status}
          </Badge>
        </Text>

        <Text>
          <b>Current Resident:</b> {data.current_resident?.full_name || "-"}
        </Text>

        <Text>
          <b>Created At:</b> {data.created_at}
        </Text>
      </Stack>
    </Modal>
  );
}
