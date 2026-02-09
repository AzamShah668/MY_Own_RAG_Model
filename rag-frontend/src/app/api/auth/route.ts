import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();

    // Proxy to FastAPI or handle internally
    // For production, we would integrate with the actual backend
    return NextResponse.json({
        success: true,
        message: "Action processed"
    });
}
