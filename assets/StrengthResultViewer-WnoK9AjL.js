import{_ as g,o as e,c as i,b as n,t as s,F as u,h as _,i as c,f as h}from"./app-D6GG9VWz.js";const p={props:{type:{type:String,required:!0},title:{type:String,required:!0},capacities:{type:Array,required:!0},criticalCapacities:{type:Array,required:!0},contentDisplay:{type:String,default:"-"}},data(){return{contentDisplayLocal:this.contentDisplay}},methods:{toggleContentDisplay(){this.contentDisplayLocal=this.contentDisplayLocal==="-"?"+":"-",this.$emit("updateContentDisplay",{type:this.type,contentDisplay:this.contentDisplayLocal})}}},L={class:"strength-result-container"},k={class:"section-title"},M=["innerHTML"],T={key:0},D={key:0,class:"subsection-title-large"},H={key:1,class:"subsection-title-large"},f={class:"subsection-title-small"},b={class:"indented-container"},x=["innerHTML"],C={key:2},N={key:0,class:"subsection-title-small"},S={class:"indented-container"},V={key:0,class:"subsection-title-small"},F={key:1},A=["innerHTML"],q=["innerHTML"],B={class:"final-result"},j=["innerHTML"],w={key:3},P={key:1},R={key:0,class:"subsection-title-large"},E={key:1,class:"subsection-title-large"},G={key:2},m={class:"indented-container"},z={class:"subsection-title-small"},I=["innerHTML"],J={class:"final-result"},K=["innerHTML"],O={key:3};function Q(U,r,l,W,y,v){return e(),i("div",L,[n("h2",k,[n("span",null,s(l.title),1),n("span",{class:"section-title-button",innerHTML:y.contentDisplayLocal==="-"?"−":"+",onClick:r[0]||(r[0]=(...o)=>v.toggleContentDisplay&&v.toggleContentDisplay(...o))},null,8,M)]),y.contentDisplayLocal==="-"?(e(),i("div",T,[(e(!0),i(u,null,_(l.criticalCapacities,(o,a)=>(e(),i("div",{key:a},[l.criticalCapacities.length===2&&a===0?(e(),i("div",D," Major Axis ")):c("",!0),l.criticalCapacities.length===2&&a===1?(e(),i("div",H," Minor Axis ")):c("",!0),(e(!0),i(u,null,_(l.capacities[a],(t,d)=>(e(),i("div",{key:d},[n("div",f,s(t.section)+" "+s(t.title),1),n("div",b,[n("div",{innerHTML:t.html},null,8,x)])]))),128)),o?(e(),i("div",C,[o.some(t=>t.isMultiState)?(e(),i("div",N," Governing Limit State ")):c("",!0),(e(!0),i(u,null,_(o,(t,d)=>(e(),i("div",{key:d},[n("div",S,[t.isMultiState?(e(),i("div",V,s(t.titlePrefix)+" "+s(l.title)+" ("+s(t.section)+") ",1)):c("",!0),t.isMultiState?(e(),i("div",F,[n("span",{innerHTML:t.nominalNotation},null,8,A),h(" = "+s(t.nominalValue.toFixed(1))+" "+s(t.unit),1)])):c("",!0),n("div",null,[n("span",{innerHTML:t.phiNotation},null,8,q),h(" = "+s(t.phiValue.toFixed(2)),1)]),n("div",B,[n("span",{innerHTML:t.designNotation},null,8,j),h(" = "+s(t.designValue.toFixed(1))+" "+s(t.unit),1)])])]))),128))])):(e(),i("div",w,r[1]||(r[1]=[n("div",{class:"indented-container"},[n("div",null,"Not available")],-1)])))]))),128))])):(e(),i("div",P,[(e(!0),i(u,null,_(l.criticalCapacities,(o,a)=>(e(),i("div",{key:a},[l.criticalCapacities.length===2&&a===0?(e(),i("div",R," Major Axis ")):c("",!0),l.criticalCapacities.length===2&&a===1?(e(),i("div",E," Minor Axis ")):c("",!0),o?(e(),i("div",G,[(e(!0),i(u,null,_(o,(t,d)=>(e(),i("div",{key:d},[n("div",m,[n("div",z,s(t.titlePrefix)+" "+s(l.title)+" ("+s(t.section)+") ",1),n("div",null,[n("span",{innerHTML:t.nominalNotation},null,8,I),h(" = "+s(t.nominalValue.toFixed(1))+" "+s(t.unit),1)]),n("div",J,[n("span",{innerHTML:t.designNotation},null,8,K),h(" = "+s(t.designValue.toFixed(1))+" "+s(t.unit),1)])])]))),128))])):(e(),i("div",O,r[2]||(r[2]=[n("div",{class:"indented-container"},[n("div",null,"Not available")],-1)])))]))),128))]))])}const Y=g(p,[["render",Q],["__file","StrengthResultViewer.vue"]]);export{Y as default};
