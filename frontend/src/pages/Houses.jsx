import { useEffect, useState } from "react";
import {
  Table,
  Text,
  Loader,
  Center,
  Pagination,
  Button,
  Group,
  TextInput,
  Select,
} from "@mantine/core";
import { getHouses, deleteHouse, vacateHouse } from "../api/house";
import HouseModal from "../components/HouseModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import HouseDetailModal from "../components/HouseDetailModal";
import AssignResidentModal from "../components/AssignResidentModal";

export default function Houses() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("desc");

  const [opened, setOpened] = useState(false);
  const [editData, setEditData] = useState(null);

  const [detailOpened, setDetailOpened] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [assignOpened, setAssignOpened] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);

  const [vacateId, setVacateId] = useState(null);
  const [vacateLoading, setVacateLoading] = useState(false);

  const fetchHouses = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await getHouses({
        page: pageNumber,
        search,
        status,
        sort_by: sortBy,
        sort_dir: sortDir,
      });

      setHouses(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses(page);
  }, [page, status, sortBy, sortDir]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchHouses(1);
      setPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);

    try {
      await deleteHouse(deleteId);
      fetchHouses(page);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleVacateConfirm = async () => {
    setVacateLoading(true);

    try {
      await vacateHouse(vacateId);
      fetchHouses(page);
      setVacateId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setVacateLoading(false);
    }
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={600}>
          Houses
        </Text>

        <Button
          onClick={() => {
            setEditData(null);
            setOpened(true);
          }}
        >
          + Add House
        </Button>
      </Group>

      <Group mb="md">
        <TextInput
          placeholder="Search house number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          placeholder="Status"
          value={status}
          onChange={setStatus}
          data={[
            { value: "", label: "All" },
            { value: "occupied", label: "Occupied" },
            { value: "vacant", label: "Vacant" },
          ]}
        />

        <Select
          placeholder="Sort By"
          value={sortBy}
          onChange={setSortBy}
          data={[
            { value: "created_at", label: "Created At" },
            { value: "house_number", label: "House Number" },
          ]}
        />

        <Select
          placeholder="Sort Direction"
          value={sortDir}
          onChange={setSortDir}
          data={[
            { value: "asc", label: "ASC" },
            { value: "desc", label: "DESC" },
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
                <Table.Th>House Number</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {houses.map((h) => (
                <Table.Tr key={h.id}>
                  <Table.Td>{h.id}</Table.Td>
                  <Table.Td>{h.house_number}</Table.Td>
                  <Table.Td>{h.status}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="light"
                        color="blue"
                        onClick={() => {
                          setSelectedHouse(h);
                          setAssignOpened(true);
                        }}
                      >
                        Assign
                      </Button>

                      {h.current_resident && (
                        <Button
                          size="xs"
                          color="orange"
                          variant="light"
                          onClick={() => setVacateId(h.id)}
                        >
                          Vacate
                        </Button>
                      )}

                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => {
                          setDetailData(h);
                          setDetailOpened(true);
                        }}
                      >
                        Detail
                      </Button>

                      <Button
                        size="xs"
                        onClick={() => {
                          setEditData(h);
                          setOpened(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="xs"
                        color="red"
                        onClick={() => setDeleteId(h.id)}
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

          <HouseModal
            key={editData?.id || "create"}
            opened={opened}
            onClose={() => setOpened(false)}
            onSuccess={() => fetchHouses(page)}
            initialData={editData}
          />

          <HouseDetailModal
            opened={detailOpened}
            onClose={() => setDetailOpened(false)}
            data={detailData}
          />

          <DeleteConfirmModal
            opened={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={handleDeleteConfirm}
            loading={deleteLoading}
          />

          <AssignResidentModal
            opened={assignOpened}
            onClose={() => setAssignOpened(false)}
            onSuccess={() => fetchHouses(page)}
            house={selectedHouse}
          />

          <DeleteConfirmModal
            opened={!!vacateId}
            onClose={() => setVacateId(null)}
            onConfirm={handleVacateConfirm}
            loading={vacateLoading}
          />
        </>
      )}
    </>
  );
}
