import React from 'react';
import 'tachyons';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
	return(
		<div className='ma4 mt0 f3'>
			<Tilt className='Tilt br2 shadow-2' options={{ max: 55}} style ={{height: 150, width:150}}>
				<div className="Tilt-inner pa3 ma0">
					<img alt='logo' src={brain}/>
				</div>
			</Tilt>
		</div>
	);
}

export default Logo;
