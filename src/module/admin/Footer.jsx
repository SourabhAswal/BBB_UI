import React from 'react'

export default function Footer (){
 return(
     <>
     {/* <div style={{bottom:"0",position:"",width:"100%"}}>
         <footer  id="divfoot" style={{ boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",textAlign: 'center',backgroundColor:"#fff", marginBottom:"0px", width:"100%",paddingTop:"18px",paddingBottom:"5px",marginTop:"60px" }}><p style={{color:"#757575",fontSize:"14px",fontFamily:"Arial"}}>Copyright © 2021 Realcoderz - developed by <b><a style={{color:'rgb(117, 117, 117)'}} href="https://realcoderz.com/">RealCoderZ</a></b> </p></footer>
         </div> */}

<footer class="sticky-footer bg-white" style={{marginTop:'25%'}}>
          <div class="copyright text-center my-auto">
            <span>© 2021 RealCoderZ - developed by 
              <b><a style={{fontFamily:"'Rubik', sans-serif"}} href="https://realcoderz.com/" > RealCoderZ</a></b>
            </span>

        </div>
      </footer>   
     </>
 )


}