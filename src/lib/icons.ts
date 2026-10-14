// Standar ukuran ikon di seluruh aplikasi.
// Pakai konstanta ini, jangan hardcode angka.
export const ICON_SIZE = {
  sm: 16,
  md: 18,
  lg: 20,
} as const;

export type IconSize = keyof typeof ICON_SIZE;
