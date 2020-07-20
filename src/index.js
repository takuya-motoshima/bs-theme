import '~/sass/index.scss';
import $ from 'jquery';
import 'bootstrap';
import 'bs4-breakpoint-check';
import 'jquery-touchswipe';
import config from '~/config/config';
import initScroller from '~/utils/initScroller';
import updateScroller from '~/utils/updateScroller';
import destroyScroller from '~/utils/destroyScroller';
import waitForFinalEvent from '~/utils/waitForFinalEvent';
import initScrollTopButton from '~/utils/initScrollTopButton';
import color from '~/utils/color';
import AlertDialog from '~/components/AlertDialog';
import ConfirmDialog from '~/components/ConfirmDialog';
import Validator from '~/components/Validator';
import DataTable from '~/components/DataTable';
import Clipboard from '~/components/Clipboard';
import Api from '~/utils/Api';

// Core private functions
function leftSidebarInit() {
  const firstAnchor = $('.sidebar-elements > li > a', leftSidebar);
  var anchor = $('.sidebar-elements li a', leftSidebar);
  var lsc = $('.left-sidebar-scroll', leftSidebar);
  var lsToggle = $('.left-sidebar-toggle', leftSidebar);
  var openLeftSidebarOnClick = config.openLeftSidebarOnClick ? true : false;

  // Collapsible sidebar toggle functionality
  function toggleSideBar() {
    $('.bt-toggle-left-sidebar').on('click', () => {
      if (wrapper.hasClass(config.collapsibleSidebarCollapsedClass)) {
        wrapper.removeClass(config.collapsibleSidebarCollapsedClass);
        $('li.open', leftSidebar).removeClass('open');
        $('li.active', leftSidebar).parents('.parent').addClass('active open');
        leftSidebar.trigger('shown.left-sidebar.collapse');
        if (typeof ps_scroller_left_sidebar === 'undefined' || !ps_scroller_left_sidebar || !ps_scroller_left_sidebar.nodeName) {
          ps_scroller_left_sidebar = initScroller($('.bt-scroller', leftSidebar));
        }
        destroyScroller(ps_scroller_left_sidebar);
        // Destroy Perfect Scrollbar collapsed instance
        if (typeof ps_sub_menu_scroller !== 'undefined') {
          destroyScroller(ps_sub_menu_scroller);
        }
      } else {
        wrapper.addClass(config.collapsibleSidebarCollapsedClass);
        $('li.active', leftSidebar).parents('.parent').removeClass('open');
        $('li.open', leftSidebar).removeClass('open');
        leftSidebar.trigger('hidden.left-sidebar.collapse');
      }
    });
  }

  // Tooltip sidebar funcionality
  function tooltipSidebar() {
    const menu = $('.sidebar-elements > li > a', leftSidebar);
    for (let i = 0; i <= menu.length; i++) {
      const self = menu[i];
      var title = $('> span', self).text();
      $(self).attr({
        'data-toggle': 'tooltip',
        'data-placement': 'right',
        'title': title
      });
      $(self).tooltip({ trigger: 'manual' });
    }
    menu.on('mouseenter', event => {
      if (!$.isSm() && wrapper.hasClass(config.collapsibleSidebarCollapsedClass)) {
        $(event.currentTarget).tooltip('show');
      }
    });
    menu.on('mouseleave', event => {
      $(event.currentTarget).tooltip('hide');
    });
  }
  // Collapsed sidebar submenu title
  function syncSubMenu(item) {
    let elements;
    if (typeof item !== 'undefined') {
      elements = item;
    } else {
      elements = $('.sidebar-elements > li', leftSidebar);
    }
    $.each(elements, (_, element) => {
      var title = $(element).find('> a span').html();
      var ul = $(element).find('> ul');
      var subEls = $('> li', ul);
      title = $('<li class="title">' + title + '</li>');
      var subContainer = $('<li class="nav-items"><div class="bt-scroller"><div class="content"><ul></ul></div></div></li>');
      if (!ul.find('> li.title').length) {
        ul.prepend(title);
        subEls.appendTo(subContainer.find('.content ul'));
        subContainer.appendTo(ul);
      }
    });
  }

  // Return boolean whether the sidebar is collapsed or not
  function isCollapsed() {
    return wrapper.hasClass(config.collapsibleSidebarCollapsedClass);
  }
  
  // Return true if the collapsible left sidebar is enabled
  function isCollapsible() {
    return wrapper.hasClass(config.collapsibleSidebarClass);
  }
  
  // Close submenu function
  function closeSubMenu(subMenu, event) {
    var target = $(event.currentTarget);
    var li = $(subMenu).parent();
    var openChildren = $('li.open', li);
    var clickOutside = !target.closest(leftSidebar).length;
    var slideSpeed = config.leftSidebarSlideSpeed;
    var isFirstLevel = target.parents().eq(1).hasClass('sidebar-elements');
    // If left sidebar is collapsed, is not small device
    // and the trigger element is first level
    // or click outside the left sidebar
    if (!$.isSm() && isCollapsed() && (isFirstLevel || clickOutside)) {
      li.removeClass('open');
      subMenu.removeClass('visible');
      openChildren.removeClass('open').removeAttr('style');
    } else { // If not execute classic slide interaction
      subMenu.slideUp({
        duration: slideSpeed,
        complete: () => {
          li.removeClass('open');
          subMenu.removeAttr('style');
          // Close opened child submenus
          openChildren.removeClass('open').removeAttr('style');
          if (wrapper.hasClass('bt-fixed-sidebar') && !$.isSm()) {
            updateScroller(ps_left_sidebar);
          }
        }
      });
    }
  }

  // Open submenu function
  function openSubMenu(anchor, event) {
    var _el = $(anchor);
    var li = $(_el).parent();
    var subMenu = $(_el).next();
    var slideSpeed = config.leftSidebarSlideSpeed;
    var isFirstLevel = $(event.currentTarget).parents().eq(1).hasClass('sidebar-elements');
    // Get the open sub menus
    var openSubMenus = li.siblings('.open');
    // If there are open sub menus close them
    if (openSubMenus) {
      closeSubMenu($('> ul', openSubMenus), event);
    }
    // If left sidebar is collapsed, is not small device
    // and the trigger element is first level
    if (!$.isSm() && isCollapsed() && isFirstLevel) {
      li.addClass('open');
      subMenu.addClass('visible');
      // Renew Perfect Scroller instance
      if (typeof ps_sub_menu_scroller !== 'undefined') {
        destroyScroller(ps_sub_menu_scroller);
      }
      if (typeof ps_sub_menu_scroller === 'undefined' || !ps_sub_menu_scroller || !ps_sub_menu_scroller.nodeName) {
        ps_sub_menu_scroller = initScroller(li.find('.bt-scroller'));
      }
      $(window).on('resize', () => {
        waitForFinalEvent(function () {
          if (!$.isXs()) {
            if (typeof ps_sub_menu_scroller !== 'undefined') {
              updateScroller(ps_sub_menu_scroller);
            }
          }
        }, 500, 'am_check_phone_classes');
      });
    } else { // If not execute classic slide interaction
      subMenu.slideDown({
        duration: slideSpeed,
        complete: () => {
          li.addClass('open');
          subMenu.removeAttr('style');
          if (wrapper.hasClass('bt-fixed-sidebar') && !$.isSm()) {
            updateScroller(ps_left_sidebar);
          }
        }
      });
    }
  }
  
  // Execute if collapsible sidebar is enabled
  if (isCollapsible()) {
    // Create sub menu elements
    syncSubMenu();
    toggleSideBar();
    tooltipSidebar();
    if (!openLeftSidebarOnClick) {
      // Open sub-menu on hover
      firstAnchor.on('mouseover', event => {
        if (isCollapsed()) {
          openSubMenu(event.currentTarget, event);
        }
      });
      // Open sub-menu on click (fix for touch devices)
      firstAnchor.on('touchstart', event => {
        var anchor = $(event.currentTarget);
        var li = anchor.parent();
        var subMenu = anchor.next();
        if (isCollapsed() && !$.isSm()) {
          if (li.hasClass('open')) {
            closeSubMenu(subMenu, event);
          } else {
            openSubMenu(event.currentTarget, event);
          }
          if ($(event.currentTarget).next().is('ul')) {
            event.preventDefault();
          }
        }
      });
      // Sub-menu delay on mouse leave
      firstAnchor.on('mouseleave', event => {
        const self = $(event.currentTarget);
        var _li = self.parent();
        var subMenu = _li.find('> ul');
        if (!$.isSm() && isCollapsed()) {
          // If mouse is over sub menu attach an additional mouseleave event to submenu
          if (subMenu.length > 0) {
            setTimeout(() => {
              if (subMenu.is(':hover')) {
                subMenu.on('mouseleave', () => {
                  setTimeout(() => {
                    if (!self.is(':hover')) {
                      closeSubMenu(subMenu, event);
                      subMenu.off('mouseleave');
                    }
                  }, 300);
                });
              } else {
                closeSubMenu(subMenu, event);
              }
            }, 300);
          } else {
            _li.removeClass('open');
          }
        }
      });
    }
    
    // Close sidebar on click outside
    $(document).on('mousedown touchstart', event => {
      if (!$(event.target).closest(leftSidebar).length && !$.isSm()) {
        closeSubMenu($('ul.visible', leftSidebar), event);
      }
    });
  }

  // Open sub-menu functionality
  anchor.on('click', event => {
    var $el = $(event.currentTarget);
    // Get the open menus
    if ($el.parent().hasClass('open')) closeSubMenu($el.next(), event);
    else openSubMenu(event.currentTarget, event);
    // If current element has children stop link action
    if ($el.next().is('ul')) event.preventDefault();
  });
  
  // Calculate sidebar tree active & open classes
  if (wrapper.hasClass(config.collapsibleSidebarCollapsedClass)) {
    $('li.active', leftSidebar).parents('.parent').addClass('active');
  } else {
    $('li.active', leftSidebar).parents('.parent').addClass('active open');
  }
  
  // Add classes if top menu is present
  if (topNavbar.find('.container-fluid > .navbar-collapse').length && leftSidebar.length) {
    wrapper.addClass(config.offCanvasLeftSidebarClass).addClass(config.offCanvasLeftSidebarMobileClass);
    wrapper.addClass(config.topHeaderMenuClass);
    leftSidebarToggle = $('<a class="nav-link bt-toggle-left-sidebar" href="#"><span class="icon mdi mdi-menu"></span></a>');
    $('.bt-navbar-header', topNavbar).prepend(leftSidebarToggle);
  }

  // Scrollbar plugin init when left sidebar is fixed
  if (wrapper.hasClass('bt-fixed-sidebar')) {
    if (!$.isSm() || wrapper.hasClass(config.offCanvasLeftSidebarClass)) {
      if (typeof ps_left_sidebar === 'undefined' || !ps_left_sidebar || !ps_left_sidebar.nodeName) {
        ps_left_sidebar = initScroller(lsc);
      }
    }
    // Update scrollbar height on window resize
    $(window).on('resize', () => {
      waitForFinalEvent(() => {
        if ($.isSm() && !wrapper.hasClass(config.offCanvasLeftSidebarClass)) {
          destroyScroller(ps_left_sidebar);
        } else {
          if (lsc.hasClass('ps')) {
            updateScroller(ps_left_sidebar);
          } else {
            if (typeof ps_left_sidebar === 'undefined' || !ps_left_sidebar || !ps_left_sidebar.nodeName) {
              ps_left_sidebar = initScroller(lsc);
            }
          }
        }
      }, 500, 'be_update_scroller');
    });
  }

  // Toggle sidebar on small devices
  lsToggle.on('click', event => {
    var spacer = $(event.currentTarget).next('.left-sidebar-spacer');
    var toggleBtn = $(event.currentTarget);
    toggleBtn.toggleClass('open');
    spacer.slideToggle(config.leftSidebarToggleSpeed, () => {
      spacer.removeAttr('style').toggleClass('open');
    });
    event.preventDefault();
  });

  // Off canvas menu
  function leftSidebarOffCanvas() {
    // Open Sidebar with toggle button
    leftSidebarToggle.on('click', event => {
      if (openSidebar && body.hasClass(config.openLeftSidebarClass)) {
        body.removeClass(config.openLeftSidebarClass);
        sidebarDelay();
      } else {
        body.addClass(config.openLeftSidebarClass + ' ' + config.transitionClass);
        openSidebar = true;
      }
      event.preventDefault();
    });

    // Close sidebar on click outside
    $(document).on('mousedown touchstart', event => {
      if (!$(event.target).closest(leftSidebar).length && !$(event.target).closest(leftSidebarToggle).length && body.hasClass(config.openLeftSidebarClass)) {
        body.removeClass(config.openLeftSidebarClass);
        sidebarDelay();
      }
    });
  }
  // Left sidebar off-canvas
  if (wrapper.hasClass(config.offCanvasLeftSidebarClass)) {
    leftSidebarOffCanvas();
  }
}

