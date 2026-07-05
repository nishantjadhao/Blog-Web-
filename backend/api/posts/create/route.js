import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Post from "../../../models/Post";

export async function POST(req: Request) {

  try {

    await connectDB();

    const body = await req.json();

    const post = await Post.create(body);

    return NextResponse.json({
      success: true,
      post,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}