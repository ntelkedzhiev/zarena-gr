class MenuDrawer extends HTMLElement {
    constructor() {
      super();
  
      this.mainDetailsToggle = this.querySelector('details');
  
      this.addEventListener('keyup', this.onKeyUp.bind(this));
      this.addEventListener('focusout', this.onFocusOut.bind(this));
      this.bindEvents();
    }
  
    bindEvents() {
      this.querySelectorAll('summary').forEach((summary) =>
        summary.addEventListener('click', this.onSummaryClick.bind(this))
      );

      this.querySelectorAll('button:not(.localization-selector)').forEach((button) =>
        button.addEventListener('click', this.onCloseButtonClick.bind(this))
      );
    }
  
    onKeyUp(event) {
      if (event.code.toUpperCase() !== 'ESCAPE') return;
  
      const openDetailsElement = event.target.closest('details[open]');
      if (!openDetailsElement) return;
  
      openDetailsElement === this.mainDetailsToggle
        ? this.closeMenuDrawer(event, this.mainDetailsToggle.querySelector('summary'))
        : this.closeSubmenu(openDetailsElement);
    }
  
    onSummaryClick(event) {
      const summaryElement = event.currentTarget;
      const detailsElement = summaryElement.parentNode;
      const parentMenuElement = detailsElement.closest('.has-submenu');
      const isOpen = detailsElement.hasAttribute('open');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      if (detailsElement === this.mainDetailsToggle) {
        if (isOpen) event.preventDefault();
        isOpen ? this.closeMenuDrawer(event, summaryElement) : this.openMenuDrawer(summaryElement);
  
        if (window.matchMedia('(max-width: 990px)')) {
          document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
        }
      } else {
        setTimeout(() => {
          detailsElement.classList.add('menu-opening');
          summaryElement.setAttribute('aria-expanded', true);
          parentMenuElement && parentMenuElement.classList.add('submenu-open');
          !reducedMotion || reducedMotion.matches
            ? addTrapFocus()
            : summaryElement.nextElementSibling.addEventListener('transitionend', addTrapFocus);
        }, 100);
      }
    }
  
    openMenuDrawer(summaryElement) {
      setTimeout(() => {
        this.mainDetailsToggle.classList.add('menu-opening');
      });
      summaryElement.setAttribute('aria-expanded', true);
      trapFocus(this.mainDetailsToggle, summaryElement);
      document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);

      this.prepareParentDivs();
    }
  
    closeMenuDrawer(event, elementToFocus = false) {
      if (event === undefined) return;

      this.mainDetailsToggle.classList.remove('menu-opening');
      this.mainDetailsToggle.querySelectorAll('details').forEach((details) => {
        // details.removeAttribute('open');
        details.classList.remove('menu-opening');
      });
      this.mainDetailsToggle.querySelectorAll('.submenu-open').forEach((submenu) => {
        submenu.classList.remove('submenu-open');
      });
      document.body.classList.remove(`overflow-hidden-${this.dataset.breakpoint}`);

      removeTrapFocus(elementToFocus);

      this.closeWithoutAnimation(this.mainDetailsToggle);
      // this.closeAnimation(this.mainDetailsToggle);
  
      if (event instanceof KeyboardEvent) elementToFocus?.setAttribute('aria-expanded', false);

      this.resetParentDivs();
    }
  
    onFocusOut(event) {
      setTimeout(() => {
        if (this.mainDetailsToggle.hasAttribute('open') && !this.mainDetailsToggle.contains(document.activeElement))
          this.closeMenuDrawer(event);
      }, 50);
    }
  
    onCloseButtonClick(event) {
      const detailsElement = event.currentTarget.closest('details');
      this.closeSubmenu(detailsElement);
    }
  
    closeSubmenu(detailsElement) {
      const parentMenuElement = detailsElement.closest('.submenu-open');
      parentMenuElement && parentMenuElement.classList.remove('submenu-open');
      detailsElement.classList.remove('menu-opening');
      detailsElement.querySelector('summary').setAttribute('aria-expanded', false);
      removeTrapFocus(detailsElement.querySelector('summary'));


      // this.closeAnimation(detailsElement);
      this.closeWithoutAnimation(detailsElement);
    }

    closeWithoutAnimation(detailsElement) {
      detailsElement.removeAttribute('open');
      if (detailsElement.closest('details[open]')) {
        trapFocus(detailsElement.closest('details[open]'), detailsElement.querySelector('summary'));
      }
    }
  
    closeAnimation(detailsElement) {
      let animationStart;
  
      const handleAnimation = (time) => {
        if (animationStart === undefined) {
          animationStart = time;
        }
  
        const elapsedTime = time - animationStart;
  
        if (elapsedTime < 400) {
          window.requestAnimationFrame(handleAnimation);
        } else {
          detailsElement.removeAttribute('open');
          if (detailsElement.closest('details[open]')) {
            trapFocus(detailsElement.closest('details[open]'), detailsElement.querySelector('summary'));
          }
        }
      };
  
      window.requestAnimationFrame(handleAnimation);
    }

    prepareParentDivs() {
      const body = document.body;
      body.style.overflow = "hidden";

      const parentElement = document.querySelector('#CollectionContainer');
      parentElement.style.pointerEvents = "none";

      const pageContent = document.getElementById('page-content');
      pageContent.style.zIndex = 25;
    }

    resetParentDivs() {
      const body = document.body;
      body.style.overflow = "auto";

      const parentElement = document.querySelector('#CollectionContainer');
      parentElement.style.pointerEvents = "auto";

      const pageContent = document.getElementById('page-content');
      pageContent.style.zIndex = 5;
    }
  }

  customElements.define('menu-drawer', MenuDrawer);

  const trapFocusHandlers = {};
  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
      )
    );
  }

  function addTrapFocus() {
    trapFocus(summaryElement.nextElementSibling, detailsElement.querySelector('button'));
    summaryElement.nextElementSibling.removeEventListener('transitionend', addTrapFocus);
  }

  function removeTrapFocus(elementToFocus = null) {
    document.removeEventListener('focusin', trapFocusHandlers.focusin);
    document.removeEventListener('focusout', trapFocusHandlers.focusout);
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  
    if (elementToFocus) elementToFocus.focus();
  }
  
  function trapFocus(container, elementToFocus = container) {
    var elements = getFocusableElements(container);
    var first = elements[0];
    var last = elements[elements.length - 1];
  
    removeTrapFocus();
  
    trapFocusHandlers.focusin = (event) => {
      if (event.target !== container && event.target !== last && event.target !== first) return;
  
      document.addEventListener('keydown', trapFocusHandlers.keydown);
    };
  
    trapFocusHandlers.focusout = function () {
      document.removeEventListener('keydown', trapFocusHandlers.keydown);
    };
  
    trapFocusHandlers.keydown = function (event) {
      if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
      // On the last focusable element and tab forward, focus the first element.
      if (event.target === last && !event.shiftKey) {
        event.preventDefault();
        first.focus();
      }
  
      //  On the first focusable element and tab backward, focus the last element.
      if ((event.target === container || event.target === first) && event.shiftKey) {
        event.preventDefault();
        last.focus();
      }
    };
  
    document.addEventListener('focusout', trapFocusHandlers.focusout);
    document.addEventListener('focusin', trapFocusHandlers.focusin);
  
    elementToFocus.focus();
  
    if (
      elementToFocus.tagName === 'INPUT' &&
      ['search', 'text', 'email', 'url'].includes(elementToFocus.type) &&
      elementToFocus.value
    ) {
      elementToFocus.setSelectionRange(0, elementToFocus.value.length);
    }
  }
  