function rightSidebarInit() {
  var rsScrollbar = $('.bt-scroller', rightSidebar);
  var rsChatScrollbar = $('.bt-scroller-chat', rightSidebar);
  var rsTodoScrollbar = $('.bt-scroller-todo', rightSidebar);
  var rsSettingsScrollbar = $('.bt-scroller-settings', rightSidebar);

  function oSidebar() {
    body.addClass(config.openRightSidebarClass + ' ' + config.transitionClass);
    openSidebar = true;
  }

  function cSidebar() {
    body.removeClass(config.openRightSidebarClass).addClass(config.transitionClass);
    sidebarDelay();
  }
  if (rightSidebar.length > 0) {
    
    // Open-Sidebar when click on topbar button
    $('.bt-toggle-right-sidebar').on('click', event => {
      if (openSidebar && body.hasClass(config.openRightSidebarClass)) {
        cSidebar();
      } else if (!openSidebar) {
        oSidebar();
      }
      event.preventDefault();
    });

    // Close sidebar on click outside
    $(document).on('mousedown touchstart', event => {
      if (!$(event.target).closest(rightSidebar).length && body.hasClass(config.openRightSidebarClass) && (config.closeRsOnClickOutside || $.isSm())) {
        cSidebar();
      }
    });
  }
  if ((typeof ps_chat_scroll === 'undefined' || !ps_chat_scroll || !ps_chat_scroll.nodeName) && rsChatScrollbar.length) {
    ps_chat_scroll = initScroller(rsChatScrollbar);
  }
  if ((typeof ps_todo_scroll === 'undefined' || !ps_todo_scroll || !ps_todo_scroll.nodeName) && rsTodoScrollbar.length) {
    ps_todo_scroll = initScroller(rsTodoScrollbar);
  }
  if ((typeof ps_settings_scroll === 'undefined' || !ps_settings_scroll || !ps_settings_scroll.nodeName) && rsSettingsScrollbar.length) {
    ps_settings_scroll = initScroller(rsSettingsScrollbar);
  }
  
  // Update scrollbar height on window resize
  $(window).on('resize', () => {
    waitForFinalEvent(() => {
      updateScroller(ps_chat_scroll);
      updateScroller(ps_todo_scroll);
      updateScroller(ps_settings_scroll);
    }, 500, 'be_rs_update_scroller');
  });

  // Update scrollbar when click on a tab
  $('a[data-toggle="tab"]', rightSidebar).on('shown.bs.tab', () => {
    updateScroller(ps_chat_scroll);
    updateScroller(ps_todo_scroll);
    updateScroller(ps_settings_scroll);
  });
}

