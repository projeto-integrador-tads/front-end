import api from "../index";
import { z } from "zod";
import { plate } from "../../../utils/regex";
import { VEHICLE_ENDPOINTS } from "../endpoints";

export const vehicleSchema = z.object({
  brand: z.string().min(1).max(50, "Marca deve ter no máximo 50 caracteres."),
  model: z.string().min(1).max(50, "Modelo deve ter no máximo 50 caracteres."),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  license_plate: z
    .string()
    .regex(plate, "Placa inválida. Formato esperado: ABC1D23"),
  color: z.string().min(1).max(30, "Cor deve ter no máximo 30 caracteres."),
  seats: z.number().int().min(1).max(50),
});

export const updateVehicleSchema = z.object({
  vehicle_id: z.string().uuid(),
  color: z.string().min(2).max(30).optional(),
  seats: z.number().int().min(1).max(50).optional(),
});

export type CreateVehicleData = z.infer<typeof vehicleSchema>;
export type UpdateVehicleData = z.infer<typeof updateVehicleSchema>;

export interface Vehicle {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  seats: number;
  active: boolean;
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

class VehicleService {
  async create(data: CreateVehicleData): Promise<Vehicle> {
    const response = await api.post<Vehicle>(VEHICLE_ENDPOINTS.CREATE, data);
    return response.data;
  }

  async update(data: UpdateVehicleData): Promise<Vehicle> {
    const response = await api.put<Vehicle>(VEHICLE_ENDPOINTS.UPDATE, data);
    return response.data;
  }

  async delete(vehicle_id: string): Promise<void> {
    await api.delete(VEHICLE_ENDPOINTS.DELETE(vehicle_id));
  }

  async reactivate(vehicle_id: string): Promise<Vehicle> {
    const response = await api.post<Vehicle>(
      VEHICLE_ENDPOINTS.REACTIVATE(vehicle_id)
    );
    return response.data;
  }

  async getActive(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Vehicle>> {
    const response = await api.get<PaginatedResponse<Vehicle>>(
      VEHICLE_ENDPOINTS.GET_ACTIVE,
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  }

  async getInactive(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Vehicle>> {
    const response = await api.get<PaginatedResponse<Vehicle>>(
      VEHICLE_ENDPOINTS.GET_INACTIVE,
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  }
}

export const vehicleService = new VehicleService();
