import React from 'react';
import 'tachyons';
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, faceBoxes}) => {
	return(
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputImage' alt='' src={imageUrl} width='500px' height='auto'/>
				<div id="container">
					{faceBoxes}
				</div>
			</div>
		</div>
	);
}

export default FaceRecognition;


// {<div className='bounding-box' style={{top: boxes.topRow, right: boxes.rightCol, bottom: boxes.bottomRow, left: boxes.leftCol}}></div>}