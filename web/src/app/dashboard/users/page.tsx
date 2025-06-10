import { UsersTable } from "@/components/pages";

export const metadata = {
    title: "Usuários - IMC Web",
};

export default async function Users() {
    return <UsersTable />;
}
