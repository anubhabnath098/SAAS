import { NextRequest, NextResponse } from "next/server";
import { createCancelSession } from "@/server/stripe";

// API Route to cancel a subscription
export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  const { userId } = await req.json();

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {

    const result = await createCancelSession(userId);
    if(result.error){
      return NextResponse.json({error:"Error while cancelling subscription"},{status:400})
    }else{
      return NextResponse.json({url:result.url}, {status:200})
    }
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
