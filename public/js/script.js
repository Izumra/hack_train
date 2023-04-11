import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.esm.browser.min.js'

//sliders
new Swiper('.card-manually__slider', {
	navigation: {
		nextEl: '.slider__next-btn',
		prevEl: '.slider__prev-btn',
	}
})
//dropdown
document.querySelectorAll('.dropdown').forEach(dropdown => {
	const ddSelect = dropdown.querySelector('.dropdown__select')
	const ddList = dropdown.querySelector('.dropdown__list')
	const ddBtns = ddList.querySelectorAll('.dropdown__btn')

	ddSelect.addEventListener('click', function () {
		ddSelect.classList.toggle('active')
		ddList.classList.toggle('active')
	})
	ddSelect.textContent = ddBtns[0].textContent
	ddSelect.dataset.value = ddBtns[0].dataset.value
	ddBtns.forEach(btn => {
		btn.addEventListener('click', function () {
			ddSelect.textContent = btn.textContent
			ddSelect.dataset.value = btn.dataset.value
			ddSelect.classList.remove('active')
			ddList.classList.remove('active')
		})
	})
})

//modal window
const allPopup = document.querySelectorAll('.popup')
allPopup.forEach(popup => {
	popup.addEventListener('click', function (evt) {
		if (!evt.target.closest('.popup__dialog') || evt.target.classList.contains('popup__close')) {
			document.body.style.overflow = 'visible'
			popup.classList.remove('popup_active')
		}
	})

	const popupShowBtns = document.querySelectorAll(`[data-popup-id="${popup.id}"]`)
	for (const btn of popupShowBtns) {
		btn.addEventListener('click', function () {
			document.body.style.overflow = 'hidden'
			popup.classList.add('popup_active')
		})
	}
})


switch (location.pathname) {
	case '/':
		login()
		break
	case '/list':
		list()
		break
	case '/card':
		card()
		break
	case '/documents':
		docs()
		break
}

function login() {
	document.querySelector('.login__btn ').addEventListener('click', function(){
		location = '/list'
	})
	const raw = {
		tel: '+79818535382',
		password: 'vovako38' 
	}

	fetch('https://app.izumra.ru/', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(raw)
	})
	.then(async result => {
		if (result.ok){
			const data = await result.json()
			console.log(data);
		}
	})
	.catch(err => console.log(err))
}

function list() {
	//accordions
	const accordionBtns = document.querySelectorAll('.accordion__btn')

	accordionBtns.forEach(btn => {
		btn.addEventListener('click', function () {
			btn.parentElement.classList.toggle('active')
		})
	});

	//select object
	const objects = document.querySelectorAll('.list-objects-card')
	for (const obj of objects) {
		obj.querySelector('.choise').addEventListener('click', function () {
			[...objects].map(o => o.classList.remove('selected'))
			obj.classList.add('selected')
		})
		obj.querySelector('.cancel').addEventListener('click', function () {
			obj.classList.remove('selected')
		})
	}

	//datasort 
	const dateSortBtn = document.querySelector('#date-sort')
	dateSortBtn.addEventListener('click', function () {
		dateSortBtn.classList.toggle('active')
		document.querySelector('.list-objects__list').classList.toggle('sorted')
	})

	//calendar
	const date = new Date()
	const month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Нояврь', 'Декабрь']

	const calendar = document.querySelector('.calendar')
	const calendarMonth = document.querySelector('.calendar__title')
	const calendarNextBtn = document.querySelector('.calendar__next-month')
	const calendarPrevBtn = document.querySelector('.calendar__prev-month')

	calendarMonth.textContent = month[date.getMonth()]
	calendarNextBtn.addEventListener('click', function () {
	})
}
function card() {
	//tabs
	const cardTabsBtns = document.querySelectorAll('.card-tabs__btn')
	cardTabsBtns.forEach(btn => {
		btn.addEventListener('click', function () {
			if (!btn.classList.contains('active')) {
				console.log(1);
				[...cardTabsBtns].map(b => b.classList.remove('active'))
				btn.classList.add('active')

				document.querySelector('.card-tabs__content.active').classList.remove('active')
				document.getElementById(btn.dataset.id).classList.add('active')
			}
		})
	})
}
function docs(){
	function copyLink(event) {
		event.preventDefault();
		const link = event.target.href;
		navigator.clipboard.writeText(link);
	}
}