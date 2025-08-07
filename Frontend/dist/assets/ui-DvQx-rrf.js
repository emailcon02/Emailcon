import{r as C,R as A}from"./vendor-CnRQdnpz.js";function Ue(t){var e,a,n="";if(typeof t=="string"||typeof t=="number")n+=t;else if(typeof t=="object")if(Array.isArray(t)){var o=t.length;for(e=0;e<o;e++)t[e]&&(a=Ue(t[e]))&&(n&&(n+=" "),n+=a)}else for(a in t)t[a]&&(n&&(n+=" "),n+=a);return n}function K(){for(var t,e,a=0,n="",o=arguments.length;a<o;a++)(t=arguments[a])&&(e=Ue(t))&&(n&&(n+=" "),n+=e);return n}function Ca(t){if(typeof document>"u")return;let e=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css",e.firstChild?e.insertBefore(a,e.firstChild):e.appendChild(a),a.styleSheet?a.styleSheet.cssText=t:a.appendChild(document.createTextNode(t))}Ca(`:root{--toastify-color-light: #fff;--toastify-color-dark: #121212;--toastify-color-info: #3498db;--toastify-color-success: #07bc0c;--toastify-color-warning: #f1c40f;--toastify-color-error: hsl(6, 78%, 57%);--toastify-color-transparent: rgba(255, 255, 255, .7);--toastify-icon-color-info: var(--toastify-color-info);--toastify-icon-color-success: var(--toastify-color-success);--toastify-icon-color-warning: var(--toastify-color-warning);--toastify-icon-color-error: var(--toastify-color-error);--toastify-container-width: fit-content;--toastify-toast-width: 320px;--toastify-toast-offset: 16px;--toastify-toast-top: max(var(--toastify-toast-offset), env(safe-area-inset-top));--toastify-toast-right: max(var(--toastify-toast-offset), env(safe-area-inset-right));--toastify-toast-left: max(var(--toastify-toast-offset), env(safe-area-inset-left));--toastify-toast-bottom: max(var(--toastify-toast-offset), env(safe-area-inset-bottom));--toastify-toast-background: #fff;--toastify-toast-padding: 14px;--toastify-toast-min-height: 64px;--toastify-toast-max-height: 800px;--toastify-toast-bd-radius: 6px;--toastify-toast-shadow: 0px 4px 12px rgba(0, 0, 0, .1);--toastify-font-family: sans-serif;--toastify-z-index: 9999;--toastify-text-color-light: #757575;--toastify-text-color-dark: #fff;--toastify-text-color-info: #fff;--toastify-text-color-success: #fff;--toastify-text-color-warning: #fff;--toastify-text-color-error: #fff;--toastify-spinner-color: #616161;--toastify-spinner-color-empty-area: #e0e0e0;--toastify-color-progress-light: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);--toastify-color-progress-dark: #bb86fc;--toastify-color-progress-info: var(--toastify-color-info);--toastify-color-progress-success: var(--toastify-color-success);--toastify-color-progress-warning: var(--toastify-color-warning);--toastify-color-progress-error: var(--toastify-color-error);--toastify-color-progress-bgo: .2}.Toastify__toast-container{z-index:var(--toastify-z-index);-webkit-transform:translate3d(0,0,var(--toastify-z-index));position:fixed;width:var(--toastify-container-width);box-sizing:border-box;color:#fff;display:flex;flex-direction:column}.Toastify__toast-container--top-left{top:var(--toastify-toast-top);left:var(--toastify-toast-left)}.Toastify__toast-container--top-center{top:var(--toastify-toast-top);left:50%;transform:translate(-50%);align-items:center}.Toastify__toast-container--top-right{top:var(--toastify-toast-top);right:var(--toastify-toast-right);align-items:end}.Toastify__toast-container--bottom-left{bottom:var(--toastify-toast-bottom);left:var(--toastify-toast-left)}.Toastify__toast-container--bottom-center{bottom:var(--toastify-toast-bottom);left:50%;transform:translate(-50%);align-items:center}.Toastify__toast-container--bottom-right{bottom:var(--toastify-toast-bottom);right:var(--toastify-toast-right);align-items:end}.Toastify__toast{--y: 0;position:relative;touch-action:none;width:var(--toastify-toast-width);min-height:var(--toastify-toast-min-height);box-sizing:border-box;margin-bottom:1rem;padding:var(--toastify-toast-padding);border-radius:var(--toastify-toast-bd-radius);box-shadow:var(--toastify-toast-shadow);max-height:var(--toastify-toast-max-height);font-family:var(--toastify-font-family);z-index:0;display:flex;flex:1 auto;align-items:center;word-break:break-word}@media only screen and (max-width: 480px){.Toastify__toast-container{width:100vw;left:env(safe-area-inset-left);margin:0}.Toastify__toast-container--top-left,.Toastify__toast-container--top-center,.Toastify__toast-container--top-right{top:env(safe-area-inset-top);transform:translate(0)}.Toastify__toast-container--bottom-left,.Toastify__toast-container--bottom-center,.Toastify__toast-container--bottom-right{bottom:env(safe-area-inset-bottom);transform:translate(0)}.Toastify__toast-container--rtl{right:env(safe-area-inset-right);left:initial}.Toastify__toast{--toastify-toast-width: 100%;margin-bottom:0;border-radius:0}}.Toastify__toast-container[data-stacked=true]{width:var(--toastify-toast-width)}.Toastify__toast--stacked{position:absolute;width:100%;transform:translate3d(0,var(--y),0) scale(var(--s));transition:transform .3s}.Toastify__toast--stacked[data-collapsed] .Toastify__toast-body,.Toastify__toast--stacked[data-collapsed] .Toastify__close-button{transition:opacity .1s}.Toastify__toast--stacked[data-collapsed=false]{overflow:visible}.Toastify__toast--stacked[data-collapsed=true]:not(:last-child)>*{opacity:0}.Toastify__toast--stacked:after{content:"";position:absolute;left:0;right:0;height:calc(var(--g) * 1px);bottom:100%}.Toastify__toast--stacked[data-pos=top]{top:0}.Toastify__toast--stacked[data-pos=bot]{bottom:0}.Toastify__toast--stacked[data-pos=bot].Toastify__toast--stacked:before{transform-origin:top}.Toastify__toast--stacked[data-pos=top].Toastify__toast--stacked:before{transform-origin:bottom}.Toastify__toast--stacked:before{content:"";position:absolute;left:0;right:0;bottom:0;height:100%;transform:scaleY(3);z-index:-1}.Toastify__toast--rtl{direction:rtl}.Toastify__toast--close-on-click{cursor:pointer}.Toastify__toast-icon{margin-inline-end:10px;width:22px;flex-shrink:0;display:flex}.Toastify--animate{animation-fill-mode:both;animation-duration:.5s}.Toastify--animate-icon{animation-fill-mode:both;animation-duration:.3s}.Toastify__toast-theme--dark{background:var(--toastify-color-dark);color:var(--toastify-text-color-dark)}.Toastify__toast-theme--light,.Toastify__toast-theme--colored.Toastify__toast--default{background:var(--toastify-color-light);color:var(--toastify-text-color-light)}.Toastify__toast-theme--colored.Toastify__toast--info{color:var(--toastify-text-color-info);background:var(--toastify-color-info)}.Toastify__toast-theme--colored.Toastify__toast--success{color:var(--toastify-text-color-success);background:var(--toastify-color-success)}.Toastify__toast-theme--colored.Toastify__toast--warning{color:var(--toastify-text-color-warning);background:var(--toastify-color-warning)}.Toastify__toast-theme--colored.Toastify__toast--error{color:var(--toastify-text-color-error);background:var(--toastify-color-error)}.Toastify__progress-bar-theme--light{background:var(--toastify-color-progress-light)}.Toastify__progress-bar-theme--dark{background:var(--toastify-color-progress-dark)}.Toastify__progress-bar--info{background:var(--toastify-color-progress-info)}.Toastify__progress-bar--success{background:var(--toastify-color-progress-success)}.Toastify__progress-bar--warning{background:var(--toastify-color-progress-warning)}.Toastify__progress-bar--error{background:var(--toastify-color-progress-error)}.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info,.Toastify__progress-bar-theme--colored.Toastify__progress-bar--success,.Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning,.Toastify__progress-bar-theme--colored.Toastify__progress-bar--error{background:var(--toastify-color-transparent)}.Toastify__close-button{color:#fff;position:absolute;top:6px;right:6px;background:transparent;outline:none;border:none;padding:0;cursor:pointer;opacity:.7;transition:.3s ease;z-index:1}.Toastify__toast--rtl .Toastify__close-button{left:6px;right:unset}.Toastify__close-button--light{color:#000;opacity:.3}.Toastify__close-button>svg{fill:currentColor;height:16px;width:14px}.Toastify__close-button:hover,.Toastify__close-button:focus{opacity:1}@keyframes Toastify__trackProgress{0%{transform:scaleX(1)}to{transform:scaleX(0)}}.Toastify__progress-bar{position:absolute;bottom:0;left:0;width:100%;height:100%;z-index:1;opacity:.7;transform-origin:left}.Toastify__progress-bar--animated{animation:Toastify__trackProgress linear 1 forwards}.Toastify__progress-bar--controlled{transition:transform .2s}.Toastify__progress-bar--rtl{right:0;left:initial;transform-origin:right;border-bottom-left-radius:initial}.Toastify__progress-bar--wrp{position:absolute;overflow:hidden;bottom:0;left:0;width:100%;height:5px;border-bottom-left-radius:var(--toastify-toast-bd-radius);border-bottom-right-radius:var(--toastify-toast-bd-radius)}.Toastify__progress-bar--wrp[data-hidden=true]{opacity:0}.Toastify__progress-bar--bg{opacity:var(--toastify-color-progress-bgo);width:100%;height:100%}.Toastify__spinner{width:20px;height:20px;box-sizing:border-box;border:2px solid;border-radius:100%;border-color:var(--toastify-spinner-color-empty-area);border-right-color:var(--toastify-spinner-color);animation:Toastify__spin .65s linear infinite}@keyframes Toastify__bounceInRight{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(3000px,0,0)}60%{opacity:1;transform:translate3d(-25px,0,0)}75%{transform:translate3d(10px,0,0)}90%{transform:translate3d(-5px,0,0)}to{transform:none}}@keyframes Toastify__bounceOutRight{20%{opacity:1;transform:translate3d(-20px,var(--y),0)}to{opacity:0;transform:translate3d(2000px,var(--y),0)}}@keyframes Toastify__bounceInLeft{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(-3000px,0,0)}60%{opacity:1;transform:translate3d(25px,0,0)}75%{transform:translate3d(-10px,0,0)}90%{transform:translate3d(5px,0,0)}to{transform:none}}@keyframes Toastify__bounceOutLeft{20%{opacity:1;transform:translate3d(20px,var(--y),0)}to{opacity:0;transform:translate3d(-2000px,var(--y),0)}}@keyframes Toastify__bounceInUp{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,3000px,0)}60%{opacity:1;transform:translate3d(0,-20px,0)}75%{transform:translate3d(0,10px,0)}90%{transform:translate3d(0,-5px,0)}to{transform:translateZ(0)}}@keyframes Toastify__bounceOutUp{20%{transform:translate3d(0,calc(var(--y) - 10px),0)}40%,45%{opacity:1;transform:translate3d(0,calc(var(--y) + 20px),0)}to{opacity:0;transform:translate3d(0,-2000px,0)}}@keyframes Toastify__bounceInDown{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,-3000px,0)}60%{opacity:1;transform:translate3d(0,25px,0)}75%{transform:translate3d(0,-10px,0)}90%{transform:translate3d(0,5px,0)}to{transform:none}}@keyframes Toastify__bounceOutDown{20%{transform:translate3d(0,calc(var(--y) - 10px),0)}40%,45%{opacity:1;transform:translate3d(0,calc(var(--y) + 20px),0)}to{opacity:0;transform:translate3d(0,2000px,0)}}.Toastify__bounce-enter--top-left,.Toastify__bounce-enter--bottom-left{animation-name:Toastify__bounceInLeft}.Toastify__bounce-enter--top-right,.Toastify__bounce-enter--bottom-right{animation-name:Toastify__bounceInRight}.Toastify__bounce-enter--top-center{animation-name:Toastify__bounceInDown}.Toastify__bounce-enter--bottom-center{animation-name:Toastify__bounceInUp}.Toastify__bounce-exit--top-left,.Toastify__bounce-exit--bottom-left{animation-name:Toastify__bounceOutLeft}.Toastify__bounce-exit--top-right,.Toastify__bounce-exit--bottom-right{animation-name:Toastify__bounceOutRight}.Toastify__bounce-exit--top-center{animation-name:Toastify__bounceOutUp}.Toastify__bounce-exit--bottom-center{animation-name:Toastify__bounceOutDown}@keyframes Toastify__zoomIn{0%{opacity:0;transform:scale3d(.3,.3,.3)}50%{opacity:1}}@keyframes Toastify__zoomOut{0%{opacity:1}50%{opacity:0;transform:translate3d(0,var(--y),0) scale3d(.3,.3,.3)}to{opacity:0}}.Toastify__zoom-enter{animation-name:Toastify__zoomIn}.Toastify__zoom-exit{animation-name:Toastify__zoomOut}@keyframes Toastify__flipIn{0%{transform:perspective(400px) rotateX(90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotateX(-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotateX(10deg);opacity:1}80%{transform:perspective(400px) rotateX(-5deg)}to{transform:perspective(400px)}}@keyframes Toastify__flipOut{0%{transform:translate3d(0,var(--y),0) perspective(400px)}30%{transform:translate3d(0,var(--y),0) perspective(400px) rotateX(-20deg);opacity:1}to{transform:translate3d(0,var(--y),0) perspective(400px) rotateX(90deg);opacity:0}}.Toastify__flip-enter{animation-name:Toastify__flipIn}.Toastify__flip-exit{animation-name:Toastify__flipOut}@keyframes Toastify__slideInRight{0%{transform:translate3d(110%,0,0);visibility:visible}to{transform:translate3d(0,var(--y),0)}}@keyframes Toastify__slideInLeft{0%{transform:translate3d(-110%,0,0);visibility:visible}to{transform:translate3d(0,var(--y),0)}}@keyframes Toastify__slideInUp{0%{transform:translate3d(0,110%,0);visibility:visible}to{transform:translate3d(0,var(--y),0)}}@keyframes Toastify__slideInDown{0%{transform:translate3d(0,-110%,0);visibility:visible}to{transform:translate3d(0,var(--y),0)}}@keyframes Toastify__slideOutRight{0%{transform:translate3d(0,var(--y),0)}to{visibility:hidden;transform:translate3d(110%,var(--y),0)}}@keyframes Toastify__slideOutLeft{0%{transform:translate3d(0,var(--y),0)}to{visibility:hidden;transform:translate3d(-110%,var(--y),0)}}@keyframes Toastify__slideOutDown{0%{transform:translate3d(0,var(--y),0)}to{visibility:hidden;transform:translate3d(0,500px,0)}}@keyframes Toastify__slideOutUp{0%{transform:translate3d(0,var(--y),0)}to{visibility:hidden;transform:translate3d(0,-500px,0)}}.Toastify__slide-enter--top-left,.Toastify__slide-enter--bottom-left{animation-name:Toastify__slideInLeft}.Toastify__slide-enter--top-right,.Toastify__slide-enter--bottom-right{animation-name:Toastify__slideInRight}.Toastify__slide-enter--top-center{animation-name:Toastify__slideInDown}.Toastify__slide-enter--bottom-center{animation-name:Toastify__slideInUp}.Toastify__slide-exit--top-left,.Toastify__slide-exit--bottom-left{animation-name:Toastify__slideOutLeft;animation-timing-function:ease-in;animation-duration:.3s}.Toastify__slide-exit--top-right,.Toastify__slide-exit--bottom-right{animation-name:Toastify__slideOutRight;animation-timing-function:ease-in;animation-duration:.3s}.Toastify__slide-exit--top-center{animation-name:Toastify__slideOutUp;animation-timing-function:ease-in;animation-duration:.3s}.Toastify__slide-exit--bottom-center{animation-name:Toastify__slideOutDown;animation-timing-function:ease-in;animation-duration:.3s}@keyframes Toastify__spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}
`);var ft=t=>typeof t=="number"&&!isNaN(t),q=t=>typeof t=="string",z=t=>typeof t=="function",Sa=t=>q(t)||ft(t),Ft=t=>q(t)||z(t)?t:null,Oa=(t,e)=>t===!1||ft(t)&&t>0?t:e,Rt=t=>C.isValidElement(t)||q(t)||z(t)||ft(t);function Na(t,e,a=300){let{scrollHeight:n,style:o}=t;requestAnimationFrame(()=>{o.minHeight="initial",o.height=n+"px",o.transition=`all ${a}ms`,requestAnimationFrame(()=>{o.height="0",o.padding="0",o.margin="0",setTimeout(e,a)})})}function La({enter:t,exit:e,appendPosition:a=!1,collapse:n=!0,collapseDuration:o=300}){return function({children:r,position:s,preventExitTransition:i,done:c,nodeRef:f,isIn:u,playToast:y}){let g=a?`${t}--${s}`:t,T=a?`${e}--${s}`:e,P=C.useRef(0);return C.useLayoutEffect(()=>{let x=f.current,b=g.split(" "),v=d=>{d.target===f.current&&(y(),x.removeEventListener("animationend",v),x.removeEventListener("animationcancel",v),P.current===0&&d.type!=="animationcancel"&&x.classList.remove(...b))};x.classList.add(...b),x.addEventListener("animationend",v),x.addEventListener("animationcancel",v)},[]),C.useEffect(()=>{let x=f.current,b=()=>{x.removeEventListener("animationend",b),n?Na(x,c,o):c()};u||(i?b():(P.current=1,x.className+=` ${T}`,x.addEventListener("animationend",b)))},[u]),A.createElement(A.Fragment,null,r)}}function pe(t,e){return{content:Xe(t.content,t.props),containerId:t.props.containerId,id:t.props.toastId,theme:t.props.theme,type:t.props.type,data:t.props.data||{},isLoading:t.props.isLoading,icon:t.props.icon,reason:t.removalReason,status:e}}function Xe(t,e,a=!1){return C.isValidElement(t)&&!q(t.type)?C.cloneElement(t,{closeToast:e.closeToast,toastProps:e,data:e.data,isPaused:a}):z(t)?t({closeToast:e.closeToast,toastProps:e,data:e.data,isPaused:a}):t}function Ma({closeToast:t,theme:e,ariaLabel:a="close"}){return A.createElement("button",{className:`Toastify__close-button Toastify__close-button--${e}`,type:"button",onClick:n=>{n.stopPropagation(),t(!0)},"aria-label":a},A.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},A.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function Fa({delay:t,isRunning:e,closeToast:a,type:n="default",hide:o,className:r,controlledProgress:s,progress:i,rtl:c,isIn:f,theme:u}){let y=o||s&&i===0,g={animationDuration:`${t}ms`,animationPlayState:e?"running":"paused"};s&&(g.transform=`scaleX(${i})`);let T=K("Toastify__progress-bar",s?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${u}`,`Toastify__progress-bar--${n}`,{"Toastify__progress-bar--rtl":c}),P=z(r)?r({rtl:c,type:n,defaultClassName:T}):K(T,r),x={[s&&i>=1?"onTransitionEnd":"onAnimationEnd"]:s&&i<1?null:()=>{f&&a()}};return A.createElement("div",{className:"Toastify__progress-bar--wrp","data-hidden":y},A.createElement("div",{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${u} Toastify__progress-bar--${n}`}),A.createElement("div",{role:"progressbar","aria-hidden":y?"true":"false","aria-label":"notification timer",className:P,style:g,...x}))}var Ra=1,Be=()=>`${Ra++}`;function Da(t,e,a){let n=1,o=0,r=[],s=[],i=e,c=new Map,f=new Set,u=d=>(f.add(d),()=>f.delete(d)),y=()=>{s=Array.from(c.values()),f.forEach(d=>d())},g=({containerId:d,toastId:p,updateId:h})=>{let E=d?d!==t:t!==1,S=c.has(p)&&h==null;return E||S},T=(d,p)=>{c.forEach(h=>{var E;(p==null||p===h.props.toastId)&&((E=h.toggle)==null||E.call(h,d))})},P=d=>{var p,h;(h=(p=d.props)==null?void 0:p.onClose)==null||h.call(p,d.removalReason),d.isActive=!1},x=d=>{if(d==null)c.forEach(P);else{let p=c.get(d);p&&P(p)}y()},b=()=>{o-=r.length,r=[]},v=d=>{var p,h;let{toastId:E,updateId:S}=d.props,_=S==null;d.staleId&&c.delete(d.staleId),d.isActive=!0,c.set(E,d),y(),a(pe(d,_?"added":"updated")),_&&((h=(p=d.props).onOpen)==null||h.call(p))};return{id:t,props:i,observe:u,toggle:T,removeToast:x,toasts:c,clearQueue:b,buildToast:(d,p)=>{if(g(p))return;let{toastId:h,updateId:E,data:S,staleId:_,delay:k}=p,M=E==null;M&&o++;let U={...i,style:i.toastStyle,key:n++,...Object.fromEntries(Object.entries(p).filter(([G,mt])=>mt!=null)),toastId:h,updateId:E,data:S,isIn:!1,className:Ft(p.className||i.toastClassName),progressClassName:Ft(p.progressClassName||i.progressClassName),autoClose:p.isLoading?!1:Oa(p.autoClose,i.autoClose),closeToast(G){c.get(h).removalReason=G,x(h)},deleteToast(){let G=c.get(h);if(G!=null){if(a(pe(G,"removed")),c.delete(h),o--,o<0&&(o=0),r.length>0){v(r.shift());return}y()}}};U.closeButton=i.closeButton,p.closeButton===!1||Rt(p.closeButton)?U.closeButton=p.closeButton:p.closeButton===!0&&(U.closeButton=Rt(i.closeButton)?i.closeButton:!0);let D={content:d,props:U,staleId:_};i.limit&&i.limit>0&&o>i.limit&&M?r.push(D):ft(k)?setTimeout(()=>{v(D)},k):v(D)},setProps(d){i=d},setToggle:(d,p)=>{let h=c.get(d);h&&(h.toggle=p)},isToastActive:d=>{var p;return(p=c.get(d))==null?void 0:p.isActive},getSnapshot:()=>s}}var N=new Map,st=[],Dt=new Set,za=t=>Dt.forEach(e=>e(t)),We=()=>N.size>0;function ja(){st.forEach(t=>Ge(t.content,t.options)),st=[]}var $a=(t,{containerId:e})=>{var a;return(a=N.get(e||1))==null?void 0:a.toasts.get(t)};function He(t,e){var a;if(e)return!!((a=N.get(e))!=null&&a.isToastActive(t));let n=!1;return N.forEach(o=>{o.isToastActive(t)&&(n=!0)}),n}function Ya(t){if(!We()){st=st.filter(e=>t!=null&&e.options.toastId!==t);return}if(t==null||Sa(t))N.forEach(e=>{e.removeToast(t)});else if(t&&("containerId"in t||"id"in t)){let e=N.get(t.containerId);e?e.removeToast(t.id):N.forEach(a=>{a.removeToast(t.id)})}}var Ua=(t={})=>{N.forEach(e=>{e.props.limit&&(!t.containerId||e.id===t.containerId)&&e.clearQueue()})};function Ge(t,e){Rt(t)&&(We()||st.push({content:t,options:e}),N.forEach(a=>{a.buildToast(t,e)}))}function Xa(t){var e;(e=N.get(t.containerId||1))==null||e.setToggle(t.id,t.fn)}function Ve(t,e){N.forEach(a=>{(e==null||!(e!=null&&e.containerId)||(e==null?void 0:e.containerId)===a.id)&&a.toggle(t,e==null?void 0:e.id)})}function Ba(t){let e=t.containerId||1;return{subscribe(a){let n=Da(e,t,za);N.set(e,n);let o=n.observe(a);return ja(),()=>{o(),N.delete(e)}},setProps(a){var n;(n=N.get(e))==null||n.setProps(a)},getSnapshot(){var a;return(a=N.get(e))==null?void 0:a.getSnapshot()}}}function Wa(t){return Dt.add(t),()=>{Dt.delete(t)}}function Ha(t){return t&&(q(t.toastId)||ft(t.toastId))?t.toastId:Be()}function ct(t,e){return Ge(t,e),e.toastId}function xt(t,e){return{...e,type:e&&e.type||t,toastId:Ha(e)}}function Tt(t){return(e,a)=>ct(e,xt(t,a))}function w(t,e){return ct(t,xt("default",e))}w.loading=(t,e)=>ct(t,xt("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...e}));function Ga(t,{pending:e,error:a,success:n},o){let r;e&&(r=q(e)?w.loading(e,o):w.loading(e.render,{...o,...e}));let s={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},i=(f,u,y)=>{if(u==null){w.dismiss(r);return}let g={type:f,...s,...o,data:y},T=q(u)?{render:u}:u;return r?w.update(r,{...g,...T}):w(T.render,{...g,...T}),y},c=z(t)?t():t;return c.then(f=>i("success",n,f)).catch(f=>i("error",a,f)),c}w.promise=Ga;w.success=Tt("success");w.info=Tt("info");w.error=Tt("error");w.warning=Tt("warning");w.warn=w.warning;w.dark=(t,e)=>ct(t,xt("default",{theme:"dark",...e}));function Va(t){Ya(t)}w.dismiss=Va;w.clearWaitingQueue=Ua;w.isActive=He;w.update=(t,e={})=>{let a=$a(t,e);if(a){let{props:n,content:o}=a,r={delay:100,...n,...e,toastId:e.toastId||t,updateId:Be()};r.toastId!==t&&(r.staleId=t);let s=r.render||o;delete r.render,ct(s,r)}};w.done=t=>{w.update(t,{progress:1})};w.onChange=Wa;w.play=t=>Ve(!0,t);w.pause=t=>Ve(!1,t);function Ka(t){var e;let{subscribe:a,getSnapshot:n,setProps:o}=C.useRef(Ba(t)).current;o(t);let r=(e=C.useSyncExternalStore(a,n,n))==null?void 0:e.slice();function s(i){if(!r)return[];let c=new Map;return t.newestOnTop&&r.reverse(),r.forEach(f=>{let{position:u}=f.props;c.has(u)||c.set(u,[]),c.get(u).push(f)}),Array.from(c,f=>i(f[0],f[1]))}return{getToastToRender:s,isToastActive:He,count:r==null?void 0:r.length}}function qa(t){let[e,a]=C.useState(!1),[n,o]=C.useState(!1),r=C.useRef(null),s=C.useRef({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:i,pauseOnHover:c,closeToast:f,onClick:u,closeOnClick:y}=t;Xa({id:t.toastId,containerId:t.containerId,fn:a}),C.useEffect(()=>{if(t.pauseOnFocusLoss)return g(),()=>{T()}},[t.pauseOnFocusLoss]);function g(){document.hasFocus()||v(),window.addEventListener("focus",b),window.addEventListener("blur",v)}function T(){window.removeEventListener("focus",b),window.removeEventListener("blur",v)}function P(_){if(t.draggable===!0||t.draggable===_.pointerType){d();let k=r.current;s.canCloseOnClick=!0,s.canDrag=!0,k.style.transition="none",t.draggableDirection==="x"?(s.start=_.clientX,s.removalDistance=k.offsetWidth*(t.draggablePercent/100)):(s.start=_.clientY,s.removalDistance=k.offsetHeight*(t.draggablePercent===80?t.draggablePercent*1.5:t.draggablePercent)/100)}}function x(_){let{top:k,bottom:M,left:U,right:D}=r.current.getBoundingClientRect();_.nativeEvent.type!=="touchend"&&t.pauseOnHover&&_.clientX>=U&&_.clientX<=D&&_.clientY>=k&&_.clientY<=M?v():b()}function b(){a(!0)}function v(){a(!1)}function d(){s.didMove=!1,document.addEventListener("pointermove",h),document.addEventListener("pointerup",E)}function p(){document.removeEventListener("pointermove",h),document.removeEventListener("pointerup",E)}function h(_){let k=r.current;if(s.canDrag&&k){s.didMove=!0,e&&v(),t.draggableDirection==="x"?s.delta=_.clientX-s.start:s.delta=_.clientY-s.start,s.start!==_.clientX&&(s.canCloseOnClick=!1);let M=t.draggableDirection==="x"?`${s.delta}px, var(--y)`:`0, calc(${s.delta}px + var(--y))`;k.style.transform=`translate3d(${M},0)`,k.style.opacity=`${1-Math.abs(s.delta/s.removalDistance)}`}}function E(){p();let _=r.current;if(s.canDrag&&s.didMove&&_){if(s.canDrag=!1,Math.abs(s.delta)>s.removalDistance){o(!0),t.closeToast(!0),t.collapseAll();return}_.style.transition="transform 0.2s, opacity 0.2s",_.style.removeProperty("transform"),_.style.removeProperty("opacity")}}let S={onPointerDown:P,onPointerUp:x};return i&&c&&(S.onMouseEnter=v,t.stacked||(S.onMouseLeave=b)),y&&(S.onClick=_=>{u&&u(_),s.canCloseOnClick&&f(!0)}),{playToast:b,pauseToast:v,isRunning:e,preventExitTransition:n,toastRef:r,eventHandlers:S}}var Qa=typeof window<"u"?C.useLayoutEffect:C.useEffect,kt=({theme:t,type:e,isLoading:a,...n})=>A.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:t==="colored"?"currentColor":`var(--toastify-icon-color-${e})`,...n});function Za(t){return A.createElement(kt,{...t},A.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))}function Ja(t){return A.createElement(kt,{...t},A.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))}function tn(t){return A.createElement(kt,{...t},A.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))}function en(t){return A.createElement(kt,{...t},A.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))}function an(){return A.createElement("div",{className:"Toastify__spinner"})}var zt={info:Ja,warning:Za,success:tn,error:en,spinner:an},nn=t=>t in zt;function on({theme:t,type:e,isLoading:a,icon:n}){let o=null,r={theme:t,type:e};return n===!1||(z(n)?o=n({...r,isLoading:a}):C.isValidElement(n)?o=C.cloneElement(n,r):a?o=zt.spinner():nn(e)&&(o=zt[e](r))),o}var rn=t=>{let{isRunning:e,preventExitTransition:a,toastRef:n,eventHandlers:o,playToast:r}=qa(t),{closeButton:s,children:i,autoClose:c,onClick:f,type:u,hideProgressBar:y,closeToast:g,transition:T,position:P,className:x,style:b,progressClassName:v,updateId:d,role:p,progress:h,rtl:E,toastId:S,deleteToast:_,isIn:k,isLoading:M,closeOnClick:U,theme:D,ariaLabel:G}=t,mt=K("Toastify__toast",`Toastify__toast-theme--${D}`,`Toastify__toast--${u}`,{"Toastify__toast--rtl":E},{"Toastify__toast--close-on-click":U}),Pa=z(x)?x({rtl:E,position:P,type:u,defaultClassName:mt}):K(mt,x),de=on(t),me=!!h||!c,Ct={closeToast:g,type:u,theme:D},pt=null;return s===!1||(z(s)?pt=s(Ct):C.isValidElement(s)?pt=C.cloneElement(s,Ct):pt=Ma(Ct)),A.createElement(T,{isIn:k,done:_,position:P,preventExitTransition:a,nodeRef:n,playToast:r},A.createElement("div",{id:S,tabIndex:0,onClick:f,"data-in":k,className:Pa,...o,style:b,ref:n,...k&&{role:p,"aria-label":G}},de!=null&&A.createElement("div",{className:K("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!M})},de),Xe(i,t,!e),pt,!t.customProgressBar&&A.createElement(Fa,{...d&&!me?{key:`p-${d}`}:{},rtl:E,theme:D,delay:c,isRunning:e,isIn:k,closeToast:g,hide:y,type:u,className:v,controlledProgress:me,progress:h||0})))},sn=(t,e=!1)=>({enter:`Toastify--animate Toastify__${t}-enter`,exit:`Toastify--animate Toastify__${t}-exit`,appendPosition:e}),ln=La(sn("bounce",!0)),fn={position:"top-right",transition:ln,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:"touch",draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light","aria-label":"Notifications Alt+T",hotKeys:t=>t.altKey&&t.code==="KeyT"};function dr(t){let e={...fn,...t},a=t.stacked,[n,o]=C.useState(!0),r=C.useRef(null),{getToastToRender:s,isToastActive:i,count:c}=Ka(e),{className:f,style:u,rtl:y,containerId:g,hotKeys:T}=e;function P(b){let v=K("Toastify__toast-container",`Toastify__toast-container--${b}`,{"Toastify__toast-container--rtl":y});return z(f)?f({position:b,rtl:y,defaultClassName:v}):K(v,Ft(f))}function x(){a&&(o(!0),w.play())}return Qa(()=>{var b;if(a){let v=r.current.querySelectorAll('[data-in="true"]'),d=12,p=(b=e.position)==null?void 0:b.includes("top"),h=0,E=0;Array.from(v).reverse().forEach((S,_)=>{let k=S;k.classList.add("Toastify__toast--stacked"),_>0&&(k.dataset.collapsed=`${n}`),k.dataset.pos||(k.dataset.pos=p?"top":"bot");let M=h*(n?.2:1)+(n?0:d*_);k.style.setProperty("--y",`${p?M:M*-1}px`),k.style.setProperty("--g",`${d}`),k.style.setProperty("--s",`${1-(n?E:0)}`),h+=k.offsetHeight,E+=.025})}},[n,c,a]),C.useEffect(()=>{function b(v){var d;let p=r.current;T(v)&&((d=p.querySelector('[tabIndex="0"]'))==null||d.focus(),o(!1),w.pause()),v.key==="Escape"&&(document.activeElement===p||p!=null&&p.contains(document.activeElement))&&(o(!0),w.play())}return document.addEventListener("keydown",b),()=>{document.removeEventListener("keydown",b)}},[T]),A.createElement("section",{ref:r,className:"Toastify",id:g,onMouseEnter:()=>{a&&(o(!1),w.pause())},onMouseLeave:x,"aria-live":"polite","aria-atomic":"false","aria-relevant":"additions text","aria-label":e["aria-label"]},s((b,v)=>{let d=v.length?{...u}:{...u,pointerEvents:"none"};return A.createElement("div",{tabIndex:-1,className:P(b),"data-stacked":a,style:d,key:`c-${b}`},v.map(({content:p,props:h})=>A.createElement(rn,{...h,stacked:a,collapseAll:x,isIn:i(h.toastId,h.containerId),key:`t-${h.key}`},p)))}))}/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */function cn(t,e,a){return(e=dn(e))in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function ge(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable})),a.push.apply(a,n)}return a}function l(t){for(var e=1;e<arguments.length;e++){var a=arguments[e]!=null?arguments[e]:{};e%2?ge(Object(a),!0).forEach(function(n){cn(t,n,a[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):ge(Object(a)).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(a,n))})}return t}function un(t,e){if(typeof t!="object"||!t)return t;var a=t[Symbol.toPrimitive];if(a!==void 0){var n=a.call(t,e);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function dn(t){var e=un(t,"string");return typeof e=="symbol"?e:e+""}const ye=()=>{};let ee={},Ke={},qe=null,Qe={mark:ye,measure:ye};try{typeof window<"u"&&(ee=window),typeof document<"u"&&(Ke=document),typeof MutationObserver<"u"&&(qe=MutationObserver),typeof performance<"u"&&(Qe=performance)}catch{}const{userAgent:he=""}=ee.navigator||{},B=ee,I=Ke,be=qe,gt=Qe;B.document;const Y=!!I.documentElement&&!!I.head&&typeof I.addEventListener=="function"&&typeof I.createElement=="function",Ze=~he.indexOf("MSIE")||~he.indexOf("Trident/");var mn=/fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,pn=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,Je={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"}},gn={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},ta=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],O="classic",wt="duotone",yn="sharp",hn="sharp-duotone",ea=[O,wt,yn,hn],bn={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"}},vn={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"}},_n=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}]]),xn={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",brands:"fab"},duotone:{solid:"fad",regular:"fadr",light:"fadl",thin:"fadt"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds",regular:"fasdr",light:"fasdl",thin:"fasdt"}},Tn=["fak","fa-kit","fakd","fa-kit-duotone"],ve={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},kn=["kit"],wn={kit:{"fa-kit":"fak"}},En=["fak","fakd"],An={kit:{fak:"fa-kit"}},_e={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},yt={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},In=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],Pn=["fak","fa-kit","fakd","fa-kit-duotone"],Cn={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Sn={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"}},On={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"]},jt={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"}},Nn=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands"],$t=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt",...In,...Nn],Ln=["solid","regular","light","thin","duotone","brands"],aa=[1,2,3,4,5,6,7,8,9,10],Mn=aa.concat([11,12,13,14,15,16,17,18,19,20]),Fn=[...Object.keys(On),...Ln,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",yt.GROUP,yt.SWAP_OPACITY,yt.PRIMARY,yt.SECONDARY].concat(aa.map(t=>"".concat(t,"x"))).concat(Mn.map(t=>"w-".concat(t))),Rn={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}};const j="___FONT_AWESOME___",Yt=16,na="fa",oa="svg-inline--fa",Q="data-fa-i2svg",Ut="data-fa-pseudo-element",Dn="data-fa-pseudo-element-pending",ae="data-prefix",ne="data-icon",xe="fontawesome-i2svg",zn="async",jn=["HTML","HEAD","STYLE","SCRIPT"],ra=(()=>{try{return!0}catch{return!1}})();function ut(t){return new Proxy(t,{get(e,a){return a in e?e[a]:e[O]}})}const sa=l({},Je);sa[O]=l(l(l(l({},{"fa-duotone":"duotone"}),Je[O]),ve.kit),ve["kit-duotone"]);const $n=ut(sa),Xt=l({},xn);Xt[O]=l(l(l(l({},{duotone:"fad"}),Xt[O]),_e.kit),_e["kit-duotone"]);const Te=ut(Xt),Bt=l({},jt);Bt[O]=l(l({},Bt[O]),An.kit);const oe=ut(Bt),Wt=l({},Sn);Wt[O]=l(l({},Wt[O]),wn.kit);ut(Wt);const Yn=mn,ia="fa-layers-text",Un=pn,Xn=l({},bn);ut(Xn);const Bn=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],St=gn,Wn=[...kn,...Fn],ot=B.FontAwesomeConfig||{};function Hn(t){var e=I.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function Gn(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}I&&typeof I.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[a,n]=e;const o=Gn(Hn(a));o!=null&&(ot[n]=o)});const la={styleDefault:"solid",familyDefault:O,cssPrefix:na,replacementClass:oa,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};ot.familyPrefix&&(ot.cssPrefix=ot.familyPrefix);const et=l(l({},la),ot);et.autoReplaceSvg||(et.observeMutations=!1);const m={};Object.keys(la).forEach(t=>{Object.defineProperty(m,t,{enumerable:!0,set:function(e){et[t]=e,rt.forEach(a=>a(m))},get:function(){return et[t]}})});Object.defineProperty(m,"familyPrefix",{enumerable:!0,set:function(t){et.cssPrefix=t,rt.forEach(e=>e(m))},get:function(){return et.cssPrefix}});B.FontAwesomeConfig=m;const rt=[];function Vn(t){return rt.push(t),()=>{rt.splice(rt.indexOf(t),1)}}const X=Yt,F={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Kn(t){if(!t||!Y)return;const e=I.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;const a=I.head.childNodes;let n=null;for(let o=a.length-1;o>-1;o--){const r=a[o],s=(r.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(s)>-1&&(n=r)}return I.head.insertBefore(e,n),t}const qn="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function it(){let t=12,e="";for(;t-- >0;)e+=qn[Math.random()*62|0];return e}function at(t){const e=[];for(let a=(t||[]).length>>>0;a--;)e[a]=t[a];return e}function re(t){return t.classList?at(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function fa(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Qn(t){return Object.keys(t||{}).reduce((e,a)=>e+"".concat(a,'="').concat(fa(t[a]),'" '),"").trim()}function Et(t){return Object.keys(t||{}).reduce((e,a)=>e+"".concat(a,": ").concat(t[a].trim(),";"),"")}function se(t){return t.size!==F.size||t.x!==F.x||t.y!==F.y||t.rotate!==F.rotate||t.flipX||t.flipY}function Zn(t){let{transform:e,containerWidth:a,iconWidth:n}=t;const o={transform:"translate(".concat(a/2," 256)")},r="translate(".concat(e.x*32,", ").concat(e.y*32,") "),s="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),i="rotate(".concat(e.rotate," 0 0)"),c={transform:"".concat(r," ").concat(s," ").concat(i)},f={transform:"translate(".concat(n/2*-1," -256)")};return{outer:o,inner:c,path:f}}function Jn(t){let{transform:e,width:a=Yt,height:n=Yt,startCentered:o=!1}=t,r="";return o&&Ze?r+="translate(".concat(e.x/X-a/2,"em, ").concat(e.y/X-n/2,"em) "):o?r+="translate(calc(-50% + ".concat(e.x/X,"em), calc(-50% + ").concat(e.y/X,"em)) "):r+="translate(".concat(e.x/X,"em, ").concat(e.y/X,"em) "),r+="scale(".concat(e.size/X*(e.flipX?-1:1),", ").concat(e.size/X*(e.flipY?-1:1),") "),r+="rotate(".concat(e.rotate,"deg) "),r}var to=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 6 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 6 Sharp Duotone";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    animation-delay: -1ms;
    animation-duration: 1ms;
    animation-iteration-count: 1;
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}`;function ca(){const t=na,e=oa,a=m.cssPrefix,n=m.replacementClass;let o=to;if(a!==t||n!==e){const r=new RegExp("\\.".concat(t,"\\-"),"g"),s=new RegExp("\\--".concat(t,"\\-"),"g"),i=new RegExp("\\.".concat(e),"g");o=o.replace(r,".".concat(a,"-")).replace(s,"--".concat(a,"-")).replace(i,".".concat(n))}return o}let ke=!1;function Ot(){m.autoAddCss&&!ke&&(Kn(ca()),ke=!0)}var eo={mixout(){return{dom:{css:ca,insertCss:Ot}}},hooks(){return{beforeDOMElementCreation(){Ot()},beforeI2svg(){Ot()}}}};const $=B||{};$[j]||($[j]={});$[j].styles||($[j].styles={});$[j].hooks||($[j].hooks={});$[j].shims||($[j].shims=[]);var R=$[j];const ua=[],da=function(){I.removeEventListener("DOMContentLoaded",da),vt=1,ua.map(t=>t())};let vt=!1;Y&&(vt=(I.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(I.readyState),vt||I.addEventListener("DOMContentLoaded",da));function ao(t){Y&&(vt?setTimeout(t,0):ua.push(t))}function dt(t){const{tag:e,attributes:a={},children:n=[]}=t;return typeof t=="string"?fa(t):"<".concat(e," ").concat(Qn(a),">").concat(n.map(dt).join(""),"</").concat(e,">")}function we(t,e,a){if(t&&t[e]&&t[e][a])return{prefix:e,iconName:a,icon:t[e][a]}}var Nt=function(e,a,n,o){var r=Object.keys(e),s=r.length,i=a,c,f,u;for(n===void 0?(c=1,u=e[r[0]]):(c=0,u=n);c<s;c++)f=r[c],u=i(u,e[f],f,e);return u};function no(t){const e=[];let a=0;const n=t.length;for(;a<n;){const o=t.charCodeAt(a++);if(o>=55296&&o<=56319&&a<n){const r=t.charCodeAt(a++);(r&64512)==56320?e.push(((o&1023)<<10)+(r&1023)+65536):(e.push(o),a--)}else e.push(o)}return e}function Ht(t){const e=no(t);return e.length===1?e[0].toString(16):null}function oo(t,e){const a=t.length;let n=t.charCodeAt(e),o;return n>=55296&&n<=56319&&a>e+1&&(o=t.charCodeAt(e+1),o>=56320&&o<=57343)?(n-55296)*1024+o-56320+65536:n}function Ee(t){return Object.keys(t).reduce((e,a)=>{const n=t[a];return!!n.icon?e[n.iconName]=n.icon:e[a]=n,e},{})}function Gt(t,e){let a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const{skipHooks:n=!1}=a,o=Ee(e);typeof R.hooks.addPack=="function"&&!n?R.hooks.addPack(t,Ee(e)):R.styles[t]=l(l({},R.styles[t]||{}),o),t==="fas"&&Gt("fa",e)}const{styles:lt,shims:ro}=R,ma=Object.keys(oe),so=ma.reduce((t,e)=>(t[e]=Object.keys(oe[e]),t),{});let ie=null,pa={},ga={},ya={},ha={},ba={};function io(t){return~Wn.indexOf(t)}function lo(t,e){const a=e.split("-"),n=a[0],o=a.slice(1).join("-");return n===t&&o!==""&&!io(o)?o:null}const va=()=>{const t=n=>Nt(lt,(o,r,s)=>(o[s]=Nt(r,n,{}),o),{});pa=t((n,o,r)=>(o[3]&&(n[o[3]]=r),o[2]&&o[2].filter(i=>typeof i=="number").forEach(i=>{n[i.toString(16)]=r}),n)),ga=t((n,o,r)=>(n[r]=r,o[2]&&o[2].filter(i=>typeof i=="string").forEach(i=>{n[i]=r}),n)),ba=t((n,o,r)=>{const s=o[2];return n[r]=r,s.forEach(i=>{n[i]=r}),n});const e="far"in lt||m.autoFetchSvg,a=Nt(ro,(n,o)=>{const r=o[0];let s=o[1];const i=o[2];return s==="far"&&!e&&(s="fas"),typeof r=="string"&&(n.names[r]={prefix:s,iconName:i}),typeof r=="number"&&(n.unicodes[r.toString(16)]={prefix:s,iconName:i}),n},{names:{},unicodes:{}});ya=a.names,ha=a.unicodes,ie=At(m.styleDefault,{family:m.familyDefault})};Vn(t=>{ie=At(t.styleDefault,{family:m.familyDefault})});va();function le(t,e){return(pa[t]||{})[e]}function fo(t,e){return(ga[t]||{})[e]}function V(t,e){return(ba[t]||{})[e]}function _a(t){return ya[t]||{prefix:null,iconName:null}}function co(t){const e=ha[t],a=le("fas",t);return e||(a?{prefix:"fas",iconName:a}:null)||{prefix:null,iconName:null}}function W(){return ie}const xa=()=>({prefix:null,iconName:null,rest:[]});function uo(t){let e=O;const a=ma.reduce((n,o)=>(n[o]="".concat(m.cssPrefix,"-").concat(o),n),{});return ea.forEach(n=>{(t.includes(a[n])||t.some(o=>so[n].includes(o)))&&(e=n)}),e}function At(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{family:a=O}=e,n=$n[a][t];if(a===wt&&!t)return"fad";const o=Te[a][t]||Te[a][n],r=t in R.styles?t:null;return o||r||null}function mo(t){let e=[],a=null;return t.forEach(n=>{const o=lo(m.cssPrefix,n);o?a=o:n&&e.push(n)}),{iconName:a,rest:e}}function Ae(t){return t.sort().filter((e,a,n)=>n.indexOf(e)===a)}function It(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{skipLookups:a=!1}=e;let n=null;const o=$t.concat(Pn),r=Ae(t.filter(y=>o.includes(y))),s=Ae(t.filter(y=>!$t.includes(y))),i=r.filter(y=>(n=y,!ta.includes(y))),[c=null]=i,f=uo(r),u=l(l({},mo(s)),{},{prefix:At(c,{family:f})});return l(l(l({},u),ho({values:t,family:f,styles:lt,config:m,canonical:u,givenPrefix:n})),po(a,n,u))}function po(t,e,a){let{prefix:n,iconName:o}=a;if(t||!n||!o)return{prefix:n,iconName:o};const r=e==="fa"?_a(o):{},s=V(n,o);return o=r.iconName||s||o,n=r.prefix||n,n==="far"&&!lt.far&&lt.fas&&!m.autoFetchSvg&&(n="fas"),{prefix:n,iconName:o}}const go=ea.filter(t=>t!==O||t!==wt),yo=Object.keys(jt).filter(t=>t!==O).map(t=>Object.keys(jt[t])).flat();function ho(t){const{values:e,family:a,canonical:n,givenPrefix:o="",styles:r={},config:s={}}=t,i=a===wt,c=e.includes("fa-duotone")||e.includes("fad"),f=s.familyDefault==="duotone",u=n.prefix==="fad"||n.prefix==="fa-duotone";if(!i&&(c||f||u)&&(n.prefix="fad"),(e.includes("fa-brands")||e.includes("fab"))&&(n.prefix="fab"),!n.prefix&&go.includes(a)&&(Object.keys(r).find(g=>yo.includes(g))||s.autoFetchSvg)){const g=_n.get(a).defaultShortPrefixId;n.prefix=g,n.iconName=V(n.prefix,n.iconName)||n.iconName}return(n.prefix==="fa"||o==="fa")&&(n.prefix=W()||"fas"),n}class bo{constructor(){this.definitions={}}add(){for(var e=arguments.length,a=new Array(e),n=0;n<e;n++)a[n]=arguments[n];const o=a.reduce(this._pullDefinitions,{});Object.keys(o).forEach(r=>{this.definitions[r]=l(l({},this.definitions[r]||{}),o[r]),Gt(r,o[r]);const s=oe[O][r];s&&Gt(s,o[r]),va()})}reset(){this.definitions={}}_pullDefinitions(e,a){const n=a.prefix&&a.iconName&&a.icon?{0:a}:a;return Object.keys(n).map(o=>{const{prefix:r,iconName:s,icon:i}=n[o],c=i[2];e[r]||(e[r]={}),c.length>0&&c.forEach(f=>{typeof f=="string"&&(e[r][f]=i)}),e[r][s]=i}),e}}let Ie=[],J={};const tt={},vo=Object.keys(tt);function _o(t,e){let{mixoutsTo:a}=e;return Ie=t,J={},Object.keys(tt).forEach(n=>{vo.indexOf(n)===-1&&delete tt[n]}),Ie.forEach(n=>{const o=n.mixout?n.mixout():{};if(Object.keys(o).forEach(r=>{typeof o[r]=="function"&&(a[r]=o[r]),typeof o[r]=="object"&&Object.keys(o[r]).forEach(s=>{a[r]||(a[r]={}),a[r][s]=o[r][s]})}),n.hooks){const r=n.hooks();Object.keys(r).forEach(s=>{J[s]||(J[s]=[]),J[s].push(r[s])})}n.provides&&n.provides(tt)}),a}function Vt(t,e){for(var a=arguments.length,n=new Array(a>2?a-2:0),o=2;o<a;o++)n[o-2]=arguments[o];return(J[t]||[]).forEach(s=>{e=s.apply(null,[e,...n])}),e}function Z(t){for(var e=arguments.length,a=new Array(e>1?e-1:0),n=1;n<e;n++)a[n-1]=arguments[n];(J[t]||[]).forEach(r=>{r.apply(null,a)})}function H(){const t=arguments[0],e=Array.prototype.slice.call(arguments,1);return tt[t]?tt[t].apply(null,e):void 0}function Kt(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t;const a=t.prefix||W();if(e)return e=V(a,e)||e,we(Ta.definitions,a,e)||we(R.styles,a,e)}const Ta=new bo,xo=()=>{m.autoReplaceSvg=!1,m.observeMutations=!1,Z("noAuto")},To={i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return Y?(Z("beforeI2svg",t),H("pseudoElements2svg",t),H("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e}=t;m.autoReplaceSvg===!1&&(m.autoReplaceSvg=!0),m.observeMutations=!0,ao(()=>{wo({autoReplaceSvgRoot:e}),Z("watch",t)})}},ko={icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:V(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){const e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],a=At(t[0]);return{prefix:a,iconName:V(a,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(m.cssPrefix,"-"))>-1||t.match(Yn))){const e=It(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||W(),iconName:V(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){const e=W();return{prefix:e,iconName:V(e,t)||t}}}},L={noAuto:xo,config:m,dom:To,parse:ko,library:Ta,findIconDefinition:Kt,toHtml:dt},wo=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e=I}=t;(Object.keys(R.styles).length>0||m.autoFetchSvg)&&Y&&m.autoReplaceSvg&&L.dom.i2svg({node:e})};function Pt(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(a=>dt(a))}}),Object.defineProperty(t,"node",{get:function(){if(!Y)return;const a=I.createElement("div");return a.innerHTML=t.html,a.children}}),t}function Eo(t){let{children:e,main:a,mask:n,attributes:o,styles:r,transform:s}=t;if(se(s)&&a.found&&!n.found){const{width:i,height:c}=a,f={x:i/c/2,y:.5};o.style=Et(l(l({},r),{},{"transform-origin":"".concat(f.x+s.x/16,"em ").concat(f.y+s.y/16,"em")}))}return[{tag:"svg",attributes:o,children:e}]}function Ao(t){let{prefix:e,iconName:a,children:n,attributes:o,symbol:r}=t;const s=r===!0?"".concat(e,"-").concat(m.cssPrefix,"-").concat(a):r;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:l(l({},o),{},{id:s}),children:n}]}]}function fe(t){const{icons:{main:e,mask:a},prefix:n,iconName:o,transform:r,symbol:s,title:i,maskId:c,titleId:f,extra:u,watchable:y=!1}=t,{width:g,height:T}=a.found?a:e,P=En.includes(n),x=[m.replacementClass,o?"".concat(m.cssPrefix,"-").concat(o):""].filter(E=>u.classes.indexOf(E)===-1).filter(E=>E!==""||!!E).concat(u.classes).join(" ");let b={children:[],attributes:l(l({},u.attributes),{},{"data-prefix":n,"data-icon":o,class:x,role:u.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(g," ").concat(T)})};const v=P&&!~u.classes.indexOf("fa-fw")?{width:"".concat(g/T*16*.0625,"em")}:{};y&&(b.attributes[Q]=""),i&&(b.children.push({tag:"title",attributes:{id:b.attributes["aria-labelledby"]||"title-".concat(f||it())},children:[i]}),delete b.attributes.title);const d=l(l({},b),{},{prefix:n,iconName:o,main:e,mask:a,maskId:c,transform:r,symbol:s,styles:l(l({},v),u.styles)}),{children:p,attributes:h}=a.found&&e.found?H("generateAbstractMask",d)||{children:[],attributes:{}}:H("generateAbstractIcon",d)||{children:[],attributes:{}};return d.children=p,d.attributes=h,s?Ao(d):Eo(d)}function Pe(t){const{content:e,width:a,height:n,transform:o,title:r,extra:s,watchable:i=!1}=t,c=l(l(l({},s.attributes),r?{title:r}:{}),{},{class:s.classes.join(" ")});i&&(c[Q]="");const f=l({},s.styles);se(o)&&(f.transform=Jn({transform:o,startCentered:!0,width:a,height:n}),f["-webkit-transform"]=f.transform);const u=Et(f);u.length>0&&(c.style=u);const y=[];return y.push({tag:"span",attributes:c,children:[e]}),r&&y.push({tag:"span",attributes:{class:"sr-only"},children:[r]}),y}function Io(t){const{content:e,title:a,extra:n}=t,o=l(l(l({},n.attributes),a?{title:a}:{}),{},{class:n.classes.join(" ")}),r=Et(n.styles);r.length>0&&(o.style=r);const s=[];return s.push({tag:"span",attributes:o,children:[e]}),a&&s.push({tag:"span",attributes:{class:"sr-only"},children:[a]}),s}const{styles:Lt}=R;function qt(t){const e=t[0],a=t[1],[n]=t.slice(4);let o=null;return Array.isArray(n)?o={tag:"g",attributes:{class:"".concat(m.cssPrefix,"-").concat(St.GROUP)},children:[{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(St.SECONDARY),fill:"currentColor",d:n[0]}},{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(St.PRIMARY),fill:"currentColor",d:n[1]}}]}:o={tag:"path",attributes:{fill:"currentColor",d:n}},{found:!0,width:e,height:a,icon:o}}const Po={found:!1,width:512,height:512};function Co(t,e){!ra&&!m.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function Qt(t,e){let a=e;return e==="fa"&&m.styleDefault!==null&&(e=W()),new Promise((n,o)=>{if(a==="fa"){const r=_a(t)||{};t=r.iconName||t,e=r.prefix||e}if(t&&e&&Lt[e]&&Lt[e][t]){const r=Lt[e][t];return n(qt(r))}Co(t,e),n(l(l({},Po),{},{icon:m.showMissingIcons&&t?H("missingIconAbstract")||{}:{}}))})}const Ce=()=>{},Zt=m.measurePerformance&&gt&&gt.mark&&gt.measure?gt:{mark:Ce,measure:Ce},nt='FA "6.7.2"',So=t=>(Zt.mark("".concat(nt," ").concat(t," begins")),()=>ka(t)),ka=t=>{Zt.mark("".concat(nt," ").concat(t," ends")),Zt.measure("".concat(nt," ").concat(t),"".concat(nt," ").concat(t," begins"),"".concat(nt," ").concat(t," ends"))};var ce={begin:So,end:ka};const ht=()=>{};function Se(t){return typeof(t.getAttribute?t.getAttribute(Q):null)=="string"}function Oo(t){const e=t.getAttribute?t.getAttribute(ae):null,a=t.getAttribute?t.getAttribute(ne):null;return e&&a}function No(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(m.replacementClass)}function Lo(){return m.autoReplaceSvg===!0?bt.replace:bt[m.autoReplaceSvg]||bt.replace}function Mo(t){return I.createElementNS("http://www.w3.org/2000/svg",t)}function Fo(t){return I.createElement(t)}function wa(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{ceFn:a=t.tag==="svg"?Mo:Fo}=e;if(typeof t=="string")return I.createTextNode(t);const n=a(t.tag);return Object.keys(t.attributes||[]).forEach(function(r){n.setAttribute(r,t.attributes[r])}),(t.children||[]).forEach(function(r){n.appendChild(wa(r,{ceFn:a}))}),n}function Ro(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}const bt={replace:function(t){const e=t[0];if(e.parentNode)if(t[1].forEach(a=>{e.parentNode.insertBefore(wa(a),e)}),e.getAttribute(Q)===null&&m.keepOriginalSource){let a=I.createComment(Ro(e));e.parentNode.replaceChild(a,e)}else e.remove()},nest:function(t){const e=t[0],a=t[1];if(~re(e).indexOf(m.replacementClass))return bt.replace(t);const n=new RegExp("".concat(m.cssPrefix,"-.*"));if(delete a[0].attributes.id,a[0].attributes.class){const r=a[0].attributes.class.split(" ").reduce((s,i)=>(i===m.replacementClass||i.match(n)?s.toSvg.push(i):s.toNode.push(i),s),{toNode:[],toSvg:[]});a[0].attributes.class=r.toSvg.join(" "),r.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",r.toNode.join(" "))}const o=a.map(r=>dt(r)).join(`
`);e.setAttribute(Q,""),e.innerHTML=o}};function Oe(t){t()}function Ea(t,e){const a=typeof e=="function"?e:ht;if(t.length===0)a();else{let n=Oe;m.mutateApproach===zn&&(n=B.requestAnimationFrame||Oe),n(()=>{const o=Lo(),r=ce.begin("mutate");t.map(o),r(),a()})}}let ue=!1;function Aa(){ue=!0}function Jt(){ue=!1}let _t=null;function Ne(t){if(!be||!m.observeMutations)return;const{treeCallback:e=ht,nodeCallback:a=ht,pseudoElementsCallback:n=ht,observeMutationsRoot:o=I}=t;_t=new be(r=>{if(ue)return;const s=W();at(r).forEach(i=>{if(i.type==="childList"&&i.addedNodes.length>0&&!Se(i.addedNodes[0])&&(m.searchPseudoElements&&n(i.target),e(i.target)),i.type==="attributes"&&i.target.parentNode&&m.searchPseudoElements&&n(i.target.parentNode),i.type==="attributes"&&Se(i.target)&&~Bn.indexOf(i.attributeName))if(i.attributeName==="class"&&Oo(i.target)){const{prefix:c,iconName:f}=It(re(i.target));i.target.setAttribute(ae,c||s),f&&i.target.setAttribute(ne,f)}else No(i.target)&&a(i.target)})}),Y&&_t.observe(o,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function Do(){_t&&_t.disconnect()}function zo(t){const e=t.getAttribute("style");let a=[];return e&&(a=e.split(";").reduce((n,o)=>{const r=o.split(":"),s=r[0],i=r.slice(1);return s&&i.length>0&&(n[s]=i.join(":").trim()),n},{})),a}function jo(t){const e=t.getAttribute("data-prefix"),a=t.getAttribute("data-icon"),n=t.innerText!==void 0?t.innerText.trim():"";let o=It(re(t));return o.prefix||(o.prefix=W()),e&&a&&(o.prefix=e,o.iconName=a),o.iconName&&o.prefix||(o.prefix&&n.length>0&&(o.iconName=fo(o.prefix,t.innerText)||le(o.prefix,Ht(t.innerText))),!o.iconName&&m.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(o.iconName=t.firstChild.data)),o}function $o(t){const e=at(t.attributes).reduce((o,r)=>(o.name!=="class"&&o.name!=="style"&&(o[r.name]=r.value),o),{}),a=t.getAttribute("title"),n=t.getAttribute("data-fa-title-id");return m.autoA11y&&(a?e["aria-labelledby"]="".concat(m.replacementClass,"-title-").concat(n||it()):(e["aria-hidden"]="true",e.focusable="false")),e}function Yo(){return{iconName:null,title:null,titleId:null,prefix:null,transform:F,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Le(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0};const{iconName:a,prefix:n,rest:o}=jo(t),r=$o(t),s=Vt("parseNodeAttributes",{},t);let i=e.styleParser?zo(t):[];return l({iconName:a,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:n,transform:F,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:o,styles:i,attributes:r}},s)}const{styles:Uo}=R;function Ia(t){const e=m.autoReplaceSvg==="nest"?Le(t,{styleParser:!1}):Le(t);return~e.extra.classes.indexOf(ia)?H("generateLayersText",t,e):H("generateSvgReplacementMutation",t,e)}function Xo(){return[...Tn,...$t]}function Me(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!Y)return Promise.resolve();const a=I.documentElement.classList,n=u=>a.add("".concat(xe,"-").concat(u)),o=u=>a.remove("".concat(xe,"-").concat(u)),r=m.autoFetchSvg?Xo():ta.concat(Object.keys(Uo));r.includes("fa")||r.push("fa");const s=[".".concat(ia,":not([").concat(Q,"])")].concat(r.map(u=>".".concat(u,":not([").concat(Q,"])"))).join(", ");if(s.length===0)return Promise.resolve();let i=[];try{i=at(t.querySelectorAll(s))}catch{}if(i.length>0)n("pending"),o("complete");else return Promise.resolve();const c=ce.begin("onTree"),f=i.reduce((u,y)=>{try{const g=Ia(y);g&&u.push(g)}catch(g){ra||g.name==="MissingIcon"&&console.error(g)}return u},[]);return new Promise((u,y)=>{Promise.all(f).then(g=>{Ea(g,()=>{n("active"),n("complete"),o("pending"),typeof e=="function"&&e(),c(),u()})}).catch(g=>{c(),y(g)})})}function Bo(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Ia(t).then(a=>{a&&Ea([a],e)})}function Wo(t){return function(e){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const n=(e||{}).icon?e:Kt(e||{});let{mask:o}=a;return o&&(o=(o||{}).icon?o:Kt(o||{})),t(n,l(l({},a),{},{mask:o}))}}const Ho=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:a=F,symbol:n=!1,mask:o=null,maskId:r=null,title:s=null,titleId:i=null,classes:c=[],attributes:f={},styles:u={}}=e;if(!t)return;const{prefix:y,iconName:g,icon:T}=t;return Pt(l({type:"icon"},t),()=>(Z("beforeDOMElementCreation",{iconDefinition:t,params:e}),m.autoA11y&&(s?f["aria-labelledby"]="".concat(m.replacementClass,"-title-").concat(i||it()):(f["aria-hidden"]="true",f.focusable="false")),fe({icons:{main:qt(T),mask:o?qt(o.icon):{found:!1,width:null,height:null,icon:{}}},prefix:y,iconName:g,transform:l(l({},F),a),symbol:n,title:s,maskId:r,titleId:i,extra:{attributes:f,styles:u,classes:c}})))};var Go={mixout(){return{icon:Wo(Ho)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=Me,t.nodeCallback=Bo,t}}},provides(t){t.i2svg=function(e){const{node:a=I,callback:n=()=>{}}=e;return Me(a,n)},t.generateSvgReplacementMutation=function(e,a){const{iconName:n,title:o,titleId:r,prefix:s,transform:i,symbol:c,mask:f,maskId:u,extra:y}=a;return new Promise((g,T)=>{Promise.all([Qt(n,s),f.iconName?Qt(f.iconName,f.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(P=>{let[x,b]=P;g([e,fe({icons:{main:x,mask:b},prefix:s,iconName:n,transform:i,symbol:c,maskId:u,title:o,titleId:r,extra:y,watchable:!0})])}).catch(T)})},t.generateAbstractIcon=function(e){let{children:a,attributes:n,main:o,transform:r,styles:s}=e;const i=Et(s);i.length>0&&(n.style=i);let c;return se(r)&&(c=H("generateAbstractTransformGrouping",{main:o,transform:r,containerWidth:o.width,iconWidth:o.width})),a.push(c||o.icon),{children:a,attributes:n}}}},Vo={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{classes:a=[]}=e;return Pt({type:"layer"},()=>{Z("beforeDOMElementCreation",{assembler:t,params:e});let n=[];return t(o=>{Array.isArray(o)?o.map(r=>{n=n.concat(r.abstract)}):n=n.concat(o.abstract)}),[{tag:"span",attributes:{class:["".concat(m.cssPrefix,"-layers"),...a].join(" ")},children:n}]})}}}},Ko={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{title:a=null,classes:n=[],attributes:o={},styles:r={}}=e;return Pt({type:"counter",content:t},()=>(Z("beforeDOMElementCreation",{content:t,params:e}),Io({content:t.toString(),title:a,extra:{attributes:o,styles:r,classes:["".concat(m.cssPrefix,"-layers-counter"),...n]}})))}}}},qo={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:a=F,title:n=null,classes:o=[],attributes:r={},styles:s={}}=e;return Pt({type:"text",content:t},()=>(Z("beforeDOMElementCreation",{content:t,params:e}),Pe({content:t,transform:l(l({},F),a),title:n,extra:{attributes:r,styles:s,classes:["".concat(m.cssPrefix,"-layers-text"),...o]}})))}}},provides(t){t.generateLayersText=function(e,a){const{title:n,transform:o,extra:r}=a;let s=null,i=null;if(Ze){const c=parseInt(getComputedStyle(e).fontSize,10),f=e.getBoundingClientRect();s=f.width/c,i=f.height/c}return m.autoA11y&&!n&&(r.attributes["aria-hidden"]="true"),Promise.resolve([e,Pe({content:e.innerHTML,width:s,height:i,transform:o,title:n,extra:r,watchable:!0})])}}};const Qo=new RegExp('"',"ug"),Fe=[1105920,1112319],Re=l(l(l(l({},{FontAwesome:{normal:"fas",400:"fas"}}),vn),Rn),Cn),te=Object.keys(Re).reduce((t,e)=>(t[e.toLowerCase()]=Re[e],t),{}),Zo=Object.keys(te).reduce((t,e)=>{const a=te[e];return t[e]=a[900]||[...Object.entries(a)][0][1],t},{});function Jo(t){const e=t.replace(Qo,""),a=oo(e,0),n=a>=Fe[0]&&a<=Fe[1],o=e.length===2?e[0]===e[1]:!1;return{value:Ht(o?e[0]:e),isSecondary:n||o}}function tr(t,e){const a=t.replace(/^['"]|['"]$/g,"").toLowerCase(),n=parseInt(e),o=isNaN(n)?"normal":n;return(te[a]||{})[o]||Zo[a]}function De(t,e){const a="".concat(Dn).concat(e.replace(":","-"));return new Promise((n,o)=>{if(t.getAttribute(a)!==null)return n();const s=at(t.children).filter(g=>g.getAttribute(Ut)===e)[0],i=B.getComputedStyle(t,e),c=i.getPropertyValue("font-family"),f=c.match(Un),u=i.getPropertyValue("font-weight"),y=i.getPropertyValue("content");if(s&&!f)return t.removeChild(s),n();if(f&&y!=="none"&&y!==""){const g=i.getPropertyValue("content");let T=tr(c,u);const{value:P,isSecondary:x}=Jo(g),b=f[0].startsWith("FontAwesome");let v=le(T,P),d=v;if(b){const p=co(P);p.iconName&&p.prefix&&(v=p.iconName,T=p.prefix)}if(v&&!x&&(!s||s.getAttribute(ae)!==T||s.getAttribute(ne)!==d)){t.setAttribute(a,d),s&&t.removeChild(s);const p=Yo(),{extra:h}=p;h.attributes[Ut]=e,Qt(v,T).then(E=>{const S=fe(l(l({},p),{},{icons:{main:E,mask:xa()},prefix:T,iconName:d,extra:h,watchable:!0})),_=I.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(_,t.firstChild):t.appendChild(_),_.outerHTML=S.map(k=>dt(k)).join(`
`),t.removeAttribute(a),n()}).catch(o)}else n()}else n()})}function er(t){return Promise.all([De(t,"::before"),De(t,"::after")])}function ar(t){return t.parentNode!==document.head&&!~jn.indexOf(t.tagName.toUpperCase())&&!t.getAttribute(Ut)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function ze(t){if(Y)return new Promise((e,a)=>{const n=at(t.querySelectorAll("*")).filter(ar).map(er),o=ce.begin("searchPseudoElements");Aa(),Promise.all(n).then(()=>{o(),Jt(),e()}).catch(()=>{o(),Jt(),a()})})}var nr={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=ze,t}}},provides(t){t.pseudoElements2svg=function(e){const{node:a=I}=e;m.searchPseudoElements&&ze(a)}}};let je=!1;var or={mixout(){return{dom:{unwatch(){Aa(),je=!0}}}},hooks(){return{bootstrap(){Ne(Vt("mutationObserverCallbacks",{}))},noAuto(){Do()},watch(t){const{observeMutationsRoot:e}=t;je?Jt():Ne(Vt("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}};const $e=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((a,n)=>{const o=n.toLowerCase().split("-"),r=o[0];let s=o.slice(1).join("-");if(r&&s==="h")return a.flipX=!0,a;if(r&&s==="v")return a.flipY=!0,a;if(s=parseFloat(s),isNaN(s))return a;switch(r){case"grow":a.size=a.size+s;break;case"shrink":a.size=a.size-s;break;case"left":a.x=a.x-s;break;case"right":a.x=a.x+s;break;case"up":a.y=a.y-s;break;case"down":a.y=a.y+s;break;case"rotate":a.rotate=a.rotate+s;break}return a},e)};var rr={mixout(){return{parse:{transform:t=>$e(t)}}},hooks(){return{parseNodeAttributes(t,e){const a=e.getAttribute("data-fa-transform");return a&&(t.transform=$e(a)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:a,transform:n,containerWidth:o,iconWidth:r}=e;const s={transform:"translate(".concat(o/2," 256)")},i="translate(".concat(n.x*32,", ").concat(n.y*32,") "),c="scale(".concat(n.size/16*(n.flipX?-1:1),", ").concat(n.size/16*(n.flipY?-1:1),") "),f="rotate(".concat(n.rotate," 0 0)"),u={transform:"".concat(i," ").concat(c," ").concat(f)},y={transform:"translate(".concat(r/2*-1," -256)")},g={outer:s,inner:u,path:y};return{tag:"g",attributes:l({},g.outer),children:[{tag:"g",attributes:l({},g.inner),children:[{tag:a.icon.tag,children:a.icon.children,attributes:l(l({},a.icon.attributes),g.path)}]}]}}}};const Mt={x:0,y:0,width:"100%",height:"100%"};function Ye(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function sr(t){return t.tag==="g"?t.children:[t]}var ir={hooks(){return{parseNodeAttributes(t,e){const a=e.getAttribute("data-fa-mask"),n=a?It(a.split(" ").map(o=>o.trim())):xa();return n.prefix||(n.prefix=W()),t.mask=n,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:a,attributes:n,main:o,mask:r,maskId:s,transform:i}=e;const{width:c,icon:f}=o,{width:u,icon:y}=r,g=Zn({transform:i,containerWidth:u,iconWidth:c}),T={tag:"rect",attributes:l(l({},Mt),{},{fill:"white"})},P=f.children?{children:f.children.map(Ye)}:{},x={tag:"g",attributes:l({},g.inner),children:[Ye(l({tag:f.tag,attributes:l(l({},f.attributes),g.path)},P))]},b={tag:"g",attributes:l({},g.outer),children:[x]},v="mask-".concat(s||it()),d="clip-".concat(s||it()),p={tag:"mask",attributes:l(l({},Mt),{},{id:v,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[T,b]},h={tag:"defs",children:[{tag:"clipPath",attributes:{id:d},children:sr(y)},p]};return a.push(h,{tag:"rect",attributes:l({fill:"currentColor","clip-path":"url(#".concat(d,")"),mask:"url(#".concat(v,")")},Mt)}),{children:a,attributes:n}}}},lr={provides(t){let e=!1;B.matchMedia&&(e=B.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){const a=[],n={fill:"currentColor"},o={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};a.push({tag:"path",attributes:l(l({},n),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});const r=l(l({},o),{},{attributeName:"opacity"}),s={tag:"circle",attributes:l(l({},n),{},{cx:"256",cy:"364",r:"28"}),children:[]};return e||s.children.push({tag:"animate",attributes:l(l({},o),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:l(l({},r),{},{values:"1;0;1;1;0;1;"})}),a.push(s),a.push({tag:"path",attributes:l(l({},n),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:l(l({},r),{},{values:"1;0;0;0;0;1;"})}]}),e||a.push({tag:"path",attributes:l(l({},n),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:l(l({},r),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:a}}}},fr={hooks(){return{parseNodeAttributes(t,e){const a=e.getAttribute("data-fa-symbol"),n=a===null?!1:a===""?!0:a;return t.symbol=n,t}}}},cr=[eo,Go,Vo,Ko,qo,nr,or,rr,ir,lr,fr];_o(cr,{mixoutsTo:L});L.noAuto;L.config;L.library;L.dom;const mr=L.parse;L.findIconDefinition;L.toHtml;const pr=L.icon;L.layer;L.text;L.counter;export{dr as L,K as c,pr as i,mr as p,w as y};
