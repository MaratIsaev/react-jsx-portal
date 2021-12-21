import React from 'react';
import { act } from "react-dom/test-utils";
import { render } from "react-dom";
import {Anchor, Portal} from '../src'

let root = null;
beforeEach(() => {
    // подготавливаем DOM-элемент, куда будем рендерить
    root = document.createElement("div");
    document.body.appendChild(root);
});

test('Появился Anchor, но никаких Portal-ов ещё нет', () => {
    act(() => {
        render(<div id="container">aaa
        </div>, root)
    })

    const c = document.querySelector('#container')

    expect(c.innerHTML).toBe('aaa')
})