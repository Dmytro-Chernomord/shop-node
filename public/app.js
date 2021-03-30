
// const instance = M.Tabs.init(document.querySelectorAll('.tabs'));

const toFormatPrice = () => {

    document.querySelectorAll('.price').forEach(node => {
        node.textContent = new Intl.NumberFormat('de-DE', {
            currency: 'eur',
            style: 'currency'
        }).format(node.textContent)
    });
}
toFormatPrice()

const toDate = date => {

    return new Intl.DateTimeFormat("de-DE",
        {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date))
}
document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})

const bag = document.querySelector('#bag');

if (bag) {
    async function remove(e) {

        const newBag = await fetch('/bag/remove/' + e.target.dataset.id, {
            method: 'delete',
            headers: { 'X-XSRF-TOKEn': e.target.dataset.csrf }
        }).then(res => res.json()).then(data => {
            return data
        })

        if (newBag.products.length === 0) {
            document.querySelector('.container').innerHTML = `<h1>Bag is empty</h1>`
        } else {
            let markUp = newBag.products.map(el => {
                return (`
                   <tr class="product-list">
            <td>${el.title}</td>
            <td>${el.quantity}</td>
            <td>${el.price}</td>
            <td><button class="btn btn-primary js-remove" data-id="${el.id}">delete</button></td>
                          </tr>`)
            }).join('')
            document.querySelector('tbody').innerHTML = markUp
            document.querySelector('h2').textContent = `Total: ${newBag.quantity}`
            document.querySelector('.price').textContent = newBag.price;
            toFormatPrice()
        }
    }
    async function removeButton(e) {
        if (e.target.classList.contains('js-remove')) { 
            const newBag = await fetch('/bag/remove/' + e.target.dataset.id, {
                method: 'delete',
                headers: { 'X-XSRF-TOKEn': e.target.dataset.csrf }
            }).then(res => res.json()).then(data => {
                return data
            })
            if (newBag.products.length === 0) {
                document.querySelector('.container').innerHTML = `<h1>Bag is empty</h1>`
            } else {
                let markUp = newBag.products.map(el => {
                    return (`
                   <tr class="product-list">
            <td>${el.title}</td>
            <td>${el.quantity}</td>
            <td>${el.price}</td>
            <td><button class="btn btn-primary js-remove" data-id="${el.id}">delete</button></td>
                          </tr>`)
                }).join('')
                document.querySelector('tbody').innerHTML = markUp
                document.querySelector('h2').textContent = `Total: ${newBag.quantity}`
                document.querySelector('.price').textContent = newBag.price;
                toFormatPrice()
            }
        }
    }
    document.querySelector('#bag').addEventListener('click', removeButton);
}
M.Tabs.init(document.querySelectorAll('.tabs'))
//alternative without button remmove logic

// if (bag) {
//     async function remove(e) {
//         const newBag = await fetch('/bag/remove/' + e.target.dataset.id, {
//             method: 'delete'
//         }).then(res => res.json()).then(data => {
//             return data
//         })
//         console.log(newBag);
//         if (newBag.products.length === 0) {
//             console.log(newBag.products);
//             document.querySelector('.container').innerHTML = `<h1>Bag is empty</h1>`
//         } else {
//             let markUp = newBag.products.map(el => {
//                 return (`
//                    <tr class="product-list">
//             <td>${el.title}</td>
//             <td>${el.quantity}</td>
//             <td>${el.price}</td>
//             <td><button class="btn btn-primary js-remove" data-id="${el.id}">delete</button></td>
//                           </tr>`)
//             }).join('')
//             document.querySelector('tbody').innerHTML = markUp
//             document.querySelector('h2').textContent = `Total: ${newBag.quantity}`
//             document.querySelector('.price').textContent = newBag.price;
//             toFormatPrice()
//         }
//     }


//     const button = document.querySelectorAll('.js-remove');
//     button.forEach(el => el.addEventListener('click', remove))
// }