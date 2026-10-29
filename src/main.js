import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/700.css';

import Alpine from 'alpinejs'

window.Alpine = Alpine

Alpine.data('homeSearch', () => ({
  query: '',
  status: '',
  normalize(value) {
    return value
      .normalize('NFKC')
      .replace(/[ي]/g, 'ی')
      .replace(/[ك]/g, 'ک')
      .toLocaleLowerCase('fa')
      .replace(/\s+/g, ' ')
      .trim()
  },
  search() {
    const query = this.normalize(this.query)
    if (!query) {
      this.status = 'عبارت جست‌وجو را وارد کنید.'
      return
    }

    const headingIds = [
      'president-title',
      'important-notices-title',
      'quick-services-title',
      'latest-news-title',
      'events-title',
      'app-download-title',
      'contact-title',
    ]
    const scopes = headingIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map((heading) => heading.closest('article, section') || heading)
    const candidates = scopes.flatMap((scope) =>
      Array.from(scope.querySelectorAll('h2, h3, h4, p, a, button, li, time, span')),
    )
    const match = candidates.find((element) => {
      const content = element.innerText || element.textContent || ''
      return content.trim() && this.normalize(content).includes(query)
    })

    if (!match) {
      this.status = 'در محتوای این صفحه نتیجه‌ای پیدا نشد.'
      return
    }

    match.scrollIntoView({ block: 'center' })
    this.status = `نتیجه پیدا شد: ${(match.innerText || match.textContent || '').trim()}`
  },
}))

const dropdownGroups = {
  services: [
    { label: 'ثبت نام در دوره', href: '/services/#courses' },
    { label: 'رویدادهای ورزشی', href: '/services/' },
    { label: 'خدمات رفاهی و معرفی نامه', href: '/services/' },
    { label: 'تمدید حق عضویت', href: '/services/' },
    { label: 'فرم درخواست شوم روم', href: '/services/' },
  ],
  workgroup: [
    { label: 'آموزش فرهنگی', href: '/workgroup/' },
    { label: 'فنی مهندسی', href: '/workgroup/' },
    { label: 'نشریه', href: '/workgroup/' },
    { label: 'رفاه', href: '/workgroup/' },
    { label: 'ورزش', href: '/workgroup/' },
    { label: 'روابط عمومی', href: '/workgroup/' },
    { label: 'کنترل و تحقیقات راهبردی', href: '/workgroup/' },
  ],
  about: [
    { label: 'مدیران ادوار', href: '/info/' },
    { label: 'موسسین', href: '/info/' },
    { label: 'اساسنامه', href: '/info/' },
  ],
}

const navChevron = '<svg aria-hidden="true" viewBox="0 0 8 6" class="h-3 w-3 shrink-0" fill="none"><path d="m1 1 3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>'

function getMenuLabel(anchor) {
  const textSpan = Array.from(anchor.children).find((child) => child.tagName === 'SPAN' && !child.hasAttribute('aria-hidden'))
  if (textSpan) return textSpan.textContent.trim()
  return Array.from(anchor.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .filter(Boolean)
    .join(' ')
}

function createDropdown(anchor, label, items, id) {
  const wrapper = document.createElement('div')
  wrapper.className = 'relative z-50 flex h-full shrink-0 items-center'
  wrapper.setAttribute('x-data', '{ open: false }')
  wrapper.setAttribute('@mouseenter', 'open = true')
  wrapper.setAttribute('@mouseleave', 'if (window.matchMedia("(hover: hover)").matches) open = false')
  wrapper.setAttribute('@click.outside', 'open = false')
  wrapper.setAttribute('@focusin', 'open = true')
  wrapper.setAttribute('@focusout', 'if (!$el.contains($event.relatedTarget)) open = false')
  wrapper.setAttribute('@keydown.escape.window', 'open = false')
  wrapper.setAttribute('data-nav-dropdown', id)

  const trigger = document.createElement('button')
  trigger.type = 'button'
  trigger.className = `${anchor.className} border-0 bg-transparent p-0 font-[inherit] text-inherit`.trim()
  trigger.style.appearance = 'none'
  trigger.style.cursor = 'pointer'
  trigger.setAttribute('aria-haspopup', 'menu')
  trigger.setAttribute('aria-expanded', 'false')
  trigger.setAttribute(':aria-expanded', 'open.toString()')
  trigger.setAttribute('aria-controls', `${id}-menu`)
  trigger.setAttribute('@click.stop', 'open = window.matchMedia("(hover: hover)").matches ? true : !open')
  if (anchor.hasAttribute('aria-current')) trigger.setAttribute('aria-current', anchor.getAttribute('aria-current'))

  const labelNode = document.createElement('span')
  labelNode.textContent = label
  trigger.append(labelNode)
  trigger.insertAdjacentHTML('beforeend', navChevron)

  const activeIndicator = anchor.querySelector(':scope > span[aria-hidden="true"]')
  if (activeIndicator) trigger.append(activeIndicator.cloneNode(true))
  wrapper.append(trigger)

  const panel = document.createElement('div')
  panel.id = `${id}-menu`
  panel.setAttribute('x-show', 'open')
  panel.setAttribute('role', 'menu')
  panel.className = 'absolute right-0 top-full z-[80] flex w-[15rem] max-w-[88vw] flex-col gap-0.5 rounded-[12px] border border-[#e5edf4] bg-white p-1.5 shadow-[0_10px_24px_rgba(41,52,112,0.15)]'

  items.forEach((item) => {
    const link = document.createElement('a')
    link.href = item.href
    link.setAttribute('role', 'menuitem')
    link.setAttribute('@click', 'open = false')
    link.className = 'flex w-full items-center rounded-[8px] px-2.5 py-1.5 text-right text-[11px] font-medium leading-5 text-[#344f73] transition-colors hover:bg-[#f5f8fc] hover:text-[#f78c32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f78c32]/40'

    const itemLabel = document.createElement('span')
    itemLabel.textContent = item.label
    link.append(itemLabel)
    panel.append(link)
  })

  wrapper.append(panel)
  const updatePanelPosition = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      const bounds = trigger.getBoundingClientRect()
      panel.style.position = 'fixed'
      panel.style.top = `${Math.round(bounds.bottom)}px`
      panel.style.right = '8px'
      panel.style.left = 'auto'
    } else {
      panel.style.position = ''
      panel.style.top = ''
      panel.style.right = ''
      panel.style.left = ''
    }
  }
  wrapper.addEventListener('mouseenter', updatePanelPosition)
  trigger.addEventListener('click', updatePanelPosition)
  window.addEventListener('resize', updatePanelPosition)
  anchor.closest('nav')?.addEventListener('scroll', updatePanelPosition, { passive: true })
  anchor.replaceWith(wrapper)
  return wrapper
}

