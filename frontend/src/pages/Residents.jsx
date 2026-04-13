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
import { getResidents, deleteResident } from "../api/resident";
import ResidentModal from "../components/ResidentModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ResidentDetailModal from "../components/ResidentDetailModal";

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const [opened, setOpened] = useState(false);
  const [editData, setEditData] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [detailOpened, setDetailOpened] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [isMarried, setIsMarried] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("desc");

  const fetchResidents = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await getResidents({
        page: pageNumber,
        search,
        type,
        is_married: isMarried,
        sort_by: sortBy,
        sort_dir: sortDir,
      });

      setResidents(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents(page);
  }, [page, type, isMarried, sortBy, sortDir]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchResidents(1);
      setPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);

    try {
      await deleteResident(deleteId);
      fetchResidents(page);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={600}>
          Residents
        </Text>

        <Button
          onClick={() => {
            setEditData(null);
            setOpened(true);
          }}
        >
          + Add Resident
        </Button>
      </Group>

      <Group mb="md">
        <TextInput
          placeholder="Search name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          placeholder="Type"
          value={type}
          onChange={setType}
          data={[
            { value: "", label: "All" },
            { value: "tetap", label: "Tetap" },
            { value: "kontrak", label: "Kontrak" },
          ]}
        />

        <Select
          placeholder="Marital Status"
          value={isMarried}
          onChange={setIsMarried}
          data={[
            { value: "", label: "All" },
            { value: "1", label: "Married" },
            { value: "0", label: "Single" },
          ]}
        />

        <Select
          placeholder="Sort By"
          value={sortBy}
          onChange={setSortBy}
          data={[
            { value: "created_at", label: "Created At" },
            { value: "full_name", label: "Name" },
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
                <Table.Th>Name</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {residents.map((r) => (
                <Table.Tr key={r.id}>
                  <Table.Td>{r.id}</Table.Td>
                  <Table.Td>{r.full_name}</Table.Td>
                  <Table.Td>{r.phone}</Table.Td>
                  <Table.Td>{r.is_married ? "Married" : "Single"}</Table.Td>
                  <Table.Td>{r.type}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => {
                          setDetailData(r);
                          setDetailOpened(true);
                        }}
                      >
                        Detail
                      </Button>

                      <Button
                        size="xs"
                        onClick={() => {
                          setEditData(r);
                          setOpened(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="xs"
                        color="red"
                        onClick={() => setDeleteId(r.id)}
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
        </>
      )}

      <ResidentModal
        key={editData?.id || "create"}
        opened={opened}
        onClose={() => setOpened(false)}
        onSuccess={() => fetchResidents(page)}
        initialData={editData}
      />

      <DeleteConfirmModal
        opened={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />

      <ResidentDetailModal
        opened={detailOpened}
        onClose={() => setDetailOpened(false)}
        data={detailData}
      />
    </>
  );
}
