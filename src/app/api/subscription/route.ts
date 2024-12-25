import { getProductCount } from "@/server/db/products"
import { getProductViewCount } from "@/server/db/productViews"
import { getUserSubscriptionTier } from "@/server/db/subscription";
import { NextRequest, NextResponse } from "next/server";
import { startOfMonth } from "date-fns";

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

    const tier = await getUserSubscriptionTier(userId);
    const productCount = await getProductCount(userId);
    const pricingViewCount = await getProductViewCount(userId, startOfMonth(new Date()));


    return NextResponse.json(
      { tier, productCount, pricingViewCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
