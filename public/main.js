let inputText = document.querySelector('#text')
let btn = document.querySelector('.h2')
let btn2 = document.querySelector('button:not(.h2)')
let div = document.querySelector('.h')
let grid = document.querySelector('.grid')
let loading = document.querySelector('.text')
btn.onclick = async e => {
    // btn.setAttribute('disabled', ' ')
    btn.setAttribute('disabled', '')
    loading.textContent = 'جاري البحث....'
    await fetch('/serach/', {
        headers: {
            'Content-Type': 'application/json'
        }, method: 'post', body: JSON.stringify({ item: inputText.value })
    }).then(e => e.json()).then(e => {
        try {
            document.querySelector('.grid').remove()
        } catch (error) {

        }

        let grid = document.createElement('div')
        grid.className = 'grid'
        e.forEach(e => {

            let div = document.createElement('div')
            let img = document.createElement('img')
            let h1 = document.createElement('h1')
            let btn = document.createElement('button')
            btn.className = 'goto'
            img.src = e.pic
            btn.value = encodeURI(e.url.slice(29))
            btn.textContent = 'WaTch'
            h1.textContent = e.title
            div.appendChild(img)
            div.appendChild(h1)
            div.appendChild(btn)
            grid.appendChild(div)
        });
        document.body.appendChild(grid)
        loading.textContent = ' '
        btn.removeAttribute('disabled')
    })

}
document.addEventListener('click', e => {
    if (e.target.className === "goto") {
        window.open('/watch/' + e.target.value, "_blank")
    }
})
