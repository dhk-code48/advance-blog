import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request, { params }: { params: { authorId: string } }) {
  try {
    if (!params.authorId) {
      return new NextResponse("Author id is required", { status: 400 });
    }

    const author = await prismadb.author.findUnique({
      where: {
        id: params.authorId,
      },
    });

    return NextResponse.json(author);
  } catch (error) {
    console.log("[AUTHOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { authorId: string; siteId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.authorId) {
      return new NextResponse("Author id is required", { status: 400 });
    }

    const siteByUserId = await prismadb.site.findFirst({
      where: {
        id: params.siteId,
        userId,
      },
    });

    if (!siteByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const author = await prismadb.author.delete({
      where: {
        id: params.authorId,
      },
    });

    return NextResponse.json(author);
  } catch (error) {
    console.log("[AUTHOR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { authorId: string; siteId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.authorId) {
      return new NextResponse("Author id is required", { status: 400 });
    }

    const siteByUserId = await prismadb.site.findFirst({
      where: {
        id: params.siteId,
        userId,
      },
    });

    if (!siteByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const author = await prismadb.author.update({
      where: {
        id: params.authorId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(author);
  } catch (error) {
    console.log("[AUTHOR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
