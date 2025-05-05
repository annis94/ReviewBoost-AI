'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Review {
  _id: string;
  rating: number;
  title: string;
  content: string;
  media: Array<{
    type: string;
    url: string;
  }>;
  sentiment: {
    label: string;
    score: number;
  };
  keywords: string[];
  summary: string;
  createdAt: string;
}

interface ReviewWidgetProps {
  shop: string;
  productId?: string;
  limit?: number;
}

export default function ReviewWidget({ shop, productId, limit = 5 }: ReviewWidgetProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url = new URL('/api/reviews', window.location.origin);
        url.searchParams.append('shop', shop);
        if (productId) {
          url.searchParams.append('productId', productId);
        }
        url.searchParams.append('limit', limit.toString());

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [shop, productId, limit]);

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center py-8">No reviews yet</div>;
  }

  return (
    <div className="space-y-8">
      {reviews.map((review) => (
        <div key={review._id} className="border rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-lg font-semibold mb-2">{review.title}</h3>
          <p className="text-gray-600 mb-4">{review.content}</p>

          {review.media.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {review.media.map((media, index) => (
                <div key={index} className="relative aspect-square">
                  {media.type.startsWith('image/') ? (
                    <Image
                      src={media.url}
                      alt="Review media"
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={media.url}
                      controls
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {review.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 