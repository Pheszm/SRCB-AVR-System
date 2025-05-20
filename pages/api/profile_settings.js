import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "Missing user_id." });

    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(user_id) },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        username: true,
        email: true,
        user_type: true,
        phone_number: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found." });
    return res.status(200).json(user);
  }

  if (method === "POST") {
    const { user_id, currentPassword } = req.body;
    if (!user_id || !currentPassword)
      return res.status(400).json({ error: "Missing current password." });

    const user = await prisma.users.findUnique({ where: { user_id: parseInt(user_id) } });
    if (!user) return res.status(404).json({ error: "User not found." });

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) return res.status(401).json({ error: "Incorrect current password." });

    return res.status(200).json({ message: "Password verified." });
  }

  if (method === "PUT") {
    const { user_id, newPassword } = req.body;
    if (!user_id || !newPassword)
      return res.status(400).json({ error: "Missing new password." });

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { user_id: parseInt(user_id) },
      data: { password_hash: newHash },
    });

    return res.status(200).json({ message: "Password updated successfully." });
  }

  return res.status(405).json({ error: "Method not allowed." });
}
