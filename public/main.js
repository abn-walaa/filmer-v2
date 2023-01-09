let inputText = document.querySelector('#text')
let btn = document.querySelector('.h2')
let btn2 = document.querySelector('button:not(.h2)')
let div = document.querySelector('.h')
let grid = document.querySelector('.grid')
let loading = document.querySelector('.text')

document.addEventListener('click', e => {
    if (e.target.className === "goto") {
        window.open('/watch/' + e.target.value, "_blank")
    }
})
