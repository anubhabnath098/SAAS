import { getProductCustomization } from "@/server/db/products";
import { canRemoveBranding, canCustomizeBanner } from "@/server/permissions";
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

    const customization = await getProductCustomization({ productId, userId });

    if (!customization) {
      return NextResponse.json(
        { error: "Product customization not found" },
        { status: 404 }
      );
    }

    const canRemoveBrandingResult = await canRemoveBranding(userId);
    const canCustomizeBannerResult = await canCustomizeBanner(userId);

    return NextResponse.json(
      {
        customization,
        permissions: {
          canRemoveBranding: canRemoveBrandingResult,
          canCustomizeBanner: canCustomizeBannerResult,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product customization:", error);
    return NextResponse.json(
      { error: "Failed to fetch product customization" },
      { status: 500 }
    );
  }
}
