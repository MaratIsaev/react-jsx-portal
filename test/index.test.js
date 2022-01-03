import React from 'react'
import { act } from 'react-dom/test-utils'
import { render } from 'react-dom'
import App from './app.test'

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

test('Проверяем корректность прокидывания пропсов', () => {
  act(() => {
    render(<App />, root)
  })

  const FIRST_COUNTRY_NAME = 'Russia'
  const SECOND_COUNTRY_NAME = 'France'

  //Находим первую ячейку
  let cell = document.querySelector(`.cell.${FIRST_COUNTRY_NAME}`)

  expect(cell).toBe

  //Открываем детальную информацию
  cell.click()
  let details = document.querySelector(`.cell.${FIRST_COUNTRY_NAME}`)

  expect(details).toBe

  //Проверяем что значения счётчиков из App, Cell, Details равны 0
  let appCounter = document.querySelector(`.appCounter.${FIRST_COUNTRY_NAME}`)
  let cellCounter = document.querySelector(`.cellCounter.${FIRST_COUNTRY_NAME}`)
  let detailsCounter = document.querySelector(`.detailsCounter.${FIRST_COUNTRY_NAME}`)

  expect(appCounter.innerHTML).toBe('0')
  expect(cellCounter.innerHTML).toBe('0')
  expect(detailsCounter.innerHTML).toBe('0')

  //Увеличиваем все счётчики на 1 и проверяем корректност пропсов
  let appCountButton = document.querySelector('.appCountButton')
  let cellCountButton = document.querySelector(`.cellCountButton.${FIRST_COUNTRY_NAME}`)
  let detailsCountButton = document.querySelector(`.detailsCountButton.${FIRST_COUNTRY_NAME}`)

  appCountButton.click()
  cellCountButton.click()
  detailsCountButton.click()

  expect(appCounter.innerHTML).toBe('1')
  expect(cellCounter.innerHTML).toBe('1')
  expect(detailsCounter.innerHTML).toBe('1')

  //Переключаемся на другую ячейку
  cell = document.querySelector(`.cell.${SECOND_COUNTRY_NAME}`)

  //Открываем детальную информацию
  cell.click()
  details = document.querySelector(`.cell.${SECOND_COUNTRY_NAME}`)

  expect(details).toBe

  //Проверяем что значения счётчиков из App, Cell, Details равны 1, 0, 0 соответственно
  appCounter = document.querySelector(`.appCounter.${SECOND_COUNTRY_NAME}`)
  cellCounter = document.querySelector(`.cellCounter.${SECOND_COUNTRY_NAME}`)
  detailsCounter = document.querySelector(`.detailsCounter.${SECOND_COUNTRY_NAME}`)

  expect(appCounter.innerHTML).toBe('1')
  expect(cellCounter.innerHTML).toBe('0')
  expect(detailsCounter.innerHTML).toBe('0')

  //Увеличиваем все счётчики на 1 и проверяем корректност пропсов
  cellCountButton = document.querySelector(`.cellCountButton.${SECOND_COUNTRY_NAME}`)
  detailsCountButton = document.querySelector(`.detailsCountButton.${SECOND_COUNTRY_NAME}`)

  appCountButton.click()
  cellCountButton.click()
  detailsCountButton.click()

  expect(appCounter.innerHTML).toBe('2')
  expect(cellCounter.innerHTML).toBe('1')
  expect(detailsCounter.innerHTML).toBe('1')

  //Возвращаемся к первой ячейке
  cell = document.querySelector(`.cell.${FIRST_COUNTRY_NAME}`)

  cell.click()

  appCounter = document.querySelector(`.appCounter.${FIRST_COUNTRY_NAME}`)
  cellCounter = document.querySelector(`.cellCounter.${FIRST_COUNTRY_NAME}`)
  detailsCounter = document.querySelector(`.detailsCounter.${FIRST_COUNTRY_NAME}`)

  expect(appCounter.innerHTML).toBe('2')
  expect(cellCounter.innerHTML).toBe('1')
  expect(detailsCounter.innerHTML).toBe('0')
})
