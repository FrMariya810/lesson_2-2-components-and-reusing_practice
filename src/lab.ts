import type { Booking } from './models/booking'
// Готовый стенд. Доступ к shadowRoot здесь нужен только для учебной диагностики.
// Основное приложение в main.ts работает через свойство и публичное событие.
type Sample = HTMLElement & { booking: Booking }
export function mountLab(target: HTMLElement) {
  target.innerHTML = `<div class="toolbar"></div><div id="sample"></div><output id="lab-output" aria-live="polite">Сначала зарегистрируйте компонент (задание 2).</output>`
  const toolbar = target.querySelector<HTMLElement>('.toolbar')!
  const stage = target.querySelector<HTMLElement>('#sample')!
  const output = target.querySelector<HTMLOutputElement>('output')!
  let card: Sample | null = null
  let root: ShadowRoot | null = null
  let originalButton: Element | null = null
  let received = 0
  const data = (): Booking => ({ id: 'sample', name: 'Иван', seats: 1, status: 'new', source: 'web' })
  const show = (text: string) => {
    output.textContent = `${text} | Событий: ${received} | Подключён: ${card?.isConnected ? 'да' : 'нет'} | Дерево: ${!root ? 'ещё нет' : card?.shadowRoot === root ? 'то же' : 'изменилось'} | Кнопка: ${!originalButton ? 'ещё нет' : card?.shadowRoot?.querySelector('button') === originalButton ? 'та же' : 'изменилась'}`
  }
  const action = (id: string, title: string, fn: () => void, needsCard = true) => {
    const button = document.createElement('button'); button.type = 'button'; button.id = id; button.textContent = title
    button.addEventListener('click', () => {
      if (needsCard && !card) { output.textContent = 'Сначала нажмите «Создать образец».'; return }
      fn()
    }); toolbar.append(button)
  }
  action('create-sample', 'Создать образец', () => {
    if (!customElements.get('booking-card')) { output.textContent = 'booking-card ещё не зарегистрирован: проверьте задание 2.'; return }
    card?.remove(); received = 0
    card = document.createElement('booking-card') as Sample
    card.addEventListener('booking-confirm', () => { received += 1; show('Получен booking-confirm') })
    stage.replaceChildren(card); root = card.shadowRoot; originalButton = root?.querySelector('button') ?? null
    show('Создан один экземпляр')
  }, false)
  action('give-data', 'Данные Ивана', () => { card!.booking = data(); show('Передан Иван: 1, new') })
  action('give-group', 'Группа из 3', () => { card!.booking = { ...data(), seats: 3 }; show('Передан Иван: 3, new') })
  action('give-confirmed', 'Подтверждённые данные', () => { card!.booking = { ...data(), status: 'confirmed' }; show('Передан Иван: 1, confirmed') })
  action('detach', 'Отключить', () => { card!.remove(); show('Элемент сохранён вне документа') })
  action('attach', 'Вернуть', () => { if (!card!.isConnected) stage.append(card!); show('Тот же экземпляр возвращён') })
  action('detached-click', 'Клик по отключённой', () => {
    if (card!.isConnected) { show('Сначала отключите карточку'); return }
    card!.shadowRoot?.querySelector('button')?.click(); show('Вызван click внутренней кнопки вне документа')
  })
  action('lookup', 'Проверить поиск', () => {
    show(`Обычный поиск: ${stage.querySelector('booking-card button') === null ? 'null' : 'найдено'}; через shadowRoot: ${card!.shadowRoot?.querySelector('button') ? 'кнопка' : 'null'}`)
  })
}
