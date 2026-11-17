import type { Booking } from './models/booking'
// Работающая обычная карточка. В П9 её заменяет компонент; этот файл менять не нужно.
export function legacyCard(booking: Booking, confirm: (id: string) => void): HTMLElement {
  const card = document.createElement('article')
  card.className = 'legacy-card'
  const name = document.createElement('h3')
  const text = document.createElement('p')
  const button = document.createElement('button')
  button.type = 'button'
  button.addEventListener('click', () => confirm(card.dataset.id ?? ''))
  card.append(name, text, button)
  updateLegacy(card, booking)
  return card
}
export function updateLegacy(card: HTMLElement, booking: Booking) {
  card.dataset.id = booking.id
  card.querySelector('h3')!.textContent = booking.name
  card.querySelector('p')!.textContent = `Участников: ${booking.seats} · ${booking.status === 'confirmed' ? 'Подтверждена' : 'Новая заявка'}`
  const button = card.querySelector('button')!
  button.textContent = booking.status === 'confirmed' ? 'Подтверждено' : 'Подтвердить'
  button.disabled = booking.status === 'confirmed'
}
