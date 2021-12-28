import React from 'react'
import { act } from 'react-dom/test-utils'
import { render } from 'react-dom'
import { App } from './app.test'

const INIT_COUNT = 12345
const ID = 'someId'

let root = null

beforeEach(() => {
  document.body.innerHTML = null
  // подготавливаем DOM-элемент, куда будем рендерить
  root = document.createElement('div')
  document.body.appendChild(root)
})

afterEach(() => {
  act(() => {
    render(null, root)
  })
})

const testAnchorAndPortl = (isAnchorFirst) => {
  act(() => {
    render(<App id={ID} anchorVisible portalVisible initCount={INIT_COUNT} anchorFirst={isAnchorFirst} />, root)
  })

  //Проверяем, что портал появился
  let portal = document.querySelector('#counter')

  expect(portal).toBe

  //Проверяем, что значение count равно начальному
  let count = document.querySelector('#count')

  expect(count.innerHTML).toBe(String(INIT_COUNT))

  //Проверяем что пропсы нормально передались в Portal
  //Для этого сначала увеличим счетчик
  let increase = document.querySelector('#increase')

  increase.click()

  expect(count.innerHTML).toBe(String(INIT_COUNT + 1))

  //Потом уменьшим
  const decrease = document.querySelector('#decrease')

  decrease.click()
  decrease.click()

  expect(count.innerHTML).toBe(String(INIT_COUNT - 1))

  //Скрыть Anchor проверить что Portal пропал
  let close = document.querySelector('#close')

  close.click()

  portal = document.querySelector('#counter')

  expect(portal).not.toBe

  //Показать Anchor проверить, что Portal появился
  const openAnchor = document.querySelector('#openAnchor')

  openAnchor.click()

  portal = document.querySelector('#counter')

  expect(portal).toBe

  count = document.querySelector('#count')

  expect(count.innerHTML).toBe(String(INIT_COUNT - 1))

  //Прячем Portal
  let closePortal = document.querySelector('#closePortal')

  closePortal.click()

  portal = document.querySelector('#counter')

  expect(portal).not.toBe

  //Показываем Portal
  const openPortal = document.querySelector('#openPortal')

  openPortal.click()

  portal = document.querySelector('#counter')

  expect(portal).toBe

  count = document.querySelector('#count')

  expect(count.innerHTML).toBe(String(INIT_COUNT - 1))

  increase = document.querySelector('#increase')

  increase.click()

  expect(count.innerHTML).toBe(String(INIT_COUNT))
}

test('Anchor и Portal появляются одновременно, но Anchor выше в дереве', () => testAnchorAndPortl(true))

test('Anchor и Portal появляются одновременно, но Portal выше в дереве', () => testAnchorAndPortl(false))

test('Проверяем что сторы очищаются корректно и нет утечек памяти', () => {
  const {
    storeElems,
    storeAnchors,
    storePortals,
  } = global.anchorAndPortalStores

  //Изначально в сторах ничего нет
  expect(storeElems[ID]).not.toBe
  expect(storeAnchors[ID]).not.toBe
  expect(storePortals[ID]).not.toBe

  //Монтируем компонент
  act(() => {
    render(<App id={ID} anchorVisible portalVisible initCount={INIT_COUNT} anchorFirst />, root)
  })

  //После того как отрендерили один Portal и один Anchor
  expect(storeElems[ID]).toBe
  expect(storeAnchors[ID]).toBe(1)
  expect(storePortals[ID]).toBe(1)

  //Скрываем Portal
  act(() => {
    render(<App id={ID} anchorVisible initCount={INIT_COUNT} anchorFirst />, root)
  })

  //После того как скрыли Portal
  expect(storeElems[ID]).toBe
  expect(storeAnchors[ID]).toBe(1)
  expect(storePortals[ID]).not.toBe

  //Скрываем Anchor
  act(() => {
    render(<App id={ID} portalVisible initCount={INIT_COUNT} anchorFirst />, root)
  })

  //После того как скрыли Anchor
  expect(storeElems[ID]).toBe
  expect(storeAnchors[ID]).not.toBe
  expect(storePortals[ID]).toBe(1)

  //Скрываем Anchor и Portal
  act(() => {
    render(<App id={ID} initCount={INIT_COUNT} anchorFirst />, root)
  })

  //После того как скрыли Portal и Anchor в сторах ничего не должно оставаться
  expect(storeElems[ID]).not.toBe
  expect(storeAnchors[ID]).not.toBe
  expect(storePortals[ID]).not.toBe
})
