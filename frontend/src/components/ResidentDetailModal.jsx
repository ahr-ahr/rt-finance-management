import { Modal, Text, Stack, Button } from "@mantine/core";

export default function ResidentDetailModal({ opened, onClose, data }) {
  if (!data) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Resident Detail" centered>
      <Stack>
        <Text>
          <b>Name:</b> {data.full_name}
        </Text>
        <Text>
          <b>Phone:</b> {data.phone}
        </Text>
        <Text>
          <b>Status:</b> {data.is_married ? "Married" : "Single"}
        </Text>
        <Text>
          <b>Type:</b> {data.type}
        </Text>

        {data.ktp_photo && (
          <Button
            onClick={() =>
              window.open(
                `http://localhost:8000/api/v1/residents/${data.id}/ktp`,
                "_blank",
              )
            }
          >
            View KTP
          </Button>
        )}
      </Stack>
    </Modal>
  );
}