function sidebarDelay() {
  openSidebar = true;
  setTimeout(() => {
    openSidebar = false;
  }, config.openSidebarDelay);
}

function sidebarSwipe() {
  // Open sidedar on swipe
  wrapper.swipe({
    allowPageScroll: 'vertical',
    preventDefaultEvents: false,
    fallbackToMouseEvents: false,
    swipeLeft: function (e) {
      if (!openSidebar && rightSidebar.length > 0) {
        body.addClass(config.openRightSidebarClass + ' ' + config.transitionClass);
        openSidebar = true;
      }
    },
    threshold: config.swipeTreshold
  });
}

function chatWidget() {
  var chat = $('.bt-right-sidebar .tab-chat');
  var contactsEl = $('.chat-contacts', chat);
  var conversationEl = $('.chat-window', chat);
  var messagesContainer = $('.chat-messages', conversationEl);
  var messagesList = $('.content ul', messagesContainer);
  var messagesScroll = $('.bt-scroller-messages', messagesContainer);
  var chatInputContainer = $('.chat-input', conversationEl);
  var chatInput = $('input', chatInputContainer);
  var chatInputSendButton = $('.send-msg', chatInputContainer);

  function openChatWindow() {
    if (!chat.hasClass('chat-opened')) {
      chat.addClass('chat-opened');
      if (typeof ps_messages_scroll === 'undefined' || !ps_messages_scroll || !ps_messages_scroll.nodeName) {
        ps_messages_scroll = initScroller(messagesScroll);
      }
    }
  }

  function closeChatWindow() {
    if (chat.hasClass('chat-opened')) {
      chat.removeClass('chat-opened');
    }
  }

  // Open Conversation Window when click on chat user
  $('.user a', contactsEl).on('click', event => {
    openChatWindow();
    event.preventDefault();
  });

  // Close chat conv window
  $('.title .return', conversationEl).on('click', () => {
    closeChatWindow();
    initNotificationsScroller();
  });
  
  // Send message
  function sendMsg(msg, self) {
    var $message = $('<li class="' + ((self) ? 'self' : 'friend') + '"></li>');
    if (msg != '') {
      $('<div class="msg">' + msg + '</div>').appendTo($message);
      $message.appendTo(messagesList);
      messagesScroll.stop().animate({
        'scrollTop': messagesScroll.prop('scrollHeight')
      }, 900, 'swing');
      updateScroller(ps_messages_scroll);
    }
  }

  // Send msg when click on 'send' button or press 'Enter'
  chatInput.on('keypress', event => {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    var msg = $(event.currentTarget).val();
    if (keycode == '13') {
      sendMsg(msg, true);
      $(event.currentTarget).val('');
    }
    event.stopPropagation();
  });
  chatInputSendButton.on('click', () => {
    var msg = chatInput.val();
    sendMsg(msg, true);
    chatInput.val('');
  });
}

