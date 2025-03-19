export const BASE_URL = "https://17r3v2zg-3000.brs.devtunnels.ms/";

export const AUTH_ENDPOINTS = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_RESET_CODE: "/verify-reset-code",
  RESET_PASSWORD: "/reset-password",
  CHANGE_PASSWORD: "/change-password",
} as const;

export const USER_ENDPOINTS = {
  GET_BY_ID: (id: string) => `/users/${id}`,
  DELETE: "/users",
  UPLOAD_PICTURE: "/users/upload/img",
  GET_PICTURE: "/users/profile-picture",
  GET_PICTURE_BY_ID: (id: string) => `/users/${id}/profile-picture`,
  DELETE_PICTURE: "/users/profile-picture",
  UPDATE: "/users",
  REPORT: "/users/report",
} as const;

export const RIDE_ENDPOINTS = {
  CREATE: "/rides",
  UPDATE: "/rides",
  DELETE: (id: string) => `/rides/${id}`,
  GET_BY_ID: (id: string) => `/rides/${id}`,
  GET_BY_DRIVER: "/rides/driver",
  GET_BY_START_CITY: (city: string) => `/rides/start-city/${city}`,
  GET_BY_DESTINATION_CITY: (city: string) => `/rides/destination-city/${city}`,
  START_RIDE: (id: string) => `/rides/start/${id}`,
  END_RIDE: (id: string) => `/rides/end/${id}`,
} as const;

export const VEHICLE_ENDPOINTS = {
  CREATE: "/vehicles",
  UPDATE: "/vehicles",
  DELETE: (vehicle_id: string) => `/vehicles/${vehicle_id}`,
  REACTIVATE: (vehicle_id: string) => `/vehicles/reactivate/${vehicle_id}`,
  GET_ACTIVE: "/vehicles/active",
  GET_INACTIVE: "/vehicles/inactive",
} as const;

export const RESERVATION_ENDPOINTS = {
  CREATE: (ride_id: string) => `/reservations/${ride_id}`,
  GET_BY_USER: "/reservations/users",
  GET_BY_RIDE: (ride_id: string) => `/reservations/rides/${ride_id}`,
  GET_CONFIRMED_BY_RIDE: (ride_id: string) =>
    `/reservations/rides/${ride_id}/confirmed`,
  CANCEL: (reservation_id: string) => `/reservations/cancel/${reservation_id}`,
  CONFIRM: (reservation_id: string) =>
    `/reservations/confirm/${reservation_id}`,
} as const;

export const REVIEW_ENDPOINTS = {
  CREATE: "/reviews",
  UPDATE: (review_id: string) => `/reviews/${review_id}`,
  DELETE: (review_id: string) => `/reviews/${review_id}`,
} as const;

export const MESSAGE_ENDPOINTS = {
  GET_CONVERSATIONS: '/messages/conversations',
  GET_MESSAGES: (rideId: string) => `/messages/${rideId}`,
  SEND_MESSAGE: '/messages',
  GET_POSSIBLE_RECIPIENTS: '/messages/possible-recipients',
} as const;
