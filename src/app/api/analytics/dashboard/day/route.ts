import { CHART_INTERVALS, getViewsByDayChartData } from '@/server/db/productViews';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      { status: 405 }
    );
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const intervalKey = searchParams.get("interval");
  const timezone = searchParams.get("timezone");
  const productId = searchParams.get("productId");


  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  if (!intervalKey || !(intervalKey in CHART_INTERVALS)) {
    return NextResponse.json(
      { error: "Invalid or missing interval" },
      { status: 400 }
    );
  }

  if (!timezone) {
    return NextResponse.json(
      { error: "Timezone is required" },
      { status: 400 }
    );
  }

  const interval = CHART_INTERVALS[intervalKey as keyof typeof CHART_INTERVALS];

  try {
    if(!productId){
      const chartData = await getViewsByDayChartData({ timezone, userId, interval });
    return NextResponse.json(chartData, { status: 200 });
    }
    else{
      const chartData = await getViewsByDayChartData({ timezone, userId, interval, productId });
    return NextResponse.json(chartData, { status: 200 });
    }
    
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
