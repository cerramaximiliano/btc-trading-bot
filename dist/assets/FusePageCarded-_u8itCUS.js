import{j as a,m as v,r as i,d as c,S as D,aC as o,aK as S,cL as I,aN as k,s as w,bz as z}from"./index-RIZY5N65.js";function F(e){const{innerScroll:r,children:t}=e;return t?a(v,{enable:r,children:a("div",{className:"FusePageCarded-sidebarContent",children:t})}):null}const P=i.forwardRef((e,r)=>{const{open:t=!0,position:d,variant:n,onClose:l=()=>{}}=e,[s,u]=i.useState(t),g=i.useCallback(p=>{u(p)},[]);return i.useImperativeHandle(r,()=>({toggleSidebar:g})),i.useEffect(()=>{g(t)},[g,t]),c(k,{children:[a(S,{lgUp:n==="permanent",children:a(D,{variant:"temporary",anchor:d,open:s,onOpen:()=>{},onClose:()=>l(),disableSwipeToOpen:!0,classes:{root:o("FusePageCarded-sidebarWrapper",n),paper:o("FusePageCarded-sidebar",n,d==="left"?"FusePageCarded-leftSidebar":"FusePageCarded-rightSidebar")},ModalProps:{keepMounted:!0},BackdropProps:{classes:{root:"FusePageCarded-backdrop"}},style:{position:"absolute"},children:a(F,{...e})})}),n==="permanent"&&a(S,{lgDown:!0,children:a(I,{variant:"permanent",anchor:d,className:o("FusePageCarded-sidebarWrapper",n,s?"opened":"closed",d==="left"?"FusePageCarded-leftSidebar":"FusePageCarded-rightSidebar"),open:s,onClose:l,classes:{paper:o("FusePageCarded-sidebar",n)},children:a(F,{...e})})})]})});function L(e){const{header:r=null}=e;return a("div",{className:o("FusePageCarded-header","container"),children:r})}const m=120,x=64,j=w("div")(({theme:e,...r})=>({display:"flex",flexDirection:"column",minWidth:0,minHeight:"100%",position:"relative",flex:"1 1 auto",width:"100%",height:"auto",backgroundColor:e.palette.background.default,"& .FusePageCarded-scroll-content":{height:"100%"},"& .FusePageCarded-wrapper":{display:"flex",flexDirection:"row",flex:"1 1 auto",zIndex:2,maxWidth:"100%",minWidth:0,height:"100%",backgroundColor:e.palette.background.paper,...r.scroll==="content"&&{position:"absolute",top:0,bottom:0,right:0,left:0,overflow:"hidden"}},"& .FusePageCarded-header":{display:"flex",flex:"0 0 auto"},"& .FusePageCarded-contentWrapper":{display:"flex",flexDirection:"column",flex:"1 1 auto",overflow:"auto",WebkitOverflowScrolling:"touch",zIndex:9999},"& .FusePageCarded-toolbar":{height:x,minHeight:x,display:"flex",alignItems:"center"},"& .FusePageCarded-content":{flex:"1 0 auto"},"& .FusePageCarded-sidebarWrapper":{overflow:"hidden",backgroundColor:"transparent",position:"absolute","&.permanent":{[e.breakpoints.up("lg")]:{position:"relative",marginLeft:0,marginRight:0,transition:e.transitions.create("margin",{easing:e.transitions.easing.sharp,duration:e.transitions.duration.leavingScreen}),"&.closed":{transition:e.transitions.create("margin",{easing:e.transitions.easing.easeOut,duration:e.transitions.duration.enteringScreen}),"&.FusePageCarded-leftSidebar":{marginLeft:-r.leftSidebarWidth},"&.FusePageCarded-rightSidebar":{marginRight:-r.rightSidebarWidth}}}}},"& .FusePageCarded-sidebar":{position:"absolute",backgroundColor:e.palette.background.paper,color:e.palette.text.primary,"&.permanent":{[e.breakpoints.up("lg")]:{position:"relative"}},maxWidth:"100%",height:"100%"},"& .FusePageCarded-leftSidebar":{width:r.leftSidebarWidth,[e.breakpoints.up("lg")]:{}},"& .FusePageCarded-rightSidebar":{width:r.rightSidebarWidth,[e.breakpoints.up("lg")]:{}},"& .FusePageCarded-sidebarHeader":{height:m,minHeight:m,backgroundColor:e.palette.primary.dark,color:e.palette.primary.contrastText},"& .FusePageCarded-sidebarHeaderInnerSidebar":{backgroundColor:"transparent",color:"inherit",height:"auto",minHeight:"auto"},"& .FusePageCarded-sidebarContent":{display:"flex",flexDirection:"column",minHeight:"100%"},"& .FusePageCarded-backdrop":{position:"absolute"}})),T=i.forwardRef((e,r)=>{const{scroll:t="page",className:d,header:n,content:l,leftSidebarContent:s,rightSidebarContent:u,leftSidebarOpen:g=!1,rightSidebarOpen:p=!1,rightSidebarWidth:y=240,leftSidebarWidth:W=240,leftSidebarVariant:H="permanent",rightSidebarVariant:R="permanent",rightSidebarOnClose:N,leftSidebarOnClose:O}=e,f=i.useRef(null),h=i.useRef(null),C=i.useRef(null);return i.useImperativeHandle(r,()=>({rootRef:C,toggleLeftSidebar:b=>{f.current.toggleSidebar(b)},toggleRightSidebar:b=>{h.current.toggleSidebar(b)}})),c(k,{children:[a(z,{styles:()=>({...t!=="page"&&{"#fuse-toolbar":{position:"static"},"#fuse-footer":{position:"static"}},...t==="page"&&{"#fuse-toolbar":{position:"sticky",top:0},"#fuse-footer":{position:"sticky",bottom:0}}})}),c(j,{className:o("FusePageCarded-root",`FusePageCarded-scroll-${e.scroll}`,d),ref:C,scroll:t,leftSidebarWidth:W,rightSidebarWidth:y,children:[n&&a(L,{header:n}),a("div",{className:"container relative z-10 flex h-full flex-auto flex-col overflow-hidden rounded-t-16 shadow-1",children:c("div",{className:"FusePageCarded-wrapper",children:[s&&a(P,{position:"left",variant:H,ref:f,open:g,onClose:O,children:s}),a(v,{className:"FusePageCarded-contentWrapper",enable:t==="content",children:l&&a("div",{className:o("FusePageCarded-content"),children:l})}),u&&a(P,{position:"right",variant:R||"permanent",ref:h,open:p,onClose:N,children:u})]})})]})]})}),M=i.memo(w(T)``);export{M as F};
