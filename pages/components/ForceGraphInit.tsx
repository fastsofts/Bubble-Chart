
import * as React from "react";
import css from '../../styles/ForceGraph.module.scss';
import ForceGraph from "./ForceGraph";
import * as d3 from "d3";
import Config from "../../public/assets/settings/settings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome} from '@fortawesome/free-solid-svg-icons'
import * as config from "../../next.config.js"


interface initproperties {
  screenwidth:number;
  screenheight:number;
}

interface IcurrentMovies{
  [index:number]: string
}

interface IpopcornTypes{
  [index:number]:string;
}

interface ImoviesProduced{
  [index:number]:string;
}

interface IstudiosLocations{
  [index:number]:string;
}

interface IproductionCompaniesWorkingWith{
  [index:number]:{connectionWithCinemaConfirmed:boolean;headOfficeLocation:string;moviesProduced:ImoviesProduced;name:string;studiosLocations:IstudiosLocations;type:string}
}

interface IfavMovie{
  [index:number]:string;
}

interface IsurveyParticipants{
  [index:number]:{name:string,favMovie:IfavMovie}
}

interface IsurveyDemographic{
  [index:number]:{demographic:string;surveyParticipants:IsurveyParticipants  }
}

interface IteatherLocations{
  [index:number]:string;
}

interface Icinemacompany{
  cinemaName:string;    
  currentMovies:IcurrentMovies;
  popcornTypes:IpopcornTypes;
  productionCompaniesWorkingWith:IproductionCompaniesWorkingWith;
  surveyDemographic:IsurveyDemographic;
  teatherLocations:IteatherLocations;
  type:string;
}

interface forcedata {
   cinemacompany:Icinemacompany
}
let chartheight:any = 0;
let chartwidth:any = 0;
let chartMargin:any = {left:.10,right:.10,top:.10,bottom:.10};
const keysorder:any = {"productionCompaniesWorkingWith":[{"type":[]},{"name":[]},{"studiosLocations":[]},{"moviesProduced":[]},{"headOfficeLocation":[]},{"connectionWithCinemaConfirmed":[]}]};  

