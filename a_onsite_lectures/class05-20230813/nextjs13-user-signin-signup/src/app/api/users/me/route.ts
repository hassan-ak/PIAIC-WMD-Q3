import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { getErrorResponse } from "@/lib/helpers";
import { jwt_users } from "@/lib/db/schema/script";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-USER-ID");
  if (!userId) {
    return getErrorResponse(
      401,
      "You are not logged in, please provide token to gain access"
    );
  }
  const user = await db
    .select()
    .from(jwt_users)
    .where(eq(jwt_users.user_id, Number(userId)));
  return NextResponse.json({
    status: "success",
    data: { user: { ...user[0], password: undefined } },
  });
}
