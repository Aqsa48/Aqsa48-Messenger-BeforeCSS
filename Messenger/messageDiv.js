import React from  "react";

export default class extends React.Component{
   render(){
      return(
         <div>
            <div  id={this.props.id} className="col-md-10 aa" 
               style={{
                  borderBottom:'1px solid',
                  height:'90px'
               }}
            >
               <img className="col-md-1" src={"userImages/"+this.props.dp} alt="" 
                  style={{
                     border:'0px solid',
                     height:'58px',
                     padding:'0',
                     borderRadius:'50px',
                     marginTop:'15px'
                  }} 
               />
               <p className="col-md-10" 
                  style={{
                     marginTop:'17px',
                     fontSize:'17px'
                  }}
               >
                  <b>{this.props.name}</b>
                  <i 
                     style={{
                        fontSize:'11px',
                        textAlign:'right'
                     }}
                  >{"      "+this.props.time}</i>
               </p>
               <p className="col-md-10" 
                  style={{
                     marginTop:'-10px',
                     fontSize:'15px'
                  }
               }>{this.props.msg}</p>
            </div>                
         </div>
      )
  }
}
