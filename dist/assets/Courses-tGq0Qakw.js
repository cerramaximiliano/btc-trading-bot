import{d as l,j as e,aP as b,av as f,a5 as N,aL as S,F as k,aQ as F,aI as L,r as i,ak as n,T as u,ae as T,aR as j,aS as A,at as I,ar as M,aT as E,aU as P,l as Q,n as B,aq as D,al as G}from"./index-1vAFrwud.js";import{b as H,C as R,c as U,d as W}from"./CourseProgress--GHt7JPO.js";import{C as Y}from"./CardActions-IwRDuUNY.js";import"./LinearProgress-vhHfrgz1.js";function $(a){const{course:s}=a;function m(){switch(s.activeStep){case s.totalSteps:return"Completed";case 0:return"Start";default:return"Continue"}}return l(F,{className:"flex flex-col h-384 shadow",children:[e(b,{className:"flex flex-col flex-auto p-24",children:e(H,{course:s})}),e(R,{course:s}),e(Y,{className:"items-center justify-end py-16 px-24",sx:{backgroundColor:r=>r.palette.mode==="light"?f(r.palette.background.default,.4):f(r.palette.background.default,.03)},children:e(N,{to:`/apps/academy/courses/${s.id}/${s.slug}`,component:S,className:"px-16 min-w-128",color:"secondary",variant:"contained",endIcon:e(k,{size:20,children:"heroicons-solid:arrow-sm-right"}),children:m()})})]})}const q={show:{transition:{staggerChildren:.04}}},z={hidden:{opacity:0,y:10},show:{opacity:1,y:0}};function V(){const{data:a,isLoading:s}=U(),{data:m}=W();console.log(m);const r=L(t=>t.breakpoints.down("lg")),[h,g]=i.useState(a),[c,x]=i.useState(""),[o,y]=i.useState("all"),[d,C]=i.useState(!1);i.useEffect(()=>{function t(){return a&&c.length===0&&o==="all"&&!d?a:D.filter(a,p=>o!=="all"&&p.category!==o||d&&p.progress.completed>0?!1:p.title.toLowerCase().includes(c.toLowerCase()))}a&&g(t())},[a,d,c,o]);function w(t){y(t.target.value)}function v(t){x(t.target.value)}return s?e(G,{}):e(B,{header:l(T,{className:"relative overflow-hidden flex shrink-0 items-center justify-center px-16 py-32 md:p-64",sx:{backgroundColor:"primary.main",color:t=>t.palette.getContrastText(t.palette.primary.main)},children:[l("div",{className:"flex flex-col items-center justify-center  mx-auto w-full",children:[e(n.div,{initial:{opacity:0},animate:{opacity:1,transition:{delay:0}},children:e(u,{color:"inherit",className:"text-18 font-semibold",children:"FUSE ACADEMY"})}),e(n.div,{initial:{opacity:0},animate:{opacity:1,transition:{delay:0}},children:e(u,{color:"inherit",className:"text-center text-32 sm:text-48 font-extrabold tracking-tight mt-4",children:"What do you want to learn today?"})}),e(n.div,{initial:{opacity:0},animate:{opacity:1,transition:{delay:.3}},children:e(u,{color:"inherit",className:"text-16 sm:text-20 mt-16 sm:mt-24 opacity-75 tracking-tight max-w-md text-center",children:"Our courses will step you through the process of a building small applications, or adding new features to existing applications."})})]}),e("svg",{className:"absolute inset-0 pointer-events-none",viewBox:"0 0 960 540",width:"100%",height:"100%",preserveAspectRatio:"xMidYMax slice",xmlns:"http://www.w3.org/2000/svg",children:l("g",{className:"text-gray-700 opacity-25",fill:"none",stroke:"currentColor",strokeWidth:"100",children:[e("circle",{r:"234",cx:"196",cy:"23"}),e("circle",{r:"234",cx:"790",cy:"491"})]})})]}),content:l("div",{className:"flex flex-col flex-1 w-full mx-auto px-24 pt-24 sm:p-40",children:[l("div",{className:"flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0",children:[l("div",{className:"flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16",children:[l(j,{className:"flex w-full sm:w-136",variant:"outlined",children:[e(A,{id:"category-select-label",children:"Category"}),e(I,{labelId:"category-select-label",id:"category-select",label:"Category",value:o,onChange:w,children:e(M,{value:"all",children:e("em",{children:" All "})})})]}),e(E,{label:"Search for a course",placeholder:"Enter a keyword...",className:"flex w-full sm:w-256 mx-8",value:c,inputProps:{"aria-label":"Search"},onChange:v,variant:"outlined",InputLabelProps:{shrink:!0}})]}),e(P,{label:"Hide completed",control:e(Q,{onChange:t=>{C(t.target.checked)},checked:d,name:"hideCompleted"})})]}),h&&(h.length>0?e(n.div,{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 mt-32 sm:mt-40",variants:q,initial:"hidden",animate:"show",children:h.map(t=>e(n.div,{variants:z,children:e($,{course:t})},t.id))}):e("div",{className:"flex flex-1 items-center justify-center",children:e(u,{color:"text.secondary",className:"text-24 my-24",children:"No courses found!"})}))]}),scroll:r?"normal":"page"})}export{V as default};
