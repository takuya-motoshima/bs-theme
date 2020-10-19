import $ from 'jquery';
import 'bootstrap';
import 'bs4-breakpoint-check';
import waitForFinalEvent from '~/utils/waitForFinalEvent';
import config from '~/config/config';

// Initialize Mega Menu
export default function() {

  function closeSubMenu(subMenu){
    const parent = $(subMenu).parent();
    const openChildren = $(`.nav-item.open, .${config.megaMenuSectionClass}.open`, parent);
    subMenu.slideUp({ duration: config.leftSidebarSlideSpeed, complete: event => {
      parent.removeClass('open');
      openChildren.removeClass('open');
      $(event.currentTarget).removeAttr('style');
    }});
  }

  function openSubMenu(subMenu){
    const parent = subMenu.parent();
    // Get the open sub menus
    let openSubMenus = parent.siblings('.open');
    if(parent.hasClass(config.megaMenuSectionClass)) {
      const megaColumn = parent.parent();
      openSubMenus = openSubMenus.add(megaColumn.siblings().find(`.${config.megaMenuSectionClass}.open`));
    }
    // If there are open sub menus close them
    if(openSubMenus) closeSubMenu($(`> .${config.subNavClass}`, openSubMenus));
    subMenu.slideDown({ duration: config.leftSidebarSlideSpeed, complete: event => {
      parent.addClass('open');
      $(event.currentTarget).removeAttr('style');
    }});
  }

  // Sub navigation interaction
  $('.bt-sub-header .nav-link, .bt-sub-header .dropdown-item').on('click', event => {
    const target = $(event.currentTarget);
    const parent = target.parent();
    const openElements = parent.siblings('.open');
    const subNav = target.next(`.${config.subNavClass}`);
    // Check if the event is fired from mobile
    if($.isSm()) {
      if(subNav.length) {
        if(parent.hasClass('open')) {
          closeSubMenu(subNav);
        } else {
          openSubMenu(subNav);
        }
        event.preventDefault();
      }
      // Stop default bootstrap dropdown interaction
      event.stopPropagation();
    } else if (parent.parent().hasClass('navbar-nav')) {
      if (subNav.length) {
        openElements.removeClass('open');
        parent.addClass('open');
        event.preventDefault();
      }
    }
  });

  // Sync tabs when resize between mobile and desktop resolutions
  $(window).on('resize', () => {
    waitForFinalEvent(() => {
      if (!$.isSm()) {
        // Main tabs active state sync
        const tabs = $('.navbar-nav > .nav-item');
        if (tabs.filter('.open').length) return;
        tabs.filter(':first-child').addClass('open');
      }
    }, 100, "sync_tabs");
  });
}
