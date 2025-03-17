import api from "../index";
import { RIDE_ENDPOINTS } from "../endpoints";
import { z } from "zod";

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

export interface Address {
  id: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
}

export interface Driver {
  name: string;
  last_name: string;
  email: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

interface Reservation {
  passenger_id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  Passenger: {
    name: string;
    last_name: string;
  };
}

export interface Ride {
  ride_id: string;
  driver_id: string;
  start_time: string;
  price: string;
  available_seats: number;
  status: string;
  preferences?: string;
  StartAddress: {
    city: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
  };
  EndAddress: {
    city: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
  };
  Driver?: {
    id: string;
    name: string;
    last_name: string;
    average_rating?: number;
  };
  Vehicle?: {
    brand: string;
    model: string;
    year: string;
    color: string;
    license_plate: string;
    seats: number;
  };
  Reservations?: Array<{
    status: string;
  }>;
}

export interface ApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

class RideService {
  async create(data: CreateRideData): Promise<{ data: Ride }> {
    const response = await api.post(RIDE_ENDPOINTS.CREATE, data);
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

  async getByDriver(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Ride>> {
    const response = await api.get<PaginatedResponse<Ride>>(
      RIDE_ENDPOINTS.GET_BY_DRIVER,
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  }

  async getByStartCity(
    city: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Ride>> {
    const response = await api.get<PaginatedResponse<Ride>>(
      RIDE_ENDPOINTS.GET_BY_START_CITY(city),
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  }

  async getByDestinationCity(
    city: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<Ride>> {
    const response = await api.get<ApiResponse<Ride>>(
      RIDE_ENDPOINTS.GET_BY_DESTINATION_CITY(city),
      {
        params: { page, pageSize },
      }
    );
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
