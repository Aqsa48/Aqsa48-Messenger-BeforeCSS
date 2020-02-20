import React from  "react";

export default class extends React.Component{
   render(){
      return(
         <div>
            <div  id={this.props.id} onClick={this.props.a} className="col-md-12" style={{border:'1px solid',height:'90px'}}>
               <img className="col-md-3" src={"userImages/"+this.props.dp} style={{border:'0px solid',height:'70px',padding:'0',borderRadius:'50px',marginTop:'7px'}} />
               <p className="col-md-9" style={{marginTop:'17px',fontSize:'17px'}}><b>{this.props.name}</b><i style={{fontSize:'11px'}}>{"      "+this.props.time}</i></p>
               <p className="col-md-9" style={{marginTop:'-10px',fontSize:'13px'}}>{this.props.msg}</p>
            </div>                
         </div>
      )
  }
}