function initNotificationsScroller() {
  if (typeof ps_scroller_notifications === 'undefined' || !ps_scroller_notifications || !ps_scroller_notifications.nodeName) {
    ps_scroller_notifications = initScroller(notifications);
  }
}

function initAsidePS() {
  const pas = asideScroller;
  ps_aside_scroll = initScroller(asideScroller);
  $(window).on('resize', () => {
    if ($.isSm() && !wrapper.hasClass(config.offCanvasLeftSidebarClass)) {
      destroyScroller(ps_aside_scroll);
    } else {
      if (pas.hasClass('ps')) {
        updateScroller(ps_aside_scroll);
      } else if (typeof ps_aside_scroll === 'undefined' || !ps_aside_scroll || !ps_aside_scroll.nodeName) {
        ps_aside_scroll = initScroller(asideScroller);
      }
    }
  });
}

// Get the main elements when document is ready
const body = $('body');
const wrapper = $('.bt-wrapper');
const topNavbar = $('.bt-top-header', wrapper);
const leftSidebar = $('.bt-left-sidebar', wrapper);
const rightSidebar = $('.bt-right-sidebar', wrapper);
const aside = $('.page-aside', wrapper);
const asideScroller = $('.bt-scroller-aside', wrapper);
const leftSidebarToggle = $('.bt-toggle-left-sidebar', topNavbar);
const notifications = $('.bt-scroller-notifications', topNavbar);
let openSidebar = false;

