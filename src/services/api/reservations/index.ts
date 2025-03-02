import { RESERVATION_ENDPOINTS } from "../endpoints";
import api from "../index";
import { z } from "zod";

export const createReservationSchema = z.object({
  ride_id: z.string().uuid("ID da corrida inválido"),
});

export const confirmReservationSchema = z.object({
  reservation_id: z.string().uuid("ID da reserva inválido"),
});

export const cancelReservationSchema = z.object({
  reservation_id: z.string().uuid("ID da reserva inválido"),
});

export type CreateReservationData = z.infer<typeof createReservationSchema>;
export type ConfirmReservationData = z.infer<typeof confirmReservationSchema>;
export type CancelReservationData = z.infer<typeof cancelReservationSchema>;

export interface Reservation {
  id: string;
  user_id: string;
  ride_id: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class ReservationService {
  async create(ride_id: string): Promise<Reservation> {
    const response = await api.post<Reservation>(
      RESERVATION_ENDPOINTS.CREATE(ride_id)
    );
    return response.data;
  }

  async getByUser(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Reservation>> {
    const response = await api.get<PaginatedResponse<Reservation>>(
      RESERVATION_ENDPOINTS.GET_BY_USER,
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  }

  async getByRide(ride_id: string): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>(
      RESERVATION_ENDPOINTS.GET_BY_RIDE(ride_id)
    );
    return response.data;
  }

  async getConfirmedByRide(
    ride_id: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Reservation>> {
    const response = await api.get<PaginatedResponse<Reservation>>(
      RESERVATION_ENDPOINTS.GET_CONFIRMED_BY_RIDE(ride_id),
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  }

  async cancel(reservation_id: string): Promise<void> {
    await api.post(RESERVATION_ENDPOINTS.CANCEL(reservation_id));
  }

  async confirm(reservation_id: string): Promise<Reservation> {
    const response = await api.post<Reservation>(
      RESERVATION_ENDPOINTS.CONFIRM(reservation_id)
    );
    return response.data;
  }
}

export const reservationService = new ReservationService();
