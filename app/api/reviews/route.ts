import { NextResponse } from 'next/server';
import { analyzeReview } from '@/lib/ai';
import { uploadFile } from '@/lib/storage';
import Review from '@/models/Review';
import connectDB from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const reviewData = {
      shop: formData.get('shop'),
      orderId: formData.get('orderId'),
      customerEmail: formData.get('customerEmail'),
      rating: Number(formData.get('rating')),
      title: formData.get('title'),
      content: formData.get('content'),
    };

    // Validate required fields
    if (!reviewData.shop || !reviewData.orderId || !reviewData.customerEmail || 
        !reviewData.rating || !reviewData.title || !reviewData.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle file uploads if any
    const mediaUrls = [];
    const files = formData.getAll('media');
    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadFile(buffer, file.name, file.type);
        mediaUrls.push({ type: file.type, url });
      }
    }

    // Analyze review content with AI
    const analysis = await analyzeReview(reviewData.content as string);

    // Create review in database
    const review = await Review.create({
      ...reviewData,
      media: mediaUrls,
      sentiment: analysis.sentiment,
      keywords: analysis.keywords,
      summary: analysis.summary,
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const shop = searchParams.get('shop');
    const orderId = searchParams.get('orderId');

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop parameter is required' },
        { status: 400 }
      );
    }

    const query: any = { shop };
    if (orderId) {
      query.orderId = orderId;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 