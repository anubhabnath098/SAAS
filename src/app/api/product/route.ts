import { getProduct, deleteProduct } from "@/server/db/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      { status: 405 }
    );
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");

  if (!productId || typeof productId !== "string") {
    return NextResponse.json(
        { error: "ProductId is required" },
        { status: 400 }
      );
    }

  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

  try {
    const product = await getProduct({ id: productId, userId });
    if (!product) {
        return NextResponse.json(
            { error: "Product is required" },
            { status: 400 }
          );
        }
        

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      { status: 405 }
    );
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");

  if (!productId || typeof productId !== "string") {
    return NextResponse.json(
      { error: "ProductId is required" },
      { status: 400 }
    );
  }

  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await deleteProduct(productId, userId);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

