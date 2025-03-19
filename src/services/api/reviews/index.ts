import api from "../index";
import { REVIEW_ENDPOINTS } from "../endpoints";
import { z } from "zod";

export const createReviewSchema = z.object({
  ride_id: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  passenger_id: z.string().optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export const reviewIdSchema = z.object({
  review_id: z.string().uuid(),
});

export type CreateReviewData = z.infer<typeof createReviewSchema>;
export type UpdateReviewData = z.infer<typeof updateReviewSchema>;

export interface Review {
  review_id: string;
  ride_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

class ReviewService {
  async create(data: CreateReviewData): Promise<Review> {
    const response = await api.post<Review>(REVIEW_ENDPOINTS.CREATE, data);
    return response.data;
  }

  async update(reviewId: string, data: UpdateReviewData): Promise<Review> {
    const response = await api.put<Review>(REVIEW_ENDPOINTS.UPDATE(reviewId), data);
    return response.data;
  }

  async delete(reviewId: string): Promise<void> {
    await api.delete(REVIEW_ENDPOINTS.DELETE(reviewId));
  }
}

export const reviewService = new ReviewService(); 