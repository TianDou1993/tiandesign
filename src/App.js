import React, { Component } from 'react';
// here we import our loader spinner as an image
import loader from './images/loader.svg';
import Gif from './Gif.js';

const Header=()=>(
  <div className="header grid">
    <h1 className="title">Tian Dou</h1>
  </div>
)

const UserHint =({loading,hintText})=>(
   <div className="user-hint">
      {loading? <img className="block mx-auto" src={loader} alt=''/> : hintText}
   </div>
)

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

// main part
class App extends Component{ 
  // we still need constructor for states
  constructor(props){
    super(props);
    this.state={
      searchTerm:'',
      hintText:'',
      gif:null,
      gifs:[],
      loading:false
    };
  }

// fetch giphy API using async functions
searchGiphy = async searchTerm =>{
  this.setState({
    loading:true
  })
  // first we try out fetch
  try{
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=XZJLFc9eUZKCbiOTYFx46TIORFgsZc9A&q=${searchTerm}&limit=25&offset=0&rating=PG-13&lang=en`);

    // const {data} gets the data from our response
    const {data} = await response.json();

    const randomGif=randomChoice(data);

    this.setState((prevState,props)=>({
      ...prevState,
      gif:randomGif,
      // here we spread out all our previous gifs and add our new random gif
      gifs:[...prevState.gifs,randomGif],
      // this is for the spinner
      loading:false
    }))
  // if fetch fails, we catch it down here
  }catch(error){

  }
}


  // with create react app we can write our methods as arrow functions. we don't need the constructor and bind
  handleChange=event=>{
    const {value}= event.target;
    // by setting the searchTerm in our state and also using that on the input as the value, we created what's called a "controlled input"
    this.setState((prevState,props)=>({
      // we take our old props and spread them out here
      ...prevState,
      // and then we overwrite the ones we want after
      searchTerm:value,
      // we can use if/fail function in setState as well. show the hint only when input is more than 2 letters
      hintText:value.length>2? `Hit enter to search ${value}`:''
    }))
  }

  handleKeyPress=event =>{
    const {value}= event.target;
    if(value.length>2 && event.key === "Enter"){
      // use search function
      this.searchGiphy(value);
      
    }
  };
  
// when have 2 or more characters in our search box
// and when we have also pressed enter, we then want to run a search.
  render(){
    
    const {searchTerm}=this.state

    return (
      <div className="page">
        <Header/>
        <div className="search grid">
{/* stack all the  */}
        {this.state.gifs.map(gif=>(
          // seperate the component in a new file. spread all proprtities
          <Gif {...gif}/>
        ))}

          {/* below is using && to test.only renderour video we the gif is not empty to prevent error when the page is first loaded */}
          {/* {gif && <video
            className="grid-item video" autoPlay loop src={gif.images.original.mp4}/>} */}
          <input 
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}/>
        </div>
        <UserHint {...this.state}/>
      </div>
    );
  } 
}

export default App;
