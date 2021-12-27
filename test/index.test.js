import React from 'react'
import { act } from 'react-dom/test-utils'
import { render } from 'react-dom'
import { App } from './app.test'

let root = null

beforeEach(() => {
  document.body.innerHTML = null
  // подготавливаем DOM-элемент, куда будем рендерить
  root = document.createElement('div')
  document.body.appendChild(root)
})

test('Anchor и Portal появляются одновременно, но Anchor выше в дереве', () => {
  const INIT_COUNT = 12345

  act(() => {
    render(<App initCount={INIT_COUNT} anchorFirst />, root)
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
  const close = document.querySelector('#close')

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
  const closePortal = document.querySelector('#closePortal')

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
})

test('Anchor и Portal появляются одновременно, но Portal выше в дереве', () => {
  const INIT_COUNT = 12345

  act(() => {
    render(<App initCount={INIT_COUNT} />, root)
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
  const close = document.querySelector('#close')

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
  const closePortal = document.querySelector('#closePortal')

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
})
