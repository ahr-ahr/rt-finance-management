import { useState } from "react";
import { Modal, Button, NumberInput, Select, Stack, Text } from "@mantine/core";

import { createPayment } from "../api/payment";

export default function PaymentModal({ opened, onClose, onSuccess, bill }) {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  if (!bill) return null;

  const handleSubmit = async () => {
    if (!amount) {
      alert("Amount required");
      return;
    }

    setLoading(true);
    try {
      await createPayment({
        monthly_bill_id: bill.id,
        amount,
        payment_method: method,
      });

      setAmount(0);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Pay Bill" centered>
      <Stack>
        <Text>
          <b>House:</b> {bill.house.house_number}
        </Text>

        <Text>
          <b>Resident:</b> {bill.resident.full_name}
        </Text>

        <Text>
          <b>Remaining:</b> Rp {bill.remaining_amount}
        </Text>

        <NumberInput
          label="Amount"
          value={amount}
          onChange={setAmount}
          min={1}
          max={bill.remaining_amount}
        />

        <Select
          label="Payment Method"
          value={method}
          onChange={setMethod}
          data={[
            { value: "cash", label: "Cash" },
            { value: "transfer", label: "Transfer" },
          ]}
        />

        <Button onClick={handleSubmit} loading={loading}>
          Pay
        </Button>
      </Stack>
    </Modal>
  );
}
