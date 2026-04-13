import { AppShell, Burger, Group, Text, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHome,
  IconUsers,
  IconBuilding,
  IconReceipt,
  IconSettings,
  IconFileInvoice,
  IconReport,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";

export default function MainLayout({ children }) {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  const menus = [
    {
      label: "Dashboard",
      icon: IconHome,
      to: "/",
    },
    {
      label: "Residents",
      icon: IconUsers,
      to: "/residents",
    },
    {
      label: "Houses",
      icon: IconBuilding,
      to: "/houses",
    },
    {
      label: "Expenses",
      icon: IconReceipt,
      to: "/expenses",
    },
    {
      label: "Bill Settings",
      icon: IconSettings,
      to: "/bill-settings",
    },
    {
      label: "Monthly Bills",
      icon: IconFileInvoice,
      to: "/monthly-bills",
    },
    {
      label: "Payments",
      icon: IconReceipt,
      to: "/payments",
    },
    {
      label: "Report Detail",
      icon: IconReport,
      to: "/reports",
    },
  ];

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={600}>RT Finance Management</Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {menus.map((menu, index) => (
          <NavLink
            key={index}
            label={menu.label}
            leftSection={<menu.icon size={18} />}
            component={Link}
            to={menu.to}
            active={location.pathname === menu.to}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
