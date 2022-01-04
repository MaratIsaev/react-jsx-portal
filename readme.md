Данная библиотека отлично подойдёт как для создания модалок и попаутов, так и для решения куда более 
сложных задач, таких как создание сложных компонентов интерфейса, когда компоновка требует отображения частей
компонента в разных местах макета, что ведёт к протеканию состояния компонента в вышестоящие компоненты и props hell.

### Преимущества (Features)

> - не использует поиск по DOM. Никаких document.querySelector, document.getElementById, ... Больше нет необходимости искать элементы в HTML-разметке, ТОЛЬКО JSX
> - предсказуемость и декларативность. Даже если компонент, внутри которого должен быть отрисован портал грузится лениво вам не о чем беспокоиться, как только этот компонет загрузится рендер произойдёт автоматически
> - broadcasting. Один и тот же компонент может быть отрисован сразу в нескольких местах.
> - возможность передавать props из компонента куда отрисовывается портал напрямую в портал, избегая props hell и не используя Context API и сопутствующих ему ограничений

### Как пользоваться (Usage)

Для работы вам понадобятся два компонента: Anchor и Portal. Anchor - это jsx элемент, в котором будет отрисовываться Portal. Для их сопоставления дайте им одинаковые id.
В пропс render компонента Portal передайте рендер-функцию, которая принимает в качестве аргумента объект с props, которые ему передаёт компонент Anchor.

    <App>
        <Anchor id="someId" someProp="My name is ..."} />
        ...
        {isOpen && <Portal id="someId" render={({ someProp }) => (<div>{someProp}</div>)} />}
    </App>

При необходимости отрисовать один и тот же портал в двух местах просто добавьте ещё один Anchor с таким же id как у Portal. Каждый отрисованный компонент получит props от своего компонента Anchor.

    <App>
        <Anchor id="someId" someProp="My name is ..."} />
        ...
        <Anchor id="someId" someProp="What a wonderful place!?"} />
        ...
        {isOpen && <Portal id="someId" render={({ someProp }) => (<div>{someProp}</div>)} />}
    </App>

Рендер нескольких Portal's в несколько Anchor's.

    <App>
        <Anchor id="someId" someProp="My name is ..."} />
        ...
        <Anchor id="someId" someProp="What a wonderful place!?"} />
        ...
        {isOpen && <Portal id="someId" render={({ someProp }) => (<div>{someProp}</div>)} />}
        {isSecondOpen && <Portal id="someId" render={({ someProp }) => (<div>{someProp}</div>)} />}
    </App>

При отрисовке нескольких Portal's в один Anchor вы можете приоретизировать какой именно из них должен быть сейчас отрисован. Для этого передайте
в Portal пропс __meta, а в компонент Anchor пропс __renderPolicy - функцию, которая на вход получает массив [{ Component, __meta }, ...] и возвращает такой же массив.

    const renderByPriority = (arr) => {
        const { length } = arr
        
        if (length) {
            const sortedByPriority = arr.sort((a, b) => b.__meta.priority - a.__meta.priority)

            return [sortedByPriority[0]]
        }
    
        return arr
    }

    ...

    <App>
        <Anchor __renderPolicy={renderByPriority} id="someId" someProp="My name is ..."} />
        ...
        {isOpen && <Portal __meta={{ priority: 1 }} id="someId" render={({ someProp }) => (<div>{someProp}</div>)} />}
        {isSecondOpen && <Portal __meta={{ priority: 10 }} id="someId" render={({ someProp }) => (<div>{someProp}</div>)} />}
    </App>