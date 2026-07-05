import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Post from "../../../models/Post";

export async function GET() {

  try {

    await connectDB();

    const posts = await Post.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      posts,
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