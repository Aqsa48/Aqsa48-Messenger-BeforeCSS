import React from  "react";
import axios from "axios";
import io from "socket.io-client";

import Message from './messageDiv.js';
// import UserDiv from './userDiv.js';

let User;

export default class extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            messages: [],
            showtime:'',
            CurrentChatUser:'',
            MessagesData:[],  
            MessageDivs:[],
            URL_id:'',
            AllUsers:[],
            UserDivs:[],
            DivsPersons:[]
        };

        this.Div=this.Div.bind(this);
        this.sendMessage=this.sendMessage.bind(this);
        this.createUserDivs=this.createUserDivs.bind(this);
        // this.createNewUserDiv=this.createNewUserDiv.bind(this);
        this.createMessageDivs=this.createMessageDivs.bind(this);
        this.addSenderMsg=this.addSenderMsg.bind(this);
        this.addReceiverMsg=this.addReceiverMsg.bind(this);
        this.updateMsgsInDb=this.updateMsgsInDb.bind(this);
        this.socket = io('localhost:9000');


        this.socket.on('RECEIVE_MESSAGE', function(data){
            if(data.receiverId===User._id){
                addMessage(data);     
            }
            else{
                console.log('User Not found');
            }
        })

        const addMessage=data=>{
            // // this.setState({messages: [...this.state.messages, data]});
            this.setState({MessagesData: [...this.state.MessagesData, data]});
            // // if(data.senderId === this.state.CurrentChatUser){
            // //     this.addReceiverMsg(data);
            // // }
            // // else{
            // //     // this.createNewUserDiv(data);
            // //     this.createUserDivs();
            // // }

            this.createUserDivs();
            
            let snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
            snd.play();
        };

    }



    componentWillMount(){ 

        this.state.URL_id=this.props.location.search.substring(4);
        this.state.USER=JSON.parse(localStorage.getItem('userData'));       
        User=this.state.USER;
         
        this.setState({});


        // axios.get('http://localhost:9000/userData')
        // .then((res)=>{    
        //     this.setState({USER:res.data});
        //     User=this.state.USER;

            axios.get('http://localhost:9000/getAllUsers')
            .then((res)=>{    
                this.setState({AllUsers:res.data});

                axios.get('http://localhost:9000/allMsgs')
                .then((res)=>{    
                    this.setState({MessagesData:res.data});
                    this.createUserDivs();
                }).catch((err)=>{
                    console.log(err);
                })

            }).catch((err)=>{
                console.log(err);
            })

        // }).catch((err)=>{
        //     console.log(err);
        // })

    }



    createUserDivs(){


        let USER_DIVS=[];
        // this.setState({DivsPersons:[]});
        this.state.DivsPersons=[];

        for(let i=this.state.MessagesData.length-1 ; i>=0 ; i--){
            
            // eslint-disable-next-line
            this.state.AllUsers.map((element2,index)=>{
                if(
                    (this.state.MessagesData[i].receiverId === this.state.USER._id  && this.state.MessagesData[i].senderId === element2._id) ||
                    (this.state.MessagesData[i].receiverId === element2._id  && this.state.MessagesData[i].senderId === this.state.USER._id)
                )
                {
        console.log(this.state.MessagesData[i].message);
        let time,hours,AmPm,mints,date,month,dateMonth;
                    let Months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

                    time=new Date(this.state.MessagesData[i].time);
                    if(time.getHours()>=13){
                        hours=time.getHours()-12;
                        AmPm='pm';
                    }
                    else if(time.getHours()===12){
                        hours=time.getHours();
                        AmPm='pm';
                    } 
                    else if(time.getHours()<12){
                        hours=time.getHours();
                        AmPm='am';
                    } 
                    mints=time.getMinutes();
                    date=time.getDate();
                    month=Months[time.getMonth()];

                    if(time.getMonth() === (new Date()).getMonth()){
                        if(time.getDate() === (new Date()).getDate()){
                            dateMonth="Today";
                        }
                        else if((time.getDate())+1 === (new Date()).getDate()){
                            dateMonth="Yesterday";
                        }
                        else{
                            dateMonth=date+" "+month;
                        }
                    }

                    if(this.state.DivsPersons.indexOf(element2._id) === -1){
                        this.state.DivsPersons.push(element2._id);

                        if(this.state.MessagesData[i].receiverId === this.state.USER._id && this.state.MessagesData[i].seen === false && this.state.MessagesData[i].senderId !== this.state.CurrentChatUser){
                            USER_DIVS.push(
                                <div key={element2._id} id={element2._id} onClick={this.Div} className="col-md-12 aa" style={{border:'1px solid',height:'90px',cursor:'pointer'}}>
                                    <img className="col-md-3" src={"userImages/"+element2.displayPhoto} alt="" style={{border:'0px solid',height:'70px',padding:'0',borderRadius:'50px',marginTop:'7px'}} />
                                    <p className="col-md-9" style={{marginTop:'24px',fontSize:'13px',marginLeft:'-5px'}}><b>{element2.fullname}</b><i style={{fontSize:'10px'}}>{" "+hours+":"+mints+" "+AmPm+" - "+dateMonth}</i></p>
                                    <p className="col-md-9" style={{marginTop:'-10px',fontSize:'12px'}}><b>{this.state.MessagesData[i].message}</b></p>
                                </div>  
                            )                 
                        }
                        else{
                            USER_DIVS.push(
                                <div key={element2._id} id={element2._id} onClick={this.Div} className="col-md-12 aa" style={{border:'1px solid',height:'90px',cursor:'pointer'}}>
                                    <img className="col-md-3" src={"userImages/"+element2.displayPhoto} alt="" style={{border:'0px solid',height:'70px',padding:'0',borderRadius:'50px',marginTop:'7px'}} />
                                    <p className="col-md-9" style={{marginTop:'24px',fontSize:'13px',marginLeft:'-5px'}}><b>{element2.fullname}</b><i style={{fontSize:'10px'}}>{" "+hours+":"+mints+" "+AmPm+" - "+dateMonth}</i></p>
                                    <p className="col-md-9" style={{marginTop:'-10px',fontSize:'12px'}}>{this.state.MessagesData[i].message}</p>
                                </div>  
                            )   
                        }
                    }
                }
                // This will create the divs of all users with whom I have chated before.

            })
        }
        // console.log(this.state.URL_id);
        
        // console.log(this.state.CurrentChatUser);
        

        this.state.AllUsers.map((element,index)=>{
            if(this.state.DivsPersons.indexOf(this.state.URL_id) === -1){
                if(this.state.URL_id === element._id){ 
                    this.state.DivsPersons.push(element._id);
                    USER_DIVS.unshift(
                        <div key={Math.random()}  id={element._id} onClick={this.Div} className="col-md-12 aa" style={{border:'1px solid',height:'90px'}}>
                            <img className="col-md-3" src={"userImages/"+element.displayPhoto} alt="" style={{border:'0px solid',height:'70px',padding:'0',borderRadius:'50px',marginTop:'7px'}} />
                            <p className="col-md-9" style={{marginTop:'24px',fontSize:'14px'}}><b>{element.fullname}</b></p>
                        </div> 
                    )
                    this.setState({CurrentChatUser:this.state.URL_id});
                }
            }
            else{
                this.setState({CurrentChatUser:this.state.URL_id});
            }
            // This if-else condition will create the user div of URL-id at first position, if the div is not created in above if-condition
            // and will assign this user's id as a CurrentChatUser, and then display messages of this user.
        });


        this.setState({UserDivs:[]});
        this.setState({UserDivs:USER_DIVS});

        if(this.state.CurrentChatUser===''){
            this.setState({CurrentChatUser:this.state.DivsPersons[0]});     
            document.getElementById(this.state.CurrentChatUser).style.backgroundColor="yellow";
            this.props.history.push('/messenger?id='+this.state.CurrentChatUser);      
            this.setState({URL_id:this.state.CurrentChatUser});                                 
        }
        else{
            document.getElementById(this.state.CurrentChatUser).style.backgroundColor="yellow";
        }
        
        this.createMessageDivs();  

    }




    createMessageDivs(){
        let MSG=[];  
        let notSeenMsgs=[];
        // eslint-disable-next-line 
        this.state.MessagesData.map((element,index)=>{
            let dp,name,time,hours,AmPm,mints,date,month,dateMonth;
            let Months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            
            if(element.receiverId === this.state.CurrentChatUser && element.senderId === this.state.USER._id){
                dp=this.state.USER.displayPhoto;
                name=this.state.USER.fullname;
                time=new Date(element.time);
                if(time.getHours()>=13){
                    hours=time.getHours()-12;
                    AmPm='pm';
                }
                else if(time.getHours()===12){
                    hours=time.getHours();
                    AmPm='pm';
                } 
                else if(time.getHours()<12){
                    hours=time.getHours();
                    AmPm='am';
                } 
                mints=time.getMinutes();
                date=time.getDate();
                month=Months[time.getMonth()];

                if(time.getMonth() === (new Date()).getMonth()){
                    if(time.getDate() === (new Date()).getDate()){
                        dateMonth="Today";
                    }
                    else if((time.getDate())+1 === (new Date()).getDate()){
                        dateMonth="Yesterday";
                    }
                    else{
                        dateMonth=date+" "+month;
                    }
                }

                MSG.push(
                    <Message
                        key={Math.random()}
                        id={element._id}
                        dp={dp}
                        name={name}
                        msg={element.message}
                        time={hours+":"+mints+" "+AmPm+" - "+dateMonth}
                    />
                )
            }

            else if(element.receiverId === this.state.USER._id && element.senderId === this.state.CurrentChatUser){
                if(!element.seen){
                    notSeenMsgs.push(element);
                }
                // eslint-disable-next-line
                this.state.AllUsers.map((element2,index)=>{
                    if(element.senderId === element2._id){
                        dp=element2.displayPhoto;
                        name=element2.fullname;
                    }
                })
                time=new Date(element.time);
                if(time.getHours()>=13){
                    hours=time.getHours()-12;
                    AmPm='pm';
                }
                else if(time.getHours()===12){
                    hours=time.getHours();
                    AmPm='pm';
                } 
                else if(time.getHours()<12){
                    hours=time.getHours();
                    AmPm='am';
                } 
                mints=time.getMinutes();
                date=time.getDate();
                month=Months[time.getMonth()];

                if(time.getMonth() === (new Date()).getMonth()){
                    if(time.getDate() === (new Date()).getDate()){
                        dateMonth="Today";
                    }
                    else if((time.getDate())+1 === (new Date()).getDate()){
                        dateMonth="Yesterday";
                    }
                    else{
                        dateMonth=date+" "+month;
                    }
                }

                MSG.push(
                    <Message
                        key={Math.random()}
                        id={element._id}
                        dp={dp}
                        name={name}
                        msg={element.message}                
                        time={hours+":"+mints+" "+AmPm+" - "+dateMonth}
                    />
                )
            }
        })
        this.setState({MessageDivs:MSG});

        var objDiv = document.getElementById("SCdiv");
        objDiv.scrollTop = objDiv.scrollHeight;

        if(notSeenMsgs.length>0){
            this.updateMsgsInDb(notSeenMsgs);
        }
    }

 



    sendMessage(e){
        
        axios({
            method:'post',
            url:'http://localhost:9000/sendmessage',
            data:{
                'message': this.state.message,
                'senderId': this.state.USER._id,
                'time' : new Date(),
                'receiverId':this.state.CurrentChatUser,
                'seen':false
            },
            headers:{
                'Access-Control-Allow-Origin':'http://localhost:9000/'
            }
            
        }).then((response)=>{
            if(response.data.confirmation==="Yes"){

                this.socket.emit('SEND_MESSAGE', response.data.message);

                // This will insert a new message JSON in all-msgs-data, everytime when sender sends a msg, 
                // to avoid database call operation again nd again, and just render the new message div by using this data.
                this.state.MessagesData.push(response.data.message);

                this.setState({});

                this.addSenderMsg();

                this.setState({message:''});     // Clear the text field
            }
            
        }).catch((err)=>{
            console.log(err);
        })

    }



