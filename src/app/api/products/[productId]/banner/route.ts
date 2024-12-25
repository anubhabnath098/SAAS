import { Banner } from "@/components/Banner";
import { env } from "@/data/env/server";
import { getProductForBanner } from "@/server/db/products";
import { createProductView } from "@/server/db/productViews";
import { canRemoveBranding, canShowDiscountBanner } from "@/server/permissions";
import { NextRequest, NextResponse } from "next/server";
import { createElement } from "react";

// export const runtime = "edge";

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  const { productId } = await params;

  if (!productId || typeof productId !== "string") {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const headersMap = req.headers;
  const requestingUrl = headersMap.get("referer") || headersMap.get("origin");
  
  if (!requestingUrl) {
    return NextResponse.json({ error: "Referer or origin header is missing" }, { status: 404 });
  }

  const countryCode = getCountryCode(req);
  
  if (!countryCode) {
    return NextResponse.json({ error: "Country code is not available" }, { status: 404 });
  }

  try {
    const { product, discount, country } = await getProductForBanner({
      id: productId,
      countryCode,
      url: requestingUrl,
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const canShowBanner = await canShowDiscountBanner(product.clerkUserId);

    await createProductView({
      productId: product.id,
      countryId: country?.id,
      userId: product.clerkUserId,
    });

    if (!canShowBanner) {
      return NextResponse.json({ error: "Cannot show banner" }, { status: 404 });
    }

    if (!country || !discount) {
      return NextResponse.json({ error: "Country or discount data missing" }, { status: 404 });
    }

    const jsContent = await getJavaScript(
      product,
      country,
      discount,
      await canRemoveBranding(product.clerkUserId)
    );

    return new NextResponse(jsContent, { headers: { "Content-Type": "application/javascript" } });
  } catch (error) {
    console.error("Error fetching banner data:", error);
    return NextResponse.json({ error: "Failed to fetch banner data" }, { status: 500 });
  }
}

function getCountryCode(request: NextRequest) {
  if (request.geo?.country) return request.geo.country;
  if (process.env.NODE_ENV === "development") {
    return env.TEST_COUNTRY_CODE;
  }
}

async function getJavaScript(
  product: {
    customization: {
      locationMessage: string;
      bannerContainer: string;
      backgroundColor: string;
      textColor: string;
      fontSize: string;
      isSticky: boolean;
      classPrefix?: string | null;
    };
  },
  country: { name: string },
  discount: { coupon: string; percentage: number },
  canRemoveBranding: boolean
) {
  const { renderToStaticMarkup } = await import("react-dom/server");

  return `
    const banner = document.createElement("div");
    banner.innerHTML = '${renderToStaticMarkup(
      createElement(Banner, {
        message: product.customization.locationMessage,
        mappings: {
          country: country.name,
          coupon: discount.coupon,
          discount: (discount.percentage * 100).toString(),
        },
        customization: product.customization,
        canRemoveBranding,
      })
    )}';
    document.querySelector("${product.customization.bannerContainer}").prepend(...banner.children);
  `.replace(/(\r\n|\n|\r)/g, "");
}
