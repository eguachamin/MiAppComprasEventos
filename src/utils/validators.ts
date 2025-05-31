// utils/validators.ts
import { z } from 'zod'
import { verificarCedula, verificarRuc } from 'udv-ec';


export const registroSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Correo inválido'),
  telefono: z.string().length(10, 'El teléfono debe tener 10 dígitos').regex(/^09\d{8}$/, 'El teléfono debe comenzar con 09 y tener 10 dígitos'),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  provincia: z.string().min(1, 'Selecciona una provincia'),
  ciudad: z.string().min(1, 'La ciudad es obligatoria'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[^A-Za-z0-9]/, 'Debe incluir al menos un carácter especial'),
  confirmarPassword: z.string(),
}).refine((data) => data.password === data.confirmarPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarPassword'],
});


// Validar que sea cédula o RUC válido
export const validateCedulaOrRUC = (value: string) => {
  if (!value || value.trim() === '') {
    return 'El campo es obligatorio';
  }

  const cleaned = value.trim();

  if (verificarCedula(cleaned) || verificarRuc(cleaned)) {
    return true;
  }

  return 'Debe ser una cédula o RUC válido';
};

export type FormData = z.infer<typeof registroSchema>;
