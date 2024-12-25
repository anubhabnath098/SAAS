import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/server/stripe";

export async function POST(req: NextRequest) {
  try {
    const { tier, userEmail, userId } = await req.json();

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!tier) {
      return NextResponse.json(
        { error: "Tier is required" },
        { status: 400 }
      );
    }

    if (!userEmail || typeof userEmail !== "string") {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    console.log(tier, userEmail,userId)

    const session = await createCheckoutSession(tier, userEmail, userId);

    if (session.error) {
      return NextResponse.json(
        { error: "Error creating checkout session" },
        { status: 400 }
      );
    }

    return NextResponse.json({ url:session.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
