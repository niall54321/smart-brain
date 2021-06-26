import React, {Component} from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';



const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  // box: {},
  boxes: [],
  faceBoxes: ``,
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const noFaces = data.outputs[0].data.regions.length;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    let clarifaiFaces = [];
    let leftCols = [];
    let topRows = [];
    let rightCols = [];
    let bottomRows = [];
    let boxes = [];

    for (let i = 0; i < noFaces; i++) {
      clarifaiFaces[i] = data.outputs[0].data.regions[i].region_info.bounding_box;
      leftCols[i] = clarifaiFaces[i].left_col * width;
      topRows[i] = clarifaiFaces[i].top_row * height;
      rightCols[i] = width - (clarifaiFaces[i].right_col * width);
      bottomRows[i] = height - (clarifaiFaces[i].bottom_row * height)
      boxes[i] = {
        leftCol: leftCols[i],
        topRow: topRows[i],
        rightCol: rightCols[i],
        bottomRow: bottomRows[i]
      }
    }
    return {boxes}
  }

  // displayFaceBox = (box) => {
  //   this.setState({box: box})
  // }

  // displayFaceBoxes = (boxes) => {
  //   this.setState({boxes: boxes})
  // }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  makeDivs = (boxes) => {
    let faceBoxes =``;
    boxes.forEach(box => {
      faceBoxes += `<div className='bounding-box' style={{top: ${box.topRow}, right: ${box.rightCol}, bottom: ${box.bottomRow}, left: ${box.leftCol}}}></div>`
    })
    this.setState({faceBoxes: faceBoxes})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    fetch('https://vast-chamber-36650.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())    
    .then(response => {
      fetch('https://vast-chamber-36650.herokuapp.com/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        let ans = this.calculateFaceLocation(response);
        this.makeDivs(ans.boxes)
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  

  render() {
    const {isSignedIn, imageUrl, route, faceBoxes} =this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions} 
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition imageUrl={imageUrl} faceBoxes={faceBoxes} />
            </div> 
          : (
              route === 'signin'
                ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            ) 
        }
      </div>
    );
  }
}

export default App;
