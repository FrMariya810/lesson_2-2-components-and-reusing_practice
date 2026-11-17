export type BookingStatus = 'new' | 'confirmed'
export interface Booking {
  id: string
  name: string
  seats: number
  status: BookingStatus
  source: 'web'
}
export function initialBookings(): Booking[] {
  return [
    { id: 'b1', name: 'Анна', seats: 1, status: 'confirmed', source: 'web' },
    // П1: временно измените seats Ивана, затем верните 1.
    { id: 'b2', name: 'Иван', seats: 1, status: 'new', source: 'web' },
  ]
}