function configureMobileNavigation(nav) {
  const mobileViewport = window.matchMedia('(max-width: 767px)')
  const update = () => {
    if (mobileViewport.matches) {
      nav.style.overflowX = 'auto'
      nav.style.justifyContent = 'flex-start'
      nav.style.gap = '8px'
      nav.style.scrollbarWidth = 'none'
      nav.style.webkitOverflowScrolling = 'touch'
      nav.style.overscrollBehaviorX = 'contain'
    } else {
      nav.style.overflowX = ''
      nav.style.justifyContent = ''
      nav.style.gap = ''
      nav.style.scrollbarWidth = ''
      nav.style.webkitOverflowScrolling = ''
      nav.style.overscrollBehaviorX = ''
    }
  }
  update()
  mobileViewport.addEventListener('change', update)
}

function initializeNavigationDropdowns() {
  document.querySelectorAll('nav[aria-label="ناوبری اصلی"]').forEach((nav, index) => {
    if (nav.querySelector('[data-nav-dropdown]')) return

    configureMobileNavigation(nav)
    const directLinks = Array.from(nav.querySelectorAll(':scope > a'))
    const servicesLink = directLinks.find((link) => link.getAttribute('href') === '/services/')
    const workgroupLink = directLinks.find((link) => link.getAttribute('href') === '/workgroup/')
    const getNormalizedLabel = (link) => getMenuLabel(link).replace(/\s+/g, ' ').trim()
    const isAboutLink = (link) =>
      link.getAttribute('href') === '/info/' || ['درباره کانون', 'درباره ما'].includes(getNormalizedLabel(link))
    const isContactLink = (link) =>
      link.getAttribute('href') === '/contact/' || getNormalizedLabel(link) === 'ارتباط با ما'
    const aboutLinks = directLinks.filter(isAboutLink)
    const contactLinks = directLinks.filter(isContactLink)
    let aboutLink = aboutLinks[0] || contactLinks[0]

    for (const link of new Set([...aboutLinks, ...contactLinks])) {
      if (link !== aboutLink) link.remove()
    }

    if (!aboutLink && workgroupLink) {
      aboutLink = workgroupLink.cloneNode(true)
      nav.insertBefore(aboutLink, workgroupLink.nextElementSibling)
    }

    if (aboutLink && workgroupLink && workgroupLink.nextElementSibling !== aboutLink) {
      nav.insertBefore(aboutLink, workgroupLink.nextElementSibling)
    }

    if (aboutLink) {
      aboutLink.href = '/info/'
      aboutLink.className = 'relative flex h-full shrink-0 items-center gap-[clamp(4px,0.79365vw,10px)] whitespace-nowrap px-[clamp(6px,0.79365vw,10px)] hover:text-orange-500'
      aboutLink.removeAttribute('aria-current')
      const label = document.createElement('span')
      label.textContent = 'درباره کانون'
      aboutLink.replaceChildren(label)

      if (window.location.pathname.replace(/\/+$/, '') === '/info') {
        aboutLink.setAttribute('aria-current', 'page')
        aboutLink.classList.add('text-[#3871ae]')
        const indicator = document.createElement('span')
        indicator.setAttribute('aria-hidden', 'true')
        indicator.className = 'absolute bottom-0 left-0 h-[3px] w-[clamp(76px,7.0635vw,89px)] bg-[#ff7400]'
        aboutLink.append(indicator)
      }
    }

    if (servicesLink) createDropdown(servicesLink, getMenuLabel(servicesLink), dropdownGroups.services, `services-menu-${index}`)
    if (workgroupLink) createDropdown(workgroupLink, getMenuLabel(workgroupLink), dropdownGroups.workgroup, `workgroup-menu-${index}`)
    if (aboutLink) {
      createDropdown(aboutLink, 'درباره کانون', dropdownGroups.about, `about-menu-${index}`)
    }
  })
}

initializeNavigationDropdowns()

Alpine.start()
