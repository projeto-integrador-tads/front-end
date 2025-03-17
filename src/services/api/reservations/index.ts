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

interface Driver {
  id: string;
  name: string;
  last_name: string;
  phone_number: string;
  average_rating: number | null;
}

interface Vehicle {
  vehicle_id: string;
  owner_id: string;
  brand: string;
  model: string;
  active: boolean;
  year: number;
  license_plate: string;
  color: string;
  seats: number;
  createdAt: string;
  updatedAt: string;
}

interface Address {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  formattedAddress: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  userId: string | null;
}

interface ExtendedRide {
  ride_id: string;
  driver_id: string;
  vehicle_id: string;
  start_address_id: string;
  end_address_id: string;
  start_time: string;
  end_time: string | null;
  price: string;
  available_seats: number;
  preferences: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  Driver: Driver;
  Vehicle: Vehicle;
  StartAddress: Address;
  EndAddress: Address;
}

export interface Reservation {
  reservation_id: string;
  ride_id: string;
  passenger_id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  payment_status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  Ride?: ExtendedRide;
}

export interface PaginatedMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

export interface ApiResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

class ReservationService {
  async create(ride_id: string): Promise<Reservation> {
    const response = await api.post<{ data: Reservation }>(
      RESERVATION_ENDPOINTS.CREATE(ride_id)
    );
    return response.data.data;
  }

  async getByUser(
    page: number = 1,
    perPage: number = 3
  ): Promise<ApiResponse<Reservation>> {
    const response = await api.get<ApiResponse<Reservation>>(
      RESERVATION_ENDPOINTS.GET_BY_USER,
      {
        params: { page, perPage },
      }
    );
    return response.data;
  }

  async getByRide(ride_id: string): Promise<ApiResponse<Reservation>> {
    const response = await api.get<ApiResponse<Reservation>>(
      RESERVATION_ENDPOINTS.GET_BY_RIDE(ride_id)
    );
    return response.data;
  }

  async getConfirmedByRide(
    ride_id: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<Reservation>> {
    const response = await api.get<ApiResponse<Reservation>>(
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
    const response = await api.post<{ data: Reservation }>(
      RESERVATION_ENDPOINTS.CONFIRM(reservation_id)
    );
    return response.data.data;
  }
}

export const reservationService = new ReservationService();
