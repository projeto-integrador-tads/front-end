// Brazilian license plate format: ABC1D23
export const plate = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

// Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and can contain special characters
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/; 