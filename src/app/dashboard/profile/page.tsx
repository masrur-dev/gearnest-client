
import ProfileForm from "@/components/dashboard/ProfileForm";
import { getSessionUser } from "@/lib/session";

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  return (
    <ProfileForm
      initial={{
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    />
  );
}
