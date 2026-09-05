import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      deliveryMethod,
      address,
      city,
      notes,
      items,
      total,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart cannot be empty" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    // Validate product IDs so deleted products don't break order creation
    const productIds = items
      .map((item: { productId?: string }) => item.productId)
      .filter((id: string | undefined): id is string => Boolean(id));

    const existingProducts = productIds.length
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true },
        })
      : [];
    const validProductIds = new Set(existingProducts.map((p) => p.id));

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: name,
        customerPhone: phone,
        customerEmail: email || "",
        deliveryMethod: deliveryMethod === "pickup" ? "pickup" : "courier",
        deliveryAddress: address || "",
        city: city || "",
        notes: notes || "",
        status: "pending",
        total: Number(total) || 0,
        items: {
          create: items.map(
            (item: {
              productId?: string;
              name: string;
              price: number;
              quantity: number;
            }) => ({
              productId:
                item.productId && validProductIds.has(item.productId)
                  ? item.productId
                  : null,
              name: item.name,
              price: Number(item.price) || 0,
              quantity: Number(item.quantity) || 1,
            })
          ),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}