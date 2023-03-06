import React, { useState } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function changePicture() {
	const [imagePreview, setImagePreview] = useState(null)
	const [crop, setCrop] = useState({ aspect: 1 })

	function handleFileInputChange(event) {
		const file = event.target.files[0]
		const reader = new FileReader()
		reader.onload = function (event) {
			setImagePreview(event.target.result)
		}
		reader.readAsDataURL(file)
	}

	function handleImageCropComplete(croppedAreaPixels, croppedImagePixels) {
		// `croppedImagePixels` is a base64-encoded string of the cropped image
		// const croppedImageFile = dataURItoFile(croppedImagePixels, 'cropped-image.jpg')
        console.log('first')
		// send `croppedImageFile` to the server or perform other necessary actions
	}
	function handleClearImage() {
		setImagePreview(null)
	}

	// function dataURItoFile(dataURI, filename) {
	// 	const byteString = atob(dataURI.split(',')[1])
	// 	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
	// 	const ab = new ArrayBuffer(byteString.length)
	// 	const ia = new Uint8Array(ab)
	// 	for (let i = 0; i < byteString.length; i++) {
	// 		ia[i] = byteString.charCodeAt(i)
	// 	}
	// 	return new File([ab], filename, { type: mimeString })
	// }

	return (
		<div>
			{/* <img src={imagePreview} alt="" /> */}
			<input type="file" onChange={handleFileInputChange} />
			{imagePreview && (
				<div style={{ width: '500px', height: '500px', outline: '1px' }}>
					<ReactCrop crop={crop} onComplete={handleImageCropComplete}>
						<img src={imagePreview} />
					</ReactCrop>
				</div>
			)}
			<button onClick={handleClearImage}>Clear image</button>
		</div>
	)
}
