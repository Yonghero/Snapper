export type anyToString<T extends Record<string, any>> = {
  [key in keyof T]: string
}
