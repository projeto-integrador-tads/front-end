import api from '../index';
import { RIDE_ENDPOINTS } from '../endpoints';
import { z } from 'zod';

export const createRideSchema = z
  .object({
    vehicle_id: z.string().uuid(),
    start_location_id: z.string().uuid().optional(),
    end_location_id: z.string().uuid().optional(),
    start_latitude: z.number().optional(),
    start_longitude: z.number().optional(),
    end_latitude: z.number().optional(),
    end_longitude: z.number().optional(),
    start_time: z.coerce.date({ message: "Digite uma data válida." }),
    price: z.number().positive(),
    available_seats: z
      .number()
      .int()
      .positive()
      .min(1, "A corrida deve conter pelo menos um assento disponível.")
      .max(50, "Não é possível adicionar mais de 50 pessoas."),
    preferences: z.string(),
  })
  .refine(
    (data) =>
      (data.start_location_id ||
        (data.start_latitude && data.start_longitude)) &&
      (data.end_location_id || (data.end_latitude && data.end_longitude)),
    {
      message:
        "Informe o ID ou as coordenadas para os endereços de partida e destino.",
    }
  );

export const updateRideSchema = z.object({
  ride_id: z.string().uuid("ID da corrida inválido."),
  start_location_id: z.string().uuid().optional(),
  end_location_id: z.string().uuid().optional(),
  vehicle_id: z.string().uuid().optional(),
  start_latitude: z.number().optional(),
  start_longitude: z.number().optional(),
  end_latitude: z.number().optional(),
  end_longitude: z.number().optional(),
  start_time: z.coerce.date().optional(),
  price: z.number().positive().optional(),
  available_seats: z
    .number()
    .int()
    .positive()
    .min(1, "A corrida deve conter pelo menos um assento disponível.")
    .max(50, "Não é possível adicionar mais de 50 pessoas.")
    .optional(),
  preferences: z.string().optional(),
});

export type CreateRideData = z.infer<typeof createRideSchema>;
export type UpdateRideData = z.infer<typeof updateRideSchema>;

export interface Ride {
  id: string;
  driver_id: string;
  vehicle_id: string;
  start_location_id: string | null;
  end_location_id: string | null;
  start_latitude: number | null;
  start_longitude: number | null;
  end_latitude: number | null;
  end_longitude: number | null;
  start_time: string;
  end_time: string | null;
  price: number;
  available_seats: number;
  preferences: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
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

class RideService {
  async create(data: CreateRideData): Promise<Ride> {
    const response = await api.post<Ride>(RIDE_ENDPOINTS.CREATE, data);
    return response.data;
  }

  async update(data: UpdateRideData): Promise<Ride> {
    const response = await api.put<Ride>(RIDE_ENDPOINTS.UPDATE, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(RIDE_ENDPOINTS.DELETE(id));
  }

  async getById(id: string): Promise<Ride> {
    const response = await api.get<Ride>(RIDE_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  }

  async getByDriver(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Ride>> {
    const response = await api.get<PaginatedResponse<Ride>>(RIDE_ENDPOINTS.GET_BY_DRIVER, {
      params: { page, pageSize },
    });
    return response.data;
  }

  async getByStartCity(city: string, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Ride>> {
    const response = await api.get<PaginatedResponse<Ride>>(RIDE_ENDPOINTS.GET_BY_START_CITY(city), {
      params: { page, pageSize },
    });
    return response.data;
  }

  async getByDestinationCity(city: string, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Ride>> {
    const response = await api.get<PaginatedResponse<Ride>>(RIDE_ENDPOINTS.GET_BY_DESTINATION_CITY(city), {
      params: { page, pageSize },
    });
    return response.data;
  }

  async startRide(id: string): Promise<Ride> {
    const response = await api.post<Ride>(RIDE_ENDPOINTS.START_RIDE(id));
    return response.data;
  }

  async endRide(id: string): Promise<Ride> {
    const response = await api.post<Ride>(RIDE_ENDPOINTS.END_RIDE(id));
    return response.data;
  }
}

export const rideService = new RideService(); 