// This method will create a new message div when sender sends a message, without calling the database for a new message.
    addSenderMsg(){
        let time,hours,AmPm,mints,date,month,dateMonth;
        let Months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        time=new Date();
        if(time.getHours()>=13){
            hours=time.getHours()-12;
            AmPm='pm';
        }
        else if(time.getHours()===12){
            hours=time.getHours();
            AmPm='pm';
        } 
        else if(time.getHours()<12){
            hours=time.getHours();
            AmPm='am';
        } 
        mints=time.getMinutes();
        date=time.getDate();
        month=Months[time.getMonth()];

        if(time.getMonth() === (new Date()).getMonth()){
            if(time.getDate() === (new Date()).getDate()){
                dateMonth="Today";
            }
            else if((time.getDate())+1 === (new Date()).getDate()){
                dateMonth="Yesterday";
            }
            else{
                dateMonth=date+" "+month;
            }
        }

        this.state.MessageDivs.push(
            <Message
                key={Math.random()}
                id={Math.random()}
                dp={this.state.USER.displayPhoto}
                name={this.state.USER.fullname}
                msg={this.state.message}                
                time={hours+":"+mints+" "+AmPm+" - "+dateMonth}
            />
        )

        this.setState({});

        var objDiv = document.getElementById("SCdiv");
        objDiv.scrollTop = objDiv.scrollHeight;
    }





    addReceiverMsg(data){
        let dp,name,time,hours,AmPm,mints,date,month,dateMonth;
        let Months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        time=new Date(data.time);
        if(time.getHours()>=13){
            hours=time.getHours()-12;
            AmPm='pm';
        }
        else if(time.getHours()===12){
            hours=time.getHours();
            AmPm='pm';
        } 
        else if(time.getHours()<12){
            hours=time.getHours();
            AmPm='am';
        } 
        mints=time.getMinutes();
        date=time.getDate();
        month=Months[time.getMonth()];

        if(time.getMonth() === (new Date()).getMonth()){
            if(time.getDate() === (new Date()).getDate()){
                dateMonth="Today";
            }
            else if((time.getDate())+1 === (new Date()).getDate()){
                dateMonth="Yesterday";
            }
            else{
                dateMonth=date+" "+month;
            }
        }

        // eslint-disable-next-line
        this.state.AllUsers.map((user,index)=>{
            if(data.senderId === user._id){
                dp=user.displayPhoto;
                name=user.fullname;
            }
        })

        this.state.MessageDivs.push(
            <Message
                key={Math.random()}
                id={Math.random()}
                dp={dp}
                name={name}
                msg={data.message}                
                time={hours+":"+mints+" "+AmPm+" - "+dateMonth}
            />
        )
        this.setState({});

        var objDiv = document.getElementById("SCdiv");
        objDiv.scrollTop = objDiv.scrollHeight;

        this.updateMsgsInDb([data]);
    }




    // createNewUserDiv(data){
    //     let time,hours,AmPm,mints,date,month,dateMonth;
    //     let Months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    //     time=new Date(data.time);
    //     if(time.getHours()>=13){
    //         hours=time.getHours()-12;
    //         AmPm='pm';
    //     }
    //     else if(time.getHours()===12){
    //         hours=time.getHours();
    //         AmPm='pm';
    //     } 
    //     else if(time.getHours()<12){
    //         hours=time.getHours();
    //         AmPm='am';
    //     } 
    //     mints=time.getMinutes();
    //     date=time.getDate();
    //     month=Months[time.getMonth()];

    //     if(time.getMonth() === (new Date()).getMonth()){
    //         if(time.getDate() === (new Date()).getDate()){
    //             dateMonth="Today";
    //         }
    //         else if((time.getDate())+1 === (new Date()).getDate()){
    //             dateMonth="Yesterday";
    //         }
    //         else{
    //             dateMonth=date+" "+month;
    //         }
    //     }

    //     // eslint-disable-next-line
    //     this.state.AllUsers.map((user,index)=>{
    //         if(data.senderId === user._id){
    //             this.state.UserDivs.unshift(
    //                 <div key={user._id} id={user._id} onClick={this.Div} className="col-md-12 aa" style={{border:'1px solid',height:'90px',cursor:'pointer'}}>
    //                     <img className="col-md-3" src={"userImages/"+user.displayPhoto} alt="" style={{border:'0px solid',height:'70px',padding:'0',borderRadius:'50px',marginTop:'7px'}} />
    //                     <p className="col-md-9" style={{marginTop:'24px',fontSize:'13px',marginLeft:'-5px'}}><b>{user.fullname}</b><i style={{fontSize:'10px'}}>{" "+hours+":"+mints+" "+AmPm+" - "+dateMonth}</i></p>
    //                     <p className="col-md-9" style={{marginTop:'-10px',fontSize:'12px'}}><b>{data.message}</b></p>
    //                 </div>  
    //             )
    //         }
    //     })
    //     this.setState({});
        
    // }






    updateMsgsInDb(notSeenMsgs){
        axios({
            method:'post',
            url:'http://localhost:9000/updateMsgs',
            data:notSeenMsgs,
            headers:{
                'Access-Control-Allow-Origin':'http://localhost:9000/'
            }
        }).then((response)=>{
            console.log(response);
        }).catch((err)=>{
            console.log(err);
        })
    }




    Div(e){

        if(e.target.childNodes[2].childNodes[0].childNodes[0]){
            e.target.childNodes[2].innerHTML=e.target.childNodes[2].childNodes[0].innerHTML;
        }

        let ele = document.getElementsByClassName('aa');
        for (var i = 0; i < ele.length; i++ ) {
            ele[i].style.backgroundColor = "white";
        }

        e.target.style.backgroundColor="yellow";
        
        this.state.CurrentChatUser=e.target.id;
        this.createMessageDivs();
        this.props.history.push('/messenger?id='+e.target.id);
        this.setState({URL_id:e.target.id});                                 
    }




    render(){
        return(
            <div>
                <div className="row" style ={{  height:'1000px',border:'1px solid black' }}>
                
                    <div className="col-md-3" style ={{ height:'700px',border:'1px solid black' }}>
                        {this.state.UserDivs}
                    </div> 
                    
                    <div id="SCdiv" className="col-md-8" style={{border:'1px solid', height:'700px',overflow:'auto'}}>
                        {this.state.MessageDivs}
                    </div>

                    <div className="col-md-4 offset-md-4" style={{border:'1px solid', height:'50px'}} >  
                        <div className="messages" >            
                            <input className="col-md-8"  name="message" type="text" placeholder="Message" value={this.state.message} onChange={ev=> this.setState({message:ev.target.value})}/>
                            <button onClick={this.sendMessage} >Send</button>
                        </div>        
                    </div>
                </div>
                
            </div>
        )
    }

}