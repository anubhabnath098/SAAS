import { NextRequest, NextResponse } from "next/server";
import { subscriptionTiers, subscriptionTiersInOrder } from "@/data/subscriptionTiers";

export async function GET() {
  try {
    
    return NextResponse.json(
      {
        subscriptionTiers,
        subscriptionTiersInOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subscription tiers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription tiers" },
      { status: 500 }
    );
  }
}
