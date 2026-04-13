import { Modal, Button, Text, Group } from "@mantine/core";

export default function DeleteConfirmModal({
  opened,
  onClose,
  onConfirm,
  loading,
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Delete" centered>
      <Text mb="md">Are you sure you want to delete this data?</Text>

      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>

        <Button color="red" onClick={onConfirm} loading={loading}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
}
