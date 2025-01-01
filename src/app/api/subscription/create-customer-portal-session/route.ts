
import { NextRequest, NextResponse } from "next/server";
import { createCustomerPortalSession } from "@/server/stripe";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    console.log(userId)
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const session = await createCustomerPortalSession(userId);
    if(session.error){
        return NextResponse.json({error:session.msg}, {status:404});
    }else{
        return NextResponse.json({url:session.url}, {status:200});
    }
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return NextResponse.json(
      { error: "Failed to create customer portal session" },
      { status: 500 }
    );
  }
}
