import { getProductCountryGroups } from "@/server/db/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const userId = searchParams.get("userId");

    if (!productId || !userId) {
      return NextResponse.json(
        { error: "Product ID and User ID are required" },
        { status: 400 }
      );
    }

    const countryGroups = await getProductCountryGroups({ productId, userId });

    return NextResponse.json(countryGroups, { status: 200 });
  } catch (error) {
    console.error("Error fetching country groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch country groups" },
      { status: 500 }
    );
  }
}
