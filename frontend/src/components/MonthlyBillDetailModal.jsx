import { Modal, Text, Stack, Badge, Divider } from "@mantine/core";

export default function MonthlyBillDetailModal({ opened, onClose, data }) {
  if (!data) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Bill Detail" centered>
      <Stack>
        <Text>
          <b>House:</b> {data.house.house_number}
        </Text>

        <Text>
          <b>Resident:</b> {data.resident.full_name}
        </Text>

        <Text>
          <b>Period:</b> {data.month}/{data.year}
        </Text>

        <Text>
          <b>Total:</b> Rp {data.total}
        </Text>

        <Text>
          <b>Paid:</b> Rp {data.paid_amount}
        </Text>

        <Text>
          <b>Remaining:</b> Rp {data.remaining_amount}
        </Text>

        <Text>
          <b>Status:</b>{" "}
          <Badge color={data.status === "paid" ? "green" : "red"}>
            {data.status}
          </Badge>
        </Text>

        <Divider label="Payments" />

        {data.payments.length === 0 ? (
          <Text c="dimmed">No payments yet</Text>
        ) : (
          data.payments.map((p) => (
            <Stack key={p.id} gap={4}>
              <Text size="sm">
                Rp {p.amount} ({p.payment_method})
              </Text>
              <Text size="xs" c="dimmed">
                {p.paid_at}
              </Text>
            </Stack>
          ))
        )}
      </Stack>
    </Modal>
  );
}
