import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // You can add backend health check here
    const backendUrl = process.env.NEXT_PUBLIC_API_URL + '/health';
    const response = await fetch(backendUrl);
    const backendHealth = await response.json();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      frontend: 'operational',
      backend: backendHealth,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        frontend: 'operational',
        backend: 'unreachable',
        error: 'Backend service unavailable',
      },
      { status: 503 }
    );
  }
}