const ForceGraphInit: React.FC<initproperties> = ({screenwidth,screenheight})  => {
  let chartWidth:number = screenwidth;
  let chartHeight:number = screenheight ;
  let margin:any = {left:screenwidth * .10,top:screenheight * .10,right:screenwidth * .10,bottom:screenheight * .10};
  let centers = {};
  const [radius,setRadius] = React.useState(0);
  let chartsvgelement:any = null;
  const [nodes,setNodes] = React.useState<any>([]);
  const [links,setLinks] = React.useState<any>([]);
  const zoomButtonRef = React.useRef(null);
  const [zoomTo,setZoomTo] = React.useState(0);
  const [initZoom,setInitZoom] = React.useState(0);
  const dataURL:string = config.assetPrefix?`${config.assetPrefix}/assets/data/data.json`:`/assets/data/data.json`;
  React.useEffect(()=>{
    getData<forcedata>(dataURL)
    .then((frcdata) => {
      // assigning the response data `toDoItem` directly to `myNewToDo` variable which is
      // of Todo type
      let forcedata:forcedata = frcdata;
      interface Isub{
         [index:number] : {}
      }

      interface Inode{
        id:string;
        fx:number;
        fy:number;
        main:string;
        sub:Isub;
        ix:number;
        iy:number;
        radius:number;       
      }
      const node: Array<Inode> = [];
      interface Ilink{
        source:string;
        target:string;
      }
      const link: Array<Ilink> = [];      
      let counter = 0;
      Object.keys(forcedata).forEach((keydata:any)=>{
        Object.keys(forcedata[keydata]).forEach((subkeydata:any)=>{
              let keys  = Object.keys(keysorder).join(",")+","
              if (keys.indexOf(subkeydata) > -1){
                  forcedata[keydata][subkeydata].forEach((maindata:any)=>{     
                      let keyfound:boolean = false;
                      Object.keys(maindata).forEach((mainkeydata:any)=>{
                         keysorder[subkeydata].forEach((itemkey:any,index:number)=>{
                            if (mainkeydata === Object.keys(itemkey)[0]){
                                keyfound = true;
                                if (typeof maindata[mainkeydata] === "object"){
                                    maindata[mainkeydata].forEach((item:any)=>{
                                        let duplicate:boolean = false;
                                        keysorder[subkeydata][index][Object.keys(itemkey)[0]].forEach((values:any,sindex:number)=>{
                                              if (values.value === item){
                                                  duplicate = true;
                                              }    
                                        });
                                        if (!duplicate){
                                            keysorder[subkeydata][index][Object.keys(itemkey)[0]].push({id:`n_${counter}`, value:item , main:subkeydata, sub:itemkey}); 
                                            counter++;
                                        }    
                                    });
                                }else{
                                   if (typeof maindata[mainkeydata] === "boolean"){
                                       if (maindata[mainkeydata]){
                                           let itemvalue:string = "Yes";
                                           let duplicate:boolean = false;
                                           keysorder[subkeydata][index][Object.keys(itemkey)[0]].forEach((values:any,sindex:number)=>{
                                                 if (values.value === itemvalue){
                                                     duplicate = true;
                                                 }    
                                           });             
                                           if (!duplicate){
                                               keysorder[subkeydata][index][Object.keys(itemkey)[0]].push({id:`n_${counter}`, value:itemvalue , main:subkeydata, sub:itemkey});
                                               counter++;
                                           }
                                       }else{
                                           let itemvalue:string = "No";
                                           let duplicate:boolean = false;
                                           keysorder[subkeydata][index][Object.keys(itemkey)[0]].forEach((values:any,sindex:number)=>{
                                                 if (values.value === itemvalue){
                                                     duplicate = true;
                                                 }    
                                           });             
                                           if (!duplicate){
                                               keysorder[subkeydata][index][Object.keys(itemkey)[0]].push({id:`n_${counter}`, value:itemvalue , main:subkeydata, sub:itemkey});
                                               counter++;  
                                           }
                                       } 
                                   }else{
                                       let duplicate:boolean = false;
                                       let itemvalue:any = maindata[mainkeydata];
                                       keysorder[subkeydata][index][Object.keys(itemkey)[0]].forEach((values:any,sindex:number)=>{
                                             if (values.value === itemvalue){
                                                 duplicate = true;
                                             }    
                                       });             
                                       if (!duplicate){
                                           keysorder[subkeydata][index][Object.keys(itemkey)[0]].push({id:`n_${counter}`, value:itemvalue , main:subkeydata, sub:itemkey});  
                                           counter++;
                                       }
                                   }    
                                }
                            }
                         })
                      });
                      if (!keyfound){
                        
                      }
                  });
              }
         });
      })
      Object.keys(keysorder).forEach((mainkey:any)=>{
           keysorder[mainkey].forEach((subkey:any,index:number)=>{
               let mkey = Object.keys(keysorder[mainkey][index])[0];
               let repdata = null;
               let sourceid = "";
               keysorder[mainkey][index][Object.keys(keysorder[mainkey][index])[0]].forEach((ikey:any,icounter:any)=>{
                  let value = keysorder[mainkey][index][Object.keys(keysorder[mainkey][index])[0]][icounter].value; 
                  sourceid = keysorder[mainkey][index][Object.keys(keysorder[mainkey][index])[0]][icounter].id;
                  Object.keys(forcedata).forEach((keydata:any)=>{
                    Object.keys(forcedata[keydata]).forEach((subkeydata:any)=>{
                         let keys  = Object.keys(keysorder).join(",")+","
                         if (keys.indexOf(subkeydata+",") > -1){
                             forcedata[keydata][subkeydata].forEach((skey:any)=>{
                                if (skey[mkey]){
                                    if (typeof skey[mkey] === "object"){
                                        skey[mkey].forEach((checkkey:any)=>{
                                           if (value === checkkey){
                                               repdata = skey
                                               let nindex = index+1;
                                               if (nindex < keysorder[mainkey].length && repdata){
                                                   let keyval = Object.keys(keysorder[mainkey][nindex])[0];
                                                   let ndata = keysorder[mainkey][nindex][keyval];
                                                   let group = [];
                                                   ndata.forEach((newdata:any,nindex:number)=>{
                                                        Object.keys(newdata.sub).forEach((ikey:any)=>{
                                                            let finaldata = repdata[ikey];
                                                            newdata.sub[ikey].forEach((zval:any)=>{
                                                               let lvalue = zval.value;
                                                               if (typeof finaldata === "object"){
                                                                   finaldata.forEach((fdata:any)=>{
                                                                       if (fdata === lvalue){
                                                                           let duplicate = false
                                                                           link.forEach((lnk:any)=>{
                                                                               if (lnk.source === sourceid && lnk.target === zval.id){
                                                                                   duplicate = true;
                                                                               }
                                                                           })
                                                                           if (!duplicate){
                                                                                link.push({source:sourceid,target:zval.id});
                                                                           }     
                                                                          // group.push(zval.id);
                                                                       }
                                                                   });
                                                               }else{
                                                                   if (typeof finaldata === "boolean"){
                                                                       let fidata = "Yes";
                                                                       if (!finaldata){
                                                                           fidata = "No"
                                                                       }
                                                                       if (fidata === lvalue){
                                                                           let duplicate = false
                                                                           link.forEach((lnk:any)=>{
                                                                               if (lnk.source === sourceid && lnk.target === zval.id){
                                                                                   duplicate = true;
                                                                               }
                                                                           })
                                                                           if (!duplicate){
                                                                               link.push({source:sourceid,target:zval.id});
                                                                           }    
                                                                           //group.push(zval.id);               
                                                                       }
                                                                   }else{
                                                                       if (finaldata === lvalue){
                                                                           let duplicate = false
                                                                           link.forEach((lnk:any)=>{
                                                                               if (lnk.source === sourceid && lnk.target === zval.id){
                                                                                   duplicate = true;
                                                                               }
                                                                           })
                                                                           if (!duplicate){
                                                                               link.push({source:sourceid,target:zval.id});
                                                                           }    
                                                                           //group.push(zval.id);   
                                                                       }
                                                                   }
                                                               }
                                                            });
                                                        });
                                                   });
                                               }                             
                                           }
                                        });
                                    }else{
                                        if (typeof skey[mkey] === "boolean"){
                                            let value1 = "Yes";
                                            if (!skey[mkey]){
                                                value1 = "No";
                                            }
                                            if (value1 === value){
                                                repdata = skey; 
                                                let nindex = index+1;
                                                if (nindex < keysorder[mainkey].length && repdata){
                                                    let keyval = Object.keys(keysorder[mainkey][nindex])[0];
                                                    let ndata = keysorder[mainkey][nindex][keyval];
                                                    let group = [];
                                                    ndata.forEach((newdata:any,nindex:number)=>{
                                                         Object.keys(newdata.sub).forEach((ikey:any)=>{
                                                             let finaldata = repdata[ikey];
                                                             newdata.sub[ikey].forEach((zval:any)=>{
                                                                let lvalue = zval.value;
                                                                if (typeof finaldata === "object"){
                                                                    finaldata.forEach((fdata:any)=>{
                                                                        if (fdata === lvalue){
                                                                            let duplicate = false
                                                                            link.forEach((lnk:any)=>{
                                                                                if (lnk.source === sourceid && lnk.target === zval.id){
                                                                                    duplicate = true;
                                                                                }
                                                                            })
                                                                            if (!duplicate){
                                                                                 link.push({source:sourceid,target:zval.id});
                                                                            }     
                                                                           // group.push(zval.id);
                                                                        }
                                                                    });
                                                                }else{
                                                                    if (typeof finaldata === "boolean"){
                                                                        let fidata = "Yes";
                                                                        if (!finaldata){
                                                                            fidata = "No"
                                                                        }
                                                                        if (fidata === lvalue){                                                                           
                                                                            let duplicate = false
                                                                            link.forEach((lnk:any)=>{
                                                                                if (lnk.source === sourceid && lnk.target === zval.id){
                                                                                    duplicate = true;
                                                                                }
                                                                            })
                                                                            if (!duplicate){
                                                                                link.push({source:sourceid,target:zval.id});
                                                                            }    
                                                                            //group.push(zval.id);               
                                                                        }
                                                                    }else{
                                                                        if (finaldata === lvalue){
                                                                            let duplicate = false
                                                                            link.forEach((lnk:any)=>{
                                                                                if (lnk.source === sourceid && lnk.target === zval.id){
                                                                                    duplicate = true;
                                                                                }
                                                                            })
                                                                            if (!duplicate){
                                                                                link.push({source:sourceid,target:zval.id});
                                                                            }    
                                                                            //group.push(zval.id);   
                                                                        }
                                                                    }
                                                                }
                                                             });
                                                         });
                                                    });
                                                }                              
                                            }
                                        }else{
                                           if (skey[mkey] === value){
                                               repdata = skey;
                                               let nindex = index+1;
                                               if (nindex < keysorder[mainkey].length && repdata){
                                                   let keyval = Object.keys(keysorder[mainkey][nindex])[0];
                                                   let ndata = keysorder[mainkey][nindex][keyval];
                                                   let group = [];
                                                   ndata.forEach((newdata:any,nindex:number)=>{
                                                        Object.keys(newdata.sub).forEach((ikey:any)=>{
                                                            let finaldata = repdata[ikey];
                                                            newdata.sub[ikey].forEach((zval:any)=>{
                                                               let lvalue = zval.value;
                                                               if (typeof finaldata === "object"){
                                                                   finaldata.forEach((fdata:any)=>{
                                                                       if (fdata === lvalue){
                                                                           let duplicate = false
                                                                           link.forEach((lnk:any)=>{
                                                                               if (lnk.source === sourceid && lnk.target === zval.id){
                                                                                   duplicate = true;
                                                                               }
                                                                           })
                                                                           if (!duplicate){
                                                                                link.push({source:sourceid,target:zval.id});
                                                                           }     
                                                                          // group.push(zval.id);
                                                                       }
                                                                   });
                                                               }else{
                                                                   if (typeof finaldata === "boolean"){
                                                                       let fidata = "Yes";
                                                                       if (!finaldata){
                                                                           fidata = "No"
                                                                       }
                                                                       if (fidata === lvalue){
                                                                           let duplicate = false
                                                                           link.forEach((lnk:any)=>{
                                                                               if (lnk.source === sourceid && lnk.target === zval.id){
                                                                                   duplicate = true;
                                                                               }
                                                                           })
                                                                           if (!duplicate){
                                                                               link.push({source:sourceid,target:zval.id});
                                                                           }    
                                                                           //group.push(zval.id);               
                                                                       }
                                                                   }else{
                                                                       if (finaldata === lvalue){
                                                                           let duplicate = false
                                                                           link.forEach((lnk:any)=>{
                                                                               if (lnk.source === sourceid && lnk.target === zval.id){
                                                                                   duplicate = true;
                                                                               }
                                                                           })
                                                                           if (!duplicate){
                                                                               link.push({source:sourceid,target:zval.id});
                                                                           }    
                                                                           //group.push(zval.id);   
                                                                       }
                                                                   }
                                                               }
                                                            });
                                                        });
                                                   });
                                               }
                             
                                           }
                                        }    
                                    }
                                 }
                             });
                          }
                      })
                  });   
              })
          })
      });
      let cwidth:number = (document.querySelector("#forcechart") as HTMLDivElement).offsetWidth;
      let cheight:number = (document.querySelector("#forcechart") as HTMLDivElement).offsetHeight;
      chartwidth  = cwidth - (cwidth * chartMargin.left) - (cwidth * chartMargin.right);
      chartheight = cheight - (cheight * chartMargin.top) - (cheight * chartMargin.bottom);
      let maxitems:number = 0;
      let totalkeys:number = 0;
      Object.keys(keysorder).forEach((mainkey:any)=>{
         keysorder[mainkey].forEach((subkey:any)=>{
            totalkeys++;
            Object.keys(subkey).forEach((key:any)=>{
               if (maxitems < subkey[key].length){
                   maxitems =  subkey[key].length;
               }
            });
         });
      })
      let rad:number = 2  // /  (chartheight > chartwidth?chartheight:chartwidth) 
      setRadius(rad);
      let radii = rad;
      let perwidth:number = chartwidth/totalkeys
      let startX:number = chartMargin.left;

      Object.keys(keysorder).forEach((mainkey:any,sindex:any)=>{
        keysorder[mainkey].forEach((subkey:any)=>{
           Object.keys(subkey).forEach((key:any)=>{
              let y:number = 0;
              let gap:number = 0;
              let centerpoint:number = 0;
              let cpoint:number = (chartheight/2)    //+ (chartheight * chartMargin.top);
              let above:number = cpoint;
              let below:number = cpoint;
              let ix = chartMargin.left;
              let iy = cpoint;
              if (subkey[key].length === 1){
 //                 y = chartMargin.top+(chartheight/2) - (radii/2);
                  centerpoint = 0;
                  gap = 0;
              }
              if (subkey[key].length === 2){
 //                 y = chartMargin.top + (chartheight/4);
                  gap = (chartheight/6);
                  centerpoint = .5
              }
              if (subkey[key].length > 2){
                  gap = (chartheight / (subkey[key].length * 2)) + rad;
                  centerpoint = (subkey[key].length-1)/2;
              }     
              keysorder[mainkey].forEach((item:any,index:number)=>{
                  if (keysorder[mainkey][index][key]){
                      keysorder[mainkey][index][key].forEach((subitem:AnalyserNode,subindex:number) =>{
                          if (subindex < centerpoint){
                              above -= gap;
                              keysorder[mainkey][index][key][subindex].fx = startX;
                              keysorder[mainkey][index][key][subindex].fy = above;
                              node.push({id:keysorder[mainkey][index][key][subindex].id,fx:keysorder[mainkey][index][key][subindex].fx,fy:keysorder[mainkey][index][key][subindex].fy,main:keysorder[mainkey][index][key][subindex].main,sub:keysorder[mainkey][index][key][subindex].sub,radius:radii,ix:ix,iy:iy})
                          }    
                          if (subindex > centerpoint){
                              below += gap;    
                              keysorder[mainkey][index][key][subindex].fx = startX;
                              keysorder[mainkey][index][key][subindex].fy = below;
                              node.push({id:keysorder[mainkey][index][key][subindex].id,fx:keysorder[mainkey][index][key][subindex].fx,fy:keysorder[mainkey][index][key][subindex].fy,main:keysorder[mainkey][index][key][subindex].main,sub:keysorder[mainkey][index][key][subindex].sub,radius:radii,ix:ix,iy:iy})                        
                          }    
                          if (subindex === centerpoint){
                              keysorder[mainkey][index][key][subindex].fx = startX;
                              keysorder[mainkey][index][key][subindex].fy = cpoint;
                              node.push({id:keysorder[mainkey][index][key][subindex].id,fx:keysorder[mainkey][index][key][subindex].fx,fy:keysorder[mainkey][index][key][subindex].fy,main:keysorder[mainkey][index][key][subindex].main,sub:keysorder[mainkey][index][key][subindex].sub,radius:radii,ix:ix,iy:iy})                            
                          }
                      });     
                  }    
              });      
           }); 
           startX += perwidth;
        });
      });  
      setNodes(node);
      setLinks(link);
    });

    async function getData<T>(resourceUrl: string): Promise<T> {
        return await fetch(resourceUrl).then(response => {
            // fetching the reponse body data
            //return response.json<T>()
            return response.json().then(data => data as T);
          })
    }
  },[dataURL]);


  const zmTo = (e:any,option:number) =>{
    e.preventDefault();
    e.stopPropagation();
    setZoomTo(option);
    setInitZoom(Math.random());
  }


  return(
        <React.Fragment>
          <div id = "forcechart" style = {{width:`${chartWidth}px`,height:`${chartHeight}px`, paddingLeft:`${margin.left}px`,paddingTop:`${margin.top}px`, paddingRight:`${margin.right}px`,paddingBottom:`${margin.bottom}px`}}>
              {Config.settings[0].zoomButtonsRequired?
                 <div id="zoom" className={css.zoom}>
                     <button id="zoom_in" onClick={(e:any)=>zmTo(e,1)} className = {css.zoom_in}>+</button>
                     <button id="home" onClick={(e:any)=>zmTo(e,2)} className={css.home}>
                       <FontAwesomeIcon icon={faHome} style={{ fontSize: '.67em' }}/>
                     </button>       
                     <button  id="zoom_out" onClick={(e:any)=>zmTo(e,3)} className = {css.zoom_out}>-</button>
                  </div> 
                 :''
               }               
               <ForceGraph initZoom={initZoom} zoomTo={zoomTo} nodes={nodes} links={links} settings={Config.settings[0]} chartwidth={chartwidth} chartheight={chartheight} screenwidth={screenwidth} screenheight = {screenheight}/>
          </div>  
       </React.Fragment>
  )
}
export default ForceGraphInit;