import { canCreateProduct } from "@/server/permissions";
import { NextRequest, NextResponse } from "next/server";

// API Route to check permission
export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const hasPermission = await canCreateProduct(userId);

    return NextResponse.json({ hasPermission }, { status: 200 });
  } catch (error) {
    console.error("Error checking permissions:", error);
    return NextResponse.json(
      { error: "Failed to check permission" },
      { status: 500 }
    );
  }
}
