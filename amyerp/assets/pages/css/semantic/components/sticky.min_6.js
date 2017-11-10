/*!
 * # Semantic UI 2.2.6 - Sticky
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
!function(e,t,o,n){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.sticky=function(i){var s,r=e(this),c=r.selector||"",l=(new Date).getTime(),a=[],f=arguments[0],m="string"==typeof f,u=[].slice.call(arguments,1);return r.each(function(){var r,d,h,g,p,b=e.isPlainObject(i)?e.extend(!0,{},e.fn.sticky.settings,i):e.extend({},e.fn.sticky.settings),v=b.className,x=b.namespace,C=b.error,S="."+x,y="module-"+x,k=e(this),T=e(t),w=e(b.scrollContext),z=(k.selector||"",k.data(y)),B=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)},P=this;p={initialize:function(){p.determineContainer(),p.determineContext(),p.verbose("Initializing sticky",b,r),p.save.positions(),p.checkErrors(),p.bind.events(),b.observeChanges&&p.observeChanges(),p.instantiate()},instantiate:function(){p.verbose("Storing instance of module",p),z=p,k.data(y,p)},destroy:function(){p.verbose("Destroying previous instance"),p.reset(),h&&h.disconnect(),g&&g.disconnect(),T.off("load"+S,p.event.load).off("resize"+S,p.event.resize),w.off("scrollchange"+S,p.event.scrollchange),k.removeData(y)},observeChanges:function(){"MutationObserver"in t&&(h=new MutationObserver(p.event.documentChanged),g=new MutationObserver(p.event.changed),h.observe(o,{childList:!0,subtree:!0}),g.observe(P,{childList:!0,subtree:!0}),g.observe(d[0],{childList:!0,subtree:!0}),p.debug("Setting up mutation observer",g))},determineContainer:function(){r=b.container?e(b.container):k.offsetParent()},determineContext:function(){if(d=b.context?e(b.context):r,0===d.length)return void p.error(C.invalidContext,b.context,k)},checkErrors:function(){if(p.is.hidden()&&p.error(C.visible,k),p.cache.element.height>p.cache.context.height)return p.reset(),void p.error(C.elementSize,k)},bind:{events:function(){T.on("load"+S,p.event.load).on("resize"+S,p.event.resize),w.off("scroll"+S).on("scroll"+S,p.event.scroll).on("scrollchange"+S,p.event.scrollchange)}},event:{changed:function(e){clearTimeout(p.timer),p.timer=setTimeout(function(){p.verbose("DOM tree modified, updating sticky menu",e),p.refresh()},100)},documentChanged:function(t){[].forEach.call(t,function(t){t.removedNodes&&[].forEach.call(t.removedNodes,function(t){(t==P||e(t).find(P).length>0)&&(p.debug("Element removed from DOM, tearing down events"),p.destroy())})})},load:function(){p.verbose("Page contents finished loading"),B(p.refresh)},resize:function(){p.verbose("Window resized"),B(p.refresh)},scroll:function(){B(function(){w.triggerHandler("scrollchange"+S,w.scrollTop())})},scrollchange:function(e,t){p.stick(t),b.onScroll.call(P)}},refresh:function(e){p.reset(),b.context||p.determineContext(),e&&p.determineContainer(),p.save.positions(),p.stick(),b.onReposition.call(P)},supports:{sticky:function(){var t=e("<div/>");t[0];return t.addClass(v.supported),t.css("position").match("sticky")}},save:{lastScroll:function(e){p.lastScroll=e},elementScroll:function(e){p.elementScroll=e},positions:function(){var e={height:w.height()},t={margin:{top:parseInt(k.css("margin-top"),10),bottom:parseInt(k.css("margin-bottom"),10)},offset:k.offset(),width:k.outerWidth(),height:k.outerHeight()},o={offset:d.offset(),height:d.outerHeight()};({height:r.outerHeight()});p.is.standardScroll()||(p.debug("Non-standard scroll. Removing scroll offset from element offset"),e.top=w.scrollTop(),e.left=w.scrollLeft(),t.offset.top+=e.top,o.offset.top+=e.top,t.offset.left+=e.left,o.offset.left+=e.left),p.cache={fits:t.height<e.height,scrollContext:{height:e.height},element:{margin:t.margin,top:t.offset.top-t.margin.top,left:t.offset.left,width:t.width,height:t.height,bottom:t.offset.top+t.height},context:{top:o.offset.top,height:o.height,bottom:o.offset.top+o.height}},p.set.containerSize(),p.set.size(),p.stick(),p.debug("Caching element positions",p.cache)}},get:{direction:function(e){var t="down";return e=e||w.scrollTop(),p.lastScroll!==n&&(p.lastScroll<e?t="down":p.lastScroll>e&&(t="up")),t},scrollChange:function(e){return e=e||w.scrollTop(),p.lastScroll?e-p.lastScroll:0},currentElementScroll:function(){return p.elementScroll?p.elementScroll:p.is.top()?Math.abs(parseInt(k.css("top"),10))||0:Math.abs(parseInt(k.css("bottom"),10))||0},elementScroll:function(e){e=e||w.scrollTop();var t=p.cache.element,o=p.cache.scrollContext,n=p.get.scrollChange(e),i=t.height-o.height+b.offset,s=p.get.currentElementScroll(),r=s+n;return s=p.cache.fits||r<0?0:r>i?i:r}},remove:{lastScroll:function(){delete p.lastScroll},elementScroll:function(e){delete p.elementScroll},offset:function(){k.css("margin-top","")}},set:{offset:function(){p.verbose("Setting offset on element",b.offset),k.css("margin-top",b.offset)},containerSize:function(){var e=r.get(0).tagName;"HTML"===e||"body"==e?p.determineContainer():Math.abs(r.outerHeight()-p.cache.context.height)>b.jitter&&(p.debug("Context has padding, specifying exact height for container",p.cache.context.height),r.css({height:p.cache.context.height}))},minimumSize:function(){var e=p.cache.element;r.css("min-height",e.height)},scroll:function(e){p.debug("Setting scroll on element",e),p.elementScroll!=e&&(p.is.top()&&k.css("bottom","").css("top",-e),p.is.bottom()&&k.css("top","").css("bottom",e))},size:function(){0!==p.cache.element.height&&0!==p.cache.element.width&&(P.style.setProperty("width",p.cache.element.width+"px","important"),P.style.setProperty("height",p.cache.element.height+"px","important"))}},is:{standardScroll:function(){return w[0]==t},top:function(){return k.hasClass(v.top)},bottom:function(){return k.hasClass(v.bottom)},initialPosition:function(){return!p.is.fixed()&&!p.is.bound()},hidden:function(){return!k.is(":visible")},bound:function(){return k.hasClass(v.bound)},fixed:function(){return k.hasClass(v.fixed)}},stick:function(e){var t=e||w.scrollTop(),o=p.cache,n=o.fits,i=o.element,s=o.scrollContext,r=o.context,c=p.is.bottom()&&b.pushing?b.bottomOffset:b.offset,e={top:t+c,bottom:t+c+s.height},l=(p.get.direction(e.top),n?0:p.get.elementScroll(e.top)),a=!n,f=0!==i.height;f&&(p.is.initialPosition()?e.top>=r.bottom?(p.debug("Initial element position is bottom of container"),p.bindBottom()):e.top>i.top&&(i.height+e.top-l>=r.bottom?(p.debug("Initial element position is bottom of container"),p.bindBottom()):(p.debug("Initial element position is fixed"),p.fixTop())):p.is.fixed()?p.is.top()?e.top<=i.top?(p.debug("Fixed element reached top of container"),p.setInitialPosition()):i.height+e.top-l>=r.bottom?(p.debug("Fixed element reached bottom of container"),p.bindBottom()):a&&(p.set.scroll(l),p.save.lastScroll(e.top),p.save.elementScroll(l)):p.is.bottom()&&(e.bottom-i.height<=i.top?(p.debug("Bottom fixed rail has reached top of container"),p.setInitialPosition()):e.bottom>=r.bottom?(p.debug("Bottom fixed rail has reached bottom of container"),p.bindBottom()):a&&(p.set.scroll(l),p.save.lastScroll(e.top),p.save.elementScroll(l))):p.is.bottom()&&(e.top<=i.top?(p.debug("Jumped from bottom fixed to top fixed, most likely used home/end button"),p.setInitialPosition()):b.pushing?p.is.bound()&&e.bottom<=r.bottom&&(p.debug("Fixing bottom attached element to bottom of browser."),p.fixBottom()):p.is.bound()&&e.top<=r.bottom-i.height&&(p.debug("Fixing bottom attached element to top of browser."),p.fixTop())))},bindTop:function(){p.debug("Binding element to top of parent container"),p.remove.offset(),k.css({left:"",top:"",marginBottom:""}).removeClass(v.fixed).removeClass(v.bottom).addClass(v.bound).addClass(v.top),b.onTop.call(P),b.onUnstick.call(P)},bindBottom:function(){p.debug("Binding element to bottom of parent container"),p.remove.offset(),k.css({left:"",top:""}).removeClass(v.fixed).removeClass(v.top).addClass(v.bound).addClass(v.bottom),b.onBottom.call(P),b.onUnstick.call(P)},setInitialPosition:function(){p.debug("Returning to initial position"),p.unfix(),p.unbind()},fixTop:function(){p.debug("Fixing element to top of page"),p.set.minimumSize(),p.set.offset(),k.css({left:p.cache.element.left,bottom:"",marginBottom:""}).removeClass(v.bound).removeClass(v.bottom).addClass(v.fixed).addClass(v.top),b.onStick.call(P)},fixBottom:function(){p.debug("Sticking element to bottom of page"),p.set.minimumSize(),p.set.offset(),k.css({left:p.cache.element.left,bottom:"",marginBottom:""}).removeClass(v.bound).removeClass(v.top).addClass(v.fixed).addClass(v.bottom),b.onStick.call(P)},unbind:function(){p.is.bound()&&(p.debug("Removing container bound position on element"),p.remove.offset(),k.removeClass(v.bound).removeClass(v.top).removeClass(v.bottom))},unfix:function(){p.is.fixed()&&(p.debug("Removing fixed position on element"),p.remove.offset(),k.removeClass(v.fixed).removeClass(v.top).removeClass(v.bottom),b.onUnstick.call(P))},reset:function(){p.debug("Resetting elements position"),p.unbind(),p.unfix(),p.resetCSS(),p.remove.offset(),p.remove.lastScroll()},resetCSS:function(){k.css({width:"",height:""}),r.css({height:""})},setting:function(t,o){if(e.isPlainObject(t))e.extend(!0,b,t);else{if(o===n)return b[t];b[t]=o}},internal:function(t,o){if(e.isPlainObject(t))e.extend(!0,p,t);else{if(o===n)return p[t];p[t]=o}},debug:function(){!b.silent&&b.debug&&(b.performance?p.performance.log(arguments):(p.debug=Function.prototype.bind.call(console.info,console,b.name+":"),p.debug.apply(console,arguments)))},verbose:function(){!b.silent&&b.verbose&&b.debug&&(b.performance?p.performance.log(arguments):(p.verbose=Function.prototype.bind.call(console.info,console,b.name+":"),p.verbose.apply(console,arguments)))},error:function(){b.silent||(p.error=Function.prototype.bind.call(console.error,console,b.name+":"),p.error.apply(console,arguments))},performance:{log:function(e){var t,o,n;b.performance&&(t=(new Date).getTime(),n=l||t,o=t-n,l=t,a.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:P,"Execution Time":o})),clearTimeout(p.performance.timer),p.performance.timer=setTimeout(p.performance.display,0)},display:function(){var t=b.name+":",o=0;l=!1,clearTimeout(p.performance.timer),e.each(a,function(e,t){o+=t["Execution Time"]}),t+=" "+o+"ms",c&&(t+=" '"+c+"'"),(console.group!==n||console.table!==n)&&a.length>0&&(console.groupCollapsed(t),console.table?console.table(a):e.each(a,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),a=[]}},invoke:function(t,o,i){var r,c,l,a=z;return o=o||u,i=P||i,"string"==typeof t&&a!==n&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(o,i){var s=o!=r?i+t[o+1].charAt(0).toUpperCase()+t[o+1].slice(1):t;if(e.isPlainObject(a[s])&&o!=r)a=a[s];else{if(a[s]!==n)return c=a[s],!1;if(!e.isPlainObject(a[i])||o==r)return a[i]!==n&&(c=a[i],!1);a=a[i]}})),e.isFunction(c)?l=c.apply(i,o):c!==n&&(l=c),e.isArray(s)?s.push(l):s!==n?s=[s,l]:l!==n&&(s=l),c}},m?(z===n&&p.initialize(),p.invoke(f)):(z!==n&&z.invoke("destroy"),p.initialize())}),s!==n?s:this},e.fn.sticky.settings={name:"Sticky",namespace:"sticky",silent:!1,debug:!1,verbose:!0,performance:!0,pushing:!1,context:!1,container:!1,scrollContext:t,offset:0,bottomOffset:0,jitter:5,observeChanges:!1,onReposition:function(){},onScroll:function(){},onStick:function(){},onUnstick:function(){},onTop:function(){},onBottom:function(){},error:{container:"Sticky element must be inside a relative container",visible:"Element is hidden, you must call refresh after element becomes visible. Use silent setting to surpress this warning in production.",method:"The method you called is not defined.",invalidContext:"Context specified does not exist",elementSize:"Sticky element is larger than its container, cannot create sticky."},className:{bound:"bound",fixed:"fixed",supported:"native",top:"top",bottom:"bottom"}}}(jQuery,window,document);