// Perfect scrollbar variables
let ps_scroller_notifications;
let ps_left_sidebar;
let ps_scroller_left_sidebar;
let ps_sub_menu_scroller;
let ps_chat_scroll;
let ps_todo_scroll;
let ps_settings_scroll;
let ps_messages_scroll;
let ps_aside_scroll;
const scroller = {
  be_scroller_notifications: ps_scroller_notifications,
  left_sidebar_scroll: ps_left_sidebar,
  be_left_sidebar_scroll: ps_scroller_left_sidebar,
  sub_menu_scroll: ps_sub_menu_scroller,
  chat_scroll: ps_chat_scroll,
  todo_scroll: ps_todo_scroll,
  settings_scroll: ps_settings_scroll,
  messages_scroll: ps_messages_scroll,
  aside_scroll: ps_aside_scroll,
  updateScroller: updateScroller,
  destroyScroller: destroyScroller,
  initScroller: initScroller
};

function init() {

  console.log('Initialize the theme');

  // Left Sidebar
  if (config.enableLeftSidebar) leftSidebarInit();
  else wrapper.addClass(config.disabledLeftSidebarClass);

  // Right Sidebar
  if (rightSidebar.length) {
    rightSidebarInit();
    chatWidget();
  }

  // Sidebars Swipe
  if (config.enableSwipe) sidebarSwipe();

  // Scroll Top button
  if (config.scrollTop) initScrollTopButton();

  // Page Aside
  if (asideScroller.length) initAsidePS();

  // Scroller plugin init
  if (notifications.length) initNotificationsScroller();

  // Bind plugins on hidden elements
  // Dropdown shown event
  $('.bt-icons-nav .dropdown').on('shown.bs.dropdown', () => updateScroller(ps_scroller_notifications));

  // Tooltips
  $('[data-toggle="tooltip"]').tooltip();

  // Popover
  $('[data-toggle="popover"]').popover();

  // Bootstrap modal scroll top fix
  $('.modal').on('show.bs.modal', () => $('html').addClass('bt-modal-open'));
  $('.modal').on('hidden.bs.modal', () => $('html').removeClass('bt-modal-open'));

  // Fixes the Sweetalert gap in the top header on boxed layout
  if (typeof Swal == 'function' && wrapper.hasClass('bt-boxed-layout')) {
    var observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type !== 'attributes' || mutation.attributeName !== 'style') return;
        if (document.body.className.indexOf('swal2-shown') > 0) topNavbar.css({ marginLeft: 'calc(-' + document.body.style.paddingRight + ' / 2)' });
        else topNavbar.css({ marginLeft: '0' });
      });
    });
    observer.observe(document.body, { attributes: true });
  }

  // Wrapper element position
  if (topNavbar.length && topNavbar.hasClass('fixed-top') && wrapper.length) {
    function layoutWrapper() {
      if (!topNavbar.length || !topNavbar.hasClass('fixed-top') || !wrapper.length) return;
      const navHeight = topNavbar.outerHeight();
      console.log('navHeight=', navHeight);
      wrapper.css('padding-top', `${navHeight}px`);
      if (aside.length) aside.css({ 'margin-top': `${navHeight}px`, 'padding-bottom': `${navHeight}px` });
    }
    $(window).on('resize', () => layoutWrapper());
    layoutWrapper();
  }
  console.log('Completed theme initialization');
}

export {
  $,
  init,
  color,
  scroller,
  AlertDialog,
  ConfirmDialog,
  Validator,
  DataTable,
  Clipboard,
  Api
}