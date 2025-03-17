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

export const createVehicleSchema = z.object({
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  year: z.number().min(1900, "Ano inválido"),
  license_plate: z.string().regex(plate, "Placa inválida. Formato esperado: ABC1D23"),
  color: z.string().min(1, "Cor é obrigatória"),
  seats: z.number().min(1, "Número de assentos inválido"),
});

export type CreateVehicleData = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleData = z.infer<typeof updateVehicleSchema>;

export interface Vehicle {
  vehicle_id: string;
  owner_id: string;
  model: string;
  year: number;
  color: string;
  active: boolean;
  seats: number;
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

class VehicleService {
  async create(data: CreateVehicleData) {
    const response = await api.post(VEHICLE_ENDPOINTS.CREATE, data);
    return response.data;
  }

  async update(data: UpdateVehicleData) {
    const response = await api.put(VEHICLE_ENDPOINTS.UPDATE, data);
    return response.data;
  }

  async delete(vehicle_id: string): Promise<void> {
    await api.delete(VEHICLE_ENDPOINTS.DELETE(vehicle_id));
  }

  async reactivate(vehicle_id: string) {
    const response = await api.post(VEHICLE_ENDPOINTS.REACTIVATE(vehicle_id));
    return response.data;
  }

  async getActive() {
    const response = await api.get(VEHICLE_ENDPOINTS.GET_ACTIVE);
    return response.data;
  }

  async getInactive(page: number = 1, pageSize: number = 10) {
    const response = await api.get(VEHICLE_ENDPOINTS.GET_INACTIVE, {
      params: { page, pageSize },
    });
    return response.data;
  }
}

export const vehicleService = new VehicleService();
