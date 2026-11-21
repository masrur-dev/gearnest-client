
import AddEquipmentForm from "@/components/dashboard/AddEquipmentForm";

export default async function AddEquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;

  return <AddEquipmentForm editId={edit} />;
}
