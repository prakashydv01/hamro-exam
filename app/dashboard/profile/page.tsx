import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <div className="bg-white p-5 rounded shadow">
        <p>Name: {session?.user.name}</p>
        <p>Email: {session?.user.email}</p>
        <p>Login Method: {session?.user.provider}</p>
      </div>
    </>
  );
}
