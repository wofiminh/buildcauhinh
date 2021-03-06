import axios from 'axios'
import Choices from './vendor/choices'

import HardwareList from './hardware_list'
import Build from './build'
import Commentation from './commentation'
import Util from './util'
import Turbolinks from 'turbolinks'

Turbolinks.start()

window.HardwareList = HardwareList
window.Build = Build
window.Commentation = Commentation
window.isFetching = false
let choices = null

axios.defaults.headers.common['X-CSRF-Token'] = document.querySelector('meta[name=csrf-token]').getAttribute('content')

class Buildcauhinh {
  static toggleDropdown () {
    const $menu = document.querySelector('.menu')
    const $body = document.querySelector('body')
    const $nav = document.querySelector('.nav-dropdown')

    if ($menu) {
      $menu.addEventListener('click', (e) => {
        $nav.classList.toggle('open')
        $body.classList.toggle('nav-dropdown-open')
        e.stopPropagation()
      })
      document.addEventListener('click', (e) => {
        if ($body.classList.contains('nav-dropdown-open')) {
          $nav.classList.remove('open')
          $body.classList.remove('nav-dropdown-open')
        }
      })
    }
  }

  static search () {
    if (window.isFetching) return
    const word = document.querySelector('.hardware-search-input .input-search').value
    if (!word) return
    window.isFetching = true
    Util.displaySpinner()
    const providers = choices.getValue()
    axios.post('/search', { providers: providers, word: word })
      .then(response => {
        Util.removeSpinner()
        if (!response.data.html) return
        document.querySelector('.main-content').innerHTML = response.data.html
        window.isFetching = false
      })
      .catch(() => {
        window.isFetching = false
        Util.removeSpinner()
        Util.alertServerError()
      })
  }

  static fadeOutFlash () {
    const flash = document.querySelector('.flash')
    if (flash) {
      setTimeout(() => {
        flash.classList.remove('flash-fade-out')
        setTimeout(() => flash.remove(), 400)
      }, 3000)
    }
  }

  static loadMoreHardwares (target) {
    Util.displayLoadMoreSpinner()
    const nextInfo = JSON.parse(target.getAttribute('data-json'))
    axios.get('/', { params: { max_id: nextInfo.max_id, part: nextInfo.part || null } })
      .then(response => {
        Util.removeLoadMoreSpinner()
        document.querySelector('.hardwares').insertAdjacentHTML('beforeend', response.data.html)
        if (response.data.next_info.has_next) {
          target.setAttribute('data-json', JSON.stringify(response.data.next_info))
        } else {
          target.remove()
        }
      })
      .catch(() => {
        Util.removeLoadMoreSpinner()
        Util.alertServerError()
      })
  }

  static loadMoreBuilds (target) {
    Util.displayLoadMoreSpinner()
    const nextInfo = JSON.parse(target.getAttribute('data-json'))
    axios.get('/builds', { params: { max_id: nextInfo.max_id } })
      .then(response => {
        Util.removeLoadMoreSpinner()
        document.querySelector('.build-items').insertAdjacentHTML('beforeend', response.data.html)
        if (response.data.next_info.has_next) {
          target.setAttribute('data-json', JSON.stringify(response.data.next_info))
        } else {
          target.remove()
        }
      })
      .catch(() => {
        Util.removeLoadMoreSpinner()
        Util.alertServerError()
      })
  }

  static loadMoreUserBuilds (target) {
    Util.displayLoadMoreSpinner()
    const nextInfo = JSON.parse(target.getAttribute('data-json'))
    const username = target.getAttribute('data-username')
    axios.get(`/${username}`, { params: { max_id: nextInfo.max_id } })
      .then(response => {
        Util.removeLoadMoreSpinner()
        document.querySelector('.build-items').insertAdjacentHTML('beforeend', response.data.html)
        if (response.data.next_info.has_next) {
          target.setAttribute('data-json', JSON.stringify(response.data.next_info))
        } else {
          target.remove()
        }
      })
      .catch(() => {
        Util.removeLoadMoreSpinner()
        Util.alertServerError()
      })
  }
}

window.Buildcauhinh = Buildcauhinh

document.addEventListener('turbolinks:load', () => {
  Buildcauhinh.toggleDropdown()
  Buildcauhinh.fadeOutFlash()
  choices = new Choices('.choices', {
    removeItemButton: true,
    searchEnabled: false,
    placeholderValue: 'Chọn cửa hàng',
    itemSelectText: '',
    noChoicesText: 'Hết cửa hàng để chọn'
  })